exports.up = function(knex) {
  return knex.schema.createTable('payments', table => {
      table.increments();
      table.string('reference').notNullable();
      table.string('type').notNullable(); // 'cash' or 'online'
      table.string('resource').notNullable(); // The thing to be paid for. Ex: 'course', 'order', 'subscription'
      table.integer('resource_id').unsigned().notNullable(); // The ID of the thing to be paid for
      table.integer('user_id').unsigned().notNullable();
      table.bigInteger('amount').notNullable();
      table.string('status').defaultTo('pending');
      table.string('narration');
      table.timestamp('paid_at').nullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());

      table.foreign('user_id').references('id').inTable('users').onDelete('NO ACTION').onUpdate('CASCADE');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("payments");
};
