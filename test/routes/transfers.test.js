const request = require('supertest');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
const { ValidationErrorMessages } = require('../../src/errors/ValidationError');

dayjs.extend(customParseFormat);

const app = require('../../src/app');

const MAIN_ROUTE = '/v1/transfers';

describe('Valid transfer solicitations', () => {
  test('Should request liquidation with current date if no due date is received and amount have 2 decimals', () => {
    return request(app)
      .post(MAIN_ROUTE)
      .send({ amount: 10000.12 })
      .then(res => {
        // make request to liquidation service
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('internalId');
        expect(res.body.amount).toBe('10000.12');
        expect(res.body.status).toBe('CREATED');
        expect(res.body.dueDate).toBe(new Date((new Date()).setHours(0, 0, 0, 0)).toISOString());
      });
  });

  test('Should request liquidation if amount does\'nt have decimals', () => {
    return request(app)
      .post(MAIN_ROUTE)
      .send({ amount: 10000 })
      .then(res => {
        // make request to liquidation service
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('internalId');
        expect(res.body.amount).toBe('10000.00');
        expect(res.body.status).toBe('CREATED');
        expect(res.body.dueDate).toBe(new Date((new Date()).setHours(0, 0, 0, 0)).toISOString());
      });
  });

  test('Should request liquidation if amount have 1 decimal', () => {
    return request(app)
      .post(MAIN_ROUTE)
      .send({ amount: 10000.1 })
      .then(res => {
        // make request to liquidation service
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('internalId');
        expect(res.body.amount).toBe('10000.10');
        expect(res.body.status).toBe('CREATED');
        expect(res.body.dueDate).toBe(new Date((new Date()).setHours(0, 0, 0, 0)).toISOString());
      });
  });

  test('Should request liquidation if receives amount as string', () => {
    return request(app)
      .post(MAIN_ROUTE)
      .send({ amount: '10000.1' })
      .then(res => {
        // make request to liquidation service
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('internalId');
        expect(res.body.amount).toBe('10000.10');
        expect(res.body.status).toBe('CREATED');
        expect(res.body.dueDate).toBe(new Date((new Date()).setHours(0, 0, 0, 0)).toISOString());
      });
  });

  test('Should request liquidation if receives amount with 14 integer part digits', () => {
    return request(app)
      .post(MAIN_ROUTE)
      .send({ amount: 11122233344455 })
      .then(res => {
        // make request to liquidation service
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('internalId');
        expect(res.body.amount).toBe('11122233344455.00');
        expect(res.body.status).toBe('CREATED');
        expect(res.body.dueDate).toBe(new Date((new Date()).setHours(0, 0, 0, 0)).toISOString());
      });
  });

  test('Should request liquidation if due date is equal than the current date', () => {
    return request(app)
      .post(MAIN_ROUTE)
      .send({ amount: 10000, dueDate: dayjs().format('DD-MM-YYYY') })
      .then(res => {
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('internalId');
        expect(res.body.amount).toBe('10000.00');
        expect(res.body.status).toBe('CREATED');
        expect(res.body.dueDate).toBe(new Date((new Date()).setHours(0, 0, 0, 0)).toISOString());
      });
  });

  test('Should request liquidation if due date is later than the current date', () => {
    return request(app)
      .post(MAIN_ROUTE)
      .send({ amount: 10000, dueDate: dayjs().add(1, 'day').format('DD-MM-YYYY') })
      .then(res => {
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('internalId');
        expect(res.body.amount).toBe('10000.00');
        expect(res.body.status).toBe('CREATED');
        expect(res.body.dueDate).toBe(dayjs(dayjs().add(1, 'day').format('DD-MM-YYYY'), 'DD-MM-YYYY').toISOString());
      });
  });
});

describe('Invalid transfer solicitations', () => {
  const validTransfer = { amount: 10000, dueDate: dayjs().format('DD-MM-YYYY') };

  const invalidTransferTestTemplate = async (newData, errorMessage) => {
    return request(app)
      .post(MAIN_ROUTE)
      .send({ ...validTransfer, ...newData })
      .then(res => {
        expect(res.status).toBe(405);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  test('Shouldn\'t request liquidation with negative amount', () => {
    return invalidTransferTestTemplate({ amount: -10000 }, ValidationErrorMessages.negativeAmount);
  });

  test('Shouldn\'t request liquidation without amount', () => {
    return invalidTransferTestTemplate({ amount: null }, ValidationErrorMessages.missingAmount);
  });

  test('Shouldn\'t request liquidation with amount equal to zero', () => {
    return invalidTransferTestTemplate({ amount: 0 }, ValidationErrorMessages.missingAmount);
  });

  test('Shouldn\'t request liquidation if amount have more than 2 decimals', () => {
    return invalidTransferTestTemplate({ amount: 100.123 }, ValidationErrorMessages.moreThan2Decimals);
  });

  test('Shouldn\'t request liquidation if amount have more than 14 integer digits', () => {
    return invalidTransferTestTemplate({ amount: 111222333444555 }, ValidationErrorMessages.moreThan14IntegerDigits);
  });

  test('Shouldn\'t request liquidation if amount have 14 integer digits and more than 2 decimals', () => {
    return invalidTransferTestTemplate({ amount: 11122233344455.123 }, ValidationErrorMessages.moreThan2Decimals);
  });

  test('Shouldn\'t request liquidation with invalid due date', () => {
    return invalidTransferTestTemplate({ dueDate: '12/12/2029' }, ValidationErrorMessages.invalidDateFormat);
  });

  test('Shouldn\'t request liquidation with past due date', () => {
    return invalidTransferTestTemplate({ dueDate: dayjs().subtract(1, 'day').format('DD-MM-YYYY') }, ValidationErrorMessages.pastDueDate);
  });
});
