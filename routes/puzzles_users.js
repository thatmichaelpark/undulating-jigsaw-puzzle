'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();
const knex = require('../knex');
const { camelizeKeys, decamelizeKeys } = require('humps');
const { checkAuth } = require('./middleware');

router.get('/puzzles_users', (req, res, next) => {
  knex('puzzles_users')
    .orderBy('id')
    .then((puzzlesUsers) => {
      res.send(camelizeKeys(puzzlesUsers));
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/puzzles_users/:puzzleId/:userId', checkAuth, (req, res, next) => {
  const { puzzleId, userId } = req.params;
  const { puzzleSolvingTime } = req.body;

  knex('puzzles_users')
    .insert(decamelizeKeys({ puzzleId, userId, puzzleSolvingTime }), '*')
    .then((result) => {
      res.send(camelizeKeys(result));
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
