'use strict';

const express = require('express');
const session = require('express-session');
const axios = require('axios');
const plantRouter = express.Router();
const bearerAuth = require('../auth/middleware/bearer.js');
const permissions = require('../auth/middleware/acl');

plantRouter.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
}));


plantRouter.get('/collection', bearerAuth, permissions('read'), async (req, res, next) => {
  try {
    const apiEndpoint = 'https://cognb1larg.execute-api.us-west-2.amazonaws.com/plantspace/collection';

    const response = await axios.get(apiEndpoint);
    res.status(200).send(response.data);
  } catch (error) {
    next(error);
  }
});

plantRouter.get('/collection/:id',  bearerAuth, permissions('read'), async (req, res, next) => {
  const apiEndpoint = `https://cognb1larg.execute-api.us-west-2.amazonaws.com/plantspace/collection/${req.params.id}`;
  try {
    const response = await axios.get(apiEndpoint);
    res.status(200).send(response.data);
  } catch (error) {
    next(error);
  }
});


plantRouter.put('/collection/:id', bearerAuth, permissions('update'), async (req, res, next) => {
  const apiEndpoint = `https://cognb1larg.execute-api.us-west-2.amazonaws.com/plantspace/collection/${req.params.id}`;
  try {
    const response = await axios.put(apiEndpoint, req.body);
    res.status(200).send(response.data);
  } catch (error) {
    next(error);
  }
});

plantRouter.delete('/collection/:id',  bearerAuth, permissions('delete'), async (req, res, next) => {
  const apiEndpoint = `https://cognb1larg.execute-api.us-west-2.amazonaws.com/plantspace/collection/${req.params.id}`;
  try {
    const response = await axios.delete(apiEndpoint);
    res.status(204).send(response.data);
  } catch (error) {
    next(error);
  }
});

plantRouter.post('/collection',  bearerAuth, permissions('create'), async (req, res, next) => {
  const apiEndpoint = 'https://cognb1larg.execute-api.us-west-2.amazonaws.com/plantspace/collection';
  // const options = {
  //   method: 'GET',
  //   url: 'https://house-plants.p.rapidapi.com/common/coralberry',
  //   headers: {
  //     'X-RapidAPI-Key': 'e2b412e95bmshd819cfe55d2ac1bp14e845jsn7156cb08f7f5',
  //     'X-RapidAPI-Host': 'house-plants.p.rapidapi.com',
  //   },
  // };
  try {
    const response = await axios.post(apiEndpoint, req.body);
    res.status(200).send(response.data);
  } catch (error) {
    next(error);
  }
});

// plantRouter.post('/add-to-order', bearerAuth, permissions('create'), async (req, res, next) => {
//   const plantId = req.body.id;
//   const quantity = req.body.quantity;

//   req.session.order = req.session.order || [];
//   req.session.order.push({ id: plantId, quantity });
//   res.send({
//     message: 'Plant added to order',
//     order: req.session.order,
//   });
// });

// plantRouter.post('/place-order', bearerAuth, permissions('create'), async (req, res, next) => {
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

plantRouter.post('/add-to-order', async (req, res, next) => {
  const plantId = req.body.id;
  const quantity = req.body.quantity;

  req.session.order = req.session.order || [];
  req.session.order.push({ id: plantId, quantity });
  res.send({
    message: 'Plant added to order',
    order: req.session.order,
  });
});

plantRouter.post('/place-order', async (req, res, next) => {
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


module.exports = plantRouter;
