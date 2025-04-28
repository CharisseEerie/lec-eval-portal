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
  const { portal_id, password } = req.body;
  if (password !== 'password123') {
    return res.render('login', { error: 'Invalid credentials' });
  }
  const student = await db.getStudentByPortalID(portal_id);
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
