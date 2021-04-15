const { nanoid } = require("nanoid");
const mongoose = require("mongoose");
const { SchemaTypes, model, Schema } = mongoose;

const schema = new Schema(
  {
    room: {
      type: SchemaTypes.ObjectId,
      required: true,
      ref: "Room",
    },
    user: {
      type: SchemaTypes.ObjectId,
      required: true,
      ref: "User",
    },
    micMuted: {
      type: SchemaTypes.Boolean,
      default: true,
    },
    isRoomCreator: {
      type: SchemaTypes.Boolean,
      default: false,
    },
    isRoomMod: {
      type: SchemaTypes.Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const RoomSpeaker = model("RoomSpeaker", schema);

module.exports = RoomSpeaker;
