const jwt = require("jsonwebtoken");

const signPayload = ({ id }) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET_KEY);
  return token;
};

const validateGetPayload = ({ token }) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  return decoded;
};

const jwtServices = { signPayload, validateGetPayload };

module.exports = jwtServices;
