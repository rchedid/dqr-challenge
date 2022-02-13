const express = require('express');
const { ThrowValidationError } = require('../errors/ValidationError');

module.exports = app => {
  const router = express.Router();

  router.post('/', (req, res, next) => {
    const requestBody = { ...req.body };
    const transfer = {};

    transfer.due_date = requestBody.dueDate ?? new Date();
    transfer.amount = requestBody.amount ?? ThrowValidationError('Amount is required property');

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
