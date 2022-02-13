const { format, addDays, subDays } = require('date-fns');

const request = require('supertest');
const app = require('../../src/app');

const MAIN_ROUTE = '/v1/transfers';

describe('Valid transfer solicitations', () => {
  test('Should request liquidation with current date if no due date is received', () => {
    return request(app)
      .post(MAIN_ROUTE)
      .send({ amount: 10000 })
      .then(res => {
        // make request to liquidation service
        expect(res.status).toBe(201);
        // expect(res.body.internalId).toBe(''); // internalId é o id da solicitação de transferencia criada
      });
  });

  test('Should request liquidation if due date is equal than the current date', () => {
    return request(app)
      .post(MAIN_ROUTE)
      .send({ amount: 10000, expectedOn: format(new Date(), 'dd-mm-yyyy') })
      .then(res => {
        expect(res.status).toBe(201);
        // expect(res.body.internalId).toBe(???) // internalId é o id da solicitação de transferencia criada
      });
  });

  test('Should request liquidation if due date is later than the current date', () => {
    return request(app)
      .post(MAIN_ROUTE)
      .send({ amount: 10000, expectedOn: format(addDays(new Date(), 1), 'dd-mm-yyyy') })
      .then(res => {
        expect(res.status).toBe(201);
        // expect(res.body.internalId).toBe(???) // internalId é o id da solicitação de transferencia criada
      });
  });
});

describe('Invalid transfer solicitations', () => {
  test('Shouldn\'t request liquidation with negative amount', () => {
    return request(app)
      .post(MAIN_ROUTE)
      .send({ amount: -10000 })
      .then(res => {
        expect(res.status).toBe(400);
        // expect(res.body.internalId).toBe(???) // internalId é o id da solicitação de transferencia criada
      });
  });

  test('Shouldn\'t request liquidation without amount', () => {
    return request(app)
      .post(MAIN_ROUTE)
      .send({ expectedOn: format(new Date(), 'dd-mm-yyyy') })
      .then(res => {
        expect(res.status).toBe(400);
        // expect(res.body.internalId).toBe(???) // internalId é o id da solicitação de transferencia criada
      });
  });

  test('Shouldn\'t request liquidation without amount and date', () => {
    return request(app)
      .post(MAIN_ROUTE)
      .send({ })
      .then(res => {
        expect(res.status).toBe(400);
        // expect(res.body.internalId).toBe(???) // internalId é o id da solicitação de transferencia criada
      });
  });

  test('Shouldn\'t request liquidation with amount equal to zero', () => {
    return request(app)
      .post(MAIN_ROUTE)
      .send({ amount: 0 })
      .then(res => {
        expect(res.status).toBe(405);
        // expect(res.body.internalId).toBe(???) // internalId é o id da solicitação de transferencia criada
      });
  });

  test('Shouldn\'t request liquidation with past due date', () => {
    return request(app)
      .post(MAIN_ROUTE)
      .send({ amount: 10000, expectedOn: format(subDays(new Date(), 1), 'dd-mm-yyyy') })
      .then(res => {
        expect(res.status).toBe(405);
        // expect(res.body.internalId).toBe(???) // internalId é o id da solicitação de transferencia criada
      });
  });
});
