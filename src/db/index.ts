import knex from "knex";

const db = knex({
  client: "sqlite3",
  connection: {
    filename: "./src/db/database.sqlite",
  },
  useNullAsDefault: true,
});

export default db;
