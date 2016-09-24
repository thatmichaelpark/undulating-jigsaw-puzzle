'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();
const bcrypt = require('bcrypt-as-promised');
const knex = require('../knex');
const { decamelizeKeys } = require('humps');
const boom = require('boom');

// const ev = require('express-validation');
// const validations = require('../validations/users');

router.get('/users', (req, res, next) => {
  knex('users')
    .select('username')
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/users', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  knex('users').where('username', username)
    .then((users) => {
      if (users.length > 0) {
        throw boom.create(400, 'Username already exists');
      }

      return bcrypt.hash(password, 12);
    })
    .then((hashedPassword) => {
      return knex('users')
        .insert(decamelizeKeys({ username, hashedPassword }), '*');
    })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
