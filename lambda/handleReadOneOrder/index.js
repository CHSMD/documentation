'use strict';

const dynamoose = require('dynamoose');

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
  let orderNumber = event.pathParameters.orderNumber;
  if (orderNumber) {
    orderNumber = parseInt(orderNumber);
  }
  try {
    const order = await Order.get(orderNumber);
    return {
      statusCode: 200,
      body: JSON.stringify(order),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'No orders found' }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
};
