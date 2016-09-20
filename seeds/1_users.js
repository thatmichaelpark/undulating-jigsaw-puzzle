/* eslint-disable max-len, camelcase */

'use strict';

exports.seed = function(knex) {
  return knex('users').del()
    .then(() => {
      return knex('users').insert([{
        id: 1,
        username: 'tmp',
        hashed_password: '$2a$12$QyCNRnoLPEEXeUNDLp7Y8.egkVXOickIrioDZeFVlFks1PYRfYVhy'
      }]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));"
      );
    });
};
