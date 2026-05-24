require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');

const app = express();
const authRoutes = require('./routes/authRoutes');

app.use(express.json());
app.use('/api/auth', authRoutes);

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'scan_system'
});

// CONNECT

db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
    return;
  }
  console.log('MySQL Connected');
});

app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await db.promise().query('SELECT 1 + 1 AS solution');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/patient/:id', (req, res) => {
  const idNumber = req.params.id;
  const sql = 'SELECT * FROM patients WHERE id_number = ?';

  db.query(sql, [idNumber], (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Database error'
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.json({
      success: true,
      patient: results[0]
    });
  });
});

app.use((req, res) => {
  res.status(404).send(`
    <h1>404 - Server Offline</h1>
  `);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});