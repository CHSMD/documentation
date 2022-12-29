'use strict';

require('dotenv').config();
const express = require('express');
const { Server } = require('socket.io');
const { createServer } = require('http');
const cors = require('cors');
const authRoutes = require('../auth/routes/routes');
const plantRoutes = require('../routes/plantRoutes');
const Queue = require('../chatServer/chatQueue/queue');
const inquirer = require('inquirer');

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer);

const plantChat = io.of('/myaccount/chat');

const chatQueue = new Queue();
let availableRep = true;

plantChat.on('connection', (socket) => {
  console.log('Connected to the plant.space customer service chat.', socket.id);

  socket.on('JOIN', (room, payload) => {
    if (availableRep) {
      availableRep = false;

      socket.join(room);
      console.log('Joined room', room);
      console.log(socket.rooms);
      socket.emit('CHAT-STARTED');
      console.log('Your conversation with an agent has started.');
    } else {
      chatQueue.enqueue({ socket, room, payload });
      socket.emit('WAITING');
    }
  });

  socket.on('CLIENTMESSAGE', async (payload) => {
    console.log('Client:', payload);
    const repMessage = await inquirer.prompt([
      {
        type: 'input',
        name: 'message',
        message: 'Plant Agent:',
      },
    ])
      .then(answers => {
        socket.emit('MESSAGE', answers.message);
      });
  });

  socket.on('CHAT-ENDED', room => {
    if (!chatQueue.isEmpty()) {
      const nextUser = chatQueue.dequeue();
      nextUser.join(room);
      nextUser.emit('CHAT-STARTED');
      availableRep = false;
    } else {
      availableRep = true;
    }
  });

  // const sendAndReceiveMessages = async () => {
  //   const repMessage = await inquirer.prompt([
  //     {
  //       type: 'input',
  //       name: 'message',
  //       message: 'Plant Agent:',
  //     },
  //   ])
  //     .then(answers => {
  //       socket.emit('MESSAGE', answers.message);
  //     });

  //   socket.on('CLIENTMESSAGE', (payload) => {
  //     console.log(`Client: ${payload}`);
  //   });
  //   sendAndReceiveMessages();
  // };

});




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
  app: app,
};
