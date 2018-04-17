const app = require('./app');

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`Pizza Search is listening on port ${port}.`);
});

module.exports = server;