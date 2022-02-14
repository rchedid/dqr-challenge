const request = require('supertest');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
const { ValidationErrorMessages } = require('../src/errors/ValidationError');

dayjs.extend(customParseFormat);

const app = require('../src/app');

const MAIN_ROUTE = '/v1/transfers';

beforeAll(async () => {
  return app.db('transfers').del();
});

describe('Valid transfer solicitations', () => {
  const validTransfer = { amount: 10000, dueDate: dayjs().format('DD-MM-YYYY') };

  const validTransferTestTemplate = async newData => {
    return request(app)
      .post(MAIN_ROUTE)
      .send({ ...validTransfer, ...newData })
      .then(res => {
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('internalId');
        expect(res.body.amount).toBe(typeof (newData.amount) === 'string' ? Number(newData.amount).toFixed(2) : newData.amount.toFixed(2));
        expect(res.body.status).toBe('CREATED');
        expect(res.body.dueDate).toBe(dayjs(newData.dueDate ?? validTransfer.dueDate, 'DD-MM-YYYY').toISOString());
      });
  };

  test('Should request liquidation with current date if no due date is received and amount have 2 decimals', () => {
    return validTransferTestTemplate({ amount: 10000.12, dueDate: null });
  });

  test('Should request liquidation if amount does\'nt have decimals', () => {
    return validTransferTestTemplate({ amount: 10000 });
  });

  test('Should request liquidation if amount have 1 decimal', () => {
    return validTransferTestTemplate({ amount: 10000.1 });
  });

  test('Should request liquidation if receives amount as string', () => {
    return validTransferTestTemplate({ amount: '10000.1' });
  });

  test('Should request liquidation if receives amount with 14 integer part digits', () => {
    return validTransferTestTemplate({ amount: 11122233344455 });
  });

  test('Should request liquidation if due date is equal than the current date', () => {
    return validTransferTestTemplate({ amount: 10000, dueDate: dayjs().format('DD-MM-YYYY') });
  });

  test('Should request liquidation if due date is later than the current date', () => {
    return validTransferTestTemplate({ amount: 10000, dueDate: dayjs().add(1, 'day').format('DD-MM-YYYY') });
  });

  test('List all transfer solicitations', () => {
    return request(app).get(MAIN_ROUTE)
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
      });
  });

  test('Return transfer by ID', () => {
    return request(app).get(`${MAIN_ROUTE}/1`)
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('internalId');
        expect(res.body).toHaveProperty('externalId');
        expect(res.body).toHaveProperty('status');
        expect(res.body).toHaveProperty('amount');
        expect(res.body).toHaveProperty('expectedOn');
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
        expect(res.status).toBe(400);
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

afterAll(done => {
  app.db.destroy();
  done();
});
