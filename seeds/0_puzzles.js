/* eslint-disable max-len, camelcase */

'use strict';

exports.seed = function(knex) {
  return knex('puzzles').del()
    .then(() => {
      return knex('puzzles').insert([{
        difficulty: 1,
        n_rows: 2,
        n_cols: 3,
        max_wave_depth: 20,
        piece_content_size: 250,
        max_freq: 2,
        max_v: 0.1,
        n_waves: 3,
        has_rotated_pieces: false,
        image_url: '/images/seattle.jpg',
        background_color: '#db9276'
      }, {
        difficulty: 1,
        n_rows: 3,
        n_cols: 4,
        max_wave_depth: 15,
        piece_content_size: 150,
        max_freq: 5,
        max_v: 0.5,
        n_waves: 3,
        has_rotated_pieces: false,
        image_url: '/images/clouds-06.jpg',
        background_color: '#5979AF'
      }, {
        difficulty: 1,
        n_rows: 4,
        n_cols: 4,
        max_wave_depth: 20,
        piece_content_size: 150,
        max_freq: 3,
        max_v: 1,
        n_waves: 2,
        has_rotated_pieces: false,
        image_url: '/images/cat800.jpg'
      }, {
        difficulty: 1,
        n_rows: 4,
        n_cols: 4,
        max_wave_depth: 20,
        piece_content_size: 150,
        max_freq: 3,
        max_v: 1,
        n_waves: 2,
        has_rotated_pieces: true,
        image_url: '/images/fractal-026.jpg',
        background_color: '#D8780A'
      }, {
        difficulty: 2,
        n_rows: 4,
        n_cols: 4,
        max_wave_depth: 20,
        piece_content_size: 150,
        max_freq: 3,
        max_v: 1,
        n_waves: 2,
        has_rotated_pieces: true,
        image_url: '/images/JellyBellyBeans.jpg'
      }, {
        difficulty: 2,
        n_rows: 4,
        n_cols: 4,
        max_wave_depth: 20,
        piece_content_size: 150,
        max_freq: 3,
        max_v: 1,
        n_waves: 2,
        has_rotated_pieces: true,
        image_url: '/images/jellyfish.jpg'
      }]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('users_id_seq', (SELECT MAX(id) FROM puzzles));"
      );
    });
};
