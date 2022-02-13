module.exports = app => {
  app.use('/v1/transfers', app.routes.transfers);
};
