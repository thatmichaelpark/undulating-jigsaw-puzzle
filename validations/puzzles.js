'use strict';

const Joi = require('joi');

module.exports = {
  post : {
    body: {
      // nRows: Joi.number().min(2).max(10),
      // nCols: Joi.number().min(2).max(10),
    }
  },
  patch : {
    body: {
    }
  },
};
