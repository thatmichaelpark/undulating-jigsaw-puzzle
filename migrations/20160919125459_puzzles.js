'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('puzzles', (table) => {
    table.increments();
    table.integer('n_rows').notNullable().defaultTo(1);
    table.integer('n_cols').notNullable().defaultTo(1);
    table.integer('max_wave_depth').notNullable().defaultTo(0);
    table.integer('piece_content_size').notNullable().defaultTo(0);
    table.float('max_freq').notNullable().defaultTo(0);
    table.float('max_v').notNullable().defaultTo(0);
    table.integer('n_waves').notNullable().defaultTo(0);
    table.bool('has_rotated_pieces').notNullable().defaultTo(false);
    table.string('image_url').notNullable().defaultTo('');
    table.string('background_color').notNullable().defaultTo('white');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('puzzles');
};
