// scripts/seed.js
const db = require('../server/db');

(async () => {
  try {
    // Initialize database and tables
    await db.init();

    // 0. Wipe existing data
    const tables = [
      'feedback','prints','evaluations','enrollments',
      'course_lecturers','courses','lecturers','students','questions','admins'
    ];
    for (const tbl of tables) {
      await db.run(`DELETE FROM ${tbl}`);
    }

    // 1. Seed students (30)
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
    for (const [reg, name] of students) {
      const email = reg.split('/').slice(1).join('/') + '@studnts.ku.ac.ke';
      await db.run(
        'INSERT INTO students (reg_no,name,email) VALUES (?,?,?)',
        [reg, name, email]
      );
    }

    // 2. Seed lecturers (10)
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
    for (const [tsc, name] of lecturers) {
      await db.run(
        'INSERT INTO lecturers (tsc_no,name) VALUES (?,?)',
        [tsc, name]
      );
    }

    // 3. Seed courses (50)
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
    for (const [code, title] of courses) {
      await db.run(
        'INSERT INTO courses (code,title) VALUES (?,?)',
        [code, title]
      );
    }

    // 4. Associate courses to lecturers
    const courseLectMap = {
      CS101: 'TSC/10001', CS102: 'TSC/10001', IS101: 'TSC/10001', INFO102: 'TSC/10001', BIOT101: 'TSC/10001',
      MATH101: 'TSC/10002', MATH102: 'TSC/10002', STAT101: 'TSC/10002', PHYS101: 'TSC/10002', CIVL101: 'TSC/10002',
      BIO101: 'TSC/10003', CHEM101: 'TSC/10003', PHAR101: 'TSC/10003', BICH101: 'TSC/10003', MBC101: 'TSC/10003',
      ECON101: 'TSC/10004', ECON102: 'TSC/10004', FIN101: 'TSC/10004', ACC101: 'TSC/10004', PROC101: 'TSC/10004',
      PSY101: 'TSC/10005', SOC101: 'TSC/10005', POLS101: 'TSC/10005', HIST101: 'TSC/10005', GEOG101: 'TSC/10005',
      ED101: 'TSC/10006', NURS101: 'TSC/10006', SPEDE101: 'TSC/10006', ENV101: 'TSC/10006', FOOD101: 'TSC/10006',
      TOUR101: 'TSC/10007', HOSP101: 'TSC/10007', MKT101: 'TSC/10007', HRM101: 'TSC/10007', LOG101: 'TSC/10007',
      ARCH101: 'TSC/10008', ELEC101: 'TSC/10008', MECH101: 'TSC/10008', ELEP101: 'TSC/10008', VET101: 'TSC/10008',
      BA101:  'TSC/10009', BA102:  'TSC/10009', HE101:  'TSC/10009', AGSC101: 'TSC/10009', LAW101: 'TSC/10009',
      MED101: 'TSC/10010', DENT101:'TSC/10010'
    };
    const courseRows = await db.all('SELECT id,code FROM courses');
    const lectRows = await db.all('SELECT id,tsc_no FROM lecturers');
    const courseIdByCode = new Map(courseRows.map(c => [c.code, c.id]));
    const lectIdByTsc = new Map(lectRows.map(l => [l.tsc_no, l.id]));

    for (const [code, tsc] of Object.entries(courseLectMap)) {
      const course_id = courseIdByCode.get(code);
      const lecturer_id = lectIdByTsc.get(tsc);
      if (course_id && lecturer_id) {
        await db.run(
          'INSERT INTO course_lecturers (course_id,lecturer_id) VALUES (?,?)',
          [course_id, lecturer_id]
        );
      }
    }

    // 5. Enroll students and seed evaluations
    const studentRows = await db.all('SELECT id FROM students');
    for (const { id: student_id } of studentRows) {
      const count = 5 + Math.floor(Math.random() * 8); // 5-12 courses
      const selected = shuffle(courseRows).slice(0, count);
      for (const { id: course_id } of selected) {
        const en = await db.run(
          'INSERT INTO enrollments (student_id,course_id) VALUES (?,?)',
          [student_id, course_id]
        );
        const done = Math.random() < 0.8;
        await db.run(
          'INSERT INTO evaluations (enrollment_id,completed,completed_at) VALUES (?,?,?)',
          [en.lastID, done ? 1 : 0, done ? new Date().toISOString() : null]
        );
      }
    }

    // 6. Admin users
    const admins = [['admin1','password123'],['admin2','password123']];
    for (const [u,p] of admins) {
      await db.run('INSERT INTO admins (username,password) VALUES (?,?)',[u,p]);
    }

    // 7. Evaluation questions
    const questions = [
      ['Was the lecturer prepared for each class?','yesno'],
      ['Did the lecturer provide materials on time?','yesno'],
      ['Did the lecturer explain concepts clearly?','likert'],
      ['Did the lecturer answer questions satisfactorily?','likert'],
      ['Did the lecturer assign relevant assignments?','yesno'],
      ['Rate the overall teaching quality (1=Strongly Disagree…5=Strongly Agree)','likert'],
      ['Was the lecturer available outside class hours?','yesno']
    ];
    for (const [text,type] of questions) {
      await db.run('INSERT INTO questions (text,type) VALUES (?,?)',[text,type]);
    }

    console.log('✅ Seed complete.');
  } catch (err) {
    console.error('🔴 Seed error:', err);
  } finally {
    process.exit(0);
  }
})();

// Helper to shuffle an array
function shuffle(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}