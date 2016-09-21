/* eslint-disable max-len, camelcase */

'use strict';

exports.seed = function(knex) {
  return knex('puzzles').del()
    .then(() => {
      return knex('puzzles').insert([{
        id: 1,
        difficulty: 1,
        n_rows: 3,
        n_cols: 4,
        max_wave_depth: 10,
        piece_content_size: 150,
        max_freq: 5,
        max_v: 2,
        n_waves: 3,
        image_url: '/images/clouds-06.jpg'
      }, {
        id: 2,
        difficulty: 1,
        n_rows: 4,
        n_cols: 4,
        max_wave_depth: 20,
        piece_content_size: 150,
        max_freq: 3,
        max_v: 1,
        n_waves: 2,
        image_url: '/images/cat800.jpg'
      }]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('users_id_seq', (SELECT MAX(id) FROM puzzles));"
      );
    });
};
