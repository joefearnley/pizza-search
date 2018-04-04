const express = require('express');
const app = express();
const path = require('path');
const yelp = require('yelp-fusion');

require('dotenv').config();

app.use( (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static(__dirname + '/'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname+'/index.html'));
});

app.get('/search/:city', (req, res) => {
  const client = yelp.client(process.env.YELP_API_KEY);
  let results = {
    success: true,
    error: null,
    locations: []
  };

  client.search({
    term:'pizza',
    location: req.params.city.toLowerCase()
  }).then(response => {
    res.send({
      success: true,
      locations: response.jsonBody.businesses
    });
  }).catch(e => {
    results.success = true;
    results.error = error;
    res.send({
      success: false,
      error: error,
      locations: response.jsonBody.businesses
    });
  });
});

module.exports = app;