'use strict';

const { server } = require('../server/index');
const Queue = require('./chatQueue/queue');

const plantChat = server.of('/myaccount/chat');

const chatQueue = new Queue();
let availableRep = true;

plantChat.on('connect', (socket) => {
  console.log('Connected to the plant.space customer service chat.');

  socket.on('JOIN', (room, payload) => {
    if (availableRep) {
      availableRep = false;

      socket.join(room);
      console.log('Joined room', room);

      socket.emit('CHAT-STARTED');
      console.log('Your conversation with an agent has started.');

    } else {
      chatQueue.enqueue({ socket, room, payload });
      socket.emit('WAITING');
      console.log('You are currently waiting for an agent to become available. Please wait...');
    }
  });

  socket.on('MESSAGE', (payload) => {
    console.log(`Plant Agent: ${payload}`);
    socket.to(socket.rooms[0]).emit('MESSAGE', payload);
  });

  socket.on('CHAT-ENDED', room => {
    if(!chatQueue.isEmpty()) {
      const nextUser = chatQueue.dequeue();
      nextUser.join(room);
      nextUser.emit('CHAT-STARTED');
      availableRep = false;
    } else {
      availableRep = true;
    }
  });
});

// I still need to work on the following:

// 1. I need to add a way for the user to end the chat and have the next user in the queue be able to join the chat.

// 2. I need to get inqurirer to work with the socket.io client.

// 3. I need to get the namespace to work with the socket.io client and the socket.io server.














