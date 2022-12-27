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
  let id = event.pathParameters.id;
  if (id) {
    id = parseInt(id);
  }
  try {
    const plant = await Plant.get(id);
    return {
      statusCode: 200,
      body: JSON.stringify(plant),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Plant not found' }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
};

// Code for Express server using Axios to make a GET request to the API Gateway endpoint
// app.get('/collection/:id', async (req, res, next) => {
//   const apiEndpoint = `https://<api-id>.execute-api.<region>.amazonaws.com/<stage>/collection/${req.params.id}`;
//   try {
//     const response = await axios.get(apiEndpoint);
//     res.status(200).send(response.data);
//   } catch (error) {
//     next(error);
//   }
// });
