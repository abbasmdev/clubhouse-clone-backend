const mongoose = require("mongoose");
const { SchemaTypes } = mongoose;
const validatorjs = require("validator/validator");
const isIranMobileRegex = require("../../utils/isIranMobile.regex");

const schema = new mongoose.Schema(
  {
    mobile: {
      type: SchemaTypes.String,
      validate: {
        validator: function (v) {
          return isIranMobileRegex.test(v);
        },
        message: (props) => `${props.value} is not a valid mobile number!`,
      },
      required: true,
    },
    code: {
      type: SchemaTypes.String,
      required: true,
      maxlength: 4,
      minlength: 4,
      validate: {
        validator: function (v) {
          return validatorjs.isNumeric(v);
        },
        message: (props) => `${props.value} is not numeric!`,
      },
    },
  },
  { timestamps: true }
);
const OtpCode = mongoose.model("OtpCode", schema);

module.exports = OtpCode;
