require("dotenv").config();
require('./config/db')

const express = require("express");
const cors = require("cors");

const authRoutes = require('./routes/authRoutes')


const app = express();

app.use(
  cors({
    origin: "https://chabot-rasa.vercel.app",
  }),
);
app.use(express.json());

app.use('/api/auth', authRoutes)

app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
