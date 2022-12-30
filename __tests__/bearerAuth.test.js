'use strict';

process.env.SECRET = 'TEST_SECRET';

const bearer = require('../src/auth/middleware/bearer');
const { db, users } = require('../src/auth/models/index');
const jwt = require('jsonwebtoken');

let userInfo = {
  admin: { username: 'admin', password: 'password', role: 'admin' },
};

beforeAll(async () => {
  await db.sync();
  await users.create(userInfo.admin);
});

afterAll(async () => {
  db.drop();
});

describe('Auth Middleware', () => {

  const req = {};
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(() => res),
    json: jest.fn(() => res),
  };
  const next = jest.fn();

  describe('user authentication', () => {

    it('fails a login for a user (admin) with an incorrect token', () => {
      req.headers = {
        authorization: 'Bearer thisisabadtoken',
      };
      return bearer(req, res, next)
        .then(() => {
          expect(next).not.toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(403);
        });
    });

    it('logs in a user with a proper token', () => {

      const user = { username: 'admin' };
      const token = jwt.sign(user, process.env.SECRET);
      req.headers = { authorization: `Bearer ${token}` };
      return bearer(req, res, next)
        .then(() => {
          expect(next).toHaveBeenCalledWith();
        });
    });
  });
});
