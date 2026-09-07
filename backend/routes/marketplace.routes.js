const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/products
router.get('/', (req, res, next) => {
  const { category } = req.query;
  let sql = "SELECT * FROM marketplace_products WHERE 1=1";
  const params = [];

  if (category && category !== 'ALL') {
    sql += " AND category = ?";
    params.push(category);
  }

  db.all(sql, params, (err, rows) => {
    if (err) return next(err);
    res.json(rows || []);
  });
});

// GET /api/products/:id
router.get('/:id', (req, res, next) => {
  db.get("SELECT * FROM marketplace_products WHERE id = ?", [req.params.id], (err, product) => {
    if (err) return next(err);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json(product);
  });
});

module.exports = router;
