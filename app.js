const express = require('express');
const app = express();
const path = require('path');
const yelp = require('yelp-fusion');

require('dotenv').config();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static(__dirname + '/'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname+'/index.html'));
});

app.get('/search', (req, res) => {
  
  if (!req.query.city) {
    res.status(422);
    res.send('City parameter not found.');
  }
  
  const client = yelp.client(process.env.YELP_API_KEY);
  client.search({
    term:'pizza',
    location: req.query.city.toLowerCase()
  }).then(response => {
    res.send({
      success: true,
      locations: response.jsonBody.businesses
    });
  }).catch(e => {
    res.send({
      success: false,
      error: error,
      locations: response.jsonBody.businesses
    });
  });
});

module.exports = app;