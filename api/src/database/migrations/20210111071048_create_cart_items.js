
exports.up = function(knex) {
  return knex.schema.createTable('cart_items', table => {
      table.increments();
      table.integer('user_id').unsigned().notNullable();
      table.integer('product_id').unsigned().notNullable();
      table.integer('quantity').unsigned().notNullable().defaultTo(1);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  knex.schema.dropTableIfExists('cart_items');
};
