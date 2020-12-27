
exports.up = function(knex) {
  return knex.schema.createTable('password_tokens', (table) => {
      table.increments();
      table.string('token').notNullable();
      table.integer('user_id').unsigned().notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('password_tokens');
};
