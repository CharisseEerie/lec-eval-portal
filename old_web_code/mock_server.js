const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for Flutter app
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

// Mock database
const mockStudents = [
  { id: 1, reg_no: 'ABC123/2021', name: 'John Doe', email: 'john@student.ku.ac.ke' },
  { id: 2, reg_no: 'DEF456/2021', name: 'Jane Smith', email: 'jane@student.ku.ac.ke' },
  { id: 3, reg_no: 'GHI789/2021', name: 'Mike Johnson', email: 'mike@student.ku.ac.ke' },
  { id: 4, reg_no: '121/6574/2021', name: 'Charissa Sarah', email: 'charissa@student.ku.ac.ke' }
];

// Mock login endpoint - matches your Express server format
app.post('/login', (req, res) => {
  const { reg_no, password } = req.body;
  
  console.log('📱 Login attempt:', { reg_no, password });
  
  // Check if student exists and password is correct
  const student = mockStudents.find(s => s.reg_no === reg_no);
  
  if (student && password === 'password123') {
    // Successful login - return 200 status
    console.log('✅ Login successful for:', student.name);
    res.status(200).send('Login successful');
  } else {
    // Failed login
    console.log('❌ Login failed for:', reg_no);
    res.status(401).send('Invalid credentials');
  }
});

// Mock dashboard endpoint
app.get('/dashboard', (req, res) => {
  res.json({
    student: mockStudents[0],
    courses: [
      { code: 'PHY101', title: 'Physics Introduction', lecturer: 'Dr. Matthew Munji', evaluation_done: false },
      { code: 'MTH101', title: 'Mathematics Basics', lecturer: 'Dr. Jane Maina', evaluation_done: true },
      { code: 'CSC101', title: 'Computer Science', lecturer: 'Prof. James Kamau', evaluation_done: false }
    ],
    allDone: false
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'KU Lecturer Evaluation Mock Server',
    endpoints: {
      login: 'POST /login',
      dashboard: 'GET /dashboard'
    },
    test_users: mockStudents.map(s => ({ reg_no: s.reg_no, password: 'password123' }))
  });
});

// Start mock server
const PORT = 3000;
app.listen(PORT, () => {
  console.log('🚀 Mock server running on http://localhost:' + PORT);
  console.log('📋 Available test users:');
  mockStudents.forEach(student => {
    console.log(`   📝 Reg No: ${student.reg_no}, Password: password123`);
  });
  console.log('🔗 Test the server: http://localhost:3000/');
});