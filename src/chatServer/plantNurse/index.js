'use strict';

require('dotenv').config();
const { io } = require('socket.io-client');
const inquirer = require('inquirer');
const PORT = process.env.PORT || 3002;

const socket = io(`http://localhost:${PORT}/myaccount/chat`);


const sendAndReceiveMessages = async() => {
  const repMessage = await inquirer.prompt([
    {
      type: 'input',
      name: 'message',
      message: 'Please enter your message:',
    },
  ]);
  socket.to(socket.rooms[0]).emit('MESSAGE', repMessage.message);

  socket.on('MESSAGE', (payload) => {
    console.log(`Client: ${payload}`);
  });
  sendAndReceiveMessages();
};

socket.on('JOIN', (room, payload) => {
  socket.join(room);
  socket.emit('MESSAGE', 'Hello! How can I help you?');
  socket.on('MESSAGE', (payload) => {
    console.log(`Client: ${payload}`);
  });
  sendAndReceiveMessages();

});


// if(payload === 'Is there anything else I can help you with?'){
//   leaveChatPrompt();
// }
//     const continueChat = inquirer.prompt([
//       {
//         type: 'list',
//         name: 'replyOrExit',
//         message: 'Would you like to reply or exit the chat?',
//         choices: ['Reply', 'Exit'],
//       },
//     ]);
//     if(continueChat.replyOrExit === 'Reply'){
//       sendAndReceiveMessages();
//     } else {
//       socket.emit('CHAT-ENDED');
//       console.log('Have a great day!');
//       process.exit();
//     }

