const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, '../data/db.sqlite'));

function run(sql, params=[]) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function get(sql, params=[]) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function all(sql, params=[]) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

module.exports = {
  init: async () => {
    await run(\`CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY,
      portal_id TEXT UNIQUE,
      name TEXT,
      email TEXT
    )\`);
    await run(\`CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY,
      code TEXT,
      title TEXT,
      semester TEXT
    )\`);
    await run(\`CREATE TABLE IF NOT EXISTS enrollments (
      id INTEGER PRIMARY KEY,
      student_id INTEGER,
      course_id INTEGER
    )\`);
    await run(\`CREATE TABLE IF NOT EXISTS evaluations (
      enrollment_id INTEGER PRIMARY KEY,
      completed BOOLEAN,
      completed_at DATETIME
    )\`);
  },
  run,
  get,
  all,
  getStudentByPortalID: async portal_id => {
    return get('SELECT * FROM students WHERE portal_id = ?', [portal_id]);
  },
  checkAllEvaluations: async student_id => {
    const courses = await all(\`
      SELECT c.code, c.title, e.completed
      FROM enrollments en
      JOIN courses c ON en.course_id = c.id
      LEFT JOIN evaluations e ON e.enrollment_id = en.id
      WHERE en.student_id = ?
    \`, [student_id]);
    const pending = courses.filter(c => !c.completed);
    return { allDone: pending.length === 0, pending };
  }
};
