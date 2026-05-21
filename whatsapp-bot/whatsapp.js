const qrcode = require("qrcode-terminal");

const axios = require("axios");

const {Client, LocalAuth} = require("whatsapp-web.js");

const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "railway-whatsapp",
  }),

  puppeteer: {
    headless: true,

    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,

    args: [
      "--no-sandbox",

      "--disable-setuid-sandbox",

      "--disable-dev-shm-usage",

      "--disable-gpu",

      "--single-process"
    ],
  },
});

// =====================
// QR LOGIN
// =====================

client.on("qr", (qr) => {
  qrcode.generate(qr, {
    small: true,
  });

  console.log("Scan QR WhatsApp");
});

// =====================
// READY
// =====================

client.on("ready", () => {
  console.log("WhatsApp Bot Ready!");
});

// =====================
// AUTH SUCCESS
// =====================

client.on("authenticated", () => {
  console.log("WhatsApp authenticated");
});

// =====================
// AUTH FAILED
// =====================

client.on("auth_failure", (msg) => {
  console.log("Auth failed:", msg);
});

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
      console.log("Destroy error:", err.message);
    }

    console.log("Reconnecting in 5s...");

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
      // abaikan pesan bot sendiri
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
      console.log("Message Error:", error.message);
    }
  },
);

// =====================
// GLOBAL ERROR
// =====================

process.on(
  "unhandledRejection",

  (error) => {
    console.log("Unhandled:", error);
  },
);

process.on(
  "uncaughtException",

  (error) => {
    console.log("Exception:", error);
  },
);

// =====================
// START
// =====================

client.initialize();
