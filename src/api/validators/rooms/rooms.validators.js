const Joi = require("joi");
const { isMongoId } = require("validator/validator");
const validatorjs = require("validator/validator");
const { roomType } = require("../../../rooms/models/Room.model");

const createRoomSchema = Joi.object({
  name: Joi.string().trim().min(3).max(50).required(),
  type: Joi.string()
    .trim()
    .custom((val, helpers) => {
      if (Object.values(roomType).includes(val)) return val;
      return helpers.error("any.invalid");
    })
    .required(),
});

const addMemberSchema = Joi.object({
  username: Joi.string().trim().min(3).max(50).required(),
  roomId: Joi.string()
    .trim()
    .custom((val, helpers) => {
      if (isMongoId(val)) return val;
      return helpers.error("any.invalid");
    })
    .required(),
});

const joinRoomSchema = Joi.object({
  roomId: Joi.string()
    .trim()
    .custom((val, helpers) => {
      if (isMongoId(val)) return val;
      return helpers.error("any.invalid");
    })
    .required(),
});

const leaveRoomSchema = Joi.object({
  roomId: Joi.string()
    .trim()
    .custom((val, helpers) => {
      if (isMongoId(val)) return val;
      return helpers.error("any.invalid");
    })
    .required(),
});

const getJoindedRoomDetailSchema = Joi.object({
  roomId: Joi.string()
    .trim()
    .custom((val, helpers) => {
      if (isMongoId(val)) return val;
      return helpers.error("any.invalid");
    })
    .required(),
});

const roomsValidators = {
  createRoomSchema,
  addMemberSchema,
  joinRoomSchema,
  leaveRoomSchema,
  getJoindedRoomDetailSchema,
};

module.exports = roomsValidators;
