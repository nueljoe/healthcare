
exports.up = function(knex) {
    return knex.schema.createTable('course_subscriptions', table => {
        table.increments();
        table.integer('user_id').unsigned().notNullable();
        table.integer('plan_id').unsigned().notNullable(); // A subscription plan ID
        table.string('payment_reference').notNullable();
        table.string('billing_duration').notNullable().defaultTo('monthly'); // 'annual', 'monthly'
        table.timestamp('expires_at');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

exports.down = async function(knex) {
    await knex.raw('SET FOREIGN_KEY_CHECKS = 0');
    await knex.schema.dropTableIfExists('course_subscriptions');
    return knex.raw('SET FOREIGN_KEY_CHECKS = 1');
};
