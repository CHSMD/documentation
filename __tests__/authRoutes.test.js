'use strict';

process.env.SECRET = 'itsasecret';

const { db, users } = require('../src/auth/models/index');
const supertest = require('supertest');
const { app } = require('../src/server');

const mockRequest = supertest(app);

const user = {
  testUser: {
    username: 'testUser',
    password: 'testPassword',
    role: 'user',
  },
  testAdmin: {
    username: 'testAdmin',
    password: 'testPassword',
    role: 'admin',
  },
};

let testUser;
let testAdmin;

beforeAll(async () => {
  await db.sync();
  testUser = await users.create({
    username: 'testUserBeforeAll',
    password: 'testPasswordBeforeAll',
    role: 'user',
  });
  testAdmin = await users.create({
    username: 'testAdminBeforeAll',
    password: 'testPasswordBeforeAll',
    role: 'admin',
  });
});

afterAll(async () => {
  await db.drop();
});

describe('Auth Routes', () => {
  it('should POST to /signup and create a new user', async () => {
    console.log('user.testUser', user.testUser);
    const response = await mockRequest.post('/signup').send(user.testUser);
    expect(response.status).toBe(201);
    expect(response.body.user.username).toEqual('testUser');
    expect(response.body.user.role).toEqual('user');
    expect(response.body.token).toBeDefined();
  });

  it('should POST to /signup and create a new admin', async () => {
    const response = await mockRequest.post('/signup').send(user.testAdmin);
    expect(response.status).toBe(201);
    expect(response.body.user.username).toEqual('testAdmin');
    expect(response.body.user.role).toEqual('admin');
    expect(response.body.token).toBeDefined();
  });

  it('should POST to /signin and successfully login a user', async () => {
    const response = await mockRequest.post('/signin').auth('testUserBeforeAll', 'testPasswordBeforeAll');
    expect(response.status).toBe(200);
    expect(response.body.user.username).toEqual('testUserBeforeAll');
    expect(response.body.user.role).toEqual('user');
    expect(response.body.token).toBeDefined();
  });

  it('should POST to /signin and successfully login an admin', async () => {
    const response = await mockRequest.post('/signin').auth('testAdminBeforeAll', 'testPasswordBeforeAll');
    expect(response.status).toBe(200);
    expect(response.body.user.username).toEqual('testAdminBeforeAll');
    expect(response.body.user.role).toEqual('admin');
    expect(response.body.token).toBeDefined();
  });

  it('should POST to /signin and fail to login a user with the wrong password', async () => {
    const response = await mockRequest.post('/signin').auth('testUserBeforeAll', 'wrongPassword');
    expect(response.status).toBe(403);
  });

  it('should POST to /signin and fail to login a user with the wrong username', async () => {
    const response = await mockRequest.post('/signin').auth('wrongUsername', 'testPasswordBeforeAll');
    expect(response.status).toBe(403);
  });

  it('should POST to /signin and fail to login a user with no username', async () => {
    const response = await mockRequest.post('/signin').auth(null, 'testPasswordBeforeAll');
    expect(response.status).toBe(403);
    expect(response.body.username).toBeUndefined();
  });

  it('should POST to /signin and fail to login a user with no password', async () => {
    const response = await mockRequest.post('/signin').auth('testUserBeforeAll', null);
    expect(response.status).toBe(403);
    expect(response.body.password).toBeUndefined();
  });

  it('should deny access to GET /users without a token', async () => {
    const response = await mockRequest.get('/users');
    expect(response.status).toBe(500);
  });

  it('should deny access to GET /users with a user access token', async () => {
    const response = await mockRequest.get('/users').set('Authorization', `Bearer ${testUser.token}`);
    expect(response.status).toBe(500);
  });

  it('should allow access to GET /users with an admin access token', async () => {
    const response = await mockRequest.get('/users').set('Authorization', `Bearer ${testAdmin.token}`);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(4);
    expect(response.body[0].username).toEqual('testUserBeforeAll');
    expect(response.body[0].role).toEqual('user');
    expect(response.body[1].username).toEqual('testAdminBeforeAll');
    expect(response.body[1].role).toEqual('admin');
    expect(response.body[2].username).toEqual('testUser');
    expect(response.body[2].role).toEqual('user');
    expect(response.body[3].username).toEqual('testAdmin');
    expect(response.body[3].role).toEqual('admin');
  });
});
