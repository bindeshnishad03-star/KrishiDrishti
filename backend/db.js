const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'krishi.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // 1. Users
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      password_hash TEXT NOT NULL,
      state TEXT,
      district TEXT,
      village TEXT,
      language TEXT DEFAULT 'English',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 2. Crops
  db.run(`
    CREATE TABLE IF NOT EXISTS crops (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      crop_name TEXT NOT NULL,
      variety TEXT,
      field_name TEXT,
      area REAL DEFAULT 1.0,
      sowing_date TEXT,
      harvest_date TEXT,
      soil_type TEXT,
      health TEXT DEFAULT 'Healthy',
      irrigation TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // 3. Community Posts
  db.run(`
    CREATE TABLE IF NOT EXISTS community_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      author_name TEXT NOT NULL,
      location TEXT,
      category TEXT DEFAULT 'General',
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      likes INTEGER DEFAULT 0,
      comments_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 4. Community Comments
  db.run(`
    CREATE TABLE IF NOT EXISTS community_comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      author_name TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE
    )
  `);

  // 5. Likes
  db.run(`
    CREATE TABLE IF NOT EXISTS likes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      UNIQUE(post_id, user_id)
    )
  `);

  // 6. Notifications
  db.run(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      category TEXT DEFAULT 'General',
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 7. Marketplace Products
  db.run(`
    CREATE TABLE IF NOT EXISTS marketplace_products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      unit TEXT DEFAULT 'pack',
      description TEXT,
      in_stock INTEGER DEFAULT 1
    )
  `);

  // 8. Farm Equipment
  db.run(`
    CREATE TABLE IF NOT EXISTS equipment (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      buy_price REAL NOT NULL,
      rental_price REAL NOT NULL,
      provider TEXT,
      location TEXT,
      availability TEXT DEFAULT 'Available'
    )
  `);

  // 9. Government Schemes
  db.run(`
    CREATE TABLE IF NOT EXISTS schemes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT DEFAULT 'Central Scheme',
      description TEXT,
      eligibility TEXT,
      benefits TEXT,
      official_url TEXT
    )
  `);

  // 10. Mandi Prices
  db.run(`
    CREATE TABLE IF NOT EXISTS mandi_prices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      crop TEXT NOT NULL,
      market TEXT NOT NULL,
      state TEXT NOT NULL,
      min_price REAL NOT NULL,
      max_price REAL NOT NULL,
      modal_price REAL NOT NULL,
      date TEXT DEFAULT CURRENT_DATE
    )
  `);

  // Seed Initial Demo Data
  seedInitialData();
});

function seedInitialData() {
  // Check demo user
  db.get("SELECT id FROM users WHERE email = 'farmer@krishidrishti.in'", (err, row) => {
    if (!row) {
      const passHash = bcrypt.hashSync('farmer123', 10);
      db.run(`
        INSERT INTO users (name, email, phone, password_hash, state, district, village)
        VALUES ('Ramesh Patel', 'farmer@krishidrishti.in', '9876543210', ?, 'Punjab', 'Ludhiana', 'Samrala')
      `, [passHash], function(err) {
        if (!err && this.lastID) {
          const userId = this.lastID;
          // Seed sample crops
          db.run(`INSERT INTO crops (user_id, crop_name, variety, field_name, area, sowing_date, harvest_date, soil_type, health, notes)
                  VALUES (?, 'Wheat', 'HD 2967', 'North Field Plot A', 3.5, '2026-11-10', '2027-04-15', 'Alluvial Soil', 'Healthy', 'First watering complete. DAP applied.')`, [userId]);
          db.run(`INSERT INTO crops (user_id, crop_name, variety, field_name, area, sowing_date, harvest_date, soil_type, health, notes)
                  VALUES (?, 'Paddy', 'PB 1121 Basmati', 'South Field Plot B', 2.0, '2026-06-20', '2026-10-25', 'Clay Loam', 'Needs Attention', 'Monitor for yellow stem borer.')`, [userId]);

          // Seed Notifications
          db.run(`INSERT INTO notifications (user_id, title, message, category)
                  VALUES (?, 'Rainfall Advisory', 'Moderate rain expected in Ludhiana district within 48 hours.', 'Weather')`, [userId]);
          db.run(`INSERT INTO notifications (user_id, title, message, category)
                  VALUES (?, 'Wheat Mandi Rate Increase', 'Wheat modal price reached ₹2,275/qtl at Khanna Mandi.', 'Mandi')`, [userId]);
        }
      });
    }
  });

  // Seed Mandi Prices
  db.get("SELECT COUNT(*) as count FROM mandi_prices", (err, row) => {
    if (row && row.count === 0) {
      const stmt = db.prepare("INSERT INTO mandi_prices (crop, market, state, min_price, max_price, modal_price, date) VALUES (?, ?, ?, ?, ?, ?, ?)");
      const today = new Date().toISOString().split('T')[0];
      stmt.run('Wheat', 'Khanna Mandi', 'Punjab', 2200, 2310, 2275, today);
      stmt.run('Wheat', 'Karnal Mandi', 'Haryana', 2180, 2290, 2250, today);
      stmt.run('Paddy (Basmati)', 'Karnal Mandi', 'Haryana', 3600, 3950, 3850, today);
      stmt.run('Paddy (Basmati)', 'Amritsar Mandi', 'Punjab', 3650, 4000, 3890, today);
      stmt.run('Cotton (Medium)', 'Rajkot Mandi', 'Gujarat', 6800, 7350, 7100, today);
      stmt.run('Mustard (Yellow)', 'Jaipur Mandi', 'Rajasthan', 5200, 5650, 5450, today);
      stmt.run('Potato', 'Agra Mandi', 'Uttar Pradesh', 1350, 1550, 1450, today);
      stmt.run('Maize', 'Bhopal Mandi', 'Madhya Pradesh', 1950, 2150, 2050, today);
      stmt.finalize();
    }
  });

  // Seed Marketplace Products
  db.get("SELECT COUNT(*) as count FROM marketplace_products", (err, row) => {
    if (row && row.count === 0) {
      const stmt = db.prepare("INSERT INTO marketplace_products (name, category, price, unit, description) VALUES (?, ?, ?, ?, ?)");
      stmt.run('Hybrid Wheat Seeds (HD-3086)', 'Seeds', 1250, '40kg bag', 'High yielding drought-tolerant certified wheat seeds.');
      stmt.run('Basmati Rice Seeds (PB-1718)', 'Seeds', 1850, '30kg bag', 'Aromatic disease-resistant basmati paddy seed variety.');
      stmt.run('Bio-NPK Fertilizer Consortium', 'Fertilizers', 450, '1L bottle', 'Organic nitrogen and potassium fixing bio-fertilizer.');
      stmt.run('Neem Oil Bio-Pesticide (10,000 PPM)', 'Pesticides', 620, '1L bottle', 'Cold-pressed natural insect repellent for whitefly & aphids.');
      stmt.run('Backpack Battery Sprayer (16L)', 'Tools', 2850, 'unit', 'Rechargeable 12V lithium-ion pump sprayer with multi-nozzle.');
      stmt.run('Micro Drip Irrigation Starter Kit', 'Irrigation', 4500, '0.5 acre kit', 'Drip lines, emitters, filter, and connectors for row crops.');
      stmt.finalize();
    }
  });

  // Seed Equipment
  db.get("SELECT COUNT(*) as count FROM equipment", (err, row) => {
    if (row && row.count === 0) {
      const stmt = db.prepare("INSERT INTO equipment (name, category, buy_price, rental_price, provider, location, availability) VALUES (?, ?, ?, ?, ?, ?, ?)");
      stmt.run('Mahindra 575 DI Tractor (45 HP)', 'Tractor', 680000, 1200, 'Kisan Machinery Hub', 'Ludhiana, Punjab', 'Available');
      stmt.run('Shaktiman Heavy Duty Rotavator (6 ft)', 'Rotavator', 115000, 500, 'Punjab Agri Implements', 'Jalandhar, Punjab', 'Available');
      stmt.run('Swaraj 744 FE Tractor', 'Tractor', 640000, 1100, 'Haryana Farm Care', 'Karnal, Haryana', 'Available');
      stmt.run('Self-Propelled Paddy Harvester', 'Harvester', 1850000, 2800, 'Green Field Tech', 'Sangrur, Punjab', 'Available');
      stmt.run('Automatic Multi-Crop Seed Drill', 'Seeder', 85000, 450, 'Patel Agri Services', 'Rajkot, Gujarat', 'Available');
      stmt.finalize();
    }
  });

  // Seed Government Schemes
  db.get("SELECT COUNT(*) as count FROM schemes", (err, row) => {
    if (row && row.count === 0) {
      const stmt = db.prepare("INSERT INTO schemes (name, category, description, eligibility, benefits, official_url) VALUES (?, ?, ?, ?, ?, ?)");
      stmt.run('PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)', 'Financial Support', 'Direct income support of ₹6,000 per year paid in three equal installments of ₹2,000.', 'All landholding farmer families with cultivable land.', 'Direct bank transfer of ₹6,000 annually.', 'https://pmkisan.gov.in');
      stmt.run('Pradhan Mantri Fasal Bima Yojana (PMFBY)', 'Crop Insurance', 'Comprehensive crop insurance against natural risks, flood, drought, pests, and post-harvest losses.', 'Farmers growing notified crops in notified areas.', 'High insurance coverage at low premium (1.5% - 2%).', 'https://pmfby.gov.in');
      stmt.run('Kisan Credit Card (KCC) Scheme', 'Institutional Credit', 'Provides timely access to short-term credit for crop production, maintenance, and farm assets.', 'All farmers, tenant farmers, and self-help groups.', 'Concessional interest rate at 4% p.a. with prompt repayment.', 'https://www.myscheme.gov.in/schemes/kcc');
      stmt.run('PM Krishi Sinchayee Yojana (PMKSY)', 'Irrigation Subsidy', 'Subsidies for drip and sprinkler irrigation installations to achieve More Crop Per Drop.', 'All farmers owning agricultural land.', 'Up to 55% subsidy for micro-irrigation systems.', 'https://pmksy.gov.in');
      stmt.finalize();
    }
  });

  // Seed Community Posts
  db.get("SELECT COUNT(*) as count FROM community_posts", (err, row) => {
    if (row && row.count === 0) {
      db.run(`INSERT INTO community_posts (user_id, author_name, location, category, title, content, likes, comments_count)
              VALUES (1, 'Ramesh Patel', 'Ludhiana, Punjab', 'Crop Help', 'Which zinc fertilizer gives best yield in wheat?', 'I have sowed HD 2967 wheat plot 10 days ago. Should I apply Zinc Sulphate 21% or Chelated Zinc with first irrigation?', 14, 3)`);
      db.run(`INSERT INTO community_posts (user_id, author_name, location, category, title, content, likes, comments_count)
              VALUES (1, 'Gurpreet Singh', 'Sangrur, Punjab', 'Success Stories', 'Switching to micro-drip irrigation reduced my water pump electricity bill by 40%!', 'Brothers, installed drip irrigation for my vegetable crops last season. Yield improved by 25% and saved significant labor.', 28, 5)`);
    }
  });
}

module.exports = db;
