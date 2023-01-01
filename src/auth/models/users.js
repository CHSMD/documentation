'use strict';

require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET || 'itsasecret';

const userModel = (sequelize, DataTypes) => {
  const model = sequelize.define('Users', {
    username: {
      type: DataTypes.STRING,
      required: true,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      required: true,
    },
    role: {
      type: DataTypes.ENUM,
      values:['user', 'admin'],
      required: true,
      defaultValue: 'user',
    },
    token: {
      type: DataTypes.VIRTUAL,
      get() {
        return jwt.sign({ username: this.username }, SECRET, {
          // this is an algorithm that is used to sign the token that is stronger than the default
          algorithm: 'HS256',
          // this is a 1 day token
          expiresIn: 1000 * 60 * 60 * 24 * 1,
        });
      },
      set(tokenObj) {
        let token = this.setDataValue(tokenObj, SECRET);
        return token;
      },
    },
    capabilities: {
      type: DataTypes.VIRTUAL,
      get() {
        const acl = {
          user: ['user'],
          admin: ['user', 'admin'],
        };
        return acl[this.role];
      },
    },
  });

  model.beforeCreate(async (user) => {
    let hashedPass = await bcrypt.hash(user.password, 6);
    user.password = hashedPass;

    return user;
  });

  model.authenticateBasic = async function (username, password) {
    const user = await this.findOne({ where: { username } });
    const valid = await bcrypt.compare(password, user.password);
    if (valid) { return user; }
    throw new Error('ERROR: Invalid User');
  };

  model.authenticateToken = async function (token) {
    try {
      const parsedToken = jwt.verify(token, SECRET);
      const user = this.findOne({where: { username: parsedToken.username } });
      if (user) { return user; }
      throw new Error('ERROR: User Not Found');
    } catch (e) {
      throw new Error(e.message);
    }
  };

  return model;
};

module.exports = userModel;
