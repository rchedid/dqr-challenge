/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = knex => {
  return knex.schema.createTable('transfers', t => {
    t.increments('id').primary();
    t.decimal('amount', 15, 2).notNull();
    t.date('due_date').notNull();
    t.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = knex => {
  return knex.schema.dropTable('transfers');
};
