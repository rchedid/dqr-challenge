const ValidationError = message => {
  this.name = 'ValidationError';
  this.message = message;
};

const ThrowValidationError = message => {
  throw new ValidationError(message);
};

module.exports = {
  ValidationError,
  ThrowValidationError,
};
