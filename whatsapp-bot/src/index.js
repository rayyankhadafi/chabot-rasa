const { startServer } = require("./server/expressServer");
const { createWhatsAppClient } = require("./services/whatsappService");

// Start HTTP server
const server = startServer();

// Start WhatsApp Client
const client = createWhatsAppClient();

// Unhandled error handlers
process.on("unhandledRejection", (err) => {
  console.error("[Process Error] Unhandled Rejection:", err);
});

process.on("uncaughtException", (err) => {
  console.error("[Process Error] Uncaught Exception:", err);
});

// Graceful shutdown handling
const shutdown = async (signal) => {
  console.log(`[Process] Received ${signal}. Closing gracefully...`);
  try {
    if (client) {
      await client.destroy();
    }
  } catch (e) {
    console.error("[Process Error] Error destroying WhatsApp client:", e.message);
  } finally {
    server.close(() => {
      console.log("[Process] HTTP Server closed.");
      process.exit(0);
    });
  }
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

// Initialize client
client.initialize();
