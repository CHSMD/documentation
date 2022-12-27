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
    const data = JSON.parse(event.body);
    const plant = await Plant.update(data);
    return {
      statusCode: 200,
      body: JSON.stringify(plant),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
};

// Code for Express server using Axios to make a PUT request to the API Gateway endpoint
// app.put('/collection/:id', async (req, res, next) => {
//   const apiEndpoint = `https://<api-id>.execute-api.<region>.amazonaws.com/<stage>/collection/${req.params.id}`;
//   try {
//     const response = await axios.put(apiEndpoint, req.body);
//     res.status(200).send(response.data);
//   } catch (error) {
//     next(error);
//   }
// });
