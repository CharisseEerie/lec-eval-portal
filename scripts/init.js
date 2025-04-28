const db = require('../server/db');

(async () => {
  try {
    await db.run(`CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reg_no TEXT,
      name TEXT,
      email TEXT
    );`);

    await db.run(`CREATE TABLE IF NOT EXISTS lecturers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tsc_no TEXT,
      name TEXT
    );`);

    await db.run(`CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT,
      title TEXT
    );`);

    await db.run(`CREATE TABLE IF NOT EXISTS course_lecturers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_id INTEGER,
      lecturer_id INTEGER
    );`);

    await db.run(`CREATE TABLE IF NOT EXISTS enrollments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER,
      course_id INTEGER
    );`);

    await db.run(`CREATE TABLE IF NOT EXISTS evaluations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      enrollment_id INTEGER,
      completed INTEGER,
      completed_at TEXT
    );`);

    await db.run(`CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      evaluation_id INTEGER,
      question_id INTEGER,
      answer TEXT,
      comment TEXT
    );`);

    await db.run(`CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT,
      type TEXT
    );`);

    await db.run(`CREATE TABLE IF NOT EXISTS prints (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER,
      printed_by_admin_id INTEGER,
      printed_at TEXT
    );`);

    await db.run(`CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
      password TEXT
    );`);

    console.log('✅ Database initialized.');
  } catch (err) {
    console.error('🔴 Database initialization error:', err);
  } finally {
    process.exit(0);
  }
})();
