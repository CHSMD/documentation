'use strict';

const { users } = require('../models/index');

module.exports = async (req, res, next) => {

  try {

    if (!req.headers.authorization) { _authError();}

    const token = req.headers.authorization.split(' ')[1];
    const validUser = await users.authenticateToken(token);
    req.user = validUser;
    req.token = validUser.token;
    next();

  } catch (e) {
    console.log(e);
  }

  function _authError() {
    next('ERROR: Invalid Login');
  }
};
