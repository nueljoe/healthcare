exports.up = function(knex) {
    return knex.schema.createTable('courses', (table) => {
        table.increments();
        table.string('title').notNullable();
        table.text('description').notNullable();
        table.text('banner').notNullable();
        table.text('tags');
        table.text('requirements');
        table.integer('category_id').unsigned().notNullable();
        table.integer('subcategory_id').unsigned();
        table.integer('creator_id').unsigned().notNullable();
        table.integer('last_lesson_viewed').unsigned();
        table.boolean('is_published').defaultTo(false);
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());

        table.foreign('category_id').references('id').inTable('course_categories');
        table.foreign('subcategory_id').references('id').inTable('course_categories');
        table.foreign('creator_id').references('id').inTable('users');
    });
};
  
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('courses');
};
