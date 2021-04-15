const HttpBadReuestException = require("../../core/exceptions/http-badrequest-exception");
const userServices = require("../../users/services/user.services");

const { isValidObjectId } = require("mongoose");

const getUserProfile = async (req, res, next) => {
  isValidObjectId;
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    throw new HttpBadReuestException({ message: "Id not valid" });
  }
  const { user } = await userServices.getUserProfile({
    userId: id,
  });

  return res.json({ userProfile: user });
};

const postFollowUser = async (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    throw new HttpBadReuestException({ message: "Id not valid" });
  }
  await userServices.followUser({
    requstUserId: req?.user?.id,
    toFollowUserId: id,
  });
  return res.json({});
};

const postUnFollowUser = async (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    throw new HttpBadReuestException({ message: "Id not valid" });
  }
  await userServices.unFollowUser({
    requstUserId: req?.user?.id,
    toUnFollowUserId: id,
  });
  return res.json({});
};

const usersController = { getUserProfile, postFollowUser, postUnFollowUser };

module.exports = usersController;
