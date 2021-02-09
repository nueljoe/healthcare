exports.up = function (knex) {
  return knex.schema.createTable("orders", (table) => {
    table.increments();
    table.integer("user_id").unsigned().notNullable();
    table.string("reference").notNullable(); // An Order Number
    table.timestamp("cancelled_at").nullable();
    table.timestamp("delivered_at").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("orders");
};
