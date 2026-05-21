const qrcode = require("qrcode-terminal");

const axios = require("axios");

const {Client, LocalAuth} = require("whatsapp-web.js");

const client = new Client({
  authStrategy: new LocalAuth(),

  puppeteer: {
    headless: true,

    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,

    args: [
      "--no-sandbox",

      "--disable-setuid-sandbox",

      "--disable-dev-shm-usage",

      "--disable-gpu",
    ],
  },
});

client.on("qr", (qr) => {
  qrcode.generate(qr, {small: true});

  console.log("Scan QR WhatsApp");
});

client.on("ready", () => {
  console.log("WhatsApp Bot Ready!");
});

client.on("authenticated", () => {
  console.log("WhatsApp authenticated");
});

client.on("auth_failure", (msg) => {
  console.log("Auth failed:", msg);
});

client.on("disconnected", (reason) => {
  console.log("Disconnected:", reason);
});

client.on("message", async (message) => {
  try {
    // abaikan pesan dari bot sendiri
    if (message.fromMe) return;

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
    console.log("Error:", error.message);
  }
});

client.initialize();
