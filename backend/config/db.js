const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");

const certPath = path.join(__dirname, "./certs/ca.pem");

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "chatbot",
  port: Number(process.env.DB_PORT) || 3306,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 60000,
};

// Optional SSL certificate support (Aiven Cloud MySQL)
if (fs.existsSync(certPath)) {
  dbConfig.ssl = {
    ca: fs.readFileSync(certPath),
  };
}

const pool = mysql.createPool(dbConfig);

const createUsersTableQuery = `
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

// Verify connection and auto-create users table if it does not exist
pool.getConnection((err, connection) => {
  if (err) {
    console.error("[Database Error] MySQL Connection Failed:", err.message);
  } else {
    console.log("[Database] MySQL Connected successfully.");
    connection.query(createUsersTableQuery, (tableErr) => {
      if (tableErr) {
        console.error("[Database Error] Failed to initialize 'users' table:", tableErr.message);
      } else {
        console.log("[Database] Table 'users' verified and ready.");
      }
      connection.release();
    });
  }
});

// Export Promise-based pool for clean async/await usage
module.exports = pool.promise();
