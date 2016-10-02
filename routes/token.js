'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-as-promised');
const knex = require('../knex');
const boom = require('boom');
const { camelizeKeys } = require('humps');
const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();

router.post('/token', (req, res, next) => {
  let user;

  knex('users')
    .where('username', req.body.username)
    .first()
    .then((row) => {
      if (!row) {
        throw boom.create(401, 'User could not be logged in');
      }

      user = camelizeKeys(row);

      return bcrypt.compare(req.body.password, user.hashedPassword);
    })
    .then(() => {
      const token = jwt.sign(
        { username: req.body.username, userId: user.id },
        process.env.JWT_SECRET,
        {}
      );

      res.cookie('NQJ_accessToken', token, {
        httpOnly: true,
        secure: router.get('env') === 'production'
      });

      res.cookie('NQJ_loggedIn', true, {
        secure: router.get('env') === 'production'
      });

      res.cookie('NQJ_username', user.username, {
        secure: router.get('env') === 'production'
      });

      res.cookie('NQJ_userId', user.id, {
        secure: router.get('env') === 'production'
      });

      res.send({ username: user.username, userId: user.id });
    })
    .catch(bcrypt.MISMATCH_ERROR, () => {
      throw boom.create(401, 'User could not be logged in');
    })
    .catch((err) => {
      next(err);
    });
});

router.delete('/token', (req, res) => {
  res.clearCookie('NQJ_accessToken');
  res.clearCookie('NQJ_loggedIn');
  res.clearCookie('NQJ_username');
  res.clearCookie('NQJ_userId');

  res.sendStatus(200);
});

module.exports = router;
