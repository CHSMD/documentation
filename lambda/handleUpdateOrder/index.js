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
  // Parse the order data from the request body
  const orderData = JSON.parse(event.body);
  // here we are using the transaction method to create a transaction object that we can use to place an order and then commit the transaction if the order is successful or rollback the transaction if the order is not successful
  const transaction = await Plant.transaction();
  try {
    // Create an array to store the updated plants in stock after the order is placed
    let updatedPlants = [];

    // Check if the order contains multiple plants or a single plant
    if (Array.isArray(orderData.plants)) {
      for (const plant of orderData.plants) {
        const id = plant.id;
        // Get the plant data from the database using the id and the transaction object we created above
        const plantData = await Plant.get(id, { transaction });
        if (plantData.availability < plant.quantity) {
          throw new Error('Insufficient availability');
        }
        // Update the availability and inStock properties of the plant data
        plantData.availability -= plant.quantity;
        // Update the inStock property of the plant data to true if the availability is greater than 0 and false if the availability is 0
        plantData.inStock = plantData.availability > 0;
        // Save the updated plant data to the database using the transaction object we created above
        await transaction.save({ transaction });

        updatedPlants.push(plantData);
      }
    } else {
      const id = orderData.plants.id;
      const plantData = await Plant.get(id, { transaction });
      if (plantData.availability < orderData.plants.quantity) {
        throw new Error('Insufficient availability');
      }
      plantData.availability -= orderData.plants.quantity;
      plantData.inStock = plantData.availability > 0;
      await transaction.save({ transaction });

      updatedPlants.push(plantData);
    }
    // Commit the transaction if the order is successful and return the updated plants in stock
    await transaction.commit();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Your plant.space order was placed successfully!',
        plants: updatedPlants,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    // Rollback the transaction if the order is not successful and return the error message
    await transaction.rollback();
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
// app.post('/myplantcart', async (req, res, next) => {
//   const apiEndpoint = 'https://<api-id>.execute-api.<region>.amazonaws.com/<stage>/myplantcart';
//   try {
//     const response = await axios.post(apiEndpoint, req.body);
//     res.status(200).send(response.data);
//   } catch (error) {
//     next(error);
//   }
// });


// JSON body for POST request
// {
//   "plants": [
//     {
//       "id": 1,
//       "quantity": 1
//     },
//     {
//       "id": 2,
//       "quantity": 2
//     }
//   ]
// }

