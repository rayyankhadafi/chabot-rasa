const express = require("express");
const fs = require("fs");
const config = require("../config");
const { getQrFilePath } = require("../utils/qrHandler");

/**
 * Creates Express application with health check and QR routes.
 * @returns {express.Application}
 */
function createExpressApp() {
  const app = express();

  app.get("/", (req, res) => {
    res.send("WhatsApp Bot Running");
  });

  app.get("/qr", (req, res) => {
    const qrPath = getQrFilePath();
    if (fs.existsSync(qrPath)) {
      res.sendFile(qrPath);
    } else {
      res.status(404).send("QR code not generated yet. Please wait...");
    }
  });

  return app;
}

/**
 * Starts Express HTTP server listening on configured port.
 * @returns {import("http").Server}
 */
function startServer() {
  const app = createExpressApp();
  return app.listen(config.port, () => {
    console.log(`[Server] Running on http://localhost:${config.port}`);
  });
}

module.exports = {
  createExpressApp,
  startServer,
};
