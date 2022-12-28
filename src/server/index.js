'use strict';

require('dotenv').config();
const express = require('express');
const { Server } = require('socket.io');
const { createServer } = require('http');
const cors = require('cors');
const authRoutes = require('../auth/routes/routes');
const plantRoutes = require('../routes/plantRoutes');

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer);

io.use(cors);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(authRoutes);
app.use(plantRoutes);

module.exports = {
  server: io,
  start: (PORT) => {
    httpServer.listen(PORT, () => {
      console.log(`Server up on port: ${PORT}`);
    });
  },
};
