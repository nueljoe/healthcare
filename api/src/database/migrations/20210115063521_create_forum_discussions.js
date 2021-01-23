
exports.up = function(knex) {
  return knex.schema.createTable('discussions', table => {
      table.increments();
      table.string('title').notNullable();
      table.string('slug').notNullable();
      table.text('body');
      table.integer('user_id').unsigned().notNullable();
      table.integer('responder_id').unsigned(); // An admin in the system who is first to respond
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = async function(knex) {
    await knex.raw('SET FOREIGN_KEY_CHECKS = 0');
    await knex.schema.dropTableIfExists('discussions');
    return knex.raw('SET FOREIGN_KEY_CHECKS = 1');
};
