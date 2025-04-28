// server/db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, '../data/db.sqlite'));

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}
function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}
function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

module.exports = {
  init: async () => {
    // students
    await run(`CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY,
      reg_no TEXT UNIQUE,
      name TEXT,
      email TEXT
    )`);
    // lecturers
    await run(`CREATE TABLE IF NOT EXISTS lecturers (
      id INTEGER PRIMARY KEY,
      tsc_no TEXT UNIQUE,
      name TEXT
    )`);
    // courses
    await run(`CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY,
      code TEXT UNIQUE,
      title TEXT
    )`);
    // course→lecturer assignment
    await run(`CREATE TABLE IF NOT EXISTS course_lecturers (
      id INTEGER PRIMARY KEY,
      course_id INTEGER,
      lecturer_id INTEGER,
      FOREIGN KEY(course_id) REFERENCES courses(id),
      FOREIGN KEY(lecturer_id) REFERENCES lecturers(id)
    )`);
    // enrollments
    await run(`CREATE TABLE IF NOT EXISTS enrollments (
      id INTEGER PRIMARY KEY,
      student_id INTEGER,
      course_id INTEGER,
      FOREIGN KEY(student_id) REFERENCES students(id),
      FOREIGN KEY(course_id) REFERENCES courses(id)
    )`);
    // evaluations
    await run(`CREATE TABLE IF NOT EXISTS evaluations (
      enrollment_id INTEGER PRIMARY KEY,
      completed BOOLEAN,
      completed_at DATETIME,
      FOREIGN KEY(enrollment_id) REFERENCES enrollments(id)
    )`);
  },

  run, get, all,

  // existing helpers
  getStudentByRegNo: async reg_no =>
    get('SELECT * FROM students WHERE reg_no = ?', [reg_no]),

  checkAllEvaluations: async student_id => {
    const rows = await all(`
      SELECT c.code, c.title, l.name as lecturer, e.completed
      FROM enrollments en
      JOIN courses c ON en.course_id = c.id
      JOIN course_lecturers cl ON cl.course_id = c.id
      JOIN lecturers l ON cl.lecturer_id = l.id
      LEFT JOIN evaluations e ON e.enrollment_id = en.id
      WHERE en.student_id = ?
    `, [student_id]);

    const pending = rows.filter(r => !r.completed);
    return { allDone: pending.length === 0, pending: pending.map(r => ({
      code: r.code, title: r.title, lecturer: r.lecturer
    })) };
  }
};
