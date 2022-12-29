// 'use strict';

// const io = require('socket.io');
// const { server } = require('../server/index');
// const Queue = require('./chatQueue/queue');
// const inquirer = require('inquirer');

// // const plantChat = io.of('/myaccount/chat');

// // const chatQueue = new Queue();
// // let availableRep = true;

// // plantChat.on('CONNECT', (socket) => {
// //   console.log('Connected to the plant.space customer service chat.');

// //   socket.on('JOIN', (room, payload) => {
// //     if (availableRep) {
// //       availableRep = false;

// //       socket.join(room);
// //       console.log('Joined room', room);

// //       socket.emit('CHAT-STARTED');
// //       console.log('Your conversation with an agent has started.');

// //     } else {
// //       chatQueue.enqueue({ socket, room, payload });
// //       socket.emit('WAITING');
// //       console.log('You are currently waiting for an agent to become available. Please wait...');
// //     }
// //   });

// //   socket.on('CHAT-ENDED', room => {
// //     if(!chatQueue.isEmpty()) {
// //       const nextUser = chatQueue.dequeue();
// //       nextUser.join(room);
// //       nextUser.emit('CHAT-STARTED');
// //       availableRep = false;
// //     } else {
// //       availableRep = true;
// //     }
// //   });
// // });

// // Instantiate a namespace for the plant.space customer service chat
// const plantChat = io.of('/myaccount/chat');

// // Instantiate a queue for the plant.space customer service chat
// const chatQueue = new Queue();

// // Instantiate a boolean to track if there is an available rep
// let availableRep = true;

// plantChat.on('connection', (socket) => {
//   console.log('Connected to the plant.space customer service chat.', socket.id);

//   socket.on('JOIN', (room, payload) => {
//     if (availableRep) {
//       availableRep = false;

//       socket.join(room);
//       console.log('Joined room', room);
//       console.log(socket.rooms);
//       socket.emit('CHAT-STARTED');
//       console.log('Your conversation with an agent has started.');
//     } else {
//       chatQueue.enqueue({ socket, room, payload });
//       socket.emit('WAITING');


//     }
//   });

//   socket.on('CLIENTMESSAGE', async (payload) => {
//     console.log('Client:', payload);
//     const repMessage = await inquirer.prompt([
//       {
//         type: 'input',
//         name: 'message',
//         message: 'Plant Agent:',
//       },
//     ])
//       .then(answers => {
//         socket.emit('MESSAGE', answers.message);
//       });
//   });

//   socket.on('CHAT-ENDED', room => {
//     if (!chatQueue.isEmpty()) {
//       const nextUser = chatQueue.dequeue();
//       nextUser.join(room);
//       nextUser.emit('CHAT-STARTED');
//       availableRep = false;
//     } else {
//       availableRep = true;
//     }
//   });

//   // const sendAndReceiveMessages = async () => {
//   //   const repMessage = await inquirer.prompt([
//   //     {
//   //       type: 'input',
//   //       name: 'message',
//   //       message: 'Plant Agent:',
//   //     },
//   //   ])
//   //     .then(answers => {
//   //       socket.emit('MESSAGE', answers.message);
//   //     });

//   //   socket.on('CLIENTMESSAGE', (payload) => {
//   //     console.log(`Client: ${payload}`);
//   //   });
//   //   sendAndReceiveMessages();
//   // };

// });



// // I still need to work on the following:

// // 1. I need to add a way for the user to end the chat and have the next user in the queue be able to join the chat.

// // 2. I need to get inqurirer to work with the socket.io client.

// // 3. I need to get the namespace to work with the socket.io client and the socket.io server.














