'use strict';

const Joi = require('joi');

module.exports = {
  post: {
    body: {
      imageUrl: Joi.string().required(),
      backgroundColor: Joi.string().required(),
      nRows: Joi.number().integer().min(2).max(10).required(),
      nCols: Joi.number().integer().min(2).max(10).required(),
      pieceContentSize: Joi.number().integer().min(1).required(),
      hasRotatedPieces: Joi.boolean().required(),
      nWaves: Joi.number().integer().min(0).max(5).required(),
      maxWaveDepth: Joi.number().min(0).required(),
      maxFreq: Joi.number().min(0).required(),
      maxV: Joi.number().min(0).required()
    }
  },
  patch: {
    body: {
      imageUrl: Joi.string().required(),
      backgroundColor: Joi.string().required(),
      nRows: Joi.number().integer().min(2).max(10).required(),
      nCols: Joi.number().integer().min(2).max(10).required(),
      pieceContentSize: Joi.number().integer().min(1).required(),
      hasRotatedPieces: Joi.boolean().required(),
      nWaves: Joi.number().integer().min(0).max(5).required(),
      maxWaveDepth: Joi.number().min(0).required(),
      maxFreq: Joi.number().min(0).required(),
      maxV: Joi.number().min(0).required()
    }
  }
};
