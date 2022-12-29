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
  const plantId = req.body.id;
  const quantity = req.body.quantity;

  req.session.order = req.session.order || [];
  req.session.order.push({ id: plantId, quantity });
  res.send({
    message: `Successfully added to order`,
    order: req.session.order,
  });
});

cartRouter.post('/place-order', async (req, res, next) => {
  const apiEndpoint = 'https://cognb1larg.execute-api.us-west-2.amazonaws.com/plantspace/place-order';
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

// update order status to shipped
cartRouter.put('/place-order/:orderNumber', async (req, res, next) => {
  const apiEndpoint = `https://cognb1larg.execute-api.us-west-2.amazonaws.com/plantspace/place-order/${req.params.orderNumber}`;
  try {
    const response = await axios.put(apiEndpoint);
    res.send(response.data);
  } catch (error) {
    next(error);
  }
});


// cartRouter.post('/add-to-order', bearerAuth, permissions('create'), async (req, res, next) => {
//   const plantId = req.body.id;
//   const quantity = req.body.quantity;

//   req.session.order = req.session.order || [];
//   req.session.order.push({ id: plantId, quantity });
//   res.send({
//     message: 'Plant added to order',
//     order: req.session.order,
//   });
// });

// cartRouter.post('/place-order', bearerAuth, permissions('create'), async (req, res, next) => {
//   const apiEndpoint = 'https://cognb1larg.execute-api.us-west-2.amazonaws.com/plantspace/place-order';
//   try {
//     const orderData = { plants: req.session.order };
//     const response = await axios.post(apiEndpoint, orderData);

//     req.session.order = [];
//     res.send(response.data);
//   } catch (error) {
//     next(error);
//   }
// });

module.exports = cartRouter;


