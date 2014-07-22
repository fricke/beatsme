var util = require('util');

function NotFoundError(message, errorCode) {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.message = message;
  this.statusCode = 404;
  if (errorCode !== undefined) {
    this.errorCode = errorCode;
  }
}

util.inherits(NotFoundError, Error);

module.exports = NotFoundError;
