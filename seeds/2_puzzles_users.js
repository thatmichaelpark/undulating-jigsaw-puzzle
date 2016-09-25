/* eslint-disable max-len, camelcase */

'use strict';

exports.seed = function(knex) {
  return knex('puzzles_users').del()
    .then(() => {
      return knex('puzzles_users').insert([
        { puzzle_id: 1, user_id: 1, puzzle_solving_time: 666 },
        { puzzle_id: 1, user_id: 2, puzzle_solving_time: 665 },
        { puzzle_id: 1, user_id: 3, puzzle_solving_time: 664 },
        { puzzle_id: 1, user_id: 4, puzzle_solving_time: 663 },
        { puzzle_id: 2, user_id: 1, puzzle_solving_time: 666 },
        { puzzle_id: 2, user_id: 2, puzzle_solving_time: 667 },
        { puzzle_id: 2, user_id: 3, puzzle_solving_time: 668 },
        { puzzle_id: 2, user_id: 4, puzzle_solving_time: 669 },
        { puzzle_id: 6, user_id: 1, puzzle_solving_time: 669 },
        { puzzle_id: 6, user_id: 2, puzzle_solving_time: 661 },
        { puzzle_id: 6, user_id: 3, puzzle_solving_time: 666 },
        { puzzle_id: 6, user_id: 4, puzzle_solving_time: 662 }
      ]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('puzzles_users_id_seq', (SELECT MAX(id) FROM puzzles_users));"
      );
    });
};
