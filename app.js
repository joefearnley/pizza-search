const express = require('express');
const app = express();
const path = require('path');
const yelp = require('yelp-fusion');

require('dotenv').config();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(express.static(__dirname + '/'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/search', (req, res) => {
  let params = {
    term:'pizza'
  };

  if (!req.query.city && !req.query.latitude && !req.query.longitude) {
    res.status(422).send('Please provide a City or Latitude, Longitude.');
    return;
  }

  if (req.query.city) {
    params.location = req.query.city.toLowerCase();
  } else {
    try {
      params.latitude = req.query.latitude;
      params.longitude = req.query.longitude;
    } catch(e) {
      res.status(422).send('Please provide a City or Latitude, Longitude.');
      return;
    }
  }

  const client = yelp.client(process.env.YELP_API_KEY);
  client.search(params)
    .then(response => {
      res.send({
        success: true,
        locations: response.jsonBody.businesses
      });
    }).catch(e => {
      res.status(422).send({
        success: false,
        error: e.message
      });
    });
});

module.exports = app;