const mysql = require('mysql2/promise');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
};

const DB_NAME = process.env.DB_NAME || 'smart_attendance';

async function setupDatabase() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL server.');

    // Create Database
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    console.log(`Database \`${DB_NAME}\` ensured.`);

    // Use Database
    await connection.query(`USE \`${DB_NAME}\`;`);

    // Disable Foreign Key checks for resetting tables
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');

    // ---------------------------------------------------------
    // 1. Table Creation
    // ---------------------------------------------------------
    console.log('Creating tables...');

    await connection.query(`
      CREATE TABLE IF NOT EXISTS Departments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        code VARCHAR(50) UNIQUE NOT NULL
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS Teachers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        department VARCHAR(255),
        department_id INT,
        phone VARCHAR(50),
        role VARCHAR(50) DEFAULT 'Teacher',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (department_id) REFERENCES Departments(id) ON DELETE SET NULL
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS Classes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        department_id INT,
        year INT NOT NULL,
        section VARCHAR(10) NOT NULL,
        FOREIGN KEY (department_id) REFERENCES Departments(id) ON DELETE CASCADE
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS Subjects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        department_id INT,
        semester INT,
        FOREIGN KEY (department_id) REFERENCES Departments(id) ON DELETE CASCADE
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS Students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        register_number VARCHAR(100) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        phone VARCHAR(50),
        class_id INT,
        photo_url VARCHAR(500),
        face_embedding JSON,
        registration_status ENUM('PENDING', 'PROCESSING', 'REGISTERED', 'INVALID_FACE', 'MULTIPLE_FACES', 'LOW_QUALITY', 'DUPLICATE', 'PROCESSING_FAILED') DEFAULT 'REGISTERED',
        face_status VARCHAR(50) DEFAULT 'VERIFIED',
        consent_given BOOLEAN DEFAULT TRUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (class_id) REFERENCES Classes(id) ON DELETE CASCADE
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS RegistrationLogs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NULL,
        register_number VARCHAR(100) NOT NULL,
        name VARCHAR(255) NOT NULL,
        department VARCHAR(255),
        class_section VARCHAR(50),
        email VARCHAR(255),
        photo_url VARCHAR(500),
        registration_status ENUM('PENDING', 'PROCESSING', 'REGISTERED', 'INVALID_FACE', 'MULTIPLE_FACES', 'LOW_QUALITY', 'DUPLICATE', 'PROCESSING_FAILED') NOT NULL,
        face_status VARCHAR(50) DEFAULT 'PENDING',
        error_message TEXT,
        raw_payload JSON,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES Students(id) ON DELETE SET NULL
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS StudentPhotos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT,
        photo_url VARCHAR(500) NOT NULL,
        is_primary BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES Students(id) ON DELETE CASCADE
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS StudentEmbeddings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        embedding JSON NOT NULL,
        embedding_model VARCHAR(50) DEFAULT 'ArcFace',
        image_path VARCHAR(500),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES Students(id) ON DELETE CASCADE
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS AttendanceSessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        teacher_id INT,
        class_id INT,
        subject_id INT,
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        classroom_image_url VARCHAR(500),
        status ENUM('processing', 'completed') DEFAULT 'processing',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (teacher_id) REFERENCES Teachers(id) ON DELETE CASCADE,
        FOREIGN KEY (class_id) REFERENCES Classes(id) ON DELETE CASCADE,
        FOREIGN KEY (subject_id) REFERENCES Subjects(id) ON DELETE CASCADE
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS Attendance (
        id INT AUTO_INCREMENT PRIMARY KEY,
        session_id INT,
        student_id INT,
        ai_prediction ENUM('Present', 'Absent'),
        final_status ENUM('Present', 'Absent'),
        confidence_score FLOAT,
        FOREIGN KEY (session_id) REFERENCES AttendanceSessions(id) ON DELETE CASCADE,
        FOREIGN KEY (student_id) REFERENCES Students(id) ON DELETE CASCADE
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS AttendanceCorrections (
        id INT AUTO_INCREMENT PRIMARY KEY,
        attendance_id INT,
        teacher_id INT,
        old_status ENUM('Present', 'Absent'),
        new_status ENUM('Present', 'Absent'),
        reason VARCHAR(255),
        corrected_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (attendance_id) REFERENCES Attendance(id) ON DELETE CASCADE,
        FOREIGN KEY (teacher_id) REFERENCES Teachers(id) ON DELETE CASCADE
      );
    `);

    // Ensure database indices and columns exist
    try { await connection.query(`ALTER TABLE Teachers ADD COLUMN department VARCHAR(255);`); } catch(e) {}
    try { await connection.query(`ALTER TABLE Teachers ADD COLUMN phone VARCHAR(50);`); } catch(e) {}
    try { await connection.query(`ALTER TABLE Teachers ADD COLUMN role VARCHAR(50) DEFAULT 'Teacher';`); } catch(e) {}
    try { await connection.query(`ALTER TABLE Students ADD COLUMN phone VARCHAR(50);`); } catch(e) {}
    try { await connection.query(`ALTER TABLE Students ADD COLUMN photo_url VARCHAR(500);`); } catch(e) {}
    try { await connection.query(`ALTER TABLE StudentEmbeddings ADD COLUMN embedding_model VARCHAR(50) DEFAULT 'ArcFace';`); } catch(e) {}
    try { await connection.query(`ALTER TABLE Subjects ADD COLUMN semester INT;`); } catch(e) {}
    try { await connection.query(`CREATE INDEX idx_student_reg ON Students(register_number);`); } catch(e) {}
    try { await connection.query(`CREATE INDEX idx_session_date ON AttendanceSessions(date);`); } catch(e) {}
    try { await connection.query(`CREATE INDEX idx_attendance_session ON Attendance(session_id);`); } catch(e) {}

    console.log('All tables verified.');

    // Clear old data for a fresh seed
    console.log('Clearing old database records for clean seeding...');
    await connection.query('TRUNCATE TABLE AttendanceCorrections');
    await connection.query('TRUNCATE TABLE Attendance');
    await connection.query('TRUNCATE TABLE AttendanceSessions');
    await connection.query('TRUNCATE TABLE StudentEmbeddings');
    await connection.query('TRUNCATE TABLE StudentPhotos');
    await connection.query('TRUNCATE TABLE Students');
    await connection.query('TRUNCATE TABLE Subjects');
    await connection.query('TRUNCATE TABLE Classes');
    await connection.query('TRUNCATE TABLE Teachers');
    await connection.query('TRUNCATE TABLE Departments');

    await connection.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('Reset completed.');

    // ---------------------------------------------------------
    // 2. Data Seeding
    // ---------------------------------------------------------
    console.log('Seeding initial data...');

    // 1. Seed 7 Departments
    const depts = [
      { name: 'Computer Science & Engineering', code: 'CS' },
      { name: 'Electronics & Comm. Eng.', code: 'ECE' },
      { name: 'Electrical & Electronics Eng.', code: 'EEE' },
      { name: 'Mechanical Eng.', code: 'ME' },
      { name: 'Civil Eng.', code: 'CE' },
      { name: 'Chemical Eng.', code: 'CH' },
      { name: 'Information Technology', code: 'IT' }
    ];

    const deptMap = {}; // name -> id
    for (const d of depts) {
      const [res] = await connection.query('INSERT INTO Departments (name, code) VALUES (?, ?)', [d.name, d.code]);
      deptMap[d.code] = res.insertId;
    }
    console.log('- Seeded 7 Engineering Departments.');

    // 2. Seed Teachers
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    const [teacherRes] = await connection.query(`
      INSERT INTO Teachers (name, email, password_hash, department, department_id, phone, role) VALUES 
      ('Administrator', 'admin@gmail.com', ?, 'Computer Science & Engineering', ?, '+1 (555) 019-9283', 'Teacher')
    `, [hashedPassword, deptMap['CS']]);
    const teacherId = teacherRes.insertId;
    console.log('- Seeded Faculty/Teacher account.');

    // 3. Seed Subjects for 8 Semesters across 7 Departments
    const subjectTemplates = {
      1: [
        { name: 'Engineering Mathematics I', suffix: 'MATH1' },
        { name: 'Engineering Physics', suffix: 'PHYS' },
        { name: 'Basic Electrical Engineering', suffix: 'BEE' },
        { name: 'Engineering Graphics', suffix: 'EG' },
        { name: 'Professional Communication', suffix: 'PC' }
      ],
      2: [
        { name: 'Engineering Mathematics II', suffix: 'MATH2' },
        { name: 'Engineering Chemistry', suffix: 'CHEM' },
        { name: 'Programming for Problem Solving', suffix: 'PPS' },
        { name: 'Engineering Mechanics', suffix: 'EM' },
        { name: 'Environmental Science', suffix: 'EVS' }
      ],
      3: {
        CS: [
          { name: 'Data Structures', suffix: 'DS' },
          { name: 'Discrete Mathematics', suffix: 'DM' },
          { name: 'Digital Electronics', suffix: 'DE' },
          { name: 'Computer Organization & Architecture', suffix: 'COA' },
          { name: 'Object Oriented Programming', suffix: 'OOP' }
        ],
        ECE: [
          { name: 'Digital Electronics', suffix: 'DE' },
          { name: 'Network Analysis', suffix: 'NA' },
          { name: 'Electronic Devices & Circuits', suffix: 'EDC' },
          { name: 'Signals & Systems', suffix: 'SS' },
          { name: 'Engineering Mathematics III', suffix: 'MATH3' }
        ],
        EEE: [
          { name: 'Electromagnetic Fields', suffix: 'EMF' },
          { name: 'Electrical Machines I', suffix: 'EM1' },
          { name: 'Network Theory', suffix: 'NT' },
          { name: 'Electronic Devices & Circuits', suffix: 'EDC' },
          { name: 'Engineering Mathematics III', suffix: 'MATH3' }
        ],
        ME: [
          { name: 'Mechanics of Materials', suffix: 'MM' },
          { name: 'Thermodynamics', suffix: 'TD' },
          { name: 'Metallurgy & Material Science', suffix: 'MMS' },
          { name: 'Mechanics of Fluids', suffix: 'MF' },
          { name: 'Engineering Mathematics III', suffix: 'MATH3' }
        ],
        CE: [
          { name: 'Surveying', suffix: 'SV' },
          { name: 'Mechanics of Fluids', suffix: 'MF' },
          { name: 'Strength of Materials', suffix: 'SM' },
          { name: 'Concrete Technology', suffix: 'CT' },
          { name: 'Engineering Geology', suffix: 'EG' }
        ],
        CH: [
          { name: 'Chemical Process Calculations', suffix: 'CPC' },
          { name: 'Fluid Flow', suffix: 'FF' },
          { name: 'Mechanical Unit Operations', suffix: 'MUO' },
          { name: 'Organic Chemistry', suffix: 'OC' },
          { name: 'Engineering Mathematics III', suffix: 'MATH3' }
        ],
        IT: [
          { name: 'Python Programming', suffix: 'PP' },
          { name: 'Digital Systems', suffix: 'DSY' },
          { name: 'Data Structures', suffix: 'DS' },
          { name: 'Discrete Mathematics', suffix: 'DM' },
          { name: 'OOP using Java', suffix: 'OOPJ' }
        ]
      },
      4: {
        CS: [
          { name: 'Database Management Systems', suffix: 'DBMS' },
          { name: 'Operating Systems', suffix: 'OS' },
          { name: 'Design & Analysis of Algorithms', suffix: 'DAA' },
          { name: 'Formal Languages & Automata', suffix: 'FLAT' },
          { name: 'Software Engineering', suffix: 'SE' }
        ],
        ECE: [
          { name: 'Analog Circuits', suffix: 'AC' },
          { name: 'Electromagnetic Fields', suffix: 'EMF' },
          { name: 'Linear Integrated Circuits', suffix: 'LIC' },
          { name: 'Microprocessors & Microcontrollers', suffix: 'MPMC' },
          { name: 'Control Systems', suffix: 'CS' }
        ],
        EEE: [
          { name: 'Electrical Machines II', suffix: 'EM2' },
          { name: 'Power Systems I', suffix: 'PS1' },
          { name: 'Analog Electronics', suffix: 'AE' },
          { name: 'Electrical Measurements', suffix: 'EM' },
          { name: 'Control Systems', suffix: 'CS' }
        ],
        ME: [
          { name: 'Applied Thermodynamics', suffix: 'ATD' },
          { name: 'Fluid Mechanics & Hydraulic Machinery', suffix: 'FMHM' },
          { name: 'Kinematics of Machinery', suffix: 'KM' },
          { name: 'Manufacturing Technology I', suffix: 'MT1' },
          { name: 'Machine Drawing', suffix: 'MD' }
        ],
        CE: [
          { name: 'Structural Analysis I', suffix: 'SA1' },
          { name: 'Hydraulics & Hydraulic Machinery', suffix: 'HHM' },
          { name: 'Geotechnical Engineering I', suffix: 'GE1' },
          { name: 'Building Materials & Construction', suffix: 'BMC' },
          { name: 'Transportation Engineering I', suffix: 'TE1' }
        ],
        CH: [
          { name: 'Chemical Eng. Thermodynamics', suffix: 'CET' },
          { name: 'Heat Transfer', suffix: 'HT' },
          { name: 'Chemical Technology', suffix: 'CT' },
          { name: 'Materials Science', suffix: 'MS' },
          { name: 'Environmental Studies', suffix: 'EVS' }
        ],
        IT: [
          { name: 'Java Programming', suffix: 'JP' },
          { name: 'Web Technologies', suffix: 'WT' },
          { name: 'Computer Organization', suffix: 'CO' },
          { name: 'Database Systems', suffix: 'DBS' },
          { name: 'Operating Systems', suffix: 'OS' }
        ]
      },
      5: {
        CS: [
          { name: 'Computer Networks', suffix: 'CN' },
          { name: 'Compiler Design', suffix: 'CD' },
          { name: 'Web Technologies', suffix: 'WT' },
          { name: 'Advanced Java Programming', suffix: 'AJP' },
          { name: 'Artificial Intelligence', suffix: 'AI' }
        ],
        ECE: [
          { name: 'Digital Communications', suffix: 'DC' },
          { name: 'Antenna & Wave Propagation', suffix: 'AWP' },
          { name: 'Computer Architecture', suffix: 'CA' },
          { name: 'VLSI Design', suffix: 'VLSI' },
          { name: 'Digital Signal Processing', suffix: 'DSP' }
        ],
        EEE: [
          { name: 'Power Electronics', suffix: 'PE' },
          { name: 'Power Systems II', suffix: 'PS2' },
          { name: 'Microprocessors & Microcontrollers', suffix: 'MPMC' },
          { name: 'Signals & Systems', suffix: 'SS' },
          { name: 'Electrical Machine Design', suffix: 'EMD' }
        ],
        ME: [
          { name: 'Dynamics of Machinery', suffix: 'DM' },
          { name: 'Machine Design I', suffix: 'MD1' },
          { name: 'Manufacturing Technology II', suffix: 'MT2' },
          { name: 'Heat & Mass Transfer', suffix: 'HMT' },
          { name: 'Industrial Engineering', suffix: 'IE' }
        ],
        CE: [
          { name: 'Structural Analysis II', suffix: 'SA2' },
          { name: 'Geotechnical Engineering II', suffix: 'GE2' },
          { name: 'Environmental Engineering I', suffix: 'EE1' },
          { name: 'Design of RC Structures', suffix: 'DRCS' },
          { name: 'Transportation Engineering II', suffix: 'TE2' }
        ],
        CH: [
          { name: 'Mass Transfer I', suffix: 'MT1' },
          { name: 'Chemical Reaction Eng. I', suffix: 'CRE1' },
          { name: 'Process Instrumentation', suffix: 'PI' },
          { name: 'Optimization of Chemical Processes', suffix: 'OCP' },
          { name: 'Industrial Safety', suffix: 'IS' }
        ],
        IT: [
          { name: 'Database Management Systems', suffix: 'DBMS' },
          { name: 'Software Engineering', suffix: 'SE' },
          { name: 'Computer Networks', suffix: 'CN' },
          { name: 'Design & Analysis of Algorithms', suffix: 'DAA' },
          { name: 'Linux Internals', suffix: 'LI' }
        ]
      },
      6: {
        CS: [
          { name: 'Machine Learning', suffix: 'ML' },
          { name: 'Cryptography & Network Security', suffix: 'CNS' },
          { name: 'Distributed Systems', suffix: 'DIST' },
          { name: 'Software Project Management', suffix: 'SPM' },
          { name: 'Mobile Application Development', suffix: 'MAD' }
        ],
        ECE: [
          { name: 'Microwave Engineering', suffix: 'MWE' },
          { name: 'Wireless Communications', suffix: 'WC' },
          { name: 'Optical Communications', suffix: 'OC' },
          { name: 'Embedded Systems', suffix: 'ES' },
          { name: 'Microcontrollers & Applications', suffix: 'MA' }
        ],
        EEE: [
          { name: 'Power System Analysis', suffix: 'PSA' },
          { name: 'Switchgear & Protection', suffix: 'SGP' },
          { name: 'Electrical Drives', suffix: 'ED' },
          { name: 'Utilization of Electrical Energy', suffix: 'UEE' },
          { name: 'High Voltage Engineering', suffix: 'HVE' }
        ],
        ME: [
          { name: 'Machine Design II', suffix: 'MD2' },
          { name: 'CAD/CAM', suffix: 'CAD' },
          { name: 'Refrigeration & Air Conditioning', suffix: 'RAC' },
          { name: 'Metrology & Instrumentation', suffix: 'MI' },
          { name: 'Operations Research', suffix: 'OR' }
        ],
        CE: [
          { name: 'Environmental Engineering II', suffix: 'EE2' },
          { name: 'Design of Steel Structures', suffix: 'DSS' },
          { name: 'Water Resources Engineering I', suffix: 'WRE1' },
          { name: 'Estimation & Costing', suffix: 'EC' },
          { name: 'Construction Project Management', suffix: 'CPM' }
        ],
        CH: [
          { name: 'Mass Transfer II', suffix: 'MT2' },
          { name: 'Chemical Reaction Eng. II', suffix: 'CRE2' },
          { name: 'Process Dynamics & Control', suffix: 'PDC' },
          { name: 'Process Modeling & Simulation', suffix: 'PMS' },
          { name: 'Energy Engineering', suffix: 'EE' }
        ],
        IT: [
          { name: 'Compiler Design', suffix: 'CD' },
          { name: 'Cryptography & Network Security', suffix: 'CNS' },
          { name: 'Distributed Systems', suffix: 'DIST' },
          { name: 'Software Project Management', suffix: 'SPM' },
          { name: 'Mobile Application Development', suffix: 'MAD' }
        ]
      },
      7: {
        CS: [
          { name: 'Cloud Computing', suffix: 'CC' },
          { name: 'Big Data Analytics', suffix: 'BDA' },
          { name: 'Internet of Things', suffix: 'IOT' },
          { name: 'Cyber Security & Forensics', suffix: 'CSF' },
          { name: 'Information Retrieval Systems', suffix: 'IRS' }
        ],
        ECE: [
          { name: 'Radar Engineering', suffix: 'RE' },
          { name: 'Satellite Communication', suffix: 'SAT' },
          { name: 'Ad-hoc Wireless Networks', suffix: 'AWN' },
          { name: 'RF Circuit Design', suffix: 'RFCD' },
          { name: 'Real Time Operating Systems', suffix: 'RTOS' }
        ],
        EEE: [
          { name: 'Power System Operation & Control', suffix: 'PSOC' },
          { name: 'Renewable Energy Sources', suffix: 'RES' },
          { name: 'HVDC Transmission', suffix: 'HVDC' },
          { name: 'Smart Grid Technologies', suffix: 'SGT' },
          { name: 'Flexible AC Transmission Systems', suffix: 'FACTS' }
        ],
        ME: [
          { name: 'Automobile Engineering', suffix: 'AE' },
          { name: 'Power Plant Engineering', suffix: 'PPE' },
          { name: 'Finite Element Analysis', suffix: 'FEA' },
          { name: 'Mechatronics', suffix: 'MC' },
          { name: 'Unconventional Machining', suffix: 'UM' }
        ],
        CE: [
          { name: 'Design of Foundation Systems', suffix: 'DFS' },
          { name: 'Water Resources Engineering II', suffix: 'WRE2' },
          { name: 'Pre-stressed Concrete', suffix: 'PC' },
          { name: 'Remote Sensing & GIS', suffix: 'RSGIS' },
          { name: 'Ground Improvement Techniques', suffix: 'GIT' }
        ],
        CH: [
          { name: 'Plant Design & Economics', suffix: 'PDE' },
          { name: 'Process Safety', suffix: 'PS' },
          { name: 'Transport Phenomena', suffix: 'TP' },
          { name: 'Petrochemical Engineering', suffix: 'PE' },
          { name: 'Polymer Science & Technology', suffix: 'PST' }
        ],
        IT: [
          { name: 'Cloud Computing', suffix: 'CC' },
          { name: 'Information Security', suffix: 'IS' },
          { name: 'Data Mining & Warehousing', suffix: 'DMW' },
          { name: 'Distributed Systems', suffix: 'DS' },
          { name: 'Mobile Computing', suffix: 'MC' }
        ]
      },
      8: {
        CS: [
          { name: 'Deep Learning', suffix: 'DL' },
          { name: 'Block Chain Technology', suffix: 'BCT' },
          { name: 'Quantum Computing', suffix: 'QC' },
          { name: 'Natural Language Processing', suffix: 'NLP' },
          { name: 'Social Network Analysis', suffix: 'SNA' }
        ],
        ECE: [
          { name: 'Cellular & Mobile Comm.', suffix: 'CMC' },
          { name: 'VLSI Physical Design', suffix: 'VPD' },
          { name: 'Nano Electronics', suffix: 'NE' },
          { name: 'Mixed Signal Design', suffix: 'MSD' },
          { name: 'Speech & Audio Processing', suffix: 'SAP' }
        ],
        EEE: [
          { name: 'Power Quality', suffix: 'PQ' },
          { name: 'AI Techniques in Power Systems', suffix: 'AIPS' },
          { name: 'Distributed Generation', suffix: 'DG' },
          { name: 'Special Electrical Machines', suffix: 'SEM' },
          { name: 'Hybrid Electric Vehicles', suffix: 'HEV' }
        ],
        ME: [
          { name: 'Robotics', suffix: 'ROB' },
          { name: 'Total Quality Management', suffix: 'TQM' },
          { name: 'Computational Fluid Dynamics', suffix: 'CFD' },
          { name: 'Additive Manufacturing', suffix: 'AM' },
          { name: 'Non-Destructive Testing', suffix: 'NDT' }
        ],
        CE: [
          { name: 'Pavement Design', suffix: 'PD' },
          { name: 'Earthquake Resistant Design', suffix: 'ERD' },
          { name: 'Bridge Engineering', suffix: 'BE' },
          { name: 'Environmental Impact Assessment', suffix: 'EIA' },
          { name: 'Soil Dynamics', suffix: 'SD' }
        ],
        CH: [
          { name: 'Biochemical Engineering', suffix: 'BE' },
          { name: 'Membrane Technology', suffix: 'MT' },
          { name: 'Clean Technology', suffix: 'CT' },
          { name: 'Nanotechnology', suffix: 'NT' },
          { name: 'Novel Separation Techniques', suffix: 'NST' }
        ],
        IT: [
          { name: 'Machine Learning', suffix: 'ML' },
          { name: 'Big Data Analytics', suffix: 'BDA' },
          { name: 'Cryptography & Network Security', suffix: 'CNS' },
          { name: 'E-Commerce', suffix: 'EC' },
          { name: 'Human Computer Interaction', suffix: 'HCI' }
        ]
      }
    };

    const subjectMap = {}; // code -> subject_id
    for (const code of Object.keys(deptMap)) {
      const deptId = deptMap[code];
      for (let sem = 1; sem <= 8; sem++) {
        let subs = [];
        if (sem === 1 || sem === 2) {
          subs = subjectTemplates[sem];
        } else {
          subs = subjectTemplates[sem][code] || [];
        }

        for (const sub of subs) {
          const subCode = `${code}-${sem}-${sub.suffix}`;
          const [subRes] = await connection.query(
            'INSERT INTO Subjects (code, name, department_id, semester) VALUES (?, ?, ?, ?)',
            [subCode, sub.name, deptId, sem]
          );
          subjectMap[subCode] = subRes.insertId;
        }
      }
    }
    console.log('- Seeded 112 subjects for all 8 Semesters across all 7 departments.');

    // 4. Seed Classes matching specific strengths
    const classDetails = [
      { deptCode: 'CS', year: 3, section: 'A', strength: 35, sem: 5 },
      { deptCode: 'CS', year: 3, section: 'B', strength: 35, sem: 5 },
      { deptCode: 'CS', year: 3, section: 'C', strength: 35, sem: 5 },
      { deptCode: 'CS', year: 4, section: 'A', strength: 20, sem: 7 },
      { deptCode: 'CS', year: 4, section: 'B', strength: 20, sem: 7 },
      { deptCode: 'CS', year: 4, section: 'C', strength: 20, sem: 7 },
      { deptCode: 'ECE', year: 2, section: 'A', strength: 20, sem: 3 },
      { deptCode: 'ECE', year: 2, section: 'B', strength: 20, sem: 3 },
      { deptCode: 'ECE', year: 2, section: 'C', strength: 20, sem: 3 },
      { deptCode: 'EEE', year: 3, section: 'A', strength: 20, sem: 5 },
      { deptCode: 'EEE', year: 3, section: 'B', strength: 20, sem: 5 },
      { deptCode: 'EEE', year: 3, section: 'C', strength: 20, sem: 5 },
      { deptCode: 'ME', year: 3, section: 'A', strength: 16, sem: 5 },
      { deptCode: 'ME', year: 3, section: 'B', strength: 16, sem: 5 },
      { deptCode: 'ME', year: 3, section: 'C', strength: 16, sem: 5 },
      { deptCode: 'CE', year: 4, section: 'A', strength: 14, sem: 7 },
      { deptCode: 'CE', year: 4, section: 'B', strength: 14, sem: 7 },
      { deptCode: 'CE', year: 4, section: 'C', strength: 14, sem: 7 }
    ];

    const classMap = {}; // deptCode-year-section -> class_id
    const classStrengths = {}; // class_id -> strength

    for (const c of classDetails) {
      const deptId = deptMap[c.deptCode];
      const [classRes] = await connection.query(
        'INSERT INTO Classes (department_id, year, section) VALUES (?, ?, ?)',
        [deptId, c.year, c.section]
      );
      const classId = classRes.insertId;
      classMap[`${c.deptCode.toLowerCase()}-${c.year}-${c.section}`] = classId;
      classStrengths[classId] = c.strength;
    }
    console.log('- Seeded 7 Academic Classes.');

    // 5. Seed Students for each class based on strength
    console.log('Generating students for classes based on target strengths...');
    const firstNames = ['Alex', 'Priya', 'Chen', 'Sarah', 'Marcus', 'Elena', 'Ryan', 'Neha', 'Liam', 'Olivia', 'Aarav', 'Sophia', 'Lucas', 'Emily', 'Zayn', 'Zara', 'David', 'Jessica', 'Omar', 'Fatima', 'Daniel', 'Amara', 'Kenji', 'Tariq', 'Chloe', 'Arjun', 'Sasha', 'Ravi', 'Maya', 'Nico'];
    const lastNames = ['Rivera', 'Sharma', 'Wei', 'Johnson', 'Chen', 'Rodriguez', 'Smith', 'Patel', 'Davis', 'Wilson', 'Gupta', 'Taylor', 'Martin', 'Brown', 'Malik', 'Khan', 'Miller', 'Jones', 'Ali', 'Hassan', 'OConnor', 'Kim', 'Sato', 'El-Amin', 'Dupont', 'Bose', 'Ivanov', 'Nair', 'Santos', 'Russo'];

    const profilePhotos = [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA6t-3Ovyb8ooA_kyTGdJul7JfLImmJ947LFz4f5KYFDoAtKHjxD3QO6RZdcCkbmbrqUHlI2280VAu4Cr4OPHCZCAUSZ4V6lziCNNOVIGcoN_Ndl3UEVz3Zh5-SPvfqyCLk23cUrUmgmI1ig2m57CDClpMNcDhtCpkltjIduTf19JmZQX2WIGqJtsG95u4pUFrnzuHTd4V0B-RFbxJmFTtoeqcRV3D-44Rvi_lpu2yKpjuqNA7bK5o0RQ',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB5dPcS9zenyCTjbRIlPsAygqvhZCFvlTOOwfxCmZK3vmClsuM4vuZZaaHrfuAhOvByfzzJIFCjpBVnymFuTCCgYHj5pYEV5XH-s7hzkSql26iZWWBFkFUWdUQ3vVHC4YEgxW0OF2dRLpwO02fczzMzvUgfQnZR9Q-dTwXM4imrOl1Pd80WUIz9vRisNbQea699wo82grDAx22ihT1V739n3cTm-k_tWTueMNg9xpmvpJFG7TIxZONOHA',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD7J7DqVvkRMyL4fJXkY9Hy1HqiMlSDHyV6isHZ7ee2k6bptxt0Jmzx3tHK9_DdrpfBeGL_L2-Ycx_XrkbboaTOATLNkIEVmcGyvM0Xv7W49r2dbws33PI0au8pHzGUqTGxz_aRJKX6TimHYjYi6lyxbXlF05kX5xdKUTw5ZW5zHmJyHsbjOkjCSNAyM9RmBfXqqU2NJs2WVH6fVO8g8ltjqnx5f4jVdtziJ2kb35I8iQCwlvVWh4Dbug',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD1sK7ge7T_Ts0rEekOy8FVnGOJi0kqY32DB1yNcoco5PkMq3WckH_qAWJekGlDeBl_nxYeJfRCgErSrB6SAfa4gXFFGcu3dAL3D6wPprFg-nURKbHeGCLMrYbP--2_WYKl70DZokW_LV-7L3YJzQcYWtPZeFOUL4K96o13jpinMZ949mtb0HNPIk9J4x4qb4_4kv0deKFna1XfaSHQwtuzlD6hktdQqqfSkjaigzV1tLxMIaml5e7ZBQ'
    ];

    const PROFILE_IMAGES = [
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256',
      'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=256',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=256',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=256',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=256',
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=256',
      'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=256',
      'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&q=80&w=256',
      'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=256',
      'https://images.unsplash.com/photo-1542206395-9feb3edaa68d?auto=format&fit=crop&q=80&w=256',
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=256',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=256',
      'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&q=80&w=256',
      'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=256',
      'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=256',
      'https://images.unsplash.com/photo-1504257400765-18889394f4b3?auto=format&fit=crop&q=80&w=256',
      'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&q=80&w=256',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256',
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=256',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256',
      'https://images.unsplash.com/photo-1531346878377-f9be2c47e8e8?auto=format&fit=crop&q=80&w=256',
      'https://images.unsplash.com/photo-1579038773867-044c48829161?auto=format&fit=crop&q=80&w=256',
      'https://images.unsplash.com/photo-1580894732444-8febeb78fb3e?auto=format&fit=crop&q=80&w=256',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=256',
      'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=256',
      'https://images.unsplash.com/photo-1534311488712-47de8b9d82a1?auto=format&fit=crop&q=80&w=256',
      'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&q=80&w=256',
      'https://images.unsplash.com/photo-1512484776495-a09d228f7383?auto=format&fit=crop&q=80&w=256',
      'https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&q=80&w=256'
    ];

    let totalStudentsSeeded = 0;
    const studentMap = {};

    // Initialize studentMap keys for all active classes
    for (const c of classDetails) {
      const classId = classMap[`${c.deptCode.toLowerCase()}-${c.year}-${c.section}`];
      studentMap[classId] = [];
    }

    const userStudentsList = [
      { "id": "STU2026-001", "name": "Aarav Sharma", "gender": "Male", "section": "A", "roll_no": 1, "image": "face_r1_c01.jpg", "classKey": "cs-3-a" },
      { "id": "STU2026-002", "name": "Rohan Verma", "gender": "Male", "section": "A", "roll_no": 2, "image": "face_r1_c02.jpg", "classKey": "cs-3-a" },
      { "id": "STU2026-003", "name": "Ananya Iyer", "gender": "Female", "section": "A", "roll_no": 3, "image": "face_r1_c03.jpg", "classKey": "cs-3-a" },
      { "id": "STU2026-004", "name": "Siddharth Rao", "gender": "Male", "section": "A", "roll_no": 4, "image": "face_r1_c04.jpg", "classKey": "cs-3-a" },
      { "id": "STU2026-005", "name": "Vikram Patel", "gender": "Male", "section": "A", "roll_no": 5, "image": "face_r1_c05.jpg", "classKey": "cs-3-a" },
      { "id": "STU2026-006", "name": "Aditya Nair", "gender": "Male", "section": "A", "roll_no": 6, "image": "face_r1_c06.jpg", "classKey": "cs-3-a" },
      { "id": "STU2026-007", "name": "Karthik Menon", "gender": "Male", "section": "A", "roll_no": 7, "image": "face_r1_c07.jpg", "classKey": "cs-3-a" },
      { "id": "STU2026-008", "name": "Diya Kapoor", "gender": "Female", "section": "A", "roll_no": 8, "image": "face_r1_c08.jpg", "classKey": "cs-3-a" },
      { "id": "STU2026-009", "name": "Pooja Deshmukh", "gender": "Female", "section": "A", "roll_no": 9, "image": "face_r1_c09.jpg", "classKey": "cs-3-a" },
      { "id": "STU2026-010", "name": "Sneha Reddy", "gender": "Female", "section": "A", "roll_no": 10, "image": "face_r1_c10.jpg", "classKey": "cs-3-a" },
      { "id": "STU2026-011", "name": "Meera Joshi", "gender": "Female", "section": "B", "roll_no": 11, "image": "face_r1_c11.jpg", "classKey": "cs-3-b" },
      { "id": "STU2026-012", "name": "Riya Sen", "gender": "Female", "section": "B", "roll_no": 12, "image": "face_r1_c12.jpg", "classKey": "cs-3-b" },
      { "id": "STU2026-013", "name": "Kunal Gupta", "gender": "Male", "section": "B", "roll_no": 13, "image": "face_r2_c01.jpg", "classKey": "cs-3-b" },
      { "id": "STU2026-014", "name": "Tanvi Kulkarni", "gender": "Female", "section": "B", "roll_no": 14, "image": "face_r2_c02.jpg", "classKey": "cs-3-b" },
      { "id": "STU2026-015", "name": "Arjun Mehta", "gender": "Male", "section": "B", "roll_no": 15, "image": "face_r2_c03.jpg", "classKey": "cs-3-b" },
      { "id": "STU2026-016", "name": "Ishita Bose", "gender": "Female", "section": "B", "roll_no": 16, "image": "face_r2_c04.jpg", "classKey": "cs-3-b" },
      { "id": "STU2026-017", "name": "Varun Nambiar", "gender": "Male", "section": "B", "roll_no": 17, "image": "face_r2_c05.jpg", "classKey": "cs-3-b" },
      { "id": "STU2026-018", "name": "Nikhil Choudhury", "gender": "Male", "section": "B", "roll_no": 18, "image": "face_r2_c06.jpg", "classKey": "cs-3-b" },
      { "id": "STU2026-019", "name": "Pranav Pillai", "gender": "Male", "section": "B", "roll_no": 19, "image": "face_r2_c07.jpg", "classKey": "cs-3-b" },
      { "id": "STU2026-020", "name": "Kavya Sundaram", "gender": "Female", "section": "C", "roll_no": 20, "image": "face_r2_c08.jpg", "classKey": "cs-3-c" },
      { "id": "STU2026-021", "name": "Shreya Das", "gender": "Female", "section": "C", "roll_no": 21, "image": "face_r2_c09.jpg", "classKey": "cs-3-c" },
      { "id": "STU2026-022", "name": "Neha Bhatt", "gender": "Female", "section": "C", "roll_no": 22, "image": "face_r2_c10.jpg", "classKey": "cs-3-c" },
      { "id": "STU2026-023", "name": "Divya Hegde", "gender": "Female", "section": "C", "roll_no": 23, "image": "face_r2_c11.jpg", "classKey": "cs-3-c" },
      { "id": "STU2026-024", "name": "Shalini Roy", "gender": "Female", "section": "C", "roll_no": 24, "image": "face_r2_c12.jpg", "classKey": "cs-3-c" },
      { "id": "STU2026-025", "name": "Manish Saxena", "gender": "Male", "section": "C", "roll_no": 25, "image": "face_r3_c01.jpg", "classKey": "cs-3-c" },
      { "id": "STU2026-026", "name": "Harsh Vardhan", "gender": "Male", "section": "C", "roll_no": 26, "image": "face_r3_c02.jpg", "classKey": "cs-3-c" },
      { "id": "STU2026-027", "name": "Bhavna Mathur", "gender": "Female", "section": "C", "roll_no": 27, "image": "face_r3_c03.jpg", "classKey": "cs-3-c" },
      { "id": "STU2026-028", "name": "Deepika Prasad", "gender": "Female", "section": "C", "roll_no": 28, "image": "face_r3_c04.jpg", "classKey": "cs-3-c" }
    ];

    for (const student of userStudentsList) {
      const lookupKey = student.classKey.replace(/-([a-c])$/, (m, g) => '-' + g.toUpperCase());
      const classId = classMap[lookupKey];
      if (!classId) continue;
      
      const email = `${student.name.toLowerCase().replace(/\s+/g, '.')}@univ.edu`;
      const phone = `+1 (555) 100-${String(student.roll_no).padStart(4, '0')}`;
      const photoUrl = `http://localhost:5000/uploads/students/${student.image}`;

      // Mock 512-dimension face embedding vector matching ArcFace output
      const dummyEmbedding = Array.from({ length: 512 }, () => (Math.random() * 0.3 - 0.15));

      const [studRes] = await connection.query(
        'INSERT INTO Students (register_number, name, email, phone, class_id, photo_url, face_embedding) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [student.id, student.name, email, phone, classId, photoUrl, JSON.stringify(dummyEmbedding)]
      );

      const studentId = studRes.insertId;

      // Insert into StudentPhotos table
      await connection.query(
        'INSERT INTO StudentPhotos (student_id, photo_url, is_primary) VALUES (?, ?, TRUE)',
        [studentId, photoUrl]
      );

      // Insert into StudentEmbeddings table
      await connection.query(
        'INSERT INTO StudentEmbeddings (student_id, embedding, embedding_model, image_path) VALUES (?, ?, ?, ?)',
        [studentId, JSON.stringify(dummyEmbedding), 'ArcFace', photoUrl]
      );

      studentMap[classId].push({
        id: studentId,
        register_number: student.id,
        name: student.name,
        email: email
      });

      totalStudentsSeeded++;
    }
    console.log(`- Seeded exactly ${totalStudentsSeeded} students matching custom roster list.`);

    // 6. Seed Historical Completed Attendance Sessions and Records for the past 2 weeks (6 sessions per class)
    console.log('Seeding historical completed attendance sessions to generate reports...');
    
    // Choose some subjects for historical sessions
    const histSubjects = [
      { classKey: 'cs-3-A', subCode: 'CS-5-OS' },
      { classKey: 'cs-3-A', subCode: 'CS-5-CN' },
      { classKey: 'cs-3-B', subCode: 'CS-5-OS' },
      { classKey: 'cs-4-C', subCode: 'CS-7-CC' },
      { classKey: 'eee-3-B', subCode: 'EEE-5-PS1' },
      { classKey: 'me-3-A', subCode: 'ME-5-KM' },
      { classKey: 'ce-4-C', subCode: 'CE-7-DSS' }
    ];

    const classroomImg = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAuV5DtS7VzHhRPRrvEouHyYqGbpHv1t9KLWp4lZ73p-cPCBFdT2agEc_uO0veHveniHJEe2fmzMpZnIenS1947S4SblP5bYhkrkJmAwRQ2-M7Vl6THQd8DVT4z9sJnYpirqhjf759USK96bMfjPqWyerNb6sRbxUXSAiffRlCJPFx0SAlv5pKuhdjgO0SrKPZ9rvP33tmD_09s8JcNNM-9bbJStwsTL-B9JuPgLXjzJ_p6uCLM_peHzQ';

    let totalSessionsSeeded = 0;
    let totalRecordsSeeded = 0;

    for (let dayOffset = 10; dayOffset >= 1; dayOffset--) {
      // Exclude weekends
      const date = new Date();
      date.setDate(date.getDate() - dayOffset);
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) continue; // Skip Sat/Sun

      const dateStr = date.toISOString().slice(0, 10) + ' 10:00:00';

      for (const hist of histSubjects) {
        const classId = classMap[hist.classKey];
        const subjectId = subjectMap[hist.subCode];
        
        if (!classId || !subjectId) continue;

        // 1. Create completed session
        const [sessRes] = await connection.query(`
          INSERT INTO AttendanceSessions (teacher_id, class_id, subject_id, date, classroom_image_url, status) VALUES 
          (?, ?, ?, ?, ?, 'completed')
        `, [teacherId, classId, subjectId, dateStr, classroomImg]);

        const sessionId = sessRes.insertId;
        totalSessionsSeeded++;

        // 2. Add attendance records
        const studentsInClass = studentMap[classId];
        
        // Match approximate target rate (e.g. 86.7% for cs-3-A)
        let presentRate = 0.85;
        if (hist.classKey === 'cs-3-A') presentRate = 0.867;
        else if (hist.classKey === 'cs-3-B') presentRate = 0.911;
        else if (hist.classKey === 'cs-4-C') presentRate = 0.96;
        else if (hist.classKey === 'eee-3-B') presentRate = 0.875;
        else if (hist.classKey === 'me-3-A') presentRate = 0.813;
        else if (hist.classKey === 'ce-4-C') presentRate = 0.952;

        const records = [];
        for (const student of studentsInClass) {
          // Special case to flag low-attendance students (e.g. first 2 students in class will have lower rate)
          let isPresent = Math.random() < presentRate;
          if (student.register_number.endsWith('01') || student.register_number.endsWith('08') || student.register_number.endsWith('14')) {
            // Force these students to be absent more often so they appear in "at risk" reports
            isPresent = Math.random() < 0.60; 
          }

          const status = isPresent ? 'Present' : 'Absent';
          const conf = isPresent ? (0.8 + Math.random() * 0.2) : 0.0;

          records.push([sessionId, student.id, status, status, conf]);
          totalRecordsSeeded++;
        }

        if (records.length > 0) {
          await connection.query(
            'INSERT INTO Attendance (session_id, student_id, ai_prediction, final_status, confidence_score) VALUES ?',
            [records]
          );
        }
      }
    }

    console.log(`- Seeded ${totalSessionsSeeded} historical attendance sessions.`);
    console.log(`- Seeded ${totalRecordsSeeded} attendance student records.`);

    console.log('✅ Database setup and seeding completed successfully!');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();
