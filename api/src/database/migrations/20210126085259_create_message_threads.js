
exports.up = function(knex) {
    return knex.schema.createTable('message_threads', table => {
        table.increments();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

exports.down = async function(knex) {
  await knex.raw('SET FOREIGN_KEY_CHECKS = 0');
  await knex.schema.dropTableIfExists('message_threads');
  return knex.raw('SET FOREIGN_KEY_CHECKS = 1');
};
