/* eslint-disable max-len, camelcase */

'use strict';

exports.seed = function(knex) {
  return knex('users').del()
    .then(() => {
      return knex('users').insert([{
        id: 1,
        username: 'mcfresh',
        hashed_password: '$2a$12$/o.M8B4o7aZqmFw/CEl4aeQ5hqyqZrIoaKJdQfHc65wwIa1MLi5JO'
      }]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));"
      );
    });
};
