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
    // Connect to MySQL server (without specifying database yet)
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL server.');

    // Create Database
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    console.log(`Database \`${DB_NAME}\` ensured.`);

    // Use Database
    await connection.query(`USE \`${DB_NAME}\`;`);

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

    // Ensure columns exist if table was created earlier without them
    try { await connection.query(`ALTER TABLE Teachers ADD COLUMN department VARCHAR(255);`); } catch(e) {}
    try { await connection.query(`ALTER TABLE Teachers ADD COLUMN phone VARCHAR(50);`); } catch(e) {}
    try { await connection.query(`ALTER TABLE Teachers ADD COLUMN role VARCHAR(50) DEFAULT 'Teacher';`); } catch(e) {}
    try { await connection.query(`ALTER TABLE Teachers ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;`); } catch(e) {}

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
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (class_id) REFERENCES Classes(id) ON DELETE CASCADE
      );
    `);
    try { await connection.query(`ALTER TABLE Students ADD COLUMN phone VARCHAR(50);`); } catch(e) {}
    try { await connection.query(`ALTER TABLE Students ADD COLUMN photo_url VARCHAR(500);`); } catch(e) {}
    // Index on register number
    try { await connection.query(`CREATE INDEX idx_student_reg ON Students(register_number);`); } catch(e) {}

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
    try { await connection.query(`ALTER TABLE StudentEmbeddings ADD COLUMN embedding_model VARCHAR(50) DEFAULT 'ArcFace';`); } catch(e) {}

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
    try { await connection.query(`CREATE INDEX idx_session_date ON AttendanceSessions(date);`); } catch(e) {}

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
    try { await connection.query(`CREATE INDEX idx_attendance_session ON Attendance(session_id);`); } catch(e) {}

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

    console.log('All tables created successfully.');

    // ---------------------------------------------------------
    // 2. Data Seeding
    // ---------------------------------------------------------
    console.log('Seeding initial data...');

    // Seed Departments
    const [depts] = await connection.query(`SELECT COUNT(*) as count FROM Departments`);
    if (depts[0].count === 0) {
      await connection.query(`
        INSERT INTO Departments (name, code) VALUES 
        ('Computer Science', 'CS'),
        ('Electrical Engineering', 'EE'),
        ('Business Administration', 'BA')
      `);
      console.log('- Inserted Departments');
    }

    // Seed Teachers
    const [teachers] = await connection.query(`SELECT COUNT(*) as count FROM Teachers`);
    if (teachers[0].count === 0) {
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      
      await connection.query(`
        INSERT INTO Teachers (name, email, password_hash, department_id) VALUES 
        ('Administrator', 'admin@gmail.com', ?, 1)
      `, [hashedPassword]);
      console.log('- Inserted Teachers');
    }

    // Seed Classes
    const [classes] = await connection.query(`SELECT COUNT(*) as count FROM Classes`);
    if (classes[0].count === 0) {
      await connection.query(`
        INSERT INTO Classes (department_id, year, section) VALUES 
        (1, 3, 'A'),
        (1, 3, 'B'),
        (2, 2, 'A'),
        (3, 4, 'C')
      `);
      console.log('- Inserted Classes');
    }

    // Seed Subjects
    const [subjects] = await connection.query(`SELECT COUNT(*) as count FROM Subjects`);
    if (subjects[0].count === 0) {
      await connection.query(`
        INSERT INTO Subjects (code, name, department_id) VALUES 
        ('CS301', 'Advanced AI', 1),
        ('CS302', 'Machine Learning', 1),
        ('EE201', 'Circuit Design', 2)
      `);
      console.log('- Inserted Subjects');
    }

    // Seed Students
    const [students] = await connection.query(`SELECT COUNT(*) as count FROM Students`);
    if (students[0].count === 0) {
      await connection.query(`
        INSERT INTO Students (register_number, name, email, class_id) VALUES 
        ('2023CS01', 'Alex Rivera', 'alex@univ.edu', 1),
        ('2023CS14', 'Priya Sharma', 'priya@univ.edu', 2),
        ('2023EE08', 'Chen Wei', 'chen@univ.edu', 3),
        ('2023BA22', 'Sarah Johnson', 'sjohnson@univ.edu', 4)
      `);
      console.log('- Inserted Students');
    }

    console.log('✅ Database setup and seeding completed successfully!');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
    process.exit();
  }
}

setupDatabase();
