'use strict';

process.env.SECRET = 'TEST_SECRET';

const { db } = require('../src/auth/models');
const supertest = require('supertest');
const { app } = require('../src/server/index');
const request = supertest(app);

let userData = {
  testUser: { username: 'user', password: 'password', role: 'user' },
};



beforeAll( async () => {
  await db.sync();
});

afterAll( async () => {
  db.drop();
});

describe('Auth Router', () => {
  it('Can create a new user', async () => {
    let response = await request.post('/signup').send(userData.testUser);
    let userObj = response.body;

    expect(response.status).toBe(201);
    expect(userObj.token).toBeDefined();
    expect(userObj.user.id).toBeDefined();
    expect(userObj.user.username).toEqual(userData.testUser.username);
  });

  it('Can sign in a user', async () => {
    let { username, password } = userData.testUser;
    let response = await request.post('/signin').auth(username, password);
    let userObj = response.body;

    expect(response.status).toBe(200);
    expect(userObj.token).toBeDefined();
    expect(userObj.user.id).toBeDefined();
    expect(userObj.user.username).toEqual(username);
  });
});
