const { Client, LocalAuth } = require("whatsapp-web.js");
const config = require("../config");
const { generateQrHtml } = require("../utils/qrHandler");
const MessageDeduplicator = require("../utils/deduplicator");
const { sendMessageToRasa } = require("./rasaService");

/**
 * Initializes and configures the WhatsApp Web client instance.
 * @returns {Client} Instantiated whatsapp-web.js Client
 */
function createWhatsAppClient() {
  const puppeteerOptions = {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--single-process",
      "--no-zygote",
    ],
  };

  if (config.puppeteerExecutablePath) {
    puppeteerOptions.executablePath = config.puppeteerExecutablePath;
  }

  const client = new Client({
    authStrategy: new LocalAuth({
      clientId: config.clientId,
      dataPath: config.dataPath,
    }),
    puppeteer: puppeteerOptions,
  });

  const deduplicator = new MessageDeduplicator(config.messageCacheTimeMs);

  // QR Code event
  client.on("qr", async (qr) => {
    await generateQrHtml(qr);
    console.log("[WhatsApp] Scan QR Code via web interface (/qr)");
  });

  // Ready event
  client.on("ready", () => {
    console.log("[WhatsApp] Client is ready!");
  });

  // Authentication events
  client.on("authenticated", () => {
    console.log("[WhatsApp] Authenticated successfully.");
  });

  client.on("auth_failure", (msg) => {
    console.error("[WhatsApp] Authentication failed:", msg);
  });

  // Disconnection event
  client.on("disconnected", async (reason) => {
    console.warn("[WhatsApp] Disconnected:", reason);

    try {
      await client.destroy();
    } catch (e) {
      console.error("[WhatsApp Error] Destroy error:", e.message);
    }

    if (reason !== "LOGOUT") {
      console.log(`[WhatsApp] Reconnecting in ${config.reconnectDelayMs / 1000}s...`);
      setTimeout(() => {
        client.initialize();
      }, config.reconnectDelayMs);
    }
  });

  // Incoming Message event
  client.on("message", async (message) => {
    try {
      if (message.fromMe || message.isStatus) {
        return;
      }

      const messageId = message.id.id;
      if (deduplicator.isDuplicate(messageId)) {
        console.log("[WhatsApp] Duplicate ignored:", message.body);
        return;
      }

      console.log(`[WhatsApp] Incoming message from ${message.from}: ${message.body}`);

      const botReply = await sendMessageToRasa(message.from, message.body);

      if (botReply) {
        await message.reply(botReply);
        console.log(`[WhatsApp] Sent reply to ${message.from}`);
      }
    } catch (err) {
      console.error("[WhatsApp Error] Message handling error:", err.message);
    }
  });

  return client;
}

module.exports = {
  createWhatsAppClient,
};
