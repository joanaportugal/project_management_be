import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("projects", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("icon").notNullable();
    table.string("description").notNullable();
    table.enum("status", ["In Progress", "Completed", "On Hold"]).notNullable();
    table.string("owner").notNullable().references("username").inTable("users");

    table.unique(["name", "owner"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("projects");
}
