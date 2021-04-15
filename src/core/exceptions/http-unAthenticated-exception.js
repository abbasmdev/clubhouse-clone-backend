const HttpException = require("./http-exception");

class HttpUnAuthenticatedException extends HttpException {
  name = "HttpUnAuthenticatedException";
  errorCode = 401;
  constructor(
    { message = "Unauthenticated", extra = [] } = {} || { message, extra }
  ) {
    super({ message, extra });
  }
}
module.exports = HttpUnAuthenticatedException;
