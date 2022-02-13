function ValidationError(message) {
  this.name = 'ValidationError';
  this.message = message;
}

function ThrowValidationError(message) {
  throw new ValidationError(message);
}

const ValidationErrorMessages = {
  missingAmount: 'Amount is required',
  negativeAmount: 'Amount must be positive',
  moreThan2Decimals: 'Amount must not have more than 2 decimals',
  moreThan14IntegerDigits: 'Amount must not have more than 14 integer digits',
  pastDueDate: 'Can\'t transfer with past due date',
  invalidDateFormat: 'Invalid date format. Accepted format is DD-MM-YYYY .',
};

module.exports = {
  ThrowValidationError,
  ValidationErrorMessages,
};
