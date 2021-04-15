const authServices = require("../../auth/services/auth.services");
const HttpBadReuestException = require("../../core/exceptions/http-badrequest-exception");

const registerUser = async (req, res, next) => {
  const profileImage = req.file;
  if (!profileImage)
    throw new HttpBadReuestException({ message: "No profile image provided." });
  const { code, mobile, username, fullName } = req.body;

  const { token, user } = await authServices.registerUser({
    mobile,
    otpCode: code,
    username,
    fullName,
    imageFile: profileImage,
  });
  res.json({ message: "authenticate success.", token, user });
};

const loginUser = async (req, res, next) => {
  const { code, mobile } = req.body;
  const { token, user } = await authServices.loginUser({
    mobile,
    otpCode: code,
  });
  res.json({ message: "authenticate success.", token, user });
};

const getMe = async (req, res, next) => {
  const userId = req?.user?.id;
  const user = await authServices.getMe({ userId });
  res.json({ user: user });
};

const sendOtpCode = async (req, res, next) => {
  const mobile = req.body.mobile;
  await authServices.sendOtpCode({ mobile });
  res.json({ message: "Code sent." });
};

const apiAuthController = { registerUser, sendOtpCode, loginUser, getMe };
module.exports = apiAuthController;
