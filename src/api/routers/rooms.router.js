const asyncHandler = require("express-async-handler");
const roomsController = require("../controllers/rooms.controller");
const joiValidatorMiddleware = require("../middlewares/joi-validator.middleware");
const roomsValidators = require("../validators/rooms/rooms.validators");

const roomsRouter = require("express").Router();

roomsRouter.post(
  "/create-room",
  [joiValidatorMiddleware(roomsValidators.createRoomSchema)],
  asyncHandler(roomsController.createRoom)
);

roomsRouter.post(
  "/add-member",
  [joiValidatorMiddleware(roomsValidators.addMemberSchema)],
  asyncHandler(roomsController.addMember)
);

roomsRouter.post(
  "/join-room",
  [joiValidatorMiddleware(roomsValidators.joinRoomSchema)],
  asyncHandler(roomsController.joinRoom)
);

roomsRouter.post(
  "/leave-room",
  [joiValidatorMiddleware(roomsValidators.leaveRoomSchema)],
  asyncHandler(roomsController.leaveRoom)
);

roomsRouter.get(
  "/get-joined-rooms",
  [],
  asyncHandler(roomsController.getJoinedRooms)
);

roomsRouter.post(
  "/get-joined-room-detail",
  [joiValidatorMiddleware(roomsValidators.getJoindedRoomDetailSchema)],
  asyncHandler(roomsController.getJoinedRoomDetail)
);

roomsRouter.get(
  "/get-public-rooms",
  [],
  asyncHandler(roomsController.getPublicRooms)
);

module.exports = roomsRouter;
