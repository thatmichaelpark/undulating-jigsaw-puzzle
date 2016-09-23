/* eslint-disable max-len, camelcase */

'use strict';

exports.seed = function(knex) {
  return knex('puzzles').del()
    .then(() => {
      return knex('puzzles').insert([{
        n_rows: 2,
        n_cols: 3,
        max_wave_depth: 20,
        piece_content_size: 200,
        max_freq: 2,
        max_v: 0.3,
        n_waves: 3,
        has_rotated_pieces: false,
        image_url: '/images/seattle.jpg',
        background_color: '#db9276'
      }, {
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
        n_rows: 3,
        n_cols: 5,
        max_wave_depth: 20,
        piece_content_size: 150,
        max_freq: 3,
        max_v: 1,
        n_waves: 2,
        has_rotated_pieces: true,
        image_url: '/images/fractal-026.jpg',
        background_color: '#D8780A'
      }, {
        n_rows: 4,
        n_cols: 5,
        max_wave_depth: 20,
        piece_content_size: 120,
        max_freq: 3,
        max_v: 1,
        n_waves: 2,
        has_rotated_pieces: true,
        image_url: '/images/JellyBellyBeans.jpg',
        background_color: '#F2B5B5'
      }, {
        n_rows: 4,
        n_cols: 6,
        max_wave_depth: 20,
        piece_content_size: 120,
        max_freq: 3,
        max_v: 1,
        n_waves: 2,
        has_rotated_pieces: true,
        image_url: '/images/jellyfish.jpg',
        background_color: '#0F74FF'
      }, {
        n_rows: 5,
        n_cols: 9,
        max_wave_depth: 20,
        piece_content_size: 100,
        max_freq: 3,
        max_v: 1,
        n_waves: 3,
        has_rotated_pieces: true,
        image_url: '/images/fractal-1119594_960_720.jpg',
        background_color: '#EDD2AC'
      }]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('users_id_seq', (SELECT MAX(id) FROM puzzles));"
      );
    });
};
