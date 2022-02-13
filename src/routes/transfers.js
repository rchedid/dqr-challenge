const express = require('express');

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
