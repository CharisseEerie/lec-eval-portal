const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database instance
const dbInstance = new sqlite3.Database(path.join(__dirname, '../data/db.sqlite'));

// Database methods
const db = {
  // Basic database operations
  run: function(sql, params = []) {
    return new Promise((resolve, reject) => {
      dbInstance.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve(this);
      });
    });
  },

  get: function(sql, params = []) {
    return new Promise((resolve, reject) => {
      dbInstance.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  all: function(sql, params = []) {
    return new Promise((resolve, reject) => {
      dbInstance.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  // Student operations
  getStudentByRegNo: function(reg_no) {
    return this.get('SELECT * FROM students WHERE reg_no = ?', [reg_no]);
  },

  // Admin operations
  getAdminByUsername: function(username) {
    return this.get('SELECT * FROM admins WHERE username = ?', [username]);
  },

  // Question operations
  getAllQuestions: function() {
    return this.all('SELECT * FROM questions ORDER BY id');
  },

  // Evaluation operations
  checkAllEvaluations: async function(student_id) {
    const rows = await this.all(`
      SELECT c.code, c.title, l.name AS lecturer, e.completed
      FROM enrollments en
      JOIN courses c ON en.course_id = c.id
      JOIN course_lecturers cl ON cl.course_id = c.id
      JOIN lecturers l ON cl.lecturer_id = l.id
      LEFT JOIN evaluations e ON e.enrollment_id = en.id
      WHERE en.student_id = ?
    `, [student_id]);
    
    const pending = rows.filter(r => !r.completed);
    return {
      allDone: pending.length === 0,
      pending: pending.map(r => ({
        code: r.code,
        title: r.title,
        lecturer: r.lecturer
      }))
    };
  },

  // Feedback operations
  clearFeedbackFor: function(enrollment_ids) {
    if (!enrollment_ids.length) return Promise.resolve();
    const placeholders = enrollment_ids.map(() => '?').join(',');
    return this.run(
      `DELETE FROM feedback WHERE enrollment_id IN (${placeholders})`, 
      enrollment_ids
    );
  },

  saveFeedback: function(enrollment_id, question_id, response, comment) {
    return this.run(
      `INSERT INTO feedback (enrollment_id, question_id, response, comment) 
       VALUES (?, ?, ?, ?)`,
      [enrollment_id, question_id, response, comment]
    );
  },

  markEvaluationDone: function(enrollment_id) {
    return this.run(
      `INSERT OR REPLACE INTO evaluations 
       (enrollment_id, completed, completed_at) 
       VALUES (?, 1, CURRENT_TIMESTAMP)`,
      [enrollment_id]
    );
  },

  // Print operations
  getPrintRecord: function(student_id) {
    return this.get('SELECT * FROM prints WHERE student_id = ?', [student_id]);
  },

  recordPrint: function(student_id, admin_id) {
    return this.run(
      `INSERT INTO prints (student_id, admin_id) VALUES (?, ?)`,
      [student_id, admin_id]
    );
  },

  // Database initialization
  init: async function() {
    try {
      await this.run(`CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        reg_no TEXT UNIQUE NOT NULL, 
        name TEXT NOT NULL, 
        email TEXT NOT NULL
      )`);

      await this.run(`CREATE TABLE IF NOT EXISTS lecturers (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        tsc_no TEXT UNIQUE NOT NULL, 
        name TEXT NOT NULL,
        department TEXT
      )`);

      await this.run(`CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        code TEXT UNIQUE NOT NULL, 
        title TEXT NOT NULL,
        credits INTEGER DEFAULT 3
      )`);

      await this.run(`CREATE TABLE IF NOT EXISTS course_lecturers (
        course_id INTEGER NOT NULL,
        lecturer_id INTEGER NOT NULL,
        PRIMARY KEY (course_id, lecturer_id),
        FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE,
        FOREIGN KEY(lecturer_id) REFERENCES lecturers(id) ON DELETE CASCADE
      )`);

      await this.run(`CREATE TABLE IF NOT EXISTS enrollments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        course_id INTEGER NOT NULL,
        UNIQUE(student_id, course_id),
        FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE,
        FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE
      )`);

      await this.run(`CREATE TABLE IF NOT EXISTS evaluations (
        enrollment_id INTEGER PRIMARY KEY,
        completed BOOLEAN DEFAULT 0,
        completed_at DATETIME,
        FOREIGN KEY(enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE
      )`);

      await this.run(`CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT
      )`);

      await this.run(`CREATE TABLE IF NOT EXISTS questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('yesno', 'likert')),
        category TEXT
      )`);

      await this.run(`CREATE TABLE IF NOT EXISTS feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        enrollment_id INTEGER NOT NULL,
        question_id INTEGER NOT NULL,
        response TEXT NOT NULL,
        comment TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE,
        FOREIGN KEY(question_id) REFERENCES questions(id) ON DELETE CASCADE
      )`);

      await this.run(`CREATE TABLE IF NOT EXISTS prints (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER UNIQUE NOT NULL,
        admin_id INTEGER NOT NULL,
        printed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE,
        FOREIGN KEY(admin_id) REFERENCES admins(id) ON DELETE CASCADE
      )`);

      console.log('Database tables initialized successfully');
    } catch (err) {
      console.error('Database initialization failed:', err);
      throw err;
    }
  }
};

module.exports = db;