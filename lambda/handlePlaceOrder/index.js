'use strict';

const dynamoose = require('dynamoose');
// const Chance = require('chance');
// const chance = new Chance();

const plantSchema = new dynamoose.Schema({
  id: Number,
  name: String,
  type: String,
  genus: String,
  price: Number,
  availability: Number,
  inStock: Boolean,
});

const Plant = dynamoose.model('plant-table', plantSchema);

const orderSchema = new dynamoose.Schema({
  orderNumber: Number,
  plants: {
    type: Array,
    schema: [{
      type: Object,
      schema: {
        id: Number,
        quantity: Number,
      },
    }],
  },
  total: Number,
  status: String,
}, {
  saveUnknown: true,
});

const Order = dynamoose.model('order-table', orderSchema);

exports.handler = async (event) => {
  try {
    // Parse the order data from the request body
    const orderData = JSON.parse(event.body);
    console.log('Order Data: ', orderData);
    // Generate a unique order number
    // const orderNumber = chance.fbid();
    const orderNumber = Math.floor(Math.random() * 9000000000) + 1000000000;
    console.log('Order Number: ', orderNumber);
    // Calculate the total cost of the order
    const total = await calculateTotal(orderData.plants);
    console.log('Total: ', total);
    // Create the order object
    const order = {
      orderNumber,
      plants: orderData.plants,
      total,
      status: 'pending',
    };
    // Create an array to store the update transaction objects
    let transactions = [];
    // Loop through the plants in the order
    for (const plant of orderData.plants) {
      // parseInt the plant id
      plant.id = parseInt(plant.id);
      console.log('Plant ID: ', plant.id);
      //get the plant from the plant table using the plant id
      const plantData = await Plant.get(plant.id);
      console.log('Plant Data:', plantData);
      //use dynamoose.transaction to update the availability of the plant in the plant database and then send back the order object containing the order number, and total cost of the order and a new status of 'pending'
      transactions.push(
        Plant.transaction.update(plant.id, {
          availability: plantData.availability - plant.quantity,
        }),
      );
      // Plant.transaction.update(Plant, plant.id, {
      //   availability: plantData.availability - plant.quantity,
      // });
    }

    console.log('Order: ', order);

    // Add the order transaction to the array of transactions
    transactions.push(Order.transaction.create(order));
    // Order.transaction.create(Order, order);
    console.log('Transactions: ', transactions);

    // Execute the transactions
    await dynamoose.transaction(transactions);
    // Return the order object
    return {
      statusCode: 200,
      body: JSON.stringify(order),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    console.log('Error: ', error);
    return {
      statusCode: 500,
      body: JSON.stringify(error),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
};

const calculateTotal = async (plants) => {
  let total = 0;
  if (Array.isArray(plants)) {
    for (const plant of plants) {
      const plantData = await Plant.get(plant.id);
      total += plantData.price * plant.quantity;
      total = Math.round(100 * total) / 100;
    }
  } else {
    const plantData = await Plant.get(plants.id);
    total += plantData.price * plants.quantity;
    total = Math.round(100 * total) / 100;
  }
  return total;
};
