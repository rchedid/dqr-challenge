const express = require('express');
const axios = require('axios').default;

const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');

dayjs.extend(customParseFormat);

module.exports = app => {
  const router = express.Router();

  const validate = (req, res, next) => {
    app.services.transfer.validate({ ...req.body })
      .then(() => next())
      .catch(err => next(err));
  };

  router.post('/', validate, (req, res, next) => {
    const requestBody = { ...req.body };
    const transfer = {};

    transfer.due_date = requestBody.dueDate ?? new Date();
    transfer.amount = requestBody.amount;

    app.services.transfer.create(transfer)
      .then(async result => {
        let settlementResponse;

        await axios.post('http://0.0.0.0:8882/paymentOrders', { externalId: result.internalId, amount: result.amount, expectedOn: dayjs(result.due_date, 'DD-MM-YYYY') })
          .then(response => {
            settlementResponse = response.data;
          })
          .catch(err => next(err));

        console.log(settlementResponse);

        // TODO salvar no BD o settlementResponse.internalId -> id da liquidação

        const clientResponse = {
          internalId: result.id,
          status: settlementResponse.status,
          amount: result.amount,
          dueDate: result.due_date,
        };

        return res.status(201).json(clientResponse);
      })
      .catch(err => next(err));
  });

  router.get('/', (req, res, next) => {
    app.services.transfer.find()
      .then(result => res.status(200).json(result))
      .catch(err => next(err));
  });

  router.get('/:id', (req, res, next) => {
    app.services.transfer.findOne({ id: req.params.id })
      .then(result => res.status(200).json(result))
      .catch(err => next(err));
  });

  return router;
};
