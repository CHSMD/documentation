'use strict';

require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const userModel = require('./users');

// const DATABASE_URL = process.env.DATABASE_URL || 'sqlite:memory';
const DATABASE_URL = process.env.NODE_ENV === 'test'
  ? 'sqlite:memory'
  : process.env.DATABASE_URL;

const sequelize = new Sequelize(DATABASE_URL);

const UserModel = userModel(sequelize, DataTypes);

module.exports = {
  db: sequelize,
  users: UserModel,
};
