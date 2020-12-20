
exports.up = function(knex) {
  return knex.schema.createTable('subscribers', (table) => {
      table.increments();
      table.string('email');
      table.boolean('allow_newsletters').defaultTo(true);
      table.boolean('allow_promotions').defaultTo(true);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('subscribers');
};
