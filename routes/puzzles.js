'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();
const knex = require('../knex');
const { camelizeKeys } = require('humps');

router.get('/puzzles', (req, res, next) => {
  knex('puzzles')
    .orderBy('id')
    .then((puzzles) => {
      res.send(camelizeKeys(puzzles));
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/puzzles/:id', (req, res, next) => {
  knex('puzzles')
    .where('id', req.params.id)
    .first()
    .then((puzzle) => {
      if (puzzle) {
        res.send(camelizeKeys(puzzle));
      }
      else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
