const db = require('../config/db')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // cek email kosong
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Semua field wajib diisi'
      })
    }

    // cek email sudah ada atau belum
    const checkQuery = 'SELECT * FROM users WHERE email = ?'

    db.query(checkQuery, [email], async (err, result) => {
      if (err) {
        return res.status(500).json(err)
      }

      if (result.length > 0) {
        return res.status(400).json({
          message: 'Email sudah digunakan'
        })
      }

      // hash password
      const hashedPassword = await bcrypt.hash(password, 10)

      // simpan user
      const insertQuery =
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)'

      db.query(
        insertQuery,
        [name, email, hashedPassword],
        (err, result) => {
          if (err) {
            return res.status(500).json(err)
          }

          res.status(201).json({
            message: 'Register berhasil'
          })
        }
      )
    })
  } catch (error) {
    res.status(500).json(error)
  }
}

exports.login = async (req, res) => {
  try {

    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email dan password wajib diisi'
      })
    }

    // cek email
    const query =
      'SELECT * FROM users WHERE email = ?'

    db.query(query, [email], async (err, result) => {

      if (err) {
        return res.status(500).json(err)
      }

      // email tidak ditemukan
      if (result.length === 0) {
        return res.status(400).json({
          message: 'Email tidak ditemukan'
        })
      }

      const user = result[0]

      // cek password
      const isMatch = await bcrypt.compare(
        password,
        user.password
      )

      if (!isMatch) {
        return res.status(400).json({
          message: 'Password salah'
        })
      }

      // buat JWT token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email
        },
        'chatbot_secret_key',
        {
          expiresIn: '1d'
        }
      )

      res.status(200).json({
        message: 'Login berhasil',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      })

    })

  } catch (error) {
    res.status(500).json(error)
  }
}
