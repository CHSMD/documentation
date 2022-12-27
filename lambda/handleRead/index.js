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

// Code for Express server using Axios to make a GET request to the API Gateway endpoint
// app.get('/collection', async (req, res, next) => {
//   // Set the API Gateway endpoint URL
//   // we can put our AWS API Gateway endpoint URL in a variable called apiEndpoint etc
//   // const apiEndpoint = 'https://<api-id>.execute-api.<region>.amazonaws.com/<stage>/collection';
//   try {
//     const response = await axios.get(apiEndpoint);
//     res.status(200).send(response.data);
//   } catch (error) {
//     next(error);
//   }
// });

