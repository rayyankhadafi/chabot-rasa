require("dotenv").config();
require("./config/db");

const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Configure CORS origins from environment variable or fallback defaults
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
  : ["http://localhost:5173", "https://chabot-rasa.vercel.app"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`[Backend] Server running on port ${PORT}`);
});
