const OtpCode = require("../models/OtpCode.model");

const createCode = async ({ mobile }) => {
  const code = new OtpCode();
  code.mobile = mobile;
  code.code = generateRadomCode();
  await code.save();
  return code;
};

const getCodeByMobile = async ({ mobile }) => {
  return OtpCode.findOne({
    mobile: mobile,
  })
    .sort({ createdAt: -1 })
    .exec();
};

const removeAllMobileCodes = async ({ mobile }) => {
  return await OtpCode.deleteMany({ mobile: mobile });
};

const generateRadomCode = () => {
  return 1111;
  const max = 9999;
  const min = 1000;
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const otpCodeServices = { createCode, getCodeByMobile, removeAllMobileCodes };

module.exports = otpCodeServices;
