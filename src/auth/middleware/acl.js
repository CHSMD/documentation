'use strict';

module.exports = (capability) => {

  return (req, res, next) => {
    try {
      if (req.user.includes(capability)){
        next();
      } else {
        next('Acess Denied');
      }
    } catch (error) {
      next('Invalid login');
    }
  };
};
