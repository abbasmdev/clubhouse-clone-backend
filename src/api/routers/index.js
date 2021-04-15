const express = require("express");
const apiRootRouter = require("express").Router();
const { MulterError } = require("multer");
const HttpException = require("../../core/exceptions/http-exception");
const jwtAuthCheckMiddleware = require("../middlewares/jwt-authcheck.middleware");
const unHandledRoutesMiddleware = require("../middlewares/uhandled-routes.middleware");
const authRouter = require("./auth.router");
const roomsRouter = require("./rooms.router");
const usersRouter = require("./users.router");

//api middlewares
apiRootRouter.use(express.json());

apiRootRouter.use("/auth", authRouter);

apiRootRouter.use("/rooms", [jwtAuthCheckMiddleware], roomsRouter);

apiRootRouter.use("/users", [jwtAuthCheckMiddleware], usersRouter);

//uhhandled routes
apiRootRouter.use(unHandledRoutesMiddleware);

//unhandled exceptions

apiRootRouter.use((err, req, res, next) => {
  let statusCode = 500;
  let message = "Internal error.";
  let extra = [];
  let errorCode = 500;

  if (err instanceof HttpException) {
    statusCode = err?.errorCode || 500;
    errorCode = statusCode;
    message = err?.message || "Internal error.";
    extra = err?.extra || [];
  }
  if (err instanceof MulterError) {
    statusCode = 400;
    message = err?.message || "Internal error.";

    errorCode = 400;
  }

  console.log(err);

  res.status(statusCode).json({ errorCode, message, extra });
});

module.exports = apiRootRouter;
