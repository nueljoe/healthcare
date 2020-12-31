
exports.up = function(knex) {
  return knex.schema.createTable('course_lectures', (table) => {
    table.increments();
    table.string('title').notNullable();
    table.string('slug').notNullable();
    table.string('overview');
    table.text('text');
    table.string('video_url');
    table.string('downloadable_file_url');
    table.integer('position').unsigned().notNullable();
    table.boolean('allow_preview').defaultTo(false);
    table.boolean('is_published').defaultTo(true);
    table.integer('course_id').unsigned().notNullable();
    table.integer('module_id').unsigned().notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.foreign('course_id').references('id').inTable('courses').onDelete('CASCADE').onUpdate('CASCADE');
    table.foreign('module_id').references('id').inTable('course_modules').onDelete('CASCADE').onUpdate('CASCADE');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('course_lectures');
};
