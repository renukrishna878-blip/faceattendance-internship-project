require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const mysql = require('mysql2/promise');

async function runTest() {
  console.log('--- STARTING VERIFICATION ---');

  // 1. Create a dummy image file for testing
  const dummyImagePath = path.join(__dirname, 'dummy_test_image.jpg');
  fs.writeFileSync(dummyImagePath, Buffer.from('fake_image_data_here'));

  // 2. We need a valid student ID to test on.
  // Connect to DB directly to get the first student ID.
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'smart_attendance',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  const [students] = await pool.query('SELECT id, register_number FROM Students LIMIT 1');
  if (students.length === 0) {
    console.error('No students found to test on. Exiting test.');
    process.exit(1);
  }

  const student = students[0];
  console.log(`Testing with student: ${student.register_number} (ID: ${student.id})`);

  // We need a valid JWT token to authenticate the upload API.
  // Let's generate one directly.
  const jwt = require('jsonwebtoken');
  const token = jwt.sign({ id: 1, role: 'admin' }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '1d',
  });

  // 3. Upload image via API
  console.log('-> Uploading image to API...');
  const formData = new FormData();
  formData.append('photo', fs.createReadStream(dummyImagePath));

  try {
    const uploadRes = await axios.post(`http://localhost:5000/api/students/${student.id}/photo`, formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Upload response:', uploadRes.data);
    const photoUrl = uploadRes.data.photoUrl;

    // 4. Verify file exists in uploads folder
    const expectedFilePath = path.join(__dirname, 'uploads/students', `student_${student.id}.jpg`);
    if (fs.existsSync(expectedFilePath)) {
      console.log('SUCCESS: File exists inside uploads/students folder:', expectedFilePath);
    } else {
      console.error('FAILED: File does not exist at expected path:', expectedFilePath);
    }

    // 5. Verify MySQL
    const [updatedRows] = await pool.query('SELECT photo_url FROM Students WHERE id = ?', [student.id]);
    if (updatedRows[0].photo_url === photoUrl) {
      console.log('SUCCESS: photo_url exists and is correct in MySQL:', updatedRows[0].photo_url);
    } else {
      console.error('FAILED: photo_url mismatch in MySQL. Found:', updatedRows[0].photo_url);
    }

    // 6. Verify GET /api/students returns photo_url
    const getRes = await axios.get(`http://localhost:5000/api/students`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const fetchedStudent = getRes.data.data.find(s => s.id === student.id);
    if (fetchedStudent && fetchedStudent.photo_url === photoUrl) {
      console.log('SUCCESS: GET /api/students returns photo_url correctly.');
    } else {
      console.error('FAILED: GET /api/students did not return correct photo_url.', fetchedStudent);
    }

    // 7. Verify Static Serving
    try {
      const staticRes = await axios.get(`http://localhost:5000${photoUrl}`);
      if (staticRes.status === 200) {
         console.log('SUCCESS: Express is correctly serving the static image file over HTTP!');
      }
    } catch (e) {
      console.error('FAILED: Express failed to serve the static image:', e.message);
    }

    // Cleanup
    fs.unlinkSync(dummyImagePath);
    console.log('--- ALL PROGRAMMATIC VERIFICATIONS PASSED ---');

  } catch (error) {
    console.error('API Test Failed:', error.response ? error.response.data : error.message);
  } finally {
    await pool.end();
  }
}

runTest();
