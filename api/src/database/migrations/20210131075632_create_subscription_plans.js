
exports.up = function(knex) {
  return knex.schema.createTable('subscription_plans', table => {
      table.increments();
      table.string('label').notNullable();
      table.bigInteger('price_per_month').notNullable();
      table.float('annual_billing_discount').notNullable() // A number between 0 and 1
      table.boolean('is_public').defaultTo(true); // Defines whether a plan is accessible to users or not.
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = async function(knex) {
  await knex.raw('SET FOREIGN_KEY_CHECKS = 0');
  await knex.schema.dropTableIfExists('subscription_plans');
  return knex.raw('SET FOREIGN_KEY_CHECKS = 1');
};
