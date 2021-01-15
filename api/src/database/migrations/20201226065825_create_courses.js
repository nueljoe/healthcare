exports.up = function(knex) {
    return knex.schema.createTable('courses', (table) => {
        table.increments();
        table.string('title').notNullable();
        table.string('slug').notNullable();
        table.text('description').notNullable();
        table.string('banner').notNullable();
        table.string('tags');
        table.text('requirements');
        table.integer('category_id').unsigned().notNullable();
        table.integer('subcategory_id').unsigned();
        table.integer('creator_id').unsigned().notNullable();
        table.float('price').defaultTo(0.0);
        table.float('discount'); // A value between 0 and 1
        table.boolean('is_published').defaultTo(false);
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());

        table.foreign('category_id').references('id').inTable('course_categories').onDelete('NO ACTION');
        table.foreign('subcategory_id').references('id').inTable('course_categories').onDelete('NO ACTION');
        table.foreign('creator_id').references('id').inTable('users');
    });
};
  
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('courses');
};
