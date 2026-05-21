const QRCode = require("qrcode");

const fs = require("fs");

const axios = require("axios");

const express = require("express");

const {Client, LocalAuth} = require("whatsapp-web.js");

// =====================
// EXPRESS
// =====================

const app = express();

const PORT = process.env.PORT || 3000;

app.get(
  "/",

  (req, res) => {
    res.send("WhatsApp Bot Running");
  },
);

// buka QR di browser

app.get(
  "/qr",

  (req, res) => {
    res.sendFile(__dirname + "/qr.html");
  },
);

app.listen(
  PORT,

  () => {
    console.log(`Server running on ${PORT}`);
  },
);

// =====================
// WHATSAPP
// =====================

const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "railway-bot-v2",

    dataPath: "/app/.wwebjs_auth",
  }),

  puppeteer: {
    headless: true,

    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,

    userDataDir: "/tmp/chrome-data",

    args: [
      "--no-sandbox",

      "--disable-setuid-sandbox",

      "--disable-dev-shm-usage",

      "--disable-gpu",

      "--single-process",

      "--no-zygote",
    ],
  },
});

// =====================
// QR
// =====================

client.on(
  "qr",

  async (qr) => {
    try {
      const image = await QRCode.toDataURL(qr);

      fs.writeFileSync(
        "qr.html",

        `<html>
          <body style="
          display:flex;
          justify-content:center;
          align-items:center;
          height:100vh;
          background:#111;
          ">

          <img src="${image}" />

          </body>
        </html>`,
      );

      console.log("QR saved");

      console.log("Open: /qr");
    } catch (err) {
      console.log(err.message);
    }
  },
);

// =====================
// READY
// =====================

client.on(
  "ready",

  () => {
    console.log("WhatsApp Bot Ready!");
  },
);

// =====================
// AUTH
// =====================

client.on(
  "authenticated",

  () => {
    console.log("WhatsApp authenticated");
  },
);

client.on(
  "auth_failure",

  (msg) => {
    console.log("Auth failed:", msg);
  },
);

// =====================
// DISCONNECT
// =====================

client.on(
  "disconnected",

  async (reason) => {
    console.log("Disconnected:", reason);

    try {
      await client.destroy();
    } catch (e) {
      console.log(e.message);
    }

    setTimeout(() => {
      client.initialize();
    }, 5000);
  },
);

// =====================
// MESSAGE
// =====================

client.on(
  "message",

  async (message) => {
    try {
      if (message.fromMe) {
        return;
      }

      const response = await axios.post(
        "https://chabot-rasa-production.up.railway.app/webhooks/rest/webhook",

        {
          sender: message.from,

          message: message.body,
        },
      );

      for (const msg of response.data) {
        if (msg.text) {
          await message.reply(msg.text);
        }
      }
    } catch (err) {
      console.log(err.message);
    }
  },
);

// =====================
// ERROR
// =====================

process.on(
  "unhandledRejection",

  (err) => {
    console.log(err);
  },
);

process.on(
  "uncaughtException",

  (err) => {
    console.log(err);
  },
);

// =====================
// START
// =====================

client.initialize();
