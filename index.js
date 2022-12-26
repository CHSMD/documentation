'use strict';

require('dotenv').config();
const ioExpress = require('./src/server/index');
const PORT = process.env.PORT || 3002;

ioExpress.start(PORT);
