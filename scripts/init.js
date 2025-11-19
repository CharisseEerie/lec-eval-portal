const db = require('../server/db');
const fs = require('fs');

(async () => {
  try {
    await db.run(`CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reg_no TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL
    )`);

    await db.run(`CREATE TABLE IF NOT EXISTS lecturers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tsc_no TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      department TEXT
    )`);

    await db.run(`CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL
    )`);

    await db.run(`CREATE TABLE IF NOT EXISTS course_lecturers (
      course_id INTEGER REFERENCES courses(id),
      lecturer_id INTEGER REFERENCES lecturers(id),
      PRIMARY KEY (course_id, lecturer_id)
    )`);

    await db.run(`CREATE TABLE IF NOT EXISTS enrollments (
      student_id INTEGER REFERENCES students(id),
      course_id INTEGER REFERENCES courses(id),
      PRIMARY KEY (student_id, course_id)
    )`);

    await db.run(`CREATE TABLE IF NOT EXISTS evaluations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      enrollment_id INTEGER,
      completed INTEGER,
      completed_at TEXT
    )`);

    await db.run(`CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      evaluation_id INTEGER,
      question_id INTEGER,
      answer TEXT,
      comment TEXT
    )`);

    await db.run(`CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT,
      type TEXT
    )`);

    await db.run(`CREATE TABLE IF NOT EXISTS prints (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER UNIQUE REFERENCES students(id),
      printed_by INTEGER REFERENCES admins(id),
      printed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    await db.run(`CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )`);

    console.log('✅ Database schema initialized');
  } catch (err) {
    console.error('🔴 Initialization error:', err);
  } finally {
    process.exit();
  }
})();