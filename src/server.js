const app = require('./app');

const PORT = 3456;

app.listen(PORT, () => {
  console.log(`Transfer service listening on port ${PORT}`);
});
