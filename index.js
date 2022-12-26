'use strict';

require('dotenv').config();
const { db } = require('./src/auth/models/');
const server = require('./src/server');

db.sync()
  .then(() => {
    server.start(process.env.PORT || 3001);
  })
  .catch( e => console.error(e));
