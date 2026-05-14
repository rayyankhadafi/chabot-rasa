const qrcode = require("qrcode-terminal");

const {Client} = require("whatsapp-web.js");

const axios = require("axios");

const client = new Client();

client.on("qr", (qr) => {
  qrcode.generate(qr, {
    small: true,
  });

  console.log("Scan QR WhatsApp");
});

client.on("ready", () => {
  console.log("WhatsApp Bot Ready!");
});

client.on("message", async (message) => {
  try {
    const response = await axios.post(
      "https://chabot-rasa-production.up.railway.app/webhooks/rest/webhook",
      {
        sender: message.from,
        message: message.body,
      },
    );

    const rasaMessages = response.data;

    if (rasaMessages.length > 0) {
      for (const msg of rasaMessages) {
        if (msg.text) {
          await message.reply(msg.text);
        }
      }
    }
  } catch (error) {
    console.log(error.message);
  }
});

client.initialize();
