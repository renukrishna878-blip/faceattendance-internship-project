const pool = require('./db');

async function migrate() {
  try {
    console.log('Running database migrations for registration...');

    // 1. Add registration_status to Students if not exists
    const [cols] = await pool.query("SHOW COLUMNS FROM Students LIKE 'registration_status'");
    if (cols.length === 0) {
      await pool.query("ALTER TABLE Students ADD COLUMN registration_status ENUM('PENDING', 'PROCESSING', 'REGISTERED', 'INVALID_FACE', 'MULTIPLE_FACES', 'LOW_QUALITY', 'DUPLICATE', 'PROCESSING_FAILED') DEFAULT 'REGISTERED'");
      console.log('Added registration_status to Students');
    } else {
      console.log('registration_status already exists on Students');
    }

    const [faceCols] = await pool.query("SHOW COLUMNS FROM Students LIKE 'face_status'");
    if (faceCols.length === 0) {
      await pool.query("ALTER TABLE Students ADD COLUMN face_status VARCHAR(50) DEFAULT 'VERIFIED'");
      console.log('Added face_status to Students');
    } else {
      console.log('face_status already exists on Students');
    }

    const [consentCols] = await pool.query("SHOW COLUMNS FROM Students LIKE 'consent_given'");
    if (consentCols.length === 0) {
      await pool.query("ALTER TABLE Students ADD COLUMN consent_given BOOLEAN DEFAULT TRUE");
      console.log('Added consent_given to Students');
    } else {
      console.log('consent_given already exists on Students');
    }

    // 2. Create RegistrationLogs table
    await pool.query(`
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
    console.log('RegistrationLogs table verified/created.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
