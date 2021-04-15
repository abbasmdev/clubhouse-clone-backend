const { Op } = require("sequelize");
const HttpBadReuestException = require("../../core/exceptions/http-badrequest-exception");
const HttpUnAuthenticatedException = require("../../core/exceptions/http-unAthenticated-exception");
const smsServices = require("../../notifications/services/sms.services");
const User = require("../../users/models/User.model");
const userServices = require("../../users/services/user.services");
const jwtServices = require("./jwt.services");
const otpCodeServices = require("./otpCode.services");

const registerUser = async ({
  mobile,
  username,
  fullName,
  imageFile,
  otpCode,
}) => {
  const vcode = await otpCodeServices.getCodeByMobile({ mobile });

  if (!vcode || vcode.code != otpCode)
    throw new HttpBadReuestException({ message: "code not valid" });

  //remove all prev otp codes for this mobile
  await otpCodeServices.removeAllMobileCodes({ mobile });

  let user = await User.findOne({
    $or: [{ username }, { mobile }],
  });

  //if user not exists create with random username,full name and create jwt token
  if (user) {
    throw new HttpBadReuestException({
      message: "user with mobile or username already exists",
    });
  }
  user = new User();
  user.mobile = mobile;
  user.username = username;
  user.fullName = fullName;
  user.profilePhotoName = imageFile.filename;
  await user.save();
  //create jwt token
  const token = jwtServices.signPayload({ id: user.id });
  return { user, token: token };
};

const loginUser = async ({ mobile, otpCode }) => {
  const vcode = await otpCodeServices.getCodeByMobile({ mobile });

  if (!vcode || vcode.code != otpCode)
    throw new HttpBadReuestException({ message: "code not valid" });

  //remove all prev otp codes for this mobile
  await otpCodeServices.removeAllMobileCodes({ mobile });

  const user = await User.findOne({ mobile });

  //if user not exists create with random username,full name and create jwt token
  if (!user) {
    throw new HttpBadReuestException({ message: "user not found." });
  }
  const token = jwtServices.signPayload({ id: user.id });
  return { user, token: token };
};

const getMe = async ({ userId }) => {
  return userServices.getUserById({ id: userId });
};
const sendOtpCode = async ({ mobile }) => {
  const code = await otpCodeServices.createCode({ mobile });
  const msg = `Your code:${code.code}`;
  await smsServices.sendMessageToMobile({ mobile, message: msg });
};

const authServices = { registerUser, sendOtpCode, loginUser, getMe };
module.exports = authServices;
