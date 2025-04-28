// scripts/seed.js
const db = require('../server/db');
(async () => {
  await db.init();

  // wipe existing
  for(const tbl of ['evaluations','enrollments','course_lecturers','courses','lecturers','students']) {
    await db.run(`DELETE FROM ${tbl}`);
  }

  // 1. Students
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
    ["A24/2867/2021","NDUNG'U ERIC P. KIBOCHO"],
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
  for(const [reg,name] of students) {
    const email = reg.split('/').slice(1).join('/') + '@studnts.ku.ac.ke';
    await db.run('INSERT INTO students (reg_no,name,email) VALUES (?,?,?)', [reg,name,email]);
  }

  // 2. Lecturers
  const lecturers = [
    ['TSC/10001','Dr. Amina Mwende'],
    ['TSC/10002','Prof. John Otieno'],
    ['TSC/10003','Dr. Mary Njeri'],
    ['TSC/10004','Dr. James Kimani'],
    ['TSC/10005','Dr. Lucy Wanjiku'],
    ['TSC/10006','Prof. Michael Thompson (USA)'],
    ['TSC/10007','Dr. Sarah Johnson (USA)'],
    ['TSC/10008','Prof. David Brown (USA)'],
    ['TSC/10009','Dr. Angela Mwangi'],
    ['TSC/10010','Dr. Robert Smith (USA)']
  ];
  for(const [tsc,name] of lecturers) {
    await db.run('INSERT INTO lecturers (tsc_no,name) VALUES (?,?)', [tsc,name]);
  }

  // 3. Courses
  const courses = [
    ['CS101','Introduction to Computer Science'],
    ['CS102','Data Structures & Algorithms'],
    ['IS101','Information Systems Fundamentals'],
    ['INFO102','Database Management Systems'],
    ['BA101','Principles of Business Administration'],
    ['BA102','Organizational Behaviour'],
    ['BIO101','General Biology'],
    ['CHEM101','General Chemistry'],
    ['PHYS101','General Physics'],
    ['MATH101','Calculus I'],
    ['MATH102','Calculus II'],
    ['STAT101','Statistics for Science'],
    ['ECON101','Introduction to Microeconomics'],
    ['ECON102','Introduction to Macroeconomics'],
    ['PSY101','Introduction to Psychology'],
    ['SOC101','Introduction to Sociology'],
    ['POLS101','Introduction to Political Science'],
    ['HIST101','African History Since Independence'],
    ['GEOG101','Physical Geography'],
    ['ENV101','Environmental Science'],
    ['FOOD101','Food Science Principles'],
    ['HE101','Home Economics Theory'],
    ['AGSC101','Fundamentals of Agricultural Science'],
    ['LAW101','Introduction to Law'],
    ['ED101','Foundations of Education'],
    ['NURS101','Fundamentals of Nursing'],
    ['PHAR101','Introduction to Pharmacology'],
    ['BICH101','Biochemistry I'],
    ['MBC101','Microbiology'],
    ['BIOT101','Introduction to Biotechnology'],
    ['TOUR101','Introduction to Tourism'],
    ['HOSP101','Principles of Hospitality Management'],
    ['FIN101','Principles of Finance'],
    ['ACC101','Financial Accounting I'],
    ['MKT101','Principles of Marketing'],
    ['HRM101','Human Resource Management'],
    ['PROC101','Procurement & Supply Chain Management'],
    ['LOG101','Logistics Management'],
    ['ARCH101','Architectural Design Basics'],
    ['CIVL101','Introduction to Civil Engineering'],
    ['ELEC101','Electrical Engineering Fundamentals'],
    ['MECH101','Mechanical Engineering Principles'],
    ['ELEP101','Electronics & Telecommunications'],
    ['MED101','Fundamentals of Medicine'],
    ['DENT101','Introduction to Dentistry'],
    ['VET101','Veterinary Science Basics'],
    ['ANTH101','Introduction to Anthropology'],
    ['MASS101','Mass Communication Theory'],
    ['LIBS101','Library Science Fundamentals'],
    ['SPEDE101','Special Education Methods']
  ];
  for(const [code,title] of courses) {
    await db.run('INSERT INTO courses (code,title) VALUES (?,?)', [code,title]);
  }

  // 4. Assign each course to its lecturer
  const courseLectMap = {
    CS101:10001, CS102:10001, IS101:10001, INFO102:10001, BIOT101:10001,
    MATH101:10002, MATH102:10002, STAT101:10002, PHYS101:10002, CIVL101:10002,
    BIO101:10003, CHEM101:10003, PHAR101:10003, BICH101:10003, MBC101:10003,
    ECON101:10004, ECON102:10004, FIN101:10004, ACC101:10004, PROC101:10004,
    PSY101:10005, SOC101:10005, POLS101:10005, HIST101:10005, GEOG101:10005,
    ED101:10006, NURS101:10006, SPEDE101:10006, ENV101:10006, FOOD101:10006,
    TOUR101:10007, HOSP101:10007, MKT101:10007, HRM101:10007, LOG101:10007,
    ARCH101:10008, ELEC101:10008, MECH101:10008, ELEP101:10008, VET101:10008,
    BA101:10009, BA102:10009, HE101:10009, AGSC101:10009, LAW101:10009,
    MED101:10010, DENT101:10010
  };
  // load course & lecturer IDs
  const allCourses = await db.all('SELECT id,code FROM courses');
  const allLects = await db.all('SELECT id,tsc_no FROM lecturers');
  const lectIdByTsc = Object.fromEntries(allLects.map(l => [l.tsc_no.replace('TSC/',''), l.id]));
  const courseIdByCode = Object.fromEntries(allCourses.map(c => [c.code, c.id]));

  for(const [code, tscNum] of Object.entries(courseLectMap)) {
    const course_id = courseIdByCode[code];
    const lecturer_id = lectIdByTsc[tscNum];
    await db.run('INSERT INTO course_lecturers (course_id,lecturer_id) VALUES (?,?)', [course_id,lecturer_id]);
  }

  // 5. Enroll each student in 5–12 random courses
  const studentsRows = await db.all('SELECT id FROM students');
  for(const {id: student_id} of studentsRows) {
    // pick random count 5-12
    const count = 5 + Math.floor(Math.random()*8);
    // shuffle & slice
    const shuffled = [...allCourses].sort(()=>0.5-Math.random());
    const chosen = shuffled.slice(0,count);
    for(const {id: course_id} of chosen) {
      const en = await db.run('INSERT INTO enrollments (student_id,course_id) VALUES (?,?)',[student_id,course_id]);
      // 6. evaluations: ~80% chance completed
      const done = Math.random() < 0.8;
      const completed_at = done ? new Date().toISOString() : null;
      await db.run('INSERT INTO evaluations (enrollment_id,completed,completed_at) VALUES (?,?,?)',
                   [en.lastID, done?1:0, completed_at]);
    }
  }

  console.log('🎓 Database seeded with students, lecturers, courses, enrollments & evaluations.');
  process.exit(0);
})();
