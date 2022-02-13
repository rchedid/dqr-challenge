const request = require('supertest');

const app = require('../src/app');

test('Root response', () => {
  return request(app).get('/')
    .then(res => {
      expect(res.status).toBe(200);
    });
});
