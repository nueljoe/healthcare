exports.up = function(knex) {
    return knex.schema.createTable('user_profiles', (table) => {
        table.increments();
        table.string('first_name').notNullable();
        table.string('last_name').notNullable();
        table.string('avatar');
        table.string('gender');
        table.integer('user_id').unsigned().notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());

        table.foreign('user_id').references('id').inTable('users');
    });
};
  
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('user_profiles');
};

