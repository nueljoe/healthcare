import db from '../models';

/**
 * initiates a database transaction and attaches the
 * transaction to the `Request` object and calls
 * `next()`.
 */
export default async (req, res, next) => {
  const transaction = await db.sequelize.transaction();
  req.transaction = transaction;
  next();
};
