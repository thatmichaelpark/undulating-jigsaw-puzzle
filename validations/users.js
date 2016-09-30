'use strict';

const Joi = require('joi');

module.exports = {
  post: {
    body: {
      username: Joi.string().token().trim().max(20),
      password: Joi.string().required().trim().max(50)
    }
  },
  patch: {
    body: {
      username: Joi.string().token().trim().max(20),
      password: Joi.string().trim().max(50)
    }
  }
};
