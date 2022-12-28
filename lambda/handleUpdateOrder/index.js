'use strict';

const dynamoose = require('dynamoose');
const chance = require('chance');

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
  orderNumber: String,
  plants: [{
    id: Number,
    quantity: Number,
  }],
  total: Number,
  status: String,
});

const Order = dynamoose.model('order-table', orderSchema);

exports.handler = async (event) => {
  // Parse the order data from the request body
  const orderData = JSON.parse(event.body);
  // Generate a unique order number
  const orderNumber = chance.fbid();
  // Calculate the total cost of the order
  const total = await calculateTotal(orderData.plants);
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
    //get the plant from the plant table using the plant id
    const plantData = await Plant.get(plant.id);
    //use dynamoose.transaction to update the availability of the plant in the plant database and then send back the order object containing the order number, and total cost of the order and a new status of 'pending'
    transactions.push(
      dynamoose.transaction.update(Plant, plant.id, {
        availability: plantData.availability - plant.quantity,
      }),
    );
  }
  // Add the order transaction to the array of transactions
  transactions.push(dynamoose.transaction.create(Order, order));
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
};

const calculateTotal = async (plants) => {
  let total = 0;
  if (Array.isArray(plants)) {
    for (const plant of plants) {
      const plantData = await Plant.get(plant.id);
      total += plantData.price * plant.quantity;
    }
  } else {
    const plantData = await Plant.get(plants.id);
    total += plantData.price * plants.quantity;
  }
  return total;
};
