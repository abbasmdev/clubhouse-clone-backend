const HttpNotFoundException = require("../../core/exceptions/http-notfound-exception");

const unHandledRoutesMiddleware = (req, res, next) => {
  next(new HttpNotFoundException({ message: "not found" }));
};

module.exports = unHandledRoutesMiddleware;
