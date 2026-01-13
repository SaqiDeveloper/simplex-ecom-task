

module.exports.paginate = (req, res, next) => {
  const page = Number(req.query?.page) || 1;
  const limit = Number(req.query?.limit) || 10;

  const offset = (page - 1) * limit;

  req.pagination = { limit, offset }

  next();

};

module.exports.paginatedResponse = (rows, count, pageNo, limitPerPage) => {

  const page = pageNo || 1;
  const limit = limitPerPage || 10;

  return {
    data: rows,
    pagination: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    },
  };
}