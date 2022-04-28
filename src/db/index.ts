import knex from "knex";

const db = knex({
  client: "sqlite3",
  connection: {
    filename: "./database.sqlite",
  },
  useNullAsDefault: true,
});

export default db;
