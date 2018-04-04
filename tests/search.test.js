const baseUrl = `http://localhost:${process.env.PORT}`;
const request = require('supertest')(baseUrl);
// const nock = require('nock');
const  server = require('../server');
const city = 'Muskegon,MI';
const fs = require('fs');
const fakeReponse = require('./response');

describe('GET /search', () => {
  test('It returns a 422 when no city is provided', async () => {
    let response = await request.get(`/search`);
    expect(response.status).toBe(422);
  });
});

describe('GET /search?city=', () => {
  // beforeEach(() => {
  //   nock(baseUrl)
  //     .get(`/search?city=${city}`)
  //     .reply(200, fakeReponse);
  // });

  afterAll(() => {
    server.close();
  });

  test('It returns a 200 when location is provided', async () => {
    let response = await request.get(`/search?city=${city}`);
    expect(response.status).toBe(200);
  });

  test('It returns a results when location is provided', async () => {
    const response = await request.get(`/search?city=${city}`);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    const firstLocation = response.body.locations.shift();
    expect(firstLocation.id).toBe('rebel-pies-muskegon');
    expect(firstLocation.name).toBe('Rebel Pies');
  });
});