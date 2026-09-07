const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth.middleware');

// GET /api/crops
router.get('/', authenticateToken, (req, res, next) => {
  db.all("SELECT * FROM crops WHERE user_id = ? ORDER BY created_at DESC", [req.user.id], (err, rows) => {
    if (err) return next(err);
    res.json(rows || []);
  });
});

// POST /api/crops
router.post('/', authenticateToken, (req, res, next) => {
  const { crop_name, variety, field_name, area, sowing_date, harvest_date, soil_type, health, irrigation, notes } = req.body;

  if (!crop_name) {
    return res.status(400).json({ success: false, message: 'Crop name is required.' });
  }

  const sql = `INSERT INTO crops (user_id, crop_name, variety, field_name, area, sowing_date, harvest_date, soil_type, health, irrigation, notes)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [
    req.user.id,
    crop_name.trim(),
    variety || '',
    field_name || '',
    area || 1.0,
    sowing_date || '',
    harvest_date || '',
    soil_type || 'Alluvial',
    health || 'Healthy',
    irrigation || '',
    notes || ''
  ];

  db.run(sql, params, function (err) {
    if (err) return next(err);
    res.status(201).json({
      success: true,
      message: 'Crop plot registered successfully.',
      id: this.lastID
    });
  });
});

// PUT /api/crops/:id
router.put('/:id', authenticateToken, (req, res, next) => {
  const { crop_name, variety, field_name, area, sowing_date, harvest_date, soil_type, health, irrigation, notes } = req.body;
  const cropId = req.params.id;

  const sql = `UPDATE crops SET crop_name=?, variety=?, field_name=?, area=?, sowing_date=?, harvest_date=?, soil_type=?, health=?, irrigation=?, notes=?, updated_at=CURRENT_TIMESTAMP
               WHERE id=? AND user_id=?`;
  const params = [crop_name, variety, field_name, area, sowing_date, harvest_date, soil_type, health, irrigation, notes, cropId, req.user.id];

  db.run(sql, params, function (err) {
    if (err) return next(err);
    if (this.changes === 0) {
      return res.status(404).json({ success: false, message: 'Crop record not found or unauthorized.' });
    }
    res.json({ success: true, message: 'Crop plot updated successfully.' });
  });
});

// DELETE /api/crops/:id
router.delete('/:id', authenticateToken, (req, res, next) => {
  const cropId = req.params.id;
  db.run("DELETE FROM crops WHERE id=? AND user_id=?", [cropId, req.user.id], function (err) {
    if (err) return next(err);
    if (this.changes === 0) {
      return res.status(404).json({ success: false, message: 'Crop record not found or unauthorized.' });
    }
    res.json({ success: true, message: 'Crop deleted successfully.' });
  });
});

module.exports = router;
