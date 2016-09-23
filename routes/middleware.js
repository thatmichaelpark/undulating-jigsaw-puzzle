'use strict';

const jwt = require('jsonwebtoken');

const checkAuth = function(req, res, next) {
  console.log(req.cookies);
  jwt.verify(req.cookies.NQJ_accessToken, process.env.JWT_SECRET,
    (err, decoded) => {
      if (err) {
        return res.sendStatus(401);
      }

      req.token = decoded; // Access the payload via req.token.userId
      next();
    }
  );
};

module.exports = { checkAuth };
