class HttpException extends Error {
  constructor(
    {
      message = "some error happened.",
      name = "HttpException",
      errorCode = 500,
      extra = [],
    } = {} || { message, name, errorCode, extra }
  ) {
    super(message);
    this.name = name;
    this.errorCode = errorCode;
    this.extra = extra;
  }
}

module.exports = HttpException;
