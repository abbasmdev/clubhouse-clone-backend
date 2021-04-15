const usersController = require("../controllers/users.controller");
const asyncHandler = require("express-async-handler");

const usersRouter = require("express").Router();
usersRouter.get(
  "/profiles/:id",
  [],
  asyncHandler(usersController.getUserProfile)
);

usersRouter.post(
  "/profiles/:id/follow",
  [],
  asyncHandler(usersController.postFollowUser)
);
usersRouter.post(
  "/profiles/:id/unfollow",
  [],
  asyncHandler(usersController.postUnFollowUser)
);

module.exports = usersRouter;
