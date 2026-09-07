const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/mandi
router.get('/', (req, res, next) => {
  const { crop, state, search } = req.query;
  let sql = "SELECT * FROM mandi_prices WHERE 1=1";
  const params = [];

  if (crop && crop !== 'ALL') {
    sql += " AND LOWER(crop) LIKE ?";
    params.push(`%${crop.toLowerCase()}%`);
  }
  if (state && state !== 'ALL') {
    sql += " AND LOWER(state) = ?";
    params.push(state.toLowerCase());
  }
  if (search) {
    sql += " AND (LOWER(market) LIKE ? OR LOWER(crop) LIKE ?)";
    params.push(`%${search.toLowerCase()}%`, `%${search.toLowerCase()}%`);
  }

  sql += " ORDER BY id DESC";

  db.all(sql, params, (err, rows) => {
    if (err) return next(err);
    res.json(rows || []);
  });
});

module.exports = router;
