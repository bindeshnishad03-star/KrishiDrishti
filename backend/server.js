const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const errorMiddleware = require('./middleware/error.middleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middleware
app.use(helmet({
  contentSecurityPolicy: false // Allows inline scripts & Chart.js/FontAwesome CDNs in frontend
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express Static File Middleware - Serves Root Frontend Files directly!
// This fixes the "Cannot GET /dashboard.html" bug permanently.
const frontendPath = path.join(__dirname, '../');
app.use(express.static(frontendPath));

// API Routes Initialization
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/crops', require('./routes/crop.routes'));
app.use('/api/mandi', require('./routes/mandi.routes'));
app.use('/api/products', require('./routes/marketplace.routes'));
app.use('/api/equipment', require('./routes/equipment.routes'));
app.use('/api/community', require('./routes/community.routes'));
app.use('/api/schemes', require('./routes/scheme.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));
app.use('/api/ai', require('./routes/ai.routes'));
app.use('/api/disease', require('./routes/disease.routes'));

// API Health Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'KrishiDrishti API is running',
    timestamp: new Date().toISOString()
  });
});

// Fallback Route Handler for Static Pages
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ success: false, message: 'API Endpoint Not Found' });
  }

  // Sanitize path to serve html files
  let requestedFile = req.path;
  if (requestedFile === '/') requestedFile = '/index.html';
  if (!requestedFile.endsWith('.html') && !requestedFile.includes('.')) {
    requestedFile += '.html';
  }

  const filePath = path.join(frontendPath, requestedFile);
  res.sendFile(filePath, (err) => {
    if (err) {
      // Fallback to index.html if file doesn't exist
      res.sendFile(path.join(frontendPath, 'index.html'));
    }
  });
});

// Global Error Middleware
app.use(errorMiddleware);

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🌱 KRISHIDRISHTI PLATFORM RUNNING`);
  console.log(`Tagline: Smart Farming, Better Future`);
  console.log(`Server URL: http://localhost:${PORT}`);
  console.log(`Dashboard URL: http://localhost:${PORT}/dashboard.html`);
  console.log(`API Base URL: http://localhost:${PORT}/api`);
  console.log(`====================================================`);
});
