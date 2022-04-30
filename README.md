# Project Organized

Backend of projects' management.

Project based on the idea of Rocketseat's 2019 OmniStack: https://github.com/rocketseat-education/curso-omnistack-back-end

---
## Requirements

For development, you will only need Node.js and a node global package, Yarn, installed in your environement.

## Install

    $ git clone https://github.com/joanaportugal/project_management_be
    $ cd project_management_be
    $ npm install

## Configuration

Create a .env file following the example given on .env.example

## Running the project

First, you need to migrate the knex database:

    $ npm run runMigrations

After migrations, you can explore the project on your machine:

    $ npm run dev

## Expanding the project

You can fork the repository and implement your own features. But be aware of these things for the database:

**Create table/Alter table:**

    $ npm run makeMigration MIGRATION_NAME

**Edit the file and in the end:**

    $ npm run runMigrations

**Made a mistake?**

    $ npm run rollback
