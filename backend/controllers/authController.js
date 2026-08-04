const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Semua field wajib diisi',
      });
    }

    // Check if email already exists
    const checkQuery = 'SELECT * FROM users WHERE email = ?';
    const [existingUsers] = await db.query(checkQuery, [email]);

    if (existingUsers.length > 0) {
      return res.status(400).json({
        message: 'Email sudah digunakan',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const insertQuery = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    await db.query(insertQuery, [name, email, hashedPassword]);

    return res.status(201).json({
      message: 'Register berhasil',
    });
  } catch (error) {
    console.error('[Auth Error] Register failed:', error.message);
    return res.status(500).json({
      message: 'Terjadi kesalahan pada server',
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email dan password wajib diisi',
      });
    }

    // Check user by email
    const query = 'SELECT * FROM users WHERE email = ?';
    const [users] = await db.query(query, [email]);

    // Email not found
    if (users.length === 0) {
      return res.status(400).json({
        message: 'Email tidak ditemukan',
      });
    }

    const user = users[0];

    // Check password match
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: 'Password salah',
      });
    }

    // Create JWT token
    const jwtSecret = process.env.JWT_SECRET || 'chatbot_secret_key';
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      jwtSecret,
      {
        expiresIn: '1d',
      }
    );

    return res.status(200).json({
      message: 'Login berhasil',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('[Auth Error] Login failed:', error.message);
    return res.status(500).json({
      message: 'Terjadi kesalahan pada server',
    });
  }
};
