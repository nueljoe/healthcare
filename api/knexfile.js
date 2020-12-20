// Update with your config settings.
require('dotenv').config();

module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      database: process.env.DB_NAME,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: __dirname + '/src/database/migrations'
    },
    seeds: {
      directory: __dirname + '/src/database/seeds'
    },
  },

  staging: {
    client: 'mysql2',
    connection: {
      database: process.env.DB_NAME,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: __dirname + '/src/database/migrations'
    },
    seeds: {
      directory: __dirname + '/src/database/seeds'
    },
  },

  production: {
    client: 'mysql2',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: __dirname + '/src/database/migrations'
    },
    seeds: {
      directory: __dirname + '/src/database/seeds'
    },
  }

};
