const qrcode = require("qrcode-terminal");

const axios = require("axios");

const express = require("express");

const {Client, LocalAuth} = require("whatsapp-web.js");

// =====================
// EXPRESS HEALTH CHECK
// =====================

const app = express();

const PORT = process.env.PORT || 3000;

app.get(
  "/",

  (req, res) => {
    res.send("WhatsApp bot running");
  },
);

app.listen(
  PORT,

  () => {
    console.log(`Server running on ${PORT}`);
  },
);

// =====================
// WHATSAPP CLIENT
// =====================

const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "railway-bot",
  }),

  puppeteer: {
    headless: true,

    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,

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
// QR LOGIN
// =====================

client.on(
  "qr",

  (qr) => {
    qrcode.generate(
      qr,

      {
        small: true,
      },
    );

    console.log("Scan QR WhatsApp");
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
// AUTH SUCCESS
// =====================

client.on(
  "authenticated",

  () => {
    console.log("WhatsApp authenticated");
  },
);

// =====================
// AUTH FAILED
// =====================

client.on(
  "auth_failure",

  (msg) => {
    console.log("Auth failed:", msg);
  },
);

// =====================
// DISCONNECTED
// =====================

client.on(
  "disconnected",

  async (reason) => {
    console.log("Disconnected:", reason);

    try {
      await client.destroy();
    } catch (err) {
      console.log(err.message);
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

      const rasaMessages = response.data;

      for (const msg of rasaMessages) {
        if (msg.text) {
          await message.reply(msg.text);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  },
);

// =====================
// ERROR HANDLER
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
