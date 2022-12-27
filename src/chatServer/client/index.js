'use strict';

require('dotenv').config();
const { io } = require('socket.io-client');
const inquirer = require('inquirer');
const PORT = process.env.PORT || 3002;

const socket = io(`http://localhost:${PORT}/myaccount/chat`);

const joinRoomPrompt = async() => {

  inquirer.prompt([
    {
      type: 'list',
      name: 'room',
      message: 'Which room would you like to join?',
      choices: ['General Plant Care', 'Orders and Shipping', 'Returns and Refunds', 'Other'],
    },
    {
      type: 'input',
      name: 'email',
      message: 'Please enter your email address:',
      when: answers => answers.room === 'Orders and Shipping' || answers.room === 'Returns and Refunds',
    },
    {
      type: 'input',
      name: 'orderNumber',
      message: 'Please enter your order number:',
      when: answers => answers.room === 'Orders and Shipping' || answers.room === 'Returns and Refunds',
    },
  ])
    .then(answers => {
      socket.emit('JOIN', answers.room, { email: answers.email, orderNumber: answers.orderNumber });
      console.log('Joined room', answers.room);
      console.log(answers);
      sendAndReceiveMessages();
    });
};

joinRoomPrompt();

socket.on('MESSAGE', payload => {
  console.log(`Plant Agent: ${ payload }`);
  // if(payload === 'Is there anything else I can help you with?'){
  //   leaveChatPrompt();
});

socket.on('WAITING', () => {
  console.log('You are currently waiting for an agent to become available. Please wait.');
});

socket.on('CHAT-STARTED', () => {
  console.log('Your conversation with an agent has started.');
  messagePrompt();
});

const messagePrompt = async() => {

  inquirer.prompt([
    {
      type: 'input',
      name: 'message',
      message: 'Please enter your message:',
    },
  ])
    .then(answers => {
      socket.emit('MESSAGE', answers.message);
    },
    );
};

const sendAndReceiveMessages = async() => {
  const clientMessage = await inquirer.prompt([
    {
      type: 'input',
      name: 'message',
      message: 'Please enter your message:',
    },
  ]);
  socket.emit('MESSAGE', clientMessage.message);
  socket.on('MESSAGE', payload => {
    console.log(`Plant Agent: ${ payload }`);
    // if(payload === 'Is there anything else I can help you with?'){
    //   leaveChatPrompt();
    // }
    const continueChat = inquirer.prompt([
      {
        type: 'list',
        name: 'replyOrExit',
        message: 'Would you like to reply or exit the chat?',
        choices: ['Reply', 'Exit'],
      },
    ]);
    if(continueChat.replyOrExit === 'Reply'){
      sendAndReceiveMessages();
    } else {
      socket.emit('CHAT-ENDED');
      console.log('Have a great day!');
      process.exit();
    }
  });
};



//   if (room === 'General Plant Care') {
//     inquirer.prompt([
//       {
//         type: 'input',
//         name: 'message',
//         message: 'What would you like to say?',
//       },
//     ])
//       .then(answers => {
//         socket.emit('MESSAGE', answers.message);
//       });
//   }
//   else if (answers.room === 'Orders and Shipping' || answers.room === 'Returns and Refunds') {
//     inquirer.prompt([
//       {
//         type: 'input',
//         name: 'message',
//         message: 'please enter your email address and order number for faster service',
//       },
//       {
//         type: 'input',
//         name: 'message',
//         message: 'How can we help you today?',
//       },
//     ])
//       .then(answers => {
//         socket.emit('MESSAGE', answers.message);
//       },
//       );
//   } else {
//     inquirer.prompt([
//       {
//         type: 'input',
//         name: 'message',
//         message: 'How can we help you today?',
//       },
//     ])
//       .then(answers => {
//         socket.emit('MESSAGE', answers.message);
//       },
//       );
//   }
// });
