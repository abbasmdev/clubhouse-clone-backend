const mongoose = require("mongoose");
const { SchemaTypes, Schema, model } = mongoose;
const isIranMobileRegex = require("../../utils/isIranMobile.regex");

const schema = new Schema({
  mobile: {
    unique: true,
    type: SchemaTypes.String,
    validate: {
      validator: function (v) {
        return isIranMobileRegex.test(v);
      },
      message: (props) => `${props.value} is not a valid mobile number!`,
    },
    required: true,
  },
  bio: {
    type: SchemaTypes.String,
    maxLength: 400,
  },
  fullName: {
    type: SchemaTypes.String,
    required: true,
    minLength: 3,
    maxLength: 50,
  },
  username: {
    type: SchemaTypes.String,
    required: true,
    minLength: 3,
    unique: true,
    maxLength: 50,
  },
  followers: {
    type: [SchemaTypes.ObjectId],
    ref: "User",
    default: [],
  },
  followings: {
    type: [SchemaTypes.ObjectId],
    ref: "User",
    default: [],
  },
  profilePhotoName: { type: SchemaTypes.String, required: true },
  isActive: { type: SchemaTypes.Boolean, default: true },
});

const User = model("User", schema);

module.exports = User;
