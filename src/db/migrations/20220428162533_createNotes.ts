import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("project_notes", (table) => {
    table
      .integer("projectId")
      .notNullable()
      .references("id")
      .inTable("projects");
    table.string("title").notNullable();
    table.string("description").notNullable();
    table
      .string("member")
      .notNullable()
      .references("username")
      .inTable("users");

    table.primary(["projectId", "title"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("project_notes");
}
