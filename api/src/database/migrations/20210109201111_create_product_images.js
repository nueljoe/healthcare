
exports.up = function(knex) {
  return knex.schema.createTable('product_images', table => {
      table.increments();
      table.string('img_url').notNullable();
      table.integer('product_id').unsigned().notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());

      table.foreign('product_id').references('id').inTable('products').onDelete('CASCADE').onUpdate('CASCADE');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('product_images');
};
