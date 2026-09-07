# KrishiDrishti 🌾
> **Tagline:** Smart Farming, Better Future  
> **Brand Name:** KrishiDrishti  

**KrishiDrishti** is a complete, production-ready Indian smart agriculture technology platform designed to empower farmers with digital crop portfolio management, AI-driven agricultural advisory, computer-vision leaf disease detection, weather forecasts & advisories, regional mandi prices with historical trend charts, an agricultural marketplace, equipment rentals, community forums, and government subsidy scheme information.

---

## 🌟 Key Features

1. **Farmer Authentication & Security**: JWT-based session security with bcrypt password hashing and stateful profile management.
2. **Interactive Farmer Dashboard**: Metric summary cards (Total crops, healthy count, attention alerts, harvest calendar), weather card, mandi highlights, quick actions, and recent activity log.
3. **Crop Portfolio Management (CRUD)**: Add, edit, delete, search, and filter field plots with sowing dates, expected harvest dates, soil types, and crop health status.
4. **AI Agriculture Assistant**: Chatbot providing expert guidance on fertilizers, pest management, and irrigation timing with built-in agricultural knowledge fallback.
5. **AI/ML Disease Detection**: Upload leaf photos for crop disease diagnosis with confidence metrics, severity scores, causes, recommended treatments, and disclaimers.
6. **Agri Weather & Smart Advisory**: Location-based weather metrics (Temp, Humidity, Rain probability, Wind) with 7-day forecast cards and irrigation advisories via Open-Meteo.
7. **Mandi Commodity Rates**: Search regional mandi prices across Indian states with 7-day price trend visualization powered by Chart.js.
8. **Agri Marketplace**: Catalog for seeds, fertilizers, pesticides, tools, and irrigation equipment with cart management and demo checkout summary.
9. **Farm Equipment Rentals**: Browse tractors, harvesters, rotavators, and seeders with daily rental rates and provider booking inquiry modals.
10. **Farmer Community Forum**: Peer discussion board supporting post publishing, categories, likes, and comment threads.
11. **Government Schemes Directory**: Information on PM-KISAN, PMFBY, KCC, and PMKSY with official government portal buttons.
12. **Notification Center**: Real-time alert list categorized by weather, disease, mandi, and community updates.
13. **Farmer Settings & Language Readiness**: Profile configuration and language readiness (English/Hindi).

---

## 🛠️ Technology Stack

- **Frontend**: HTML5, Vanilla CSS3 (Custom Emerald Agriculture Theme), Vanilla JavaScript (ES6+), Font Awesome 6, Chart.js.
- **Backend**: Node.js, Express.js REST API.
- **Database**: SQLite (`backend/krishi.db`) with parameterized SQL queries.
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs.
- **AI Integration**: Backend abstraction supporting OpenAI/Gemini REST endpoints or local knowledge engine fallback.
- **ML Microservice**: Python, Flask / FastAPI, Pillow, NumPy, scikit-learn (`ml/app.py` & `ml/train_model.py`).

---

## 📁 Project Folder Structure

```
c:\Users\MY PC\OneDrive\Desktop\crop/
├── index.html
├── login.html
├── register.html
├── dashboard.html
├── crops.html
├── weather.html
├── ai-assistant.html
├── disease-detection.html
├── mandi.html
├── marketplace.html
├── equipment.html
├── community.html
├── schemes.html
├── notifications.html
├── settings.html
├── style.css
├── auth.js
├── app.js
├── config.js
├── assets/
│   ├── logo.png
│   └── favicon.png
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── auth.js
│   ├── db.js
│   ├── ai-service.js
│   ├── routes/
│   ├── middleware/
│   └── krishi.db
├── ml/
│   ├── requirements.txt
│   ├── app.py
│   ├── train_model.py
│   ├── predict.py
│   ├── model/
│   └── dataset/
├── .env.example
├── .gitignore
├── README.md
└── DEPLOYMENT.md
```

---

## 🚀 Quick Start & Local Setup

### 1. Install & Start Backend (Node.js & Express)

```bash
# Navigate to backend directory or root
npm install

# Start the Express server (runs on http://localhost:5000)
npm start
```

Once running, navigate your browser to:
- **Homepage**: `http://localhost:5000/`
- **Dashboard**: `http://localhost:5000/dashboard.html`
- **Login**: `http://localhost:5000/login.html`

### 2. Demo Login Credentials

- **Email**: `farmer@krishidrishti.in`
- **Password**: `farmer123`

### 3. Optional: Start Python ML Microservice

```bash
# Navigate to ml directory
cd ml

# Install python dependencies
pip install -r requirements.txt

# Start ML service (runs on http://localhost:8000)
python app.py
```

---

## 📄 License
Licensed under MIT License. Developed for Indian Smart Agriculture.
