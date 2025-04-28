const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'mocksecret', resave: false, saveUninitialized: true }));

app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', async (req, res) => {
  const { reg_no, password } = req.body;
  if (password !== 'password123') {
    return res.render('login', { error: 'Invalid credentials' });
  }
  const student = await db.getStudentByRegNo(reg_no);
  if (!student) {
    return res.render('login', { error: 'User not found' });
  }
  req.session.student = student;
  res.redirect('/dashboard');
});

app.get('/dashboard', async (req, res) => {
  if (!req.session.student) {
    return res.redirect('/login');
  }
  const status = await db.checkAllEvaluations(req.session.student.id);
  res.render('dashboard', { student: req.session.student, status });
});

// ADMIN login pages
app.get('/admin/login', (req,res)=> res.render('admin/login',{error:null}));
app.post('/admin/login', async(req,res)=>{
  const { username, password } = req.body;
  const admin = await db.getAdminByUsername(username);
  if(!admin || admin.password!==password) {
    return res.render('admin/login',{ error: 'Invalid credentials' });
  }
  req.session.admin = admin;
  res.redirect('/admin/dashboard');
});

// PROTECT admin routes
function requireAdmin(req,res,next){
  if(!req.session.admin) return res.redirect('/admin/login');
  next();
}

// ADMIN dashboard — list all students
app.get('/admin/dashboard', requireAdmin, async(req,res)=>{
  const students = await db.all(`SELECT * FROM students ORDER BY reg_no`);
  const data = await Promise.all(students.map(async s=>{
    const status = await db.checkAllEvaluations(s.id);
    const printRec = await db.getPrintRecord(s.id);
    return {
      ...s,
      total: status.pending.length + (status.allDone?0:0), // or count from enrollments
      pending: status.pending.length,
      allDone: status.allDone,
      printed: !!printRec
    };
  }));
  res.render('admin/dashboard',{ admin:req.session.admin, data });
});

// ADMIN view single student
app.get('/admin/student/:id', requireAdmin, async(req,res)=>{
  const sid = req.params.id;
  const student = await db.get('SELECT * FROM students WHERE id=?',[sid]);
  const status = await db.checkAllEvaluations(sid);
  const printed = !!(await db.getPrintRecord(sid));
  res.render('admin/student',{
    admin: req.session.admin,
    student,
    status,
    printed
  });
});

// ADMIN print action
app.post('/admin/student/:id/print', requireAdmin, async(req,res)=>{
  const sid = req.params.id;
  const printed = await db.getPrintRecord(sid);
  const status = await db.checkAllEvaluations(sid);
  if(printed || !status.allDone) {
    return res.redirect(`/admin/student/${sid}`);
  }
  // record & generate PDF
  await db.recordPrint(sid, req.session.admin.id);
  const html = await renderExamCard(await db.get('SELECT * FROM students WHERE id=?',[sid]));
  const pdf = await generatePDF(html);
  res.type('application/pdf').send(pdf);
});

// SHOW evaluation form (only pending)
app.get('/evaluate', async(req,res)=>{
  if(!req.session.student) return res.redirect('/login');
  const status = await db.checkAllEvaluations(req.session.student.id);
  if(status.allDone) return res.redirect('/dashboard');
  const enrolls = await db.all(`
    SELECT en.id, c.code, c.title, l.name AS lecturer
    FROM enrollments en
    JOIN courses c ON en.course_id=c.id
    JOIN course_lecturers cl ON cl.course_id=c.id
    JOIN lecturers l ON cl.lecturer_id=l.id
    LEFT JOIN evaluations e ON e.enrollment_id=en.id
    WHERE en.student_id=? AND (e.completed IS NULL OR e.completed=0)
  `,[req.session.student.id]);
  const questions = await db.getAllQuestions();
  res.render('evaluate',{ student:req.session.student, enrolls, questions });
});

app.post('/evaluate', async(req,res)=>{
  if(!req.session.student) return res.redirect('/login');
  // req.body will have something like:
  // responses[enrollment_id][question_id]=value
  // comment[enrollment_id]=text
  const responses = req.body.responses || {};
  const comments = req.body.comment || {};
  const enrollment_ids = Object.keys(responses);
  // clear old feedback
  await db.clearFeedbackFor(enrollment_ids);
  for(const eid of enrollment_ids){
    for(const qid in responses[eid]){
      const resp = responses[eid][qid];
      const cmt = comments[eid] || '';
      await db.saveFeedback(eid, qid, resp, cmt);
    }
    await db.markEvaluationDone(eid);
  }
  res.redirect('/dashboard');
});

app.post('/print', async (req, res) => {
  if (!req.session.student) {
    return res.redirect('/login');
  }
  const html = await renderExamCard(req.session.student);
  const pdfBuffer = await generatePDF(html);
  res.type('application/pdf');
  res.send(pdfBuffer);
});

async function renderExamCard(student) {
  const ejs = require('ejs');
  const fs = require('fs');
  const template = fs.readFileSync(__dirname + '/views/exam-card.ejs', 'utf8');
  return ejs.render(template, { student });
}

async function generatePDF(html) {
  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setContent(html);
  const pdf = await page.pdf({ format: 'A4' });
  await browser.close();
  return pdf;
}

app.listen(3000, () => console.log('Server listening on http://localhost:3000'));
