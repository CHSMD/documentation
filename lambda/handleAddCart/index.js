'use strict';

const dynamoose = require('dynamoose');

// Create the shopping cart schema
const shoppingCartSchema = new dynamoose.Schema({
  id: Number, // plant ID
  quantity: Number,
});

// Create the shopping cart model
const ShoppingCart = dynamoose.model('shopping-cart-table', shoppingCartSchema);

exports.handler = async (event) => {

  try {
    // Parse the plant ID and quantity from the request body
    const { id, quantity } = JSON.parse(event.body);
    // Check if the plant is already in the shopping cart
    const existingPlant = await ShoppingCart.get(id);
    if (existingPlant) {
      // If the plant is already in the shopping cart, update the quantity
      existingPlant.quantity += quantity;
      await existingPlant.save();
    } else {
      // If the plant is not in the shopping cart, create a new record
      const newPlant = new ShoppingCart({ id, quantity });
      await newPlant.save();
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Plant added to shopping cart' }),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  } catch (error) {
    
  }
};
