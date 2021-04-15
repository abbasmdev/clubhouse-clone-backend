const HttpBadReuestException = require("../../core/exceptions/http-badrequest-exception");

const joiValidatorMiddleware = (schema) => (req, res, next) => {
  schema
    .validateAsync(req.body, { abortEarly: false })
    .then((value) => {
      req.body = value;
      next();
    })
    .catch((err) => {
      const message = err?.message || "bad request";
      const extra = err?.details || [];
      next(new HttpBadReuestException({ message: message, extra: extra }));
    });
};

module.exports = joiValidatorMiddleware;
