// server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to SQLite
const db = new sqlite3.Database('./db.sqlite3', (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to SQLite: db.sqlite3');
  }
});

// === API: Login ===
app.post('/api/login', (req, res) => {
  const { reg_no, password, role } = req.body;

  if (role === 'student') {
    const sql = `SELECT * FROM students WHERE email = ? AND password = ?`;
    db.get(sql, [reg_no, password], (err, row) => {
      if (err || !row) {
        return res.json({ success: false, message: 'Invalid credentials' });
      }
      res.json({
        success: true,
        role: 'student',
        student: {
          name: row.name,
          reg_no: row.reg_no,
          email: row.email
        }
      });
    });
  } else if (role === 'admin') {
    if (reg_no === 'admin123' && password === 'admin123') {
      res.json({ success: true, role: 'admin' });
    } else {
      res.json({ success: false, message: 'Invalid admin credentials' });
    }
  }
});

// === API: Get Courses for Student ===
app.get('/api/courses/:reg_no', (req, res) => {
  const regNo = req.params.reg_no;
  const sql = `SELECT c.code, c.title, l.name as lecturer 
               FROM courses c
               JOIN lecturers l ON c.lecturer_id = l.id
               JOIN enrollments e ON c.id = e.course_id
               WHERE e.student_reg_no = ?`;

  db.all(sql, [regNo], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// === API: Submit Evaluation ===
app.post('/api/evaluate', (req, res) => {
  const { reg_no, course_code, ratings } = req.body;
  // ratings: { "1": 5, "2": 4, ... }

  const stmt = db.prepare(`
    INSERT INTO evaluations (student_reg_no, course_code, question_id, rating)
    VALUES (?, ?, ?, ?)
  `);

  let inserted = 0;
  for (const [qid, rating] of Object.entries(ratings)) {
    stmt.run(reg_no, course_code, qid, rating, () => {
      inserted++;
      if (inserted === Object.keys(ratings).length) {
        stmt.finalize();
        res.json({ success: true });
      }
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});