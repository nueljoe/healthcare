
exports.up = function(knex) {
    return knex.schema.createTable('discussion_comments', table => {
        table.increments();
        table.text('body').notNullable();
        table.integer('user_id').unsigned().notNullable();
        table.integer('discussion_id').unsigned().notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());

        table.foreign('discussion_id').references('id').inTable('discussions').onDelete('CASCADE').onUpdate('CASCADE')
    });
  };
  
  exports.down = async function(knex) {
      await knex.raw('SET FOREIGN_KEY_CHECKS = 0');
      await knex.schema.dropTableIfExists('discussion_comments');
      return knex.raw('SET FOREIGN_KEY_CHECKS = 1');
  };
  