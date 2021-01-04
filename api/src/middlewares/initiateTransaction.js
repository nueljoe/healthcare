import knex from '../database';

/**
 * initiates a database transaction and attaches the
 * transaction to the `Request` object and calls
 * `next()`.
 */
export default async (req, res, next) => {
  const transaction = await knex.transaction();
  req.transaction = transaction;
  next();
};
