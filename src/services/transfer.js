const DateUtils = require('../utils/DateUtils');
const NumberUtils = require('../utils/NumberUtils');

const { ThrowValidationError, ValidationErrorMessages } = require('../errors/ValidationError');

module.exports = app => {
  const validate = async requestBody => {
    if (requestBody.dueDate && !DateUtils.dateFormatIsValid(requestBody.dueDate)) ThrowValidationError(ValidationErrorMessages.invalidDateFormat);
    if (DateUtils.countDateDifferenceFromToday(requestBody.dueDate) > 0) ThrowValidationError(ValidationErrorMessages.pastDueDate);

    if (!requestBody.amount) ThrowValidationError(ValidationErrorMessages.missingAmount);
    if (requestBody.amount < 0) ThrowValidationError(ValidationErrorMessages.negativeAmount);
    if (requestBody.amount === 0) ThrowValidationError(ValidationErrorMessages.missingAmount);

    if (NumberUtils.countNumberDigits(requestBody.amount).decimalPart > 2) {
      ThrowValidationError(ValidationErrorMessages.moreThan2Decimals);
    }

    if (NumberUtils.countNumberDigits(requestBody.amount).integerPart > 14) {
      ThrowValidationError(ValidationErrorMessages.moreThan14IntegerDigits);
    }
  };

  const create = async transfer => {
    const createdTransfer = await app.db('transfers').insert(transfer, '*');
    return createdTransfer[0];
  };

  const find = (filter = {}) => {
    return app.db('transfers')
      .where(filter)
      .select();
  };

  const findOne = (filter = {}) => {
    return app.db('transfers')
      .where(filter)
      .first();
  };

  return { create, validate, find, findOne };
};
