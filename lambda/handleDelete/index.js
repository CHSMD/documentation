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
    const plantData = JSON.parse(event.body);
    await Plant.delete(plantData);
    return {
      statusCode: 204,
      body: JSON.stringify({ message: 'Plant deleted successfully' }),
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

// code for Express server using Axios to make a DELETE request to the API Gateway endpoint
// app.delete('/collection/:id', async (req, res, next) => {
//   const apiEndpoint = `https://<api-id>.execute-api.<region>.amazonaws.com/<stage>/collection/${req.params.id}`;
//   try {
//     const response = await axios.delete(apiEndpoint);
//     res.status(204).send(response.data);
//   } catch (error) {
//     next(error);
//   }
// });

