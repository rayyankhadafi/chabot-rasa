# PRIVA - Praktikum Virtual Assistant Chatbot System 🤖

PRIVA adalah sistem chatbot asisten virtual cerdas yang dikembangkan untuk membantu mahasiswa dan civitas akademika Program Studi Informatika UAD dalam mengakses informasi seputar praktikum, responsi, jadwal, aturan laboratorium, dan inhal.

---

## Arsitektur Sistem & Tech Stack

Sistem terdiri dari 4 modul utama yang saling terintegrasi:

```
[ Frontend (React + Vite) ] --------> [ Backend API (Express + MySQL) ]
             |
             +----------------------> [ Rasa AI Server (Rasa 3.6.21 + Custom Actions) ]
                                                        ^
[ WhatsApp Bot (whatsapp-web.js) ] ---------------------+
```

1. **`frontend/`**: Antarmuka web pengguna berbasis React 18, Vite, Tailwind CSS, Lucide Icons, dan Sonner Toast.
2. **`backend/`**: Service REST API untuk Autentikasi Pengguna (Register & Login) berbasis Express.js, JWT, Bcrypt, dan MySQL.
3. **`rasa/`**: Server Natural Language Understanding (NLU) & Dialogue Engine berbasis Rasa 3.6.21 dengan Custom Actions Python.
4. **`whatsapp-bot/`**: Bot WhatsApp terintegrasi yang menjembatani pesan WhatsApp ke Server Rasa berbasis `whatsapp-web.js`, Puppeteer, dan Express QR Web Viewer.

---

## Pengembangan Lokal

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
Dikembangkan oleh **Rayyan Khadafi** sebagai proyek skripsi di Laboratorium Informatika Universitas Ahmad Dahlan (UAD).
