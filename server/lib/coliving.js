const list = async (req, res, sequelize) => {
  const { city, page, label, people, type, date, maxprice } = req.query;

  const filters = [];

  if (city) {
    filters.push(`city='${city}'`);
  }

  const labels = ["surf", "kitesurf", "mountains", "beach", "yoga", "nature"];
  if (label && labels.includes(label)) {
    filters.push(`is${label}=true`);
  }
  if (maxprice && !isNan(maxprice)) {
    filters.push(`price_per_month < ${maxprice}`);
  }

  filters.push(`type='coliving'`);

  const where = filters.length > 0 ? "WHERE " + filters.join(" AND ") : "";

  const page2 = page && !isNaN(page) && page >= 1 ? page : 1;
  const query = `SELECT * FROM coliving ${where} LIMIT ${(page2 - 1) * 30},30`;

  console.log("query", query);
  const [results] = await sequelize.query(query);

  res.json(results);
};

module.exports = {
  list,
};
