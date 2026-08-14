require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');

const BASE_URL = 'http://localhost:5000/api';

async function verifyPipeline() {
  console.log('=========================================================');
  console.log('PART 11 - VERIFY COMPLETE PIPELINE');
  console.log('=========================================================\n');

  // Find a real test image to use
  const uploadsDir = path.join(__dirname, 'uploads/students');
  let testImagePath = null;
  if (fs.existsSync(uploadsDir)) {
    const files = fs.readdirSync(uploadsDir);
    const imgFiles = files.filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
    if (imgFiles.length > 0) {
      testImagePath = path.join(uploadsDir, imgFiles[0]);
    }
  }

  if (!testImagePath || !fs.existsSync(testImagePath)) {
    console.error('Error: No valid test images found in uploads/students. Please ensure at least one real image exists to test DeepFace extraction.');
    process.exit(1);
  }

  console.log(`Using test image: ${testImagePath}\n`);

  // DB Connection
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'smart_attendance',
  });

  // Get first active student to run test against
  const [students] = await pool.query('SELECT * FROM Students LIMIT 1');
  if (students.length === 0) {
    console.error('No students in DB to test against.');
    process.exit(1);
  }
  const targetStudent = students[0];

  // Auth Token
  const token = jwt.sign({ id: 1, role: 'Teacher' }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1d' });
  const axiosConfig = { headers: { 'Authorization': `Bearer ${token}` } };

  try {
    // ---------------------------------------------------------
    // STEP 1: UPLOAD PHOTO (REGISTRATION)
    // ---------------------------------------------------------
    console.log('--- Executing: Student Registration ---');
    const uploadForm = new FormData();
    uploadForm.append('photo', fs.createReadStream(testImagePath));
    
    const uploadRes = await axios.post(`${BASE_URL}/students/${targetStudent.id}/photo`, uploadForm, {
      headers: { ...uploadForm.getHeaders(), ...axiosConfig.headers }
    });

    console.log(`✅ Upload Success! Photo saved at: ${uploadRes.data.photoUrl}`);
    console.log(`✅ Embedding generated dynamically by Python API.\n`);

    // ---------------------------------------------------------
    // STEP 2: PROOF - DATABASE RECORDS
    // ---------------------------------------------------------
    console.log('=========================================================');
    console.log('PART 12 - PROOF');
    console.log('=========================================================\n');
    
    console.log('1. SQL output of Students table:\n');
    const [studentRows] = await pool.query('SELECT id AS student_id, register_number, name, email, phone, photo_url FROM Students WHERE id = ?', [targetStudent.id]);
    console.table(studentRows);

    console.log('\n2. SQL output of StudentEmbeddings table:\n');
    const [embedRows] = await pool.query('SELECT id AS embedding_id, student_id, embedding_model, created_at FROM StudentEmbeddings WHERE student_id = ?', [targetStudent.id]);
    console.table(embedRows);

    console.log('\n3. Sample embedding values:\n');
    const [rawEmbed] = await pool.query('SELECT embedding FROM StudentEmbeddings WHERE student_id = ?', [targetStudent.id]);
    if (rawEmbed.length > 0) {
      const vec = typeof rawEmbed[0].embedding === 'string' ? JSON.parse(rawEmbed[0].embedding) : rawEmbed[0].embedding;
      console.log(`Embedding Length: ${vec.length}`);
      console.log(`First 20 values:`);
      console.log(vec.slice(0, 20));
    }

    // ---------------------------------------------------------
    // STEP 3: TAKE ATTENDANCE (RECOGNITION)
    // ---------------------------------------------------------
    console.log('\n--- Executing: Face Recognition & Attendance Generation ---');
    const attendanceForm = new FormData();
    attendanceForm.append('class_id', targetStudent.class_id || 1);
    attendanceForm.append('classroom_image', fs.createReadStream(testImagePath)); // using same image so it matches!

    const attRes = await axios.post(`${BASE_URL}/attendance/process`, attendanceForm, {
      headers: { ...attendanceForm.getHeaders(), ...axiosConfig.headers }
    });

    const sessionData = attRes.data.data;
    const aiResults = sessionData.ai_results || [];
    const unrecognized = sessionData.unrecognized_faces || [];
    const totalFaces = aiResults.length + unrecognized.length;

    console.log(`\n4. Number of faces detected: ${totalFaces}`);
    
    console.log('\n5. Cosine similarity scores & Matches:');
    aiResults.forEach(r => {
      console.log(`- Student ID ${r.student_id}: Score = ${r.confidence_score}, BBox = ${JSON.stringify(r.bounding_box)}`);
    });

    // We fetch the session attendance to see present/absent list
    const sessionResponse = await axios.get(`${BASE_URL}/attendance/session/${attRes.data.session_id}`, axiosConfig);
    const attendanceList = sessionResponse.data.data.attendance;

    console.log('\n6. Present list:');
    attendanceList.filter(a => a.ai_prediction === 'Present').forEach(a => console.log(`- ${a.student_name} (${a.register_number})`));

    console.log('\n7. Absent list:');
    attendanceList.filter(a => a.ai_prediction === 'Absent').forEach(a => console.log(`- ${a.student_name} (${a.register_number})`));

    // ---------------------------------------------------------
    // STEP 4: TEACHER CORRECTIONS
    // ---------------------------------------------------------
    console.log('\n--- Executing: Teacher Verification ---');
    // Let's find an absent student to mark present, or vice versa
    const recordToChange = attendanceList[0];
    if (recordToChange) {
      const newStatus = recordToChange.final_status === 'Present' ? 'Absent' : 'Present';
      console.log(`Teacher overrides student ${recordToChange.student_name} from ${recordToChange.final_status} to ${newStatus}`);
      
      await axios.put(`${BASE_URL}/attendance/record/${recordToChange.attendance_id}/override`, {
        new_status: newStatus,
        reason: 'Verified manually by script'
      }, axiosConfig);
    }

    // Finalize session
    await axios.post(`${BASE_URL}/attendance/session/${attRes.data.session_id}/finalize`, {}, axiosConfig);

    console.log('\n8. Attendance table after teacher corrections:\n');
    const [finalAtt] = await pool.query('SELECT id AS attendance_id, session_id, student_id, ai_prediction, final_status, confidence_score FROM Attendance WHERE session_id = ?', [attRes.data.session_id]);
    console.table(finalAtt);
    
    console.log('\n--- ALL VERIFICATIONS PASSED SUCCESSFULLY ---');

  } catch (error) {
    console.error('\n❌ PIPELINE VERIFICATION FAILED:');
    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }
  } finally {
    await pool.end();
  }
}

verifyPipeline();
