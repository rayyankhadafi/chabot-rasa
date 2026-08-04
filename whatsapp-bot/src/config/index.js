const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

module.exports = {
  port: process.env.PORT || 3000,
  rasaUrl: process.env.RASA_URL || "http://localhost:5005/webhooks/rest/webhook",
  clientId: process.env.CLIENT_ID || "priva-bot",
  dataPath: process.env.DATA_PATH || path.resolve(__dirname, "../../.wwebjs_auth"),
  puppeteerExecutablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
  reconnectDelayMs: 5000,
  messageCacheTimeMs: 60000,
};
