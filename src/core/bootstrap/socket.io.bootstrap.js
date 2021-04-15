const jwtServices = require("../../auth/services/jwt.services");
const roomServices = require("../../rooms/services/room.services");
const userServices = require("../../users/services/user.services");

class SocketIoBootstrap {
  io;

  socketIoOpts = {
    pingTimeout: 10000,
    pingInterval: 10000,
    cors: {
      origin: "*",
    },
  };
  async init({ httpServer }) {
    this.io = require("socket.io")(httpServer, this.socketIoOpts);

    console.log(`Socket io bootstrap success.`);
    this.io
      .use(this.socketIoJwtAuthCheck)

      .on("connection", this.onSocketIoConnection);
  }

  socketIoJwtAuthCheck = async (socket, next) => {
    try {
      const jwtToken = socket?.handshake?.query?.token;
      const { id } = jwtServices.validateGetPayload({ token: jwtToken });
      const user = await userServices.getUserById({ id: id });

      if (!id || !user || user.isActive == false)
        throw new Error("Unauthenticated.");
      socket.jwtToken = jwtToken;
      socket.authUser = user;
      next();
    } catch (error) {
      console.log("socketIoJwtAuthCheck error", error);
      socket?.disconnect?.();
      next(new Error("Unauthenticated."));
    }
  };
  socketIoPacketJwtAuthCheck = async (packet, socket, next) => {
    try {
      const jwtToken = socket.jwtToken;
      const { id } = jwtServices.validateGetPayload({ token: jwtToken });
      const user = await userServices.getUserById({ id: id });

      if (!id || !user || user.isActive == false)
        throw new Error("Unauthenticated.");
      next();
    } catch (error) {
      socket?.disconnect?.();
      next(new Error("Unauthenticated."));
    }
  };
  onSocketIoConnection = async (socket) => {
    socket.use((packet, next) => {
      this.socketIoPacketJwtAuthCheck(packet, socket, next);
    });
    socket.emit("auth-ok", undefined);
    console.log("on new connection", socket.id);
    const authUser = socket.authUser;
    socket.on("enter-room", async (roomName) => {
      try {
        socket.on("user-update-event", (action, data) => {
          this.onUserUpdateEventHandler(authUser.id, roomName, action, data);
        });

        await roomServices.enterRoom({
          userId: authUser.id,
          rtcRoomName: roomName,
        });
        socket.join(roomName);
        socket.broadcast.to(roomName).emit("user-entered", authUser?.username);
        socket.emit("room-update-event", "you-entered");
        await this.senRoomInfoUpdateToMembers(roomName);
        socket.on("disconnect", async () => {
          try {
            console.log("disconnected>>>", roomName, authUser?.username);
            socket.broadcast
              .to(roomName)
              .emit("user-exist", authUser?.username);
            await roomServices.exitRoom({
              userId: authUser.id,
              rtcRoomName: roomName,
            });
            await this.senRoomInfoUpdateToMembers(roomName);
          } catch (error) {
            console.log(error);
          }
        });
      } catch (error) {
        socket?.disconnect?.();
        console.log(error);
      }
    });
    socket.on("get-room-info", async (roomName) => {
      const { speakers, others } = await roomServices.getSpeakersAndOthers({
        rtcRoomName: roomName,
      });
      socket.emit("room-update-event", "room-info", {
        speakers,
        others,
      });
    });
  };

  onUserUpdateEventHandler = async (userId, roomName, action, value) => {
    switch (action) {
      case "micMuted":
        await roomServices.updateSpeakerMicStatus({
          userId,
          rtcRoomName: roomName,
          micMuted: value,
        });
        await this.senRoomInfoUpdateToMembers(roomName);
        break;

      default:
        break;
    }
  };

  senRoomInfoUpdateToMembers = async (roomName) => {
    const { speakers, others } = await roomServices.getSpeakersAndOthers({
      rtcRoomName: roomName,
    });
    this.io.to(roomName).emit("room-update-event", "room-info", {
      speakers,
      others,
    });
  };
}

const socketIoBootstrap = new SocketIoBootstrap();

module.exports = socketIoBootstrap;
