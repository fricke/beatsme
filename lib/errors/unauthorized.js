var util = require('util');

function UnauthorizedError(message, errorCode) {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.message = message;
  this.statusCode = 401;
  if (errorCode !== undefined) {
    this.errorCode = errorCode;
  }
}

util.inherits(UnauthorizedError, Error);

module.exports = UnauthorizedError;
