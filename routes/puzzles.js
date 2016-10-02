'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();
const knex = require('../knex');
const { camelizeKeys, decamelizeKeys } = require('humps');
const { checkAuth } = require('./middleware');
const ev = require('express-validation');
const validations = require('../validations/puzzles');
const boom = require('boom');

// GET /puzzles
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

// GET /puzzles/full -- puzzles data augmented with puzzle_solving_time/username
router.get('/puzzles/full', (req, res, next) => {
  // eslint-disable-next-line max-len
  knex.raw('select puzzles.id, image_url, n_rows, n_cols, background_color, has_rotated_pieces, n_waves, max_wave_depth, max_freq, max_v, piece_content_size, times from (select blah.puzzle_id, array_agg((puzzle_solving_time, username)) as times from users inner join (select * from puzzles_users order by puzzle_solving_time) as blah on (users.id = blah.user_id) group by puzzle_id) as foo right join puzzles on (puzzles.id = foo.puzzle_id) order by id')
    .then((puzzles) => {
      res.send(camelizeKeys(puzzles.rows));
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

router.post('/puzzles', checkAuth, ev(validations.post), (req, res, next) => {
  if (req.token.username !== 'admin') {
    return next(boom.create(401, 'Not logged in as admin'));
  }

  knex('puzzles')
    .insert(decamelizeKeys(req.body), '*')
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      next(err);
    });
});

router.patch('/puzzles/:id', checkAuth, ev(validations.patch), (req, res, next) => {
  if (req.token.username !== 'admin') {
    return next(boom.create(401, 'Not logged in as admin'));
  }

  knex('puzzles')
  .update(decamelizeKeys(req.body), '*')
  .where('id', req.params.id)
  .then((puzzles) => {
    res.send(puzzles[0]);
  })
  .catch((err) => {
    next(err);
  });
});

router.delete('/puzzles/:id', checkAuth, (req, res, next) => {
  if (req.token.username !== 'admin') {
    return next(boom.create(401, 'Not logged in as admin'));
  }

  knex('puzzles')
  .where('id', req.params.id)
  .first()
  .then((puzzle) => {
    if (!puzzle) {
      throw boom.create(400, 'Could not delete');
    }

    return knex('puzzles')
      .del()
      .where('id', req.params.id)
      .then(() => {
        delete puzzle.id;
        res.send(puzzle);
      });
  })
  .catch((err) => {
    next(err);
  });
});

module.exports = router;
