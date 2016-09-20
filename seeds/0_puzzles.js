/* eslint-disable max-len, camelcase */

'use strict';

exports.seed = function(knex) {
  return knex('puzzles').del()
    .then(() => {
      return knex('puzzles').insert([{
      }]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('users_id_seq', (SELECT MAX(id) FROM puzzles));"
      );
    });
};
