/* KrishiDrishti Global API & System Configuration */

window.KRISHI_CONFIG = {
  API_BASE_URL: window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
    ? 'http://localhost:5000/api'
    : '/api',
  ML_BASE_URL: 'http://localhost:8000',
  BRAND_NAME: 'KrishiDrishti',
  TAGLINE: 'Smart Farming, Better Future'
};

window.KRISHI_API_BASE = window.KRISHI_CONFIG.API_BASE_URL;
