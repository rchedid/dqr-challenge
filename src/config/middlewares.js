const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
// const knexLogger = require('knex-logger');

const swaggerDocs = require('../../__docs__/swagger.json');

module.exports = app => {
  app.use(bodyParser.json());
  app.use(cors({ origin: '*' }));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  // app.use(knexLogger(app.db));
};
