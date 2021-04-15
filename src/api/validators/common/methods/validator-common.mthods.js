const isIranMobileRegex = require("../../../../utils/isIranMobile.regex");

const isIranMobile = (value, helpers) => {
  if (!isIranMobileRegex.test(value)) {
    return helpers.error("any.invalid");
  }

  return value;
};

const validatorCommonMethods = { isIranMobile };
module.exports = validatorCommonMethods;
