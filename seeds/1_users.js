/* eslint-disable max-len, camelcase */

'use strict';

exports.seed = function(knex) {
  return knex('users').del()
    .then(() => {
      return knex('users').insert([{
        id: 1,
        username: 'test1',
        hashed_password: '$2a$12$pEyTt6Fb22hQk75dOTrGIer7D5UtR8VoCsJCaNyO.u9CBFrIGzWbe'
      }, {
        id: 2,
        username: 'test2',
        hashed_password: '$2a$12$XlRjbeMG3ReiDgX/ntqWo.4tJil5JhXay72vV0ifwYpLWuu5PsAz6'
      }, {
        id: 3,
        username: 'test3',
        hashed_password: '$2a$12$.IXZkYf6AuRF82VD64M68ePRg6I0SqfOM686Y/duL8gL9Jo71xJQu'
      }, {
        id: 4,
        username: 'test4',
        hashed_password: '$2a$12$E.M6IpGk9L1ka.uv5ICQHO1G8LsSWMd3CmCKRltliegQA9eIDZTIG'
      }]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));"
      );
    });
};
