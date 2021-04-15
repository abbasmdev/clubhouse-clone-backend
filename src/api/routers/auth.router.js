const asyncHandler = require("express-async-handler");
const profileImageUpload = require("../../core/multer/uploads/profile-image.upload");

const { apiAuthController } = require("../controllers");
const joiValidatorMiddleware = require("../middlewares/joi-validator.middleware");
const jwtAuthCheckMiddleware = require("../middlewares/jwt-authcheck.middleware");
const authValidatorSchemas = require("../validators/auth/auth.validators");

const authRouter = require("express").Router();

authRouter.post(
  "/register",
  [
    profileImageUpload.single("image"),
    joiValidatorMiddleware(authValidatorSchemas.registerSchema),
  ],
  asyncHandler(apiAuthController.registerUser)
);

authRouter.post(
  "/login",
  [joiValidatorMiddleware(authValidatorSchemas.loginSchema)],
  asyncHandler(apiAuthController.loginUser)
);

authRouter.post(
  "/send-otp",
  [joiValidatorMiddleware(authValidatorSchemas.sendOtpCodeSchema)],
  asyncHandler(apiAuthController.sendOtpCode)
);

authRouter.get(
  "/me",
  [jwtAuthCheckMiddleware],
  asyncHandler(apiAuthController.getMe)
);

module.exports = authRouter;
