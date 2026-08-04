# PRIVA - Praktikum Virtual Assistant Chatbot System 🤖

PRIVA adalah sistem chatbot asisten virtual cerdas yang dikembangkan untuk membantu mahasiswa dan civitas akademika Program Studi Informatika UAD dalam mengakses informasi seputar praktikum, responsi, jadwal, aturan laboratorium, dan inhal.

---

## 🌟 Arsitektur Sistem & Tech Stack

Sistem terdiri dari 4 modul utama yang saling terintegrasi:

```
[ Frontend (React + Vite) ] --------> [ Backend API (Express + MySQL) ]
             |
             +----------------------> [ Rasa AI Server (Rasa 3.6.21 + Custom Actions) ]
                                                        ^
[ WhatsApp Bot (whatsapp-web.js) ] ---------------------+
```

1. **`frontend/`**: Antarmuka web pengguna berbasis React 18, Vite, Tailwind CSS, Lucide Icons, dan Sonner Toast. *(Siap Deploy di Vercel)*
2. **`backend/`**: Service REST API untuk Autentikasi Pengguna (Register & Login) berbasis Express.js, JWT, Bcrypt, dan MySQL Cloud (Aiven).
3. **`rasa/`**: Server Natural Language Understanding (NLU) & Dialogue Engine berbasis Rasa 3.6.21 dengan Custom Actions Python. Akurasi pengujian NLU mencapai **97.44%**.
4. **`whatsapp-bot/`**: Bot WhatsApp terintegrasi yang menjembatani pesan WhatsApp ke Server Rasa berbasis `whatsapp-web.js`, Puppeteer, dan Express QR Web Viewer.

---

## 🚀 Panduan Deployment

### 1. Deployment Frontend (`frontend/`) di Vercel
- Hubungkan repository GitHub Anda ke **Vercel**.
- Set **Root Directory**: `frontend`.
- Masukkan **Environment Variables**:
  - `VITE_AUTH_URL` = URL Backend API Anda (misal `https://priva-backend.onrender.com`)
  - `VITE_API_URL` = URL Server Rasa Anda (misal `https://priva-rasa.onrender.com`)

### 2. Deployment Backend (`backend/`) di Render
- Buat **New Web Service** di Render dari repository GitHub.
- Set **Root Directory**: `backend`.
- **Environment**: Docker (atau Node.js).
- Masukkan **Environment Variables**:
  - `PORT` = `8000`
  - `DB_HOST` = Host MySQL Cloud Aiven Anda
  - `DB_USER` = User MySQL Cloud Aiven
  - `DB_PASSWORD` = Password MySQL Cloud Aiven
  - `DB_NAME` = `defaultdb` (atau nama db Anda)
  - `DB_PORT` = `3306`
  - `JWT_SECRET` = Secret Key JWT Anda
  - `CORS_ORIGIN` = `https://<URL-FRONTEND-VERCEL>.vercel.app`

### 3. Deployment Rasa Chatbot (`rasa/`) di Render
- Buat **New Web Service** di Render dari repository GitHub.
- Set **Root Directory**: `rasa`.
- **Environment**: Docker (Render akan otomatis mengeksekusi `Dockerfile` dan `entrypoint.sh`).
- Skrip `entrypoint.sh` secara otomatis menjalankan **Rasa Action Server** dan **Rasa API Server** secara bersamaan dalam 1 Container Render (Free Tier Friendly).

### 4. Deployment WhatsApp Bot (`whatsapp-bot/`) di Render
- Buat **New Web Service** di Render dari repository GitHub.
- Set **Root Directory**: `whatsapp-bot`.
- **Environment**: Docker (Render akan menggunakan `Dockerfile` khusus berisikan Chromium/Puppeteer).
- Masukkan **Environment Variables**:
  - `RASA_URL` = `https://<URL-RASA-RENDER>.onrender.com/webhooks/rest/webhook`

---

## 🛠️ Pengembangan Lokal (Local Development)

### 1. Jalankan Backend
```bash
cd backend
npm install
npm run dev
```

### 2. Jalankan Rasa Chatbot & Action Server
```bash
cd rasa
source .venv/bin/activate
rasa run actions &
rasa run --enable-api --cors "*"
```

### 3. Jalankan WhatsApp Bot
```bash
cd whatsapp-bot
npm install
npm start
```
*Akses QR Code di: `http://localhost:3000/qr`*

### 4. Jalankan Frontend
```bash
cd frontend
npm install
npm run dev
```
*Akses antarmuka web di: `http://localhost:5173`*

---

## 📝 Lisensi & Kredit
Dikembangkan oleh **Rayyan Khadafi** sebagai proyek skripsi & portofolio aplikasi terintegrasi di Laboratorium Informatika Universitas Ahmad Dahlan (UAD).
