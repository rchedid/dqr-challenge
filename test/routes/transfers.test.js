const request = require('supertest');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');

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
  test.skip('Shouldn\'t request liquidation with negative amount', () => {
    return request(app)
      .post(MAIN_ROUTE)
      .send({ amount: -10000 })
      .then(res => {
        expect(res.status).toBe(405);
        expect(res.body).toHaveProperty('internalId');
        expect(res.body.amount).toBe('10000.00');
        expect(res.body.status).toBe('CREATED');
        expect(res.body.dueDate).toBe(new Date((new Date()).setHours(0, 0, 0, 0)).toISOString());
      });
  });

  test.skip('Shouldn\'t request liquidation without amount', () => {
    return request(app)
      .post(MAIN_ROUTE)
      .send({ })
      .then(res => {
        expect(res.status).toBe(400);
        // expect(res.body.internalId).toBe(???) // internalId é o id da solicitação de transferencia criada
      });
  });

  test.skip('Shouldn\'t request liquidation without amount and date', () => {
    return request(app)
      .post(MAIN_ROUTE)
      .send({ })
      .then(res => {
        expect(res.status).toBe(400);
        // expect(res.body.internalId).toBe(???) // internalId é o id da solicitação de transferencia criada
      });
  });

  test.skip('Shouldn\'t request liquidation with amount equal to zero', () => {
    return request(app)
      .post(MAIN_ROUTE)
      .send({ amount: 0 })
      .then(res => {
        expect(res.status).toBe(405);
        // expect(res.body.internalId).toBe(???) // internalId é o id da solicitação de transferencia criada
      });
  });

  test.skip('Shouldn\'t request liquidation with amount with more than 2 decimals', () => {
    return request(app)
      .post(MAIN_ROUTE)
      .send({ amount: 100.123 })
      .then(res => {
        expect(res.status).toBe(405);
        // expect(res.body.internalId).toBe(???) // internalId é o id da solicitação de transferencia criada
      });
  });

  test.skip('Shouldn\'t request liquidation with past due date', () => {
    return request(app)
      .post(MAIN_ROUTE)
      .send({ amount: 10000, dueDate: dayjs().subtract(1, 'day').format('DD-MM-YYYY') })
      .then(res => {
        expect(res.status).toBe(405);
        // expect(res.body.internalId).toBe(???) // internalId é o id da solicitação de transferencia criada
      });
  });
});
