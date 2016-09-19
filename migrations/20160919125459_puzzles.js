'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('puzzles', (table) => {
    table.increments();
    table.string('image_url').notNullable().defaultTo('');
    table.integer('n_rows').notNullable().defaultTo(1);
    table.integer('n_cols').notNullable().defaultTo(1);
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('puzzles');
};
