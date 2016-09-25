'use strict';

const Joi = require('joi');

module.exports.post = {
  body: {
    username: Joi.string().token().trim().max(20),
    password: Joi.string().trim().max(50)
  }
};
