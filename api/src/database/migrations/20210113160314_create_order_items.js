
exports.up = function(knex) {
    return knex.schema.createTable('order_items', table => {
        table.increments();
        table.integer('order_id').unsigned().notNullable();
        table.integer('product_id').unsigned().notNullable();
        table.float('amount').unsigned().notNullable();
        table.integer('quantity').unsigned().notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());

    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('order_items');
  };
