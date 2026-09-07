# KrishiDrishti Deployment Guide 🚀

This document details how to deploy the **KrishiDrishti** smart agriculture platform across environments.

---

## 🏗️ Architecture Architecture Overview

```
              ┌───────────────────────────────┐
              │     Static Frontend Hosting   │
              │  (GitHub Pages / Vercel / Netlify) │
              └──────────────┬────────────────┘
                             │ API Calls (JSON/JWT)
                             ▼
              ┌───────────────────────────────┐
              │     Node.js Express Backend   │
              │   (Render / Railway / Fly.io) │
              └──────────────┬────────────────┘
                             │ Multipart HTTP / REST
                             ▼
              ┌───────────────────────────────┐
              │     Python ML Microservice    │
              │   (Render / Railway / Hugging)│
              └───────────────────────────────┘
```

---

## 1. Local Development Deployment

1. **Install Node Dependencies**:
   ```bash
   npm install
   ```
2. **Start Integrated Node.js Backend & Static Server**:
   ```bash
   node backend/server.js
   ```
   Access application at `http://localhost:5000`.

3. **Start Python ML Service (Optional)**:
   ```bash
   pip install -r ml/requirements.txt
   python ml/app.py
   ```

---

## 2. Separate Production Frontend Deployment (GitHub Pages)

Since GitHub Pages serves static files (HTML, CSS, JS):

1. **Update `config.js`**:
   In production, set `API_BASE_URL` in `config.js` to your deployed backend URL:
   ```javascript
   window.KRISHI_CONFIG = {
     API_BASE_URL: "https://your-krishidrishti-backend.onrender.com/api",
     ML_BASE_URL: "https://your-krishidrishti-ml.onrender.com"
   };
   ```
2. Push root directory files (`index.html`, `dashboard.html`, `style.css`, `assets/`, etc.) to your GitHub repository and enable GitHub Pages on `main` branch.

---

## 3. Backend Deployment (Render / Railway)

1. Connect your repository to **Render** or **Railway**.
2. Set Build Command: `npm install`
3. Set Start Command: `node backend/server.js`
4. Configure Environment Variables in Service Dashboard:
   - `PORT`: `5000`
   - `JWT_SECRET`: `<your_secure_random_string>`
   - `AI_API_KEY`: `<your_openai_or_gemini_key>` (Optional)
   - `ML_SERVICE_URL`: `https://your-krishidrishti-ml.onrender.com`

---

## 4. Python ML Service Deployment (Render Web Service)

1. Create a Python Web Service on Render pointing to the `ml/` directory.
2. Build Command: `pip install -r requirements.txt`
3. Start Command: `gunicorn -w 2 -b 0.0.0.0:8000 app:app` or `python app.py`

---

## 🔐 Security Best Practices
- **NEVER** expose your `AI_API_KEY` or `JWT_SECRET` in frontend JavaScript files.
- Ensure CORS is restricted to your production domain in `backend/server.js`.
