const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Token tidak tersedia",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,

      "chatbot_secret_key",
    );

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(403).json({
      message: "Token tidak valid",
    });
  }
};

module.exports = verifyToken;
