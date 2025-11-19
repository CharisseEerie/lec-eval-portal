// lib/services/mock_database.dart
class MockDatabase {
  static final MockDatabase instance = MockDatabase._();
  MockDatabase._();

  // 20 REALISTIC KU STUDENTS — 3 for live demo, 17 to fill the screen
  List<Map<String, dynamic>> students = [
    // === 3 STUDENTS YOU WILL LOGIN TO LIVE ===
    {
      'id': '1',
      'name': 'Charissa Sarah A.',
      'regNo': 'I21/6574/2021',
      'email': 'I21/6574/2021@students.ku.ac.ke',
      'password': 'password123',
      'completedCount': 0,
      'totalCourses': 8,
      'hasRequested': false,
      'approved': false,
    },
    {
      'id': '2',
      'name': 'Kelvin Omondi',
      'regNo': 'K22/8901/2022',
      'email': 'K22/8901/2022@students.ku.ac.ke',
      'password': 'password123',
      'completedCount': 0,
      'totalCourses': 8,
      'hasRequested': false,
      'approved': false,
    },
    {
      'id': '3',
      'name': 'Fatuma Ali',
      'regNo': 'F21/3456/2021',
      'email': 'F21/3456/2021@students.ku.ac.ke',
      'password': 'password123',
      'completedCount': 0,
      'totalCourses': 8,
      'hasRequested': false,
      'approved': false,
    },

    // === 17 MORE TO FILL THE SCREEN (already completed or in progress) ===
    {'id': '4',  'name': 'Brian Otieno',      'regNo': 'B22/1122/2022', 'completedCount': 8, 'totalCourses': 8, 'hasRequested': true,  'approved': true},
    {'id': '5',  'name': 'Aisha Mohammed',    'regNo': 'A21/3344/2021', 'completedCount': 8, 'totalCourses': 8, 'hasRequested': true,  'approved': true},
    {'id': '6',  'name': 'Victor Kimani',     'regNo': 'V22/5566/2022', 'completedCount': 8, 'totalCourses': 8, 'hasRequested': true,  'approved': false},
    {'id': '7',  'name': 'Grace Wambui',      'regNo': 'G21/7788/2021', 'completedCount': 7, 'totalCourses': 8, 'hasRequested': false, 'approved': false},
    {'id': '8',  'name': 'Samuel Njoroge',    'regNo': 'S22/9900/2022', 'completedCount': 8, 'totalCourses': 8, 'hasRequested': true,  'approved': true},
    {'id': '9',  'name': 'Linet Chepkoech',   'regNo': 'L21/2233/2021', 'completedCount': 5, 'totalCourses': 8, 'hasRequested': false, 'approved': false},
    {'id': '10', 'name': 'David Muthomi',     'regNo': 'D22/4455/2022', 'completedCount': 8, 'totalCourses': 8, 'hasRequested': true,  'approved': false},
    {'id': '11', 'name': 'Mercy Wangari',     'regNo': 'M21/6677/2021', 'completedCount': 8, 'totalCourses': 8, 'hasRequested': true,  'approved': true},
    {'id': '12', 'name': 'Esther Njeri',      'regNo': 'E22/8899/2022', 'completedCount': 6, 'totalCourses': 8, 'hasRequested': false, 'approved': false},
    {'id': '13', 'name': 'Paul Kipchumba',    'regNo': 'P21/0011/2021', 'completedCount': 8, 'totalCourses': 8, 'hasRequested': true,  'approved': true},
    {'id': '14', 'name': 'Sarah Akinyi',      'regNo': 'S22/2233/2022', 'completedCount': 8, 'totalCourses': 8, 'hasRequested': true,  'approved': false},
    {'id': '15', 'name': 'James Mwangi',      'regNo': 'J21/4455/2021', 'completedCount': 4, 'totalCourses': 8, 'hasRequested': false, 'approved': false},
    {'id': '16', 'name': 'Beatrice Wanjiku',  'regNo': 'B22/6677/2022', 'completedCount': 8, 'totalCourses': 8, 'hasRequested': true,  'approved': true},
    {'id': '17', 'name': 'Isaac Kiptoo',       'regNo': 'I21/8899/2021', 'completedCount': 8, 'totalCourses': 8, 'hasRequested': true,  'approved': false},
    {'id': '18', 'name': 'Naomi Cherotich',   'regNo': 'N22/1122/2022', 'completedCount': 8, 'totalCourses': 8, 'hasRequested': true,  'approved': true},
    {'id': '19', 'name': 'Timothy Ochieng',   'regNo': 'T21/3344/2021', 'completedCount': 2, 'totalCourses': 8, 'hasRequested': false, 'approved': false},
    {'id': '20', 'name': 'Joyce Muthoni',     'regNo': 'J22/5566/2022', 'completedCount': 8, 'totalCourses': 8, 'hasRequested': true,  'approved': true},
  ];

  // Call this when a student finishes all 8 evaluations
  void completeAllEvaluations(String studentId) {
    final student = students.firstWhere((s) => s['id'] == studentId);
    student['completedCount'] = 8;
    student['hasRequested'] = true;
  }

  // Call this when admin approves
  void approveRequest(String studentId) {
    final student = students.firstWhere((s) => s['id'] == studentId);
    student['approved'] = true;
  }
}