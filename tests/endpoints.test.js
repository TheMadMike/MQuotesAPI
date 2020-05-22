const request = require('supertest');
const app = require('../src/app');
const db = require('../src/db.js');

const expectValidQuoteData = (response) => {
  expect(response.status).toBe(200);
  expect(response.body.quote).toBeDefined();
  expect(response.body.author).toBeDefined();
};

describe('GET /', () => {
  it('responds with json containing info about the project', async (done) => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    const { body } = response;
    expect(body.name).toBeDefined();
    expect(body.description).toBeDefined();
    expect(body.version).toBeDefined();
    expect(body.author).toBeDefined();

    done();
  });
});

describe('GET /:id', () => {
  it('responds with \'404\' error when id is out of range', async (done) => {
    let response = await request(app).get('/0');
    expect(response.status).toBe(404);
    response = await request(app).get('/99999999');
    expect(response.status).toBe(404);
    done();
  });

  it('responds with \'400\' when id is NaN', async (done) => {
    let response = await request(app).get('/asdf');
    expect(response.status).toBe(400);
    response = await request(app).get('/123asdf');
    expect(response.status).toBe(400);
    done();
  });

  it('responds with proper json data when id is valid and in range', async (done) => {
    const response = await request(app).get('/1').expect('Content-Type', /json/);
    expectValidQuoteData(response);
    done();
  });
});

describe('GET /random', () => {
  it('responds with proper json data', async (done) => {
    const response = await request(app).get('/random').expect('Content-Type', /json/);
    expectValidQuoteData(response);
    done();
  });
});

describe('GET /daily', () => {
  it('responds with proper json data', async (done) => {
    const response = await request(app).get('/daily').expect('Content-Type', /json/);
    expectValidQuoteData(response);
    done();
  });
  it('responds with the same data when requested twice over a short time span', async (done) => {
    let response = await request(app).get('/daily');
    const firstID = response.body.id;
    response = await request(app).get('/daily');
    expect(firstID).toBe(response.body.id);
    done();
  });
});

beforeAll(async () => {
  if (!db.connected) {
    await db.connect();
  }
});

afterAll(() => {
  db.disconnect();
});
