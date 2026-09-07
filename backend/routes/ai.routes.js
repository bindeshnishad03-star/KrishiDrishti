const express = require('express');
const router = express.Router();
const { generateAgriResponse } = require('../ai-service');
const { optionalAuth } = require('../middleware/auth.middleware');

// POST /api/ai/chat
router.post('/chat', optionalAuth, async (req, res, next) => {
  const { message, context } = req.body;

  if (!message) {
    return res.status(400).json({ success: false, message: 'Message query is required.' });
  }

  try {
    const response = await generateAgriResponse(message, context || {});
    res.json({
      success: true,
      response: response
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
