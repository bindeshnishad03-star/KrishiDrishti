const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth.middleware');

// GET /api/notifications
router.get('/', authenticateToken, (req, res, next) => {
  db.all("SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC", [req.user.id], (err, rows) => {
    if (err) return next(err);
    res.json(rows || []);
  });
});

// PUT /api/notifications/:id/read
router.put('/:id/read', authenticateToken, (req, res, next) => {
  db.run("UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?", [req.params.id, req.user.id], function (err) {
    if (err) return next(err);
    res.json({ success: true });
  });
});

// PUT /api/notifications/read-all
router.put('/read-all', authenticateToken, (req, res, next) => {
  db.run("UPDATE notifications SET is_read = 1 WHERE user_id = ?", [req.user.id], function (err) {
    if (err) return next(err);
    res.json({ success: true, message: 'All marked as read.' });
  });
});

module.exports = router;
