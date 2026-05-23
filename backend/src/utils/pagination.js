const pagination = (query, total, page, limit) => {
  return {
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit),
    limit: parseInt(limit),
  };
};

module.exports = pagination;
