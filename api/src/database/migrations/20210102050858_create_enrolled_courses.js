
exports.up = function(knex) {
  return knex.schema.createTable('enrolled_courses', table => {
      table.increments();
      table.integer('user_id').unsigned().notNullable();
      table.integer('course_id').unsigned().notNullable();
      table.integer('last_lecture_viewed').unsigned();
      table.string('payment_reference'); // If null, then the course must had been free at the time of enrollment
      table.timestamp('completed_at');
      table.timestamp('cancelled_at');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());

      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
      table.foreign('course_id').references('id').inTable('courses').onDelete('CASCADE').onUpdate('CASCADE');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('enrolled_courses');
};
