import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("users", (table) => {
    table.string("username").primary();
    table.string("email").notNullable().unique();
    table.string("name").notNullable();
    table
      .string("avatar")
      .defaultTo(
        "https://icon-library.com/images/default-profile-icon/default-profile-icon-24.jpg"
      );
    table.string("password").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("users");
}
