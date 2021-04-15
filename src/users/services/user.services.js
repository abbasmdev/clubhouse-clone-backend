const HttpBadReuestException = require("../../core/exceptions/http-badrequest-exception");
const HttpNotFoundException = require("../../core/exceptions/http-notfound-exception");
const User = require("../models/User.model");

const getUserById = async ({ id }) => {
  return User.findById(id);
};

const getUserProfile = async ({ userId }) => {
  const user = await User.findById(userId);
  if (!user) throw new HttpNotFoundException({ message: "profile not found" });

  return { user };
};

const followUser = async ({ requstUserId, toFollowUserId }) => {
  const reqUser = await User.findById(requstUserId);
  const toFollowUser = await User.findById(toFollowUserId);
  if (!reqUser || !toFollowUser)
    throw new HttpBadReuestException({ message: "user not found." });
  if (
    requstUserId == toFollowUserId ||
    toFollowUser?.followers?.includes(requstUserId)
  ) {
    throw new HttpBadReuestException({
      message: "Already following!",
    });
  }
  toFollowUser.followers.push(reqUser);
  reqUser.followings.push(toFollowUser);
  await toFollowUser.save();
  await reqUser.save();
  return reqUser;
};

const unFollowUser = async ({ requstUserId, toUnFollowUserId }) => {
  const reqUser = await User.findById(requstUserId);
  const toUnFollowUser = await User.findById(toUnFollowUserId);
  if (!reqUser || !toUnFollowUser)
    throw new HttpBadReuestException({ message: "user not found." });
  if (
    requstUserId == toUnFollowUserId ||
    !toUnFollowUser?.followers?.includes(requstUserId)
  ) {
    throw new HttpBadReuestException({
      message: "Not following!",
    });
  }
  toUnFollowUser?.followers?.splice(
    toUnFollowUser?.followers?.indexOf(requstUserId),
    1
  );
  reqUser?.followings?.splice(reqUser?.followings?.indexOf(requstUserId), 1);
  await toUnFollowUser.save();
  await reqUser.save();
  return reqUser;
};

const userServices = {
  getUserById,
  getUserProfile,
  followUser,
  unFollowUser,
};

module.exports = userServices;
