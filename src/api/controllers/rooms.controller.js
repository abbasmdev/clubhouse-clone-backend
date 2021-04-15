const roomServices = require("../../rooms/services/room.services");

const createRoom = async (req, res, next) => {
  const { name, type } = req.body;
  const user = req.user;
  const room = await roomServices.createRoom({ name, type, creator: user });
  return res.json({ room: room });
};

const addMember = async (req, res, next) => {
  const { username, roomId } = req.body;
  const user = req.user;
  const room = await roomServices.addMember({
    requestUserId: user.id,
    username: username,
    roomId: roomId,
  });
  return res.json({ room: room });
};

const joinRoom = async (req, res, next) => {
  const { roomId } = req.body;
  const user = req.user;
  const room = await roomServices.joinRoom({
    requestUserId: user.id,
    roomId: roomId,
  });
  return res.json({ room: room });
};

const leaveRoom = async (req, res, next) => {
  const { roomId } = req.body;
  const user = req.user;
  const room = await roomServices.leaveRoom({
    requestUserId: user.id,
    roomId: roomId,
  });
  return res.json({ room: room });
};

const getJoinedRooms = async (req, res, next) => {
  const { roomId } = req.body;
  const user = req.user;
  const rooms = await roomServices.getJoinedRooms({
    requestUserId: user.id,
  });
  return res.json({ rooms: rooms });
};

const getJoinedRoomDetail = async (req, res, next) => {
  const { roomId } = req.body;
  const user = req.user;
  const room = await roomServices.getJoinedRoomDetail({
    requestUserId: user.id,
    roomId: roomId,
  });
  return res.json({ room: room });
};

const getPublicRooms = async (req, res, next) => {
  const user = req.user;
  const rooms = await roomServices.getPublicRooms({
    requestUserId: user.id,
  });
  return res.json({ rooms: rooms });
};

const roomsController = {
  getPublicRooms,
  createRoom,
  addMember,
  joinRoom,
  leaveRoom,
  getJoinedRooms,
  getJoinedRoomDetail,
};

module.exports = roomsController;
