import dotenv from 'dotenv';
import knex from 'knex';

dotenv.config();

const connection = process.env.DB_CONNECTION_STRING || {
  user : process.env.DB_USERNAME,
  password : process.env.DB_PASSWORD,
  database : process.env.DB_NAME
};

/**
 * @type { knex.Client }
 * A knex Client instance
 */
export default knex({
  client: 'mysql2',
  connection,
});
