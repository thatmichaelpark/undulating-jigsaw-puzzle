'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('puzzles_users', (table) => {
    table.increments();
    table.integer('puzzle_id')
      .notNullable()
      .references('id')
      .inTable('puzzles')
      .onDelete('CASCADE')
      .index();
    table.integer('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .index();
    table.integer('puzzle_solving_time');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('puzzles_users');
};
