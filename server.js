const app = require('./app');

const server = app.listen(process.env.PORT || 5000, () => {
  console.log(`Pizza Search is listening on port ${process.env.PORT}.`);
});

module.exports = server;