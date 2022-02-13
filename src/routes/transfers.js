const express = require('express');
const { format, addDays, subDays } = require('date-fns');

module.exports = app => {
  const router = express.Router();

  router.post('/', (req, res, next) => {
    const transfer = { ...req.body };

    if (transfer.expectedOn) {
      // data passada
    }

    // if (!transfer.expectedOn) {

    // }

    return res.status(201).send();

    // app.services.transfer.save(transfer)
    //   .then(result => res.status(201).json(result[0]))
    //   .catch(err => next(err));
  });

  return router;
};
