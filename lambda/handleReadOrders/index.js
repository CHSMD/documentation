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
  total: Object,
  status: String,
}, {
  saveUnknown: true,
});

const Order = dynamoose.model('order-table', orderSchema);

exports.handler = async (event) => {
  try {
    const orders = await Order.scan().exec();
    return {
      statusCode: 200,
      body: JSON.stringify(orders),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'No Orders Found' }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
};
