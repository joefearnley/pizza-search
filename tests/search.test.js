const baseUrl = `http://localhost:${process.env.PORT}`;
const request = require('supertest')(baseUrl);
const  server = require('../server');
const nock = require('nock');
const fakeResponse = require('./response');
const city = 'Muskegon,MI';

describe('GET /search', () => {

  afterAll(() => {
    server.close();
  });

  test('It returns a 422 when no city is provided', async () => {
    let response = await request.get(`/search`);
    expect(response.status).toBe(422);
  });

  test('It returns a 200 when location is provided', async () => {
    let response = await request.get(`/search?city=${city}`);
    expect(response.status).toBe(200);
  });

  test('It returns a results when city is provided', async () => {
    nock(baseUrl)
      .get(`/search?city=${city}`)
      .reply(200, fakeResponse);

    const response = await request.get(`/search?city=${city}`);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    const firstLocation = response.body.locations.shift();
    expect(firstLocation.id).toBe('rebel-pies-muskegon');
    expect(firstLocation.name).toBe('Rebel Pies');
  });

  test('It returns a results when latitude and longitude are provided', async () => {
    const latitude = 43.224194;
    const longitude = -86.235809;

    nock(baseUrl)
      .get(`/search?latitude=${latitude}&longitude=${longitude}`)
      .reply(200, fakeResponse);

    const response = await request.get(`/search?latitude=${latitude}&longitude=${longitude}`)
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    const firstLocation = response.body.locations.shift();
    expect(firstLocation.id).toBe('rebel-pies-muskegon');
    expect(firstLocation.name).toBe('Rebel Pies');
  });
});