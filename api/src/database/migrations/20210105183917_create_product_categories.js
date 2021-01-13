
exports.up = function(knex) {
    return knex.schema.createTable('product_categories', (table) => {
        table.increments();
        table.string('label').notNullable();
        table.integer('parent_id').unsigned();
        table.boolean('is_active').defaultTo(true);
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());

        table.foreign('parent_id').references('id').inTable('product_categories').onDelete('CASCADE').onUpdate('CASCADE');
    });
};
  
exports.down = async function(knex) {
    await knex.raw('SET FOREIGN_KEY_CHECKS = 0');
    await knex.schema.dropTableIfExists('product_categories');
    return knex.raw('SET FOREIGN_KEY_CHECKS = 1');
};