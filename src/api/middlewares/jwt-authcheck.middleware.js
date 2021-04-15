const jwtServices = require("../../auth/services/jwt.services");
const HttpUnAuthenticatedException = require("../../core/exceptions/http-unAthenticated-exception");
const userServices = require("../../users/services/user.services");

const jwtAuthCheckMiddleware = async (req, res, next) => {
  try {
    const token = req?.headers["authorization"]?.split("Bearer ")?.[1];

    const { id } = jwtServices.validateGetPayload({ token });

    const user = await userServices.getUserById({ id: id });
    if (!user || user.isActive == false)
      throw new HttpUnAuthenticatedException();
    req.user = user;
    next();
  } catch (error) {
    next(new HttpUnAuthenticatedException());
  }
};
module.exports = jwtAuthCheckMiddleware;
