exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments();
    table.string("email").notNullable();
    table.string("password").notNullable();
    table.string("confirmation_token");
    table.timestamp("verified_at").nullable();
    table.timestamp("last_logged_in_at").nullable();
    table.timestamp("deactivated_at").nullable();
    table.integer("permission_id").unsigned().notNullable();
    table.integer("deactivated_by").unsigned();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    table.foreign("permission_id").references("id").inTable("permissions");
    table.foreign("deactivated_by").references("id").inTable("users");
  });
};

exports.down = async function (knex) {
  await knex.raw("SET FOREIGN_KEY_CHECKS = 0");
  await knex.schema.dropTableIfExists("users");
  return knex.raw("SET FOREIGN_KEY_CHECKS = 1");
};
