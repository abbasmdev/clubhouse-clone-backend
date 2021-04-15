const HttpBadReuestException = require("../../core/exceptions/http-badrequest-exception");
const HttpException = require("../../core/exceptions/http-exception");
const User = require("../../users/models/User.model");
const userServices = require("../../users/services/user.services");
const Room = require("../models/Room.model");
const RoomSpeaker = require("../models/RoomSpeaker.model");

const createRoom = async ({ name, type, creator }) => {
  const room = new Room();
  room.name = name;
  room.roomType = type;
  room.creator = creator;
  room.users.push(creator);
  await room.save();

  return room;
};

const addMember = async ({ requestUserId, username, roomId }) => {
  const room = await Room.findById(roomId);
  const requestUser = await userServices.getUserById({ id: requestUserId });
  const toAddUser = await User.findOne({ username: username });
  if (!room || !requestUser || !toAddUser)
    throw new HttpBadReuestException({ message: "Room or user not found." });

  // toAddUser not to be in room and requestUser be in room
  if (room.hasUser(toAddUser.id) || !room.hasUser(requestUser.id))
    throw new HttpBadReuestException({
      message: "User already in room or you are not in room.",
    });

  const rtype = room.roomType;

  if (rtype == Room.roomType.OPEN || rtype == Room.roomType.SOCIAL) {
    //room open or social
    room.addUser(toAddUser.id);
    await room.save();
    return room;
  } else if (rtype == Room.roomType.CLOSED) {
    //room closed and request user is room mod,creator
    const hasMod = room.hasMod(requestUser);
    if (room.creator._id == requestUser.id || hasMod) {
      room.addUser(toAddUser.id);
      await room.save();
      return room;
    }

    throw new HttpBadReuestException({
      message: "You are not mod or creator to add member to this room",
    });
  } else {
    //unknown
    throw new HttpBadReuestException({ message: "Bad request" });
  }
};

const joinRoom = async ({ requestUserId, roomId }) => {
  const room = await Room.findById(roomId);
  const requestUser = await User.findById(requestUserId);
  if (!room || !requestUser)
    throw new HttpBadReuestException({ message: "Room not found" });

  if (room.hasUser(requestUser.id))
    throw new HttpBadReuestException({ message: "You are already in room." });
  if (room.roomType != Room.roomType.OPEN)
    throw new HttpBadReuestException({
      message: "Only open rooms you can join.",
    });

  room.addUser(requestUser.id);
  await room.save();
  return room;
};

const leaveRoom = async ({ requestUserId, roomId }) => {
  const room = await Room.findById(roomId);
  const requestUser = await User.findById(requestUserId);
  if (!room || !requestUser)
    throw new HttpBadReuestException({ message: "Room not found" });

  if (!room.hasUser(requestUser.id))
    throw new HttpBadReuestException({ message: "You are not in room." });

  //creator is leaving
  if (room.creator._id == requestUser.id) {
    throw new HttpBadReuestException({
      message: "You can't leave your room, try deleting room maybe.",
    });
  } else if (room.hasMod(requestUser.id)) {
    room.removeMod(requestUser.id);
    room.removeUser(requestUser.id);
    await room.save();
    return room;
  } else {
    //normal user
    room.removeUser(requestUser.id);
    await room.save();
    return room;
  }
};

const getJoinedRooms = async ({ requestUserId }) => {
  const user = await User.findById(requestUserId);
  if (!user) throw new HttpBadReuestException({ message: "user not found" });
  const rooms = await Room.find({ users: { $in: [requestUserId] } })
    .populate({
      path: "users",
      select: "username id profilePhotoName fullName ",
    })
    .populate({
      path: "speakers",
      populate: {
        path: "user",
        model: "User",
        select: "profilePhotoName username fullName",
      },
    });
  return rooms;
};

const getPublicRooms = async ({ requestUserId }) => {
  //public rooms which user not joined.
  const user = await User.findById(requestUserId);
  if (!user) throw new HttpBadReuestException({ message: "user not found" });
  const rooms = await Room.find({
    roomType: Room.roomType.OPEN,
    users: { $nin: [requestUserId] },
  });

  return rooms;
};

const getJoinedRoomDetail = async ({ requestUserId, roomId }) => {
  const room = await Room.findById(roomId);
  const requestUser = await User.findById(requestUserId);
  if (!room || !requestUser)
    throw new HttpBadReuestException({ message: "Room not found" });

  if (!room?.hasUser(requestUserId))
    throw new HttpException({
      message: "You are not in room.",
      errorCode: 401,
    });

  return room;
};

//start voice chat
const enterRoom = async ({ userId, rtcRoomName }) => {
  const room = await Room.findOne({ rtcRoomName: rtcRoomName });
  const user = await User.findById(userId);
  if (!room || !user || !room.hasUser(user.id)) {
    throw new HttpBadReuestException({ message: "You are not in room." });
  }
  const isMod = room.hasMod(user);
  const isCreator = room.creator._id == user.id;
  await RoomSpeaker.findOneAndRemove({ user: user.id, room: room.id });
  const speaker = new RoomSpeaker({ isMod, isCreator, user, room });
  await speaker.save();
  room.addSpeaker(speaker.id);
  await room.save();
  return room;
};

//end voice chat
const exitRoom = async ({ userId, rtcRoomName }) => {
  const room = await Room.findOne({ rtcRoomName });
  const user = await User.findById(userId);
  if (!room || !user || !room.hasUser(user.id)) {
    throw new HttpBadReuestException({ message: "You are not in room." });
  }
  const speaker = await RoomSpeaker.findOne({ user: user.id, room: room.id });
  if (room.hasSpeaker(speaker.id)) {
    room.removeSpeaker(speaker.id);
    await room.save();
    await speaker.delete();
    return room;
  }
};

const getSpeakersAndOthers = async ({ rtcRoomName }) => {
  const room = await Room.findOne({ rtcRoomName }).populate({
    path: "speakers",
    populate: {
      path: "user",
      model: "User",
      select: "profilePhotoName username fullName",
    },
  });

  if (!room) {
    throw new HttpBadReuestException({ message: "room not found" });
  }
  const speakers = await room.getSpeakers();
  const others = [];
  return { speakers: speakers, others: others };
};

const updateSpeakerMicStatus = async ({ userId, rtcRoomName, micMuted }) => {
  const room = await Room.findOne({ rtcRoomName });
  const user = await userServices.getUserById({ id: userId });
  if (!room || !user) {
    throw new HttpBadReuestException({ message: "user or room not found" });
  }
  await RoomSpeaker.findOneAndUpdate(
    { room: room.id, user: user.id },
    { micMuted: micMuted }
  );

  return room;
};

const roomServices = {
  createRoom,
  addMember,
  updateSpeakerMicStatus,
  joinRoom,
  leaveRoom,
  getJoinedRooms,
  getJoinedRoomDetail,
  enterRoom,
  exitRoom,
  getSpeakersAndOthers,
  getPublicRooms,
};

module.exports = roomServices;
