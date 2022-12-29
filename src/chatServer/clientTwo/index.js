'use strict';

require('dotenv').config();
const { io } = require('socket.io-client');
const inquirer = require('inquirer');
const PORT = process.env.PORT || 3002;

const socket = io(`http://localhost:${PORT}/myaccount/chat`);

const joinRoomPrompt = async () => {
  inquirer.prompt([
    {
      type: 'list',
      name: 'room',
      message: 'What can we help you with today?',
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
      process.stdout.write('\n');
      socket.emit('JOIN', answers.room, { email: answers.email, orderNumber: answers.orderNumber });
      console.log('Joined Room:', answers.room);
      process.stdout.write('\n');
    });
};

joinRoomPrompt();

socket.on('WAITING', () => {
  process.stdout.write('\n');
  console.log('You are currently waiting for an agent to become available. Please wait...');
  process.stdout.write('\n');
});

socket.on('CHAT-STARTED', async (room) => {
  setTimeout(() => {
    console.log('Your conversation with an plant.space representative has started.');
    process.stdout.write('\n');

    setTimeout(() => {
      console.log('REP: Hey there! My name is Dustin, how can I help you today?');
      process.stdout.write('\n');

      setTimeout(() => {
        sendMessage(room);
      }, 500);
    }, 2000);
  }, 500);
});

socket.on('MESSAGE', async (payload) => {
  setTimeout(() => {
    console.log(`REP: ${payload}`);
    process.stdout.write('\n');

    setTimeout(async () => {
      await inquirer.prompt([
        {
          type: 'list',
          name: 'replyOrExit',
          message: 'Would you like to reply or exit the chat?',
          choices: ['Reply', 'Exit'],
        },
      ])
        .then(answers => {
          if (answers.replyOrExit === 'Reply') {
            process.stdout.write('\n');
            sendMessage();
          } else {
            socket.emit('CHAT-ENDED');
            process.stdout.write('\n');
            console.log('REP: Thank you so much for your time! Have a great day!');
            process.stdout.write('\n');
            process.exit();
          }
        });
    }, 1000);
  }, 500);
});

const sendMessage = async (room) => {
  setTimeout(async () => {
    await inquirer.prompt([
      {
        type: 'input',
        name: 'message',
        message: 'reply >>>',
      },
    ])
      .then(answers => {
        socket.emit('MESSAGE', answers.message);
        process.stdout.write('\n');
      });
  }, 500);
};
