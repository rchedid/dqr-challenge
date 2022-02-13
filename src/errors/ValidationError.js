function ValidationError(message) {
  this.name = 'ValidationError';
  this.message = message;
}

function ThrowValidationError(message) {
  throw new ValidationError(message);
}

const ValidationErrorMessages = {
  missingAmount: 'Amount is required attribute',
  negativeAmount: 'Amount must be positive',
  zeroAmount: 'Amount must be greater than zero',
  moreThanTwoDecimals: 'Amount must not have more than 2 decimals',
  moreThanFifteenIntegerDigits: 'Amount must not have more than 15 integer digits',
  pastDueDate: 'Can\'t transfer with past due date',
  invalidDateFormat: 'Invalid date format. Accepted format is DD-MM-YYYY .',
};

module.exports = {
  ThrowValidationError,
  ValidationErrorMessages,
};
