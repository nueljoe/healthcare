
exports.up = function(knex) {
    return knex.schema.createTable('message_thread_participants', table => {
        table.increments();
        table.integer('thread_id').unsigned().notNullable();
        table.integer('user_id').unsigned().notNullable();
        table.timestamp('last_deleted_at'); // The last time a participant deletes a thread. This will be used for filtering messages in the thread which will be shown to the user
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());

        table.foreign('thread_id').references('id').inTable('message_threads').onDelete('CASCADE');
    });

};

exports.down = async function(knex) {
  await knex.raw('SET FOREIGN_KEY_CHECKS = 0');
  await knex.schema.dropTableIfExists('message_thread_participants');
  return knex.raw('SET FOREIGN_KEY_CHECKS = 1');
};
