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

// add new plant to the DB using a lambda function
exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body);
    const plant = new Plant(data);

    await plant.save();
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

// Code for Express server using Axios to make a POST request to the API Gateway endpoint
// app.post('/plants', async (req, res, next) => {
//   Set the API Gateway endpoint URL
//   we can put our AWS API Gateway endpoint URL in a variable called apiEndpoint etc
  const apiEndpoint = 'https://cognb1larg.execute-api.us-west-2.amazonaws.com/plantspace';
  try {
    const response = await axios.post(apiEndpoint, req.body);
    res.status(200).send(response.data);
  } catch (error) {
    next(error);
  }
});

// JSON data to send to the API Gateway endpoint
// {
//   "id": 1,
//   "name": "Aloe Vera",
//   "type": "succulent",
//   "genus": "Aloe",
//   "price": 10,
//   "availability": 10,
//   "inStock": true
// }

// {
//   "id": 2,
//   "name": "plant1",
//   "type": "crazyPlant",
//   "genus": "oshKoshBgosh",
//   "price": 12,
//   "availabilty": 19,
//   "inStock": true,
// }





