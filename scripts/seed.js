const db = require('../server/db');
(async () => {
  await db.init();
  // Students
  await db.run('DELETE FROM students');
  await db.run('INSERT INTO students (portal_id, name, email) VALUES (?, ?, ?)', ['stu001', 'Alice', 'alice@school.ac.ke']);
  await db.run('INSERT INTO students (portal_id, name, email) VALUES (?, ?, ?)', ['stu002', 'Bob', 'bob@school.ac.ke']);
  // Courses
  await db.run('DELETE FROM courses');
  const courses = [
    ['MATH101','Calculus I','2025-S1'],
    ['CS102','Intro to CS','2025-S1'],
    ['ENG201','Academic Writing','2025-S1']
  ];
  for(const [code,title,sem] of courses) {
    await db.run('INSERT INTO courses (code, title, semester) VALUES (?, ?, ?)', [code,title,sem]);
  }
  // Enrollments
  await db.run('DELETE FROM enrollments');
  const enrollments = [[1,1],[1,2],[1,3],[2,1],[2,2],[2,3]];
  for(const [stud,course] of enrollments) {
    await db.run('INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)', [stud,course]);
  }
  // Evaluations
  await db.run('DELETE FROM evaluations');
  const evals = [
    [1,1,true,'2025-04-01 10:00:00'],
    [2,2,true,'2025-04-02 11:00:00'],
    [3,3,true,'2025-04-03 12:00:00'],
    [4,4,true,'2025-04-05 09:00:00']
  ];
  for(const [en, , comp, date] of evals) {
    await db.run('INSERT INTO evaluations (enrollment_id, completed, completed_at) VALUES (?, ?, ?)', [en,comp ? 1 : 0, date]);
  }
  console.log('Database seeded.');
  process.exit(0);
})();