const db = require('../server/db');

function shuffle(array) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

(async () => {
  try {
    console.log('🚀 Starting database seeding...');
    
    // Initialize database
    await db.init();
    
    // Clear existing data safely
    const tables = [
      'feedback', 'prints', 'evaluations', 'enrollments',
      'course_lecturers', 'courses', 'lecturers', 'students', 'questions', 'admins'
    ];

    console.log('🧹 Clearing existing data:');
    for (const [index, tbl] of tables.entries()) {
      try {
        process.stdout.write(`  ▸ ${tbl.padEnd(20)} (${index+1}/${tables.length})\r`);
        await db.run(`DELETE FROM ${tbl}`);
      } catch (err) {
        if (!err.message.includes('no such table')) continue;
      }
    }
    console.log('\n✔ Database cleared successfully\n');

    // Seed students
    const students = [
      ['I21/6447/2021','CHARISSE SARAH A.'],
      ['I21/7654/2021','ALVIN KIPRONO SAMINI'],
      ['I21/9876/2021','ELVIS KIMANI MWANGI'],
      ['I21/1234/2021','MARVIN WAINANA'],
      ['I21/4321/2021','ZACHARIAH SAM'],
      ['A24/2857/2021','NAYFEEN NAJIM OMAR'],
      ['A2476/2859/2021','GICHURE FAITH IRENE WAIRIMU'],
      ['K24/2860/2021','KARUOYA MERCY MUTHONI'],
      ['K24/2861/2021','MBUTO JULIAN WAMBUGU'],
      ['A2476/2862/2021','KAMONJO KEZIA NJERI'],
      ['K24/2863/2021','MUNGAI CHRISTINE WAIRIMU'],
      ['A24/2864/2021','WAWERU MICHELLE WANJIRU'],
      ['A24/2865/2021','WAMBUI ELIZABETH WANJIRU'],
      ['A24/2866/2021','NGANGA IAN WAITHAKA'],
      ['A24/2867/2021','NDUNG\'U ERIC P. KIBOCHO'],
      ['A24/2868/2021','FARDOSA KHALIF ABDI'],
      ['A24/2869/2021','DORCAS CHEPKORIR'],
      ['A24/2870/2021','MURATHA VIRGINIA WAIRIMU'],
      ['A24/2871/2021','MUKIRI FELISTUS M. WANJIRU'],
      ['A24/2872/2021','KIRIMI DAWN KAWIRIA'],
      ['A24/2873/2021','VIOLAH NEKESA MAYENGA'],
      ['A24/2874/2021','NGOVI ABIGAEL NZEMBI'],
      ['A24/2875/2021','NICOLE KENYA MUINDI'],
      ['A24/2876/2021','LINYANGE JESCA MWENDWA'],
      ['F18/2281/2021','ZAKARIA DEROW ABDULLAHI F'],
      ['F18/2282/2021','NGALA OMAR KARISA'],
      ['F18/2283/2021','MUTUKU DENNIS MUTINDA'],
      ['F18/2284/2021','KINUTHIA ERIC NDUNGU'],
      ['F18/2285/2021','GITONGA PAUL NYARE']
    ];

    console.log(`🎓 Seeding ${students.length} students:`);
    for (const [i, [reg, name]] of students.entries()) {
      const email = `${reg.toLowerCase().replace(/\//g,'.')}@students.ku.ac.ke`;
      process.stdout.write(`  ▸ ${reg.padEnd(12)} ${name.padEnd(25)} (${i+1}/${students.length})\r`);
      await db.run('INSERT INTO students (reg_no,name,email) VALUES (?,?,?)', [reg, name, email]);
    }
    console.log('\n✔ Students seeded successfully\n');

    // Seed lecturers
    const lecturers = [
      ['TSC/10001','Dr. Amina Mwende', 'Computer Science'],
      ['TSC/10002','Prof. John Otieno', 'Mathematics'],
      ['TSC/10003','Dr. Mary Njeri', 'Biological Sciences'],
      ['TSC/10004','Dr. James Kimani', 'Economics'],
      ['TSC/10005','Dr. Lucy Wanjiku', 'Psychology'],
      ['TSC/10006','Prof. Michael Thompson', 'Education'],
      ['TSC/10007','Dr. Sarah Johnson', 'Hospitality'],
      ['TSC/10008','Prof. David Brown', 'Environmental Science'],
      ['TSC/10009','Dr. Angela Mwangi', 'Medicine'],
      ['TSC/10010','Dr. Robert Smith', 'Engineering']
    ];

    console.log(`👨‍🏫 Seeding ${lecturers.length} lecturers:`);
    const lectIdByTsc = {};
    for (const [i, [tsc, name, dept]] of lecturers.entries()) {
      process.stdout.write(`  ▸ ${tsc.padEnd(10)} ${name.padEnd(25)} (${dept})\r`);
      await db.run('INSERT INTO lecturers (tsc_no,name,department) VALUES (?,?,?)', [tsc, name, dept]);
      const row = await db.get('SELECT last_insert_rowid() as id');
      lectIdByTsc[tsc] = row.id;
    }
    console.log('\n✔ Lecturers seeded successfully\n');

    // Seed courses
    const courses = [
      ['CS101','Introduction to Computer Science', 3],
      ['CS102','Data Structures & Algorithms', 4],
      ['IS101','Information Systems Fundamentals', 3],
      ['INFO102','Database Management Systems', 4],
      ['BA101','Principles of Business Administration', 3],
      ['BA102','Organizational Behaviour', 3],
      ['BIO101','General Biology', 4],
      ['CHEM101','General Chemistry', 4],
      ['PHYS101','General Physics', 4],
      ['MATH101','Calculus I', 4],
      ['MATH102','Calculus II', 4],
      ['STAT101','Statistics for Science', 3],
      ['ECON101','Introduction to Microeconomics', 3],
      ['ECON102','Introduction to Macroeconomics', 3],
      ['PSY101','Introduction to Psychology', 3],
      ['SOC101','Introduction to Sociology', 3],
      ['POLS101','Introduction to Political Science', 3],
      ['HIST101','African History Since Independence', 3],
      ['GEOG101','Physical Geography', 3],
      ['ENV101','Environmental Science', 3],
      ['FOOD101','Food Science Principles', 3],
      ['HE101','Home Economics Theory', 3],
      ['AGSC101','Fundamentals of Agricultural Science', 4],
      ['LAW101','Introduction to Law', 3],
      ['ED101','Foundations of Education', 3],
      ['NURS101','Fundamentals of Nursing', 4],
      ['PHAR101','Introduction to Pharmacology', 4],
      ['BICH101','Biochemistry I', 4],
      ['MBC101','Microbiology', 4],
      ['BIOT101','Introduction to Biotechnology', 4],
      ['TOUR101','Introduction to Tourism', 3],
      ['HOSP101','Principles of Hospitality Management', 3],
      ['FIN101','Principles of Finance', 3],
      ['ACC101','Financial Accounting I', 3],
      ['MKT101','Principles of Marketing', 3],
      ['HRM101','Human Resource Management', 3],
      ['PROC101','Procurement & Supply Chain Management', 3],
      ['LOG101','Logistics Management', 3],
      ['ARCH101','Architectural Design Basics', 4],
      ['CIVL101','Introduction to Civil Engineering', 4],
      ['ELEC101','Electrical Engineering Fundamentals', 4],
      ['MECH101','Mechanical Engineering Principles', 4],
      ['ELEP101','Electronics & Telecommunications', 4],
      ['MED101','Fundamentals of Medicine', 4],
      ['DENT101','Introduction to Dentistry', 4],
      ['VET101','Veterinary Science Basics', 4],
      ['ANTH101','Introduction to Anthropology', 3],
      ['MASS101','Mass Communication Theory', 3],
      ['LIBS101','Library Science Fundamentals', 3],
      ['SPEDE101','Special Education Methods', 3]
    ];

    console.log(`📚 Seeding ${courses.length} courses:`);
    const courseIdByCode = {};
    for (const [i, [code, title, credits]] of courses.entries()) {
      process.stdout.write(`  ▸ ${code.padEnd(8)} ${title.padEnd(40)} (${credits} cr)\r`);
      await db.run('INSERT INTO courses (code,title,credits) VALUES (?,?,?)', [code, title, credits]);
      const row = await db.get('SELECT last_insert_rowid() as id');
      courseIdByCode[code] = row.id;
    }
    console.log('\n✔ Courses seeded successfully\n');

    // Map courses to lecturers
    const courseLectMap = {
      CS101:'TSC/10001', CS102:'TSC/10001', IS101:'TSC/10001', INFO102:'TSC/10001',
      MATH101:'TSC/10002', MATH102:'TSC/10002', STAT101:'TSC/10002',
      BIO101:'TSC/10003', CHEM101:'TSC/10003', BICH101:'TSC/10003',
      ECON101:'TSC/10004', ECON102:'TSC/10004', FIN101:'TSC/10004',
      PSY101:'TSC/10005', SOC101:'TSC/10005', POLS101:'TSC/10005',
      ED101:'TSC/10006', NURS101:'TSC/10006', SPEDE101:'TSC/10006',
      TOUR101:'TSC/10007', HOSP101:'TSC/10007', MKT101:'TSC/10007',
      ENV101:'TSC/10008', GEOG101:'TSC/10008',
      MED101:'TSC/10009', PHAR101:'TSC/10009',
      ELEC101:'TSC/10010', MECH101:'TSC/10010'
    };

    console.log('🔗 Mapping courses to lecturers:');
    let mappingCount = 0;
    for (const [code, tsc] of Object.entries(courseLectMap)) {
      const cid = courseIdByCode[code];
      const lid = lectIdByTsc[tsc];
      if (cid && lid) {
        process.stdout.write(`  ▸ ${code.padEnd(8)} → ${tsc.padEnd(10)} ${lecturers.find(l => l[0] === tsc)[1]}\r`);
        await db.run('INSERT INTO course_lecturers (course_id,lecturer_id) VALUES (?,?)', [cid, lid]);
        mappingCount++;
      }
    }
    console.log(`\n✔ ${mappingCount} course-lecturer mappings created\n`);

    // Enroll students and create evaluations
    console.log('📝 Enrolling students and creating evaluations:');
    const studs = await db.all('SELECT id,reg_no,name FROM students');
    let totalEnrollments = 0;
    let completedEvals = 0;

    for (const {id: sid, reg_no, name} of studs) {
      const courseCount = 5 + Math.floor(Math.random() * 8);
      const courseCodes = shuffle(Object.keys(courseIdByCode)).slice(0, courseCount);
      
      process.stdout.write(`  ▸ ${reg_no.padEnd(12)} ${name.padEnd(25)}: ${courseCount} courses\r`);
      
      for (const code of courseCodes) {
        const course_id = courseIdByCode[code];
        const res = await db.run('INSERT INTO enrollments (student_id,course_id) VALUES (?,?)', [sid, course_id]);
        totalEnrollments++;

        const completed = Math.random() < 0.8;
        if (completed) completedEvals++;
        
        await db.run(
          'INSERT INTO evaluations (enrollment_id,completed,completed_at) VALUES (?,?,?)',
          [res.lastID, completed ? 1 : 0, completed ? new Date().toISOString() : null]
        );
      }
    }
    console.log(`\n✔ ${totalEnrollments} enrollments created (${completedEvals} completed evaluations)\n`);

    // Seed admins
    const admins = [
      ['admin1', 'password123', 'Exam Office Admin'],
      ['admin2', 'password123', 'Department Admin']
    ];

    console.log('🔐 Seeding admin accounts:');
    for (const [username, password, role] of admins) {
      process.stdout.write(`  ▸ Creating ${role.padEnd(20)} (${username})\r`);
      await db.run('INSERT INTO admins (username,password,role) VALUES (?,?,?)', [username, password, role]);
    }
    console.log('\n✔ Admin accounts created\n');

    // Seed questions
    const questions = [
      ['Was the lecturer prepared for each class?', 'yesno', 'Preparation'],
      ['Did the lecturer provide materials on time?', 'yesno', 'Resources'],
      ['Did the lecturer explain concepts clearly?', 'likert', 'Teaching'],
      ['Did the lecturer answer questions satisfactorily?', 'likert', 'Interaction'],
      ['Did the lecturer assign relevant assignments?', 'yesno', 'Assessment'],
      ['Rate the overall teaching quality (1=Poor, 5=Excellent)', 'likert', 'Overall'],
      ['Was the lecturer available outside class hours?', 'yesno', 'Availability']
    ];

    console.log('📝 Seeding evaluation questions:');
    for (const [text, type, category] of questions) {
      process.stdout.write(`  ▸ ${category.padEnd(12)}: ${text}\r`);
      await db.run('INSERT INTO questions (text,type,category) VALUES (?,?,?)', [text, type, category]);
    }
    console.log('\n✔ Evaluation questions seeded\n');

    console.log(`
    🌟 SEEDING COMPLETE 🌟
    ======================
    Students:      ${students.length}
    Lecturers:     ${lecturers.length}
    Courses:       ${courses.length}
    Enrollments:   ${totalEnrollments}
    Evaluations:   ${completedEvals} completed
    Admin Users:   ${admins.length}
    Questions:     ${questions.length}
    `);

  } catch (err) {
    console.error('\n🔴 SEEDING FAILED:', err);
  } finally {
    process.exit();
  }
})();