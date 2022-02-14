const request = require('supertest');

const app = require('../src/app');

test('Should respond status 200 when request base route', () => {
  return request(app).get('/')
    .then(res => {
      expect(res.status).toBe(200);
    });
});

test('Show respond 404 when request inexistent route', () => {
  return request(app).get('/not-found')
    .then(res => {
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Path /not-found not found');
    });
});

test('Show respond 500 when occur internal server error', () => {
  return request(app).get('/internal-server-error')
    .then(res => {
      expect(res.status).toBe(500);
    });
});
