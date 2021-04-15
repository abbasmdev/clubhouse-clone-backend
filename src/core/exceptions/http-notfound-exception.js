const HttpException = require("./http-exception");

class HttpNotFoundException extends HttpException {
  name = "HttpNotFoundException";
  errorCode = 404;
  constructor(
    { message = "Not found", extra = [] } = {} || { message, extra }
  ) {
    super({ message, extra });
  }
}
module.exports = HttpNotFoundException;
