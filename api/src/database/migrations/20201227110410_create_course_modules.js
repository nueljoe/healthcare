
exports.up = function(knex) {
  return knex.schema.createTable('course_modules', (table) => {
      table.increments();
      table.string('title').notNullable();
      table.text('description');
      table.integer('position').unsigned().notNullable();
      table.integer('course_id').unsigned().notNullable();
      table.boolean('is_published').defaultTo(false);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());

      table.foreign('course_id').references('id').inTable('courses').onDelete('CASCADE').onUpdate('CASCADE');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('course_modules');
};
