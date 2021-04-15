const Joi = require("joi");
const validatorjs = require("validator/validator");
const validatorCommonMethods = require("../common/methods/validator-common.mthods");

const sendOtpCodeSchema = Joi.object({
  mobile: Joi.string()
    .trim()
    .custom(validatorCommonMethods.isIranMobile)
    .required(),
});

const registerSchema = Joi.object({
  mobile: Joi.string()
    .trim()
    .custom(validatorCommonMethods.isIranMobile)
    .required(),
  code: Joi.string()
    .trim()
    .length(4)
    .custom((value, helpers) => {
      if (validatorjs.isNumeric(value)) return value;
      return helpers.error("any.invalid");
    })
    .required(),

  username: Joi.string().trim().min(3).max(50).required(),
  fullName: Joi.string().trim().max(50).required(),
});

const loginSchema = Joi.object({
  mobile: Joi.string()
    .trim()
    .custom(validatorCommonMethods.isIranMobile)
    .required(),
  code: Joi.string()
    .trim()
    .length(4)
    .custom((value, helpers) => {
      if (validatorjs.isNumeric(value)) return value;
      return helpers.error("any.invalid");
    })
    .required(),
});
const authValidatorSchemas = { sendOtpCodeSchema, registerSchema, loginSchema };

module.exports = authValidatorSchemas;
