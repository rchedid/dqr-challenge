/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = knex => {
  return knex.schema.createTable('transfers', t => {
    t.increments('id').primary();
    t.enu('status', ['xxx', 'xx']).notNull();
    t.date('date').notNull();
    t.decimal('ammount', 15, 2).notNull();
    // t.integer('user_id')
    //   .references('id')
    //   .inTable('users')
    //   .notNull();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = knex => {
  return knex.schema.dropTable('transfers');
};
