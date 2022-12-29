'use strict';

process.env.SECRET = 'TEST_SECRET';

const { db } = require('./auth/src/models');
const supertest = require('supertest');
const server = require('./src/server').server;

const testRequest = supertest(server);

let plantData = {
  testPlant: { name: 'rose', genus: 'rosa' },
};

beforeAll(async () => {
  await db.sync();
});

afterAll(async () => {
  await db.drop();
});

describe('plant collection router', () => {

  it('Can GET ALL plant objects and data', async () => {
    const response = await testRequest.post('/api/collection').send(plantData.testPlant);
    const plantObject = response.body;


  });

  it('Can POST a new plant to the collection', async () => {
    const response = await testRequest.post('/api/collection').send(plantData.testPlant);
    const plantObject = response.body;

    expect(response.status).toBe(201);
    expect(plantObject.token).toBeDefined();
    expect(plantObject.user.id).toBeDefined();
    expect(plantObject.user.username).toEqual(plantData.testPlant.name);
  });

  it('Can UPDATE a plant from the collection', async () => {
    const response = await testRequest.post('/api/collection').send(plantData.testPlant);
    const plantObject = response.body;

  });

  it('Can DELETE a plant from the collection', async () => {
    const response = await testRequest.post('/api/collection').send(plantData.testPlant);
    const plantObject = response.body;


  });

});

