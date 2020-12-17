export default class QueryOptions {
  /**
   *
   * @param { Request } request - An Express Request object
   */
  constructor(request, options = { statrtPage: 1, limit: 100 }) {
    this.request = request;
    this.requestQuery = request.query;

    this.query = {};

    this.fields = this.requestQuery.fields;
    this.page = this.requestQuery.page || options.page;
    this.limit = this.requestQuery.limit || options.limit;
  }

  composeFields() {
    if (this.fields) {
      this.query.attributes = this.fields.split();
    }
  }

  handlePagination() {
    this.page *= 1;
    this.limit *= 1;

    const startIndex = this.page <= 0 ? 1 : this.page - 1;
    const offset = this.page === 1 ? startIndex : startIndex * this.limit;

    this.query.limit = this.limit;
    this.query.offset = offset;
  }

  setOrder() {
    const orderBy = this.requestQuery.order_by;
    if (orderBy) {
      this.query = {
        order: [orderBy, this.getOrderMagnitude()],
      };
    }
  }

  getOrderMagnitude() {
    if (this.requestQuery.order_magnitude) {
      return this.orderMagnitude;
    }
    return 'DESC';
  }

  cleanRequestQuery() {
    delete this.requestQuery.page;
    delete this.requestQuery.limit;
    delete this.requestQuery.fields;
    delete this.requestQuery.order_by;
    delete this.requestQuery.order_magnitude;
    delete this.requestQuery.group_by;
  }
}
