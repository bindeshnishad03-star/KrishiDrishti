const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/schemes
router.get('/', (req, res, next) => {
  db.all("SELECT * FROM schemes ORDER BY id ASC", [], (err, rows) => {
    if (err) return next(err);
    res.json(rows || []);
  });
});

module.exports = router;
