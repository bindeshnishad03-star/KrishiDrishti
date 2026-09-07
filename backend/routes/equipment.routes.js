const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/equipment
router.get('/', (req, res, next) => {
  db.all("SELECT * FROM equipment ORDER BY id DESC", [], (err, rows) => {
    if (err) return next(err);
    res.json(rows || []);
  });
});

module.exports = router;
