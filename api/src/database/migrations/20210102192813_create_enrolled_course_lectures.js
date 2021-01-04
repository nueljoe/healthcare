
exports.up = function(knex) {
  return knex.schema.createTable('enrolled_course_lectures', (table) => {
      table.increments();
      table.integer('enrollment_id').unsigned().notNullable();
      table.integer('lecture_id').unsigned().notNullable();
      table.boolean('is_complete').defaultTo(false);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      
      table.foreign('enrollment_id').references('id').inTable('enrolled_courses').onDelete('CASCADE').onUpdate('CASCADE');
      table.foreign('lecture_id').references('id').inTable('course_lectures').onDelete('CASCADE').onUpdate('CASCADE');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('enrolled_course_lectures');
};
