const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db');
const { createToken } = require('../auth');
const { authenticateToken } = require('../middleware/auth.middleware');

// POST /api/auth/register
router.post('/register', (req, res, next) => {
  const { name, email, phone, password, state, district, village, language } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required fields.' });
  }

  db.get("SELECT id FROM users WHERE email = ?", [email.toLowerCase().trim()], (err, user) => {
    if (err) return next(err);
    if (user) {
      return res.status(400).json({ success: false, message: 'User with this email already exists.' });
    }

    const password_hash = bcrypt.hashSync(password, 10);
    const sql = `INSERT INTO users (name, email, phone, password_hash, state, district, village, language)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [name.trim(), email.toLowerCase().trim(), phone || '', password_hash, state || '', district || '', village || '', language || 'English'];

    db.run(sql, params, function (err) {
      if (err) return next(err);
      res.status(201).json({
        success: true,
        message: 'Farmer account registered successfully!',
        userId: this.lastID
      });
    });
  });
});

// POST /api/auth/login
router.post('/login', (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  db.get("SELECT * FROM users WHERE email = ?", [email.toLowerCase().trim()], (err, user) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = createToken(user);
    const userInfo = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      state: user.state,
      district: user.district,
      village: user.village,
      language: user.language
    };

    res.json({
      success: true,
      token,
      user: userInfo
    });
  });
});

// GET /api/me
router.get('/me', authenticateToken, (req, res, next) => {
  db.get("SELECT id, name, email, phone, state, district, village, language, created_at FROM users WHERE id = ?", [req.user.id], (err, user) => {
    if (err) return next(err);
    if (!user) return res.status(404).json({ success: false, message: 'User profile not found.' });
    res.json({ success: true, user });
  });
});

module.exports = router;
