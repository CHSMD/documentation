'use strict';

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const axios = require('axios');
const cartRouter = express.Router();
const bearerAuth = require('../auth/middleware/bearer.js');
const permissions = require('../auth/middleware/acl');

cartRouter.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
}));

cartRouter.post('/add-to-cart', async (req, res, next) => {
  try {
    const plantId = req.body.id;
    const quantity = req.body.quantity;

    if (!plantId || !quantity) {
      throw new Error('Missing plantId or quantity');
    }

    req.session.order = req.session.order || [];
    req.session.order.push({ id: plantId, quantity });
    res.send({
      message: `Successfully added ${quantity} of plantID:${plantId} to your cart`,
      order: req.session.order,
    });
  } catch (error) {
    next(error);
  }
});

cartRouter.post('/orders', bearerAuth, permissions('user'), async (req, res, next) => {
  const apiEndpoint = 'https://cognb1larg.execute-api.us-west-2.amazonaws.com/plantspace/orders';
  try {
    const orderData = { plants: req.session.order };
    console.log(orderData);
    const response = await axios.post(apiEndpoint, orderData);

    req.session.order = [];
    res.send(response.data);
  } catch (error) {
    next(error);
  }
});

cartRouter.put('/orders/:orderNumber', bearerAuth, permissions('admin'), async (req, res, next) => {
  const apiEndpoint = `https://cognb1larg.execute-api.us-west-2.amazonaws.com/plantspace/orders/${req.params.orderNumber}`;
  try {
    const response = await axios.put(apiEndpoint);
    res.send(response.data);
  } catch (error) {
    next(error);
  }
});

cartRouter.get('/orders', bearerAuth, permissions('admin'), async (req, res, next) => {
  const apiEndpoint = 'https://cognb1larg.execute-api.us-west-2.amazonaws.com/plantspace/orders';
  try {

    const response = await axios.get(apiEndpoint);
    res.status(200).send(response.data);

  } catch (error) {
    next(error);
  }
});

cartRouter.get('/orders/:orderNumber', bearerAuth, permissions('user'), async (req, res, next) => {
  const apiEndpoint = `https://cognb1larg.execute-api.us-west-2.amazonaws.com/plantspace/orders/${req.params.orderNumber}`;
  try {
    const response = await axios.get(apiEndpoint);
    res.status(200).send(response.data);
  } catch (error) {
    next(error);
  }
});

module.exports = cartRouter;
