const express = require('express');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
const { ThrowValidationError, ValidationErrorMessages } = require('../errors/ValidationError');

dayjs.extend(customParseFormat);

const countNumberDigits = number => {
  const numberIntegerPart = Math.abs(Math.trunc(number));

  return {
    integerPart: numberIntegerPart.toString().length,
    decimalPart: Math.abs(number).toString().replace('.', '').length - numberIntegerPart.toString().length,
  };
};

const dateFormatIsValid = date => {
  return dayjs(date, 'DD-MM-YYYY', true).isValid();
};

const countDateDifferenceFromToday = date => {
  return dayjs(dayjs().format('DD-MM-YYYY'), 'DD-MM-YYYY').diff(dayjs(date, 'DD-MM-YYYY'), 'day');
};

module.exports = app => {
  const router = express.Router();

  router.post('/', (req, res, next) => {
    const requestBody = { ...req.body };
    const transfer = {};

    transfer.due_date = requestBody.dueDate ?? new Date();
    if (requestBody.dueDate && !dateFormatIsValid(requestBody.dueDate)) ThrowValidationError(ValidationErrorMessages.invalidDateFormat);
    if (countDateDifferenceFromToday(requestBody.dueDate) > 0) ThrowValidationError(ValidationErrorMessages.pastDueDate);

    transfer.amount = requestBody.amount ?? ThrowValidationError(ValidationErrorMessages.missingAmount);

    if (requestBody.amount < 0) ThrowValidationError(ValidationErrorMessages.negativeAmount);
    if (requestBody.amount === 0) ThrowValidationError(ValidationErrorMessages.zeroAmount);

    if (countNumberDigits(requestBody.amount).decimalPart > 2) {
      ThrowValidationError(ValidationErrorMessages.moreThanTwoDecimals);
    }

    if (countNumberDigits(requestBody.amount).integerPart > 15) {
      ThrowValidationError(ValidationErrorMessages.moreThanFifteenIntegerDigits);
    }

    app.services.transfer.create(transfer)
      .then(result => {
        const clientResponse = {
          internalId: result.id,
          status: 'CREATED',
          amount: result.amount,
          dueDate: result.due_date,
        };

        return res.status(201).json(clientResponse);
      })
      .catch(err => next(err));
  });

  return router;
};
