'use strict';

require('dotenv').config();

const { db } = require('./src/auth/models');
const ioExpress = require('./src/server/index');
const PORT = process.env.PORT || 3002;

db.sync()
  .then(() => {
    ioExpress.start(PORT);
  })
  .catch(e => console.error(e));
