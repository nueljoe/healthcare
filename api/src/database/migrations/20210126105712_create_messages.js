exports.up = function (knex) {
  return knex.schema.createTable("messages", (table) => {
    table.increments();
    table.integer("thread_id").unsigned().notNullable();
    table.text("body");
    table.integer("sender_id").unsigned().notNullable();
    table.integer("parent_id").unsigned(); // The ID of another message in the thread to which this one is a response.
    table.boolean("is_deleted_by_recipient").notNullable().defaultTo(false);
    table.timestamp("read_at").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    table
      .foreign("thread_id")
      .references("id")
      .inTable("message_threads")
      .onDelete("CASCADE");
  });
};

exports.down = async function (knex) {
  await knex.raw("SET FOREIGN_KEY_CHECKS = 0");
  await knex.schema.dropTableIfExists("messages");
  return knex.raw("SET FOREIGN_KEY_CHECKS = 1");
};
