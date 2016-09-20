/* eslint-disable max-len, camelcase */

'use strict';

exports.seed = function(knex) {
  return knex('puzzles_users').del()
    .then(() => {
      return knex('puzzles_users').insert([]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('users_id_seq', (SELECT MAX(id) FROM puzzles_users));"
      );
    });
};
