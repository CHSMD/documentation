'use strict';

const dynamoose = require('dynamoose');

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

exports.handler = async (event) => {
  try {
    const plants = await Plant.scan().exec();
    return {
      statusCode: 200,
      body: JSON.stringify(plants),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Plants not found' }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
};
