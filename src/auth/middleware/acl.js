'use strict';

module.exports = (capability) => {
  return (req, res, next) => {
    try {
      if (req.user.capabilities.includes(capability)){
        next();
      } else {
        next('SERVER: Access Denied');
      }
    } catch (error) {
      next('ERROR: Invalid Login');
    }
  };
};
