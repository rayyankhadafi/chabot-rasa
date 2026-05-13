require("dotenv").config();
require("./config/db");

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(
  cors({
    origin: "https://chabot-rasa.vercel.app",
  }),
);

app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API Running");
});

// WEBHOOK VERIFY
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "rayy321";

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
  console.log("WEBHOOK VERIFIED");

  return res.status(200).send(challenge);
    }

    return res.sendStatus(403);
  });

const PORT = process.env.PORT || 8000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
