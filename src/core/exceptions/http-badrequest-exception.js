const HttpException = require("./http-exception");

class HttpBadReuestException extends HttpException {
  name = "HttpBadReuestException";
  errorCode = 400;
  constructor(
    { message = "Bad request", extra = [] } = {} || { message, extra }
  ) {
    super({ message, extra });
  }
}
module.exports = HttpBadReuestException;
