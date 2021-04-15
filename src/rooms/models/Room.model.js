const { nanoid } = require("nanoid");
const mongoose = require("mongoose");
const RoomSpeaker = require("./RoomSpeaker.model");
const { SchemaTypes, model, Schema } = mongoose;
const roomType = Object.freeze({
  OPEN: "OPEN",
  SOCIAL: "SOCIAL",
  CLOSED: "CLOSED",
});

const schema = new Schema({
  name: {
    type: SchemaTypes.String,
    required: true,
    maxLength: 50,
    minLength: 3,
  },
  creator: {
    type: SchemaTypes.ObjectId,
    required: true,
    ref: "User",
  },
  users: { type: [SchemaTypes.ObjectId], default: [], ref: "User" },
  mods: {
    type: [SchemaTypes.ObjectId],
    default: [],
    ref: "User",
  },
  speakers: {
    type: [SchemaTypes.ObjectId],
    default: [],
    ref: "RoomSpeaker",
  },
  roomType: {
    type: SchemaTypes.String,
    enum: roomType,
    default: roomType.CLOSED,
  },
  rtcRoomName: {
    type: SchemaTypes.String,
    default: () => nanoid("20"),
  },
});

schema.methods.hasUser = function (userId, cb) {
  return this?.users?.includes(userId);
};

schema.methods.addUser = function (userId, cb) {
  if (userId) return this?.users?.push(userId);
};

schema.methods.removeUser = function (userId, cb) {
  const idx = this?.users.indexOf(userId);
  if (userId && idx >= 0) return this?.users?.splice(idx, 1);
};

schema.methods.hasMod = function (userId, cb) {
  return this?.mods?.includes(userId);
};

schema.methods.removeMod = function (userId, cb) {
  const idx = this?.mods.indexOf(userId);
  if (userId && idx >= 0) return this?.mods?.splice(idx, 1);
};

schema.methods.addSpeaker = function (speakerId, cb) {
  if (speakerId) return this?.speakers?.push(speakerId);
};

schema.methods.hasSpeaker = function (speakerId, cb) {
  return this?.speakers?.includes(speakerId);
};

schema.methods.getSpeakers = async function (speakerId, cb) {
  if (!this?.speakers?.length > 0) return [];
  return this?.speakers;
};

schema.methods.removeSpeaker = function (speakerId, cb) {
  const idx = this?.speakers.indexOf(speakerId);
  if (speakerId && idx >= 0) return this?.speakers?.splice(idx, 1);
};

const Room = model("Room", schema);

module.exports = Room;
module.exports.roomType = roomType;
