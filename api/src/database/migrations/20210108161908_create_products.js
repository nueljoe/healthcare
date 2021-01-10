
exports.up = function(knex) {
    return knex.schema.createTable('products', (table) => {
        table.increments();
        table.string('name').notNullable();
        table.string('slug').notNullable();
        table.text('description').notNullable();
        table.string('img_url').notNullable();
        table.string('tags');
        table.integer('category_id').unsigned();
        table.integer('subcategory_id').unsigned();
        table.float('price').unsigned().notNullable();
        table.float('discount').unsigned().defaultTo(0.0); // A value between 0 and 1 //
        table.integer('stock').defaultTo(1);
        table.boolean('is_published').defaultTo(false);
        table.integer('creator_id').unsigned().notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());

        table.foreign('category_id').references('id').inTable('course_categories').onDelete('SET NULL').onUpdate('CASCADE');
        table.foreign('subcategory_id').references('id').inTable('course_categories').onDelete('SET NULL').onUpdate('CASCADE');
        table.foreign('creator_id').references('id').inTable('users');
    });
};
  
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('products');
};
