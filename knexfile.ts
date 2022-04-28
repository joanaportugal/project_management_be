const setup = {
  client: "sqlite3",
  connection: {
    filename: "./src/db/database.sqlite",
  },
  migrations: {
    directory: "./src/db/migrations",
  },
  useNullAsDefault: true,
};

export default setup;
