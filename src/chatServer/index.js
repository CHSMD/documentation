// 'use strict';

// const io = require('socket.io');
// const { server } = require('../server/index');
// const Queue = require('./chatQueue/queue');
// const inquirer = require('inquirer');

// // const plantChat = io.of('/myaccount/chat');

// // Instantiate a namespace for the plant.space customer service chat
// const plantChat = server.of('/myaccount/chat');

// // Instantiate a queue for the plant.space customer service chat
// const chatQueue = new Queue();

// // Instantiate a boolean to track if there is an available rep and the room the rep is in
// let availableRep = true;
// let inRoom;

// plantChat.on('connection', (socket) => {
//   process.stdout.write('\n');
//   console.log('Connected to the plant.space customer service chat.', socket.id);
//   process.stdout.write('\n');

//   socket.on('JOIN', (room, payload) => {
//     if (availableRep) {
//       availableRep = false;

//       console.log('Available Rep:', availableRep);

//       socket.join(room);

//       process.stdout.write('\n');
//       console.log('Joined Room:', room);
//       inRoom = room;
//       console.log('inRoom:', inRoom);
//       process.stdout.write('\n');
//       socket.emit('CHAT-STARTED', room);
//       process.stdout.write('\n');

//       console.log('CONNECTED: Your conversation with a client has started.');

//       setTimeout(() => {
//         process.stdout.write('\n');
//         console.log('::: waiting...');
//         process.stdout.write('\n');
//       }, 1000);

//     } else {
//       chatQueue.enqueue({
//         socket: socket,
//         room: room,
//         payload: payload,
//       });

//       process.stdout.write('\n');
//       console.log('QUEUED CLIENT IN ROOM:', room);

//       socket.emit('WAITING');
//       process.stdout.write('\n');

//       let inQueue = chatQueue.length();

//       console.log(`::: You currently have ${inQueue} client(s) waiting in the queue for you to become available...`);
//       process.stdout.write('\n');
//     }
//   });

//   socket.on('MESSAGE', (payload) => {
//     console.log(`CLIENT: ${payload}`);
//     process.stdout.write('\n');

//     setTimeout(() => {
//       sendAndReceiveMessages();
//     }, 500);
//   });

//   const sendAndReceiveMessages = async () => {
//     setTimeout(async () => {
//       await inquirer.prompt([
//         {
//           type: 'input',
//           name: 'message',
//           message: '>>>',
//         },
//       ])
//         .then(answers => {
//           socket.emit('MESSAGE', answers.message);
//           setTimeout(() => {
//             process.stdout.write('\n');
//             console.log('::: waiting for incoming client message...');
//             process.stdout.write('\n');
//           }, 3000);
//         });
//     }, 500);
//   };

//   socket.on('CHAT-ENDED', () => {
//     if (!chatQueue.isEmpty()) {

//       const nextUser = chatQueue.dequeue();
//       const { socket, room } = nextUser.data;

//       socket.join(room);

//       process.stdout.write('\n');
//       console.log('Joined New Room:', room);
//       inRoom = room;
//       console.log('inRoom:', inRoom);
//       process.stdout.write('\n');
//       socket.emit('CHAT-STARTED', room);
//       process.stdout.write('\n');

//       console.log('CONNECTED: Your conversation with a new client has started.');

//       availableRep = false;

//       process.stdout.write('\n');
//       console.log('Available Rep:', availableRep);
//       process.stdout.write('\n');

//     } else {
//       availableRep = true;

//       console.log('Available Rep:', availableRep);

//       process.stdout.write('\n');
//       console.log(`DISCONNECTED: Your conversation with a client in Room "${inRoom}" has ended.`);
//       process.stdout.write('\n');
//       socket.leave(inRoom);
//     }
//   });
// });
