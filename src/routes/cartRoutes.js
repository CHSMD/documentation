'use strict';

const express = require('express');
const axios = require('axios');
const cartRouter = express.Router();
const bearerAuth = require('../auth/middleware/bearer.js');
const permissions = require('../auth/middleware/acl');

cartRouter.get('/myplantcart', bearerAuth, permissions('cartRead'), async (req, res, next) => {
  try {
    const apiEndpoint = 'https://cognb1larg.execute-api.us-west-2.amazonaws.com/plantspace/collection';

    const response = await axios.get(apiEndpoint);
    res.status(200).send(response.data);
  } catch (error) {
    next(error);
  }
});

cartRouter.get('/myplantcart/:id',  bearerAuth, permissions('cartRead'), async (req, res, next) => {
  const apiEndpoint = `https://cognb1larg.execute-api.us-west-2.amazonaws.com/plantspace/collection/${req.params.id}`;
  try {
    const response = await axios.get(apiEndpoint);
    res.status(200).send(response.data);
  } catch (error) {
    next(error);
  }
});


cartRouter.put('/myplantcart/:id', bearerAuth, permissions('cartUpdate'), async (req, res, next) => {
  const apiEndpoint = `https://cognb1larg.execute-api.us-west-2.amazonaws.com/plantspace/collection/${req.params.id}`;
  try {
    const response = await axios.put(apiEndpoint, req.body);
    res.status(200).send(response.data);
  } catch (error) {
    next(error);
  }
});

cartRouter.delete('/myplantcart/:id',  bearerAuth, permissions('cartDelete'), async (req, res, next) => {
  const apiEndpoint = `https://cognb1larg.execute-api.us-west-2.amazonaws.com/plantspace/collection/${req.params.id}`;
  try {
    const response = await axios.delete(apiEndpoint);
    res.status(204).send(response.data);
  } catch (error) {
    next(error);
  }
});

cartRouter.post('/myplantcart',  bearerAuth, permissions('cartCreate'), async (req, res, next) => {
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


module.exports = cartRouter;


