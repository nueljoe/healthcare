import { fn, col } from 'sequelize';

const deletePaginationDetailsFromQuery = (req) => {
  delete req.query.page;
  delete req.query.limit;
};

const prepareFields = (req) => {
  const { fields } = req.query;

  if (fields) {
    const fieldArray = fields.split(',');
    req.queryOptions.fields = fieldArray;
  }
};

const handleAttributes = (req) => {
  const options = req.queryOptions;

  if (options.group || options.fields) {
    options.attributes = options.group
      ? [[fn('count', col('id')), 'count'], ...options.fields]
      : options.fields;
  }

  delete options.fields;
  delete req.query.fields;
};

const handlePagination = (req) => {
  let { page, limit } = req.query;
  page *= 1;
  limit *= 1;

  // Set default limit
  req.queryOptions.limit = limit || 100;

  if (limit && page) {
    const startIndex = page <= 0 ? 1 : page - 1;
    const offset = page === 1 ? startIndex : startIndex * limit;
    req.queryOptions.offset = offset;
  }
  deletePaginationDetailsFromQuery(req);
};

const handleGroupBy = (req) => {
  const { groupBy, fields } = req.query;

  if (groupBy) {
    const groupByArray = groupBy.split(',');

    req.queryOptions.group = groupByArray;
    req.queryOptions.fields = fields
      ? [...fields, ...groupByArray]
      : groupByArray;

    delete req.query.groupBy;
  }
};

export default (req, res, next) => {
  req.queryOptions = {};

  prepareFields(req);
  handlePagination(req);
  handleGroupBy(req);
  handleAttributes(req);

  console.log('Query Options', req.queryOptions);

  next();
};
