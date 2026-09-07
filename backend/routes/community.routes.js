const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth.middleware');

// GET /api/community/posts
router.get('/posts', (req, res, next) => {
  db.all("SELECT * FROM community_posts ORDER BY created_at DESC", [], (err, rows) => {
    if (err) return next(err);
    res.json(rows || []);
  });
});

// POST /api/community/posts
router.post('/posts', authenticateToken, (req, res, next) => {
  const { title, content, category } = req.body;

  if (!title || !content) {
    return res.status(400).json({ success: false, message: 'Title and content are required.' });
  }

  db.get("SELECT name, village, state FROM users WHERE id = ?", [req.user.id], (err, user) => {
    const author_name = user ? user.name : req.user.name || 'Farmer';
    const location = user && user.village ? `${user.village}, ${user.state}` : 'India';

    const sql = `INSERT INTO community_posts (user_id, author_name, location, category, title, content)
                 VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(sql, [req.user.id, author_name, location, category || 'General', title.trim(), content.trim()], function (err) {
      if (err) return next(err);
      res.status(201).json({
        success: true,
        message: 'Community post created successfully.',
        id: this.lastID
      });
    });
  });
});

// POST /api/community/posts/:id/like
router.post('/posts/:id/like', authenticateToken, (req, res, next) => {
  const postId = req.params.id;
  const userId = req.user.id;

  db.run("INSERT OR IGNORE INTO likes (post_id, user_id) VALUES (?, ?)", [postId, userId], function (err) {
    if (err) return next(err);
    db.run("UPDATE community_posts SET likes = likes + 1 WHERE id = ?", [postId], function (err) {
      if (err) return next(err);
      res.json({ success: true, message: 'Liked post.' });
    });
  });
});

module.exports = router;
