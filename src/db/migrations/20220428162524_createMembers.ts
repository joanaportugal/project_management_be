import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("project_members", (table) => {
    table
      .integer("projectId")
      .notNullable()
      .references("id")
      .inTable("projects");
    table
      .string("member")
      .notNullable()
      .references("username")
      .inTable("users");
    table.string("role").notNullable();
    table.primary(["projectId", "member"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("project_members");
}
