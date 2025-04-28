// server/db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, '../data/db.sqlite'));

function run(sql, params=[]) { /* unchanged */ }
function get(sql, params=[]) { /* unchanged */ }
function all(sql, params=[]) { /* unchanged */ }

module.exports = {
  init: async () => {
    // existing tables...
    await run(`CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY, reg_no TEXT UNIQUE, name TEXT, email TEXT
    )`);
    await run(`CREATE TABLE IF NOT EXISTS lecturers (
      id INTEGER PRIMARY KEY, tsc_no TEXT UNIQUE, name TEXT
    )`);
    await run(`CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY, code TEXT UNIQUE, title TEXT
    )`);
    await run(`CREATE TABLE IF NOT EXISTS course_lecturers (
      id INTEGER PRIMARY KEY,
      course_id INTEGER,
      lecturer_id INTEGER,
      FOREIGN KEY(course_id) REFERENCES courses(id),
      FOREIGN KEY(lecturer_id) REFERENCES lecturers(id)
    )`);
    await run(`CREATE TABLE IF NOT EXISTS enrollments (
      id INTEGER PRIMARY KEY,
      student_id INTEGER,
      course_id INTEGER,
      FOREIGN KEY(student_id) REFERENCES students(id),
      FOREIGN KEY(course_id) REFERENCES courses(id)
    )`);
    await run(`CREATE TABLE IF NOT EXISTS evaluations (
      enrollment_id INTEGER PRIMARY KEY,
      completed BOOLEAN,
      completed_at DATETIME,
      FOREIGN KEY(enrollment_id) REFERENCES enrollments(id)
    )`);

    // NEW TABLES
    await run(`CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY,
      username TEXT UNIQUE,
      password TEXT
    )`);
    await run(`CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY,
      text TEXT,
      type TEXT   -- 'yesno' or 'likert'
    )`);
    await run(`CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY,
      enrollment_id INTEGER,
      question_id INTEGER,
      response TEXT,
      comment TEXT,
      created_at DATETIME,
      FOREIGN KEY(enrollment_id) REFERENCES enrollments(id),
      FOREIGN KEY(question_id) REFERENCES questions(id)
    )`);
    await run(`CREATE TABLE IF NOT EXISTS prints (
      id INTEGER PRIMARY KEY,
      student_id INTEGER UNIQUE,
      admin_id INTEGER,
      printed_at DATETIME,
      FOREIGN KEY(student_id) REFERENCES students(id),
      FOREIGN KEY(admin_id) REFERENCES admins(id)
    )`);
  },

  run, get, all,

  // STUDENT lookups
  getStudentByRegNo: reg_no => get('SELECT * FROM students WHERE reg_no=?',[reg_no]),

  // ADMIN lookup
  getAdminByUsername: username =>
    get('SELECT * FROM admins WHERE username=?',[username]),

  // QUESTIONS
  getAllQuestions: () => all('SELECT * FROM questions ORDER BY id'),

  // EVALUATION STATUS
  checkAllEvaluations: async student_id => {
    const rows = await all(`
      SELECT c.code,c.title,l.name AS lecturer,e.completed
      FROM enrollments en
      JOIN courses c ON en.course_id=c.id
      JOIN course_lecturers cl ON cl.course_id=c.id
      JOIN lecturers l ON cl.lecturer_id=l.id
      LEFT JOIN evaluations e ON e.enrollment_id=en.id
      WHERE en.student_id=?
    `,[student_id]);
    const pending = rows.filter(r=>!r.completed);
    return {
      allDone: pending.length===0,
      pending: pending.map(r=>({
        code:r.code,title:r.title,lecturer:r.lecturer
      }))
    };
  },

  // FEEDBACK
  clearFeedbackFor: enrollment_ids =>
    Promise.all(enrollment_ids.map(id=>
      run('DELETE FROM feedback WHERE enrollment_id=?',[id])
    )),

  saveFeedback: (enrollment_id, question_id, response, comment) =>
    run(`INSERT INTO feedback
      (enrollment_id,question_id,response,comment,created_at)
     VALUES (?,?,?,?,?)`,[
      enrollment_id,question_id,response,comment,new Date().toISOString()
    ]),

  markEvaluationDone: (enrollment_id) =>
    run(`INSERT OR REPLACE INTO evaluations
      (enrollment_id,completed,completed_at)
     VALUES (?,?,?)`,[
      enrollment_id,1,new Date().toISOString()
    ]),

  // ADMIN printing
  getPrintRecord: student_id =>
    get('SELECT * FROM prints WHERE student_id=?',[student_id]),

  recordPrint: (student_id, admin_id) =>
    run(`INSERT INTO prints (student_id,admin_id,printed_at)
      VALUES (?,?,?)`,[
      student_id,admin_id,new Date().toISOString()
    ]),

  // re-export other helpers as needed...
};