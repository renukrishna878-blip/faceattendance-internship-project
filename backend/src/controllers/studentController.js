const Student = require('../models/studentModel');
const pool = require('../config/db');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const AdmZip = require('adm-zip');

// Helper: Ensure Department & Class exist in MySQL and return class_id
async function resolveClassId(deptName, yearVal, sectionVal) {
  if (!deptName) return null;

  const department_name = String(deptName).trim();
  const year_val = parseInt(String(yearVal).replace(/\D/g, ''), 10) || 1;
  const section_val = String(sectionVal || 'A').replace(/^Section\s*/i, '').trim().toUpperCase() || 'A';

  // 1. Department
  let [deptRows] = await pool.query('SELECT id FROM Departments WHERE name = ?', [department_name]);
  let deptId;
  if (deptRows.length > 0) {
    deptId = deptRows[0].id;
  } else {
    const code = department_name.substring(0, 5).toUpperCase() + Math.floor(Math.random() * 100);
    const [insertDept] = await pool.query('INSERT INTO Departments (name, code) VALUES (?, ?)', [department_name, code]);
    deptId = insertDept.insertId;
  }

  // 2. Class
  let [classRows] = await pool.query('SELECT id FROM Classes WHERE department_id = ? AND year = ? AND section = ?', [deptId, year_val, section_val]);
  if (classRows.length > 0) {
    return classRows[0].id;
  } else {
    const [insertClass] = await pool.query('INSERT INTO Classes (department_id, year, section) VALUES (?, ?, ?)', [deptId, year_val, section_val]);
    return insertClass.insertId;
  }
}

// @desc    Get all students (with search & filter)
// @route   GET /api/students
// @access  Private
const getStudents = async (req, res, next) => {
  try {
    const { search, class_id } = req.query;
    const filters = {};
    if (class_id) filters.class_id = class_id;

    const students = await Student.findAll(filters, search);
    res.json({ success: true, count: students.length, data: students });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single student by ID
// @route   GET /api/students/:id
// @access  Private
const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a student with photos
// @route   POST /api/students
// @access  Private
const createStudent = async (req, res, next) => {
  try {
    let { register_number, student_id, name, email, phone, department_name, department_id, year, section, class_id } = req.body;
    
    const regNo = (register_number || student_id || '').trim();

    if (!regNo || !name) {
      return res.status(400).json({ success: false, message: 'Register number and Name are required' });
    }

    if (!class_id && department_name) {
      class_id = await resolveClassId(department_name, year, section);
    } else if (!class_id && department_id) {
      let [cRows] = await pool.query('SELECT id FROM Classes WHERE department_id = ? LIMIT 1', [department_id]);
      class_id = cRows.length > 0 ? cRows[0].id : null;
    }

    const id = await Student.create({ register_number: regNo, name, email, phone, class_id });

    if (req.files && req.files.length > 0) {
      const filePaths = req.files.map(file => `/uploads/students/${file.filename}`);
      await Student.addPhotos(id, filePaths);

      try {
        const formData = new FormData();
        req.files.forEach(file => {
          const absolutePath = path.join(__dirname, '../../uploads/students', file.filename);
          formData.append('photos', fs.createReadStream(absolutePath));
        });

        const response = await axios.post('http://localhost:8000/register-student', formData, {
          headers: { ...formData.getHeaders() }
        });
        
        if (response.data.success && response.data.embedding) {
          await Student.saveEmbedding(id, response.data.embedding);
        }
      } catch (err) {
        console.error('Failed to generate embedding via FastAPI:', err.message);
      }
    }

    const newStudent = await Student.findById(id);
    res.status(201).json({ success: true, data: newStudent });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'Student with this register number or email already exists' });
    }
    next(error);
  }
};

// @desc    Update student details & photos
// @route   PUT /api/students/:id
// @access  Private
const updateStudent = async (req, res, next) => {
  try {
    const studentId = req.params.id;
    let { register_number, student_id, name, email, phone, department_name, year, section, class_id } = req.body;

    const existingStudent = await Student.findById(studentId);
    if (!existingStudent) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const regNo = (register_number || student_id || existingStudent.register_number).trim();

    if (!class_id && department_name) {
      class_id = await resolveClassId(department_name, year || existingStudent.year, section || existingStudent.section);
    } else if (!class_id) {
      class_id = existingStudent.class_id;
    }

    await Student.update(studentId, {
      register_number: regNo,
      name: name || existingStudent.name,
      email: email !== undefined ? email : existingStudent.email,
      phone: phone !== undefined ? phone : existingStudent.phone,
      class_id
    });

    if (req.files && req.files.length > 0) {
      const filePath = `/uploads/students/${req.files[0].filename}`;
      await Student.replacePhoto(studentId, filePath);

      try {
        const formData = new FormData();
        req.files.forEach(file => {
          const absolutePath = path.join(__dirname, '../../uploads/students', file.filename);
          formData.append('photos', fs.createReadStream(absolutePath));
        });

        const response = await axios.post('http://localhost:8000/register-student', formData, {
          headers: { ...formData.getHeaders() }
        });
        
        if (response.data.success && response.data.embedding) {
          await Student.saveEmbedding(studentId, response.data.embedding);
        }
      } catch (err) {
        console.error('Failed to update embedding via FastAPI:', err.message);
      }
    }

    const updatedStudent = await Student.findById(studentId);
    res.json({ success: true, data: updatedStudent });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'Register number or email already in use' });
    }
    next(error);
  }
};

// @desc    Delete a student
// @route   DELETE /api/students/:id
// @access  Private
const deleteStudent = async (req, res, next) => {
  try {
    const studentId = req.params.id;
    const existingStudent = await Student.findById(studentId);
    if (!existingStudent) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    await Student.delete(studentId);
    res.json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Import Students from Excel/CSV (UPSERT)
// @route   POST /api/students/import-excel
// @access  Private
const importStudentsFromExcel = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an Excel or CSV file.' });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawRows = xlsx.utils.sheet_to_json(sheet);

    if (!rawRows || rawRows.length === 0) {
      return res.status(400).json({ success: false, message: 'Uploaded file is empty.' });
    }

    let insertedCount = 0;
    let updatedCount = 0;
    let failedCount = 0;
    const errors = [];

    for (let i = 0; i < rawRows.length; i++) {
      const row = rawRows[i];
      
      const regNo = String(row['Register Number'] || row['register_number'] || row['RegisterNo'] || row['Student ID'] || row['id'] || '').trim();
      const name = String(row['Student Name'] || row['name'] || row['Name'] || '').trim();
      const dept = String(row['Department'] || row['department'] || 'Computer Science').trim();
      const year = row['Year'] || row['year'] || 1;
      const section = String(row['Section'] || row['section'] || 'A').trim();
      const email = String(row['Email'] || row['email'] || '').trim();
      const phone = String(row['Phone'] || row['phone'] || row['Phone Number'] || '').trim();

      if (!regNo || !name) {
        failedCount++;
        errors.push(`Row ${i + 2}: Missing mandatory Register Number or Name.`);
        continue;
      }

      try {
        const classId = await resolveClassId(dept, year, section);
        const existing = await Student.findByRegisterNumber(regNo);

        if (existing) {
          // UPDATE existing record (UPSERT)
          await Student.update(existing.id, {
            register_number: regNo,
            name,
            email: email || existing.email,
            phone: phone || existing.phone,
            class_id: classId
          });
          updatedCount++;
        } else {
          // INSERT new student
          await Student.create({
            register_number: regNo,
            name,
            email: email || null,
            phone: phone || null,
            class_id: classId
          });
          insertedCount++;
        }
      } catch (err) {
        failedCount++;
        errors.push(`Row ${i + 2}: Failed to process student '${name}' (${err.message}).`);
      }
    }

    // Clean up temp file
    try { fs.unlinkSync(req.file.path); } catch(e) {}

    const totalSuccess = insertedCount + updatedCount;

    res.json({
      success: true,
      message: `Import completed: ${totalSuccess} processed (${insertedCount} new, ${updatedCount} updated), ${failedCount} failed.`,
      importedCount: totalSuccess,
      insertedCount,
      updatedCount,
      failedCount,
      errors
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Import Students from JSON array (UPSERT)
// @route   POST /api/students/import-json
// @access  Private
const importStudentsFromJSON = async (req, res, next) => {
  try {
    const { students: rows } = req.body;

    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ success: false, message: 'No student data provided to import.' });
    }

    let insertedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    const errors = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      
      const regNo = String(row.register_number || row['Register Number'] || row['RegisterNo'] || '').trim();
      const name = String(row.name || row['Student Name'] || row['Name'] || '').trim();
      const dept = String(row.department_name || row['Department'] || 'Computer Science').trim();
      const year = row.year || row['Year'] || 1;
      const section = String(row.section || row['Section'] || 'A').trim();
      const email = String(row.email || row['Email'] || '').trim();
      const phone = String(row.phone || row['Phone'] || '').trim();

      if (!regNo || !name) {
        skippedCount++;
        errors.push(`Row ${i + 1}: Missing mandatory Register Number or Name.`);
        continue;
      }

      try {
        const classId = await resolveClassId(dept, year, section);
        const existing = await Student.findByRegisterNumber(regNo);

        if (existing) {
          await Student.update(existing.id, {
            register_number: regNo,
            name,
            email: email || existing.email,
            phone: phone || existing.phone,
            class_id: classId
          });
          updatedCount++;
        } else {
          await Student.create({
            register_number: regNo,
            name,
            email: email || null,
            phone: phone || null,
            class_id: classId
          });
          insertedCount++;
        }
      } catch (err) {
        skippedCount++;
        errors.push(`Row ${i + 1}: Failed to process '${name}' (${err.message}).`);
      }
    }

    const totalImported = insertedCount + updatedCount;

    res.json({
      success: true,
      message: `Import completed: ${totalImported} total (${insertedCount} new created, ${updatedCount} updated).`,
      importedCount: totalImported,
      insertedCount,
      updatedCount,
      skippedCount,
      errors
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Import Bulk Photos from ZIP mapped by Register Number
// @route   POST /api/students/import-photo-zip
// @access  Private
const importPhotosFromZip = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a ZIP file.' });
    }

    const zip = new AdmZip(req.file.path);
    const zipEntries = zip.getEntries();

    let matchedCount = 0;
    let unmatchedCount = 0;
    const unmatchedFiles = [];
    const uploadsDir = path.join(__dirname, '../../uploads');

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    for (const entry of zipEntries) {
      if (entry.isDirectory) continue;
      
      const ext = path.extname(entry.entryName).toLowerCase();
      if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue;

      const filename = path.basename(entry.entryName, ext).trim(); // e.g. "23CS001"
      
      const student = await Student.findByRegisterNumber(filename);
      if (student) {
        const newFilename = `zip_${Date.now()}_${filename}${ext}`;
        const targetPath = path.join(uploadsDir, newFilename);
        
        fs.writeFileSync(targetPath, entry.getData());
        
        const photoUrl = `/uploads/${newFilename}`;
        await Student.replacePhoto(student.id, photoUrl);

        try {
          const formData = new FormData();
          formData.append('photos', fs.createReadStream(targetPath));

          const aiRes = await axios.post('http://localhost:8000/register-student', formData, {
            headers: { ...formData.getHeaders() }
          });
          if (aiRes.data.success && aiRes.data.embedding) {
            await Student.saveEmbedding(student.id, aiRes.data.embedding);
          }
        } catch (e) {
          console.error(`AI Embedding failed for ${filename}:`, e.message);
        }

        matchedCount++;
      } else {
        unmatchedCount++;
        unmatchedFiles.push(entry.name);
      }
    }

    try { fs.unlinkSync(req.file.path); } catch(e) {}

    res.json({
      success: true,
      message: `Bulk photo mapping complete: ${matchedCount} matched & updated, ${unmatchedCount} unmatched.`,
      matchedCount,
      unmatchedCount,
      unmatchedFiles
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Download Sample CSV Template
// @route   GET /api/students/sample-excel
// @access  Private
const downloadSampleExcel = (req, res) => {
  const csvContent = `Register Number,Student Name,Department,Year,Section,Email,Phone
2024CS101,Alex Rivera,Computer Science,3,A,alex.rivera@university.edu,+1 555-0101
2024CS102,Priya Sharma,Computer Science,3,A,priya.sharma@university.edu,+1 555-0102
2024EE201,Chen Wei,Electrical Engineering,2,B,chen.wei@university.edu,+1 555-0103
2024BA301,Sarah Johnson,Business Administration,1,C,sarah.johnson@university.edu,+1 555-0104`;

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="sample_students_import.csv"');
  res.send(csvContent);
};

// @desc    Upload / Replace Student Photo
// @route   POST /api/students/:id/photo
// @access  Private
const uploadStudentPhoto = async (req, res, next) => {
  try {
    const studentId = req.params.id;
    const uploadedFile = req.file || (req.files && req.files[0]);

    if (!uploadedFile) {
      return res.status(400).json({ success: false, message: 'Please select a valid JPG, JPEG, or PNG image file (Max 5MB).' });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Rename the file to student_<studentId>.jpg to match user request precisely
    const ext = path.extname(uploadedFile.originalname) || '.jpg';
    const newFilename = `student_${studentId}${ext}`;
    const oldPath = path.join(__dirname, '../../uploads/students', uploadedFile.filename);
    const newPath = path.join(__dirname, '../../uploads/students', newFilename);
    
    if (fs.existsSync(oldPath)) {
      // Avoid locking issues on Windows if renaming over existing file
      if (fs.existsSync(newPath) && oldPath !== newPath) {
         fs.unlinkSync(newPath);
      }
      fs.renameSync(oldPath, newPath);
    }

    const photoUrl = `/uploads/students/${newFilename}`;

    // 1. Save photo_url in MySQL Students and StudentPhotos
    await Student.replacePhoto(studentId, photoUrl);

    // 2. Trigger Python AI to generate face embedding vector
    try {
      const formData = new FormData();
      formData.append('photos', fs.createReadStream(newPath));

      const response = await axios.post('http://localhost:8000/register-student', formData, {
        headers: { ...formData.getHeaders() }
      });
      
      if (response.data && response.data.success && response.data.embedding) {
        await Student.saveEmbedding(studentId, response.data.embedding, photoUrl);
      }
    } catch (err) {
      console.error('FastAPI face embedding registration warning:', err.message);
    }

    const updatedStudent = await Student.findById(studentId);

    res.json({
      success: true,
      message: 'Student photo uploaded successfully',
      photoUrl,
      data: updatedStudent
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Student Photo
// @route   DELETE /api/students/:id/photo
// @access  Private
const deleteStudentPhoto = async (req, res, next) => {
  try {
    const studentId = req.params.id;
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Try unlinking local file if it exists
    if (student.photo_url) {
      try {
        const localPath = path.join(__dirname, '../../', student.photo_url);
        if (fs.existsSync(localPath)) {
          fs.unlinkSync(localPath);
        }
      } catch (e) {
        console.error('Could not delete photo file:', e.message);
      }
    }

    // Clear photo_url in MySQL
    await Student.setPhotoUrl(studentId, null);

    const updatedStudent = await Student.findById(studentId);

    res.json({
      success: true,
      message: 'Photo deleted successfully',
      data: updatedStudent
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Direct Photo Upload
// @route   POST /api/students/upload-photo
// @access  Private
const uploadPhotoDirect = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No photo uploaded.' });
    }
    const photoUrls = req.files.map(f => `/uploads/${f.filename}`);
    res.json({ success: true, photoUrls });
  } catch (error) {
    next(error);
  }
};

// Helper: Parse class/section strings like "III-A", "3-A", "Year 3 Section B"
function parseClassSection(classSectionStr) {
  if (!classSectionStr) return { year: 1, section: 'A' };
  const raw = String(classSectionStr).trim().toUpperCase();

  let year = 1;
  let section = 'A';

  // Roman numerals first
  const romanMatch = raw.match(/\b(VIII|VII|VI|IV|V|III|II|I)\b/i);
  if (romanMatch) {
    const rMap = { 'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5, 'VI': 6, 'VII': 7, 'VIII': 8 };
    year = rMap[romanMatch[1].toUpperCase()] || 1;
  } else {
    const digitMatch = raw.match(/\b([1-8])\b/) || raw.match(/(\d+)/);
    if (digitMatch) {
      year = parseInt(digitMatch[1], 10) || 1;
    }
  }

  // Find section (single letter A-Z)
  const secMatch = raw.match(/(?:SECTION|SEC|[-_\s])\s*([A-Z])\b/i) || raw.match(/([A-Z])\s*$/i);
  if (secMatch) {
    section = secMatch[1].toUpperCase();
  }

  return { year, section };
}

// @desc    Process Google Form Registration Webhook
// @route   POST /api/students/google-form-register
// @access  Public (Protected via X-API-KEY header)
const googleFormRegister = async (req, res, next) => {
  const payload = req.body || {};
  const studentId = String(payload.student_id || payload.register_number || payload['Student ID'] || '').trim();
  const name = String(payload.name || payload.student_name || payload['Student Name'] || '').trim();
  const department = String(payload.department || payload['Department'] || 'General').trim();
  const classSection = String(payload.class_section || payload.class || payload['Class/Section'] || 'I-A').trim();
  const email = String(payload.email || payload['Email'] || payload['Email Address'] || '').trim() || null;
  const consentRaw = payload.consent || payload.acknowledgement || payload['Consent/acknowledgement'] || true;
  const consentGiven = (consentRaw === true || consentRaw === 'true' || consentRaw === 'Yes' || consentRaw === 'YES' || consentRaw === 1);

  // 1. Read & Validate Student ID
  if (!studentId || studentId.length < 2) {
    await Student.logRegistration({
      register_number: studentId || 'UNKNOWN',
      name: name || 'UNKNOWN',
      department,
      class_section: classSection,
      email,
      registration_status: 'PROCESSING_FAILED',
      face_status: 'FAILED',
      error_message: 'Invalid or missing Student ID.',
      raw_payload: payload
    });
    return res.status(400).json({
      success: false,
      status: 'PROCESSING_FAILED',
      face_status: 'FAILED',
      error: 'Student ID is required and must be valid.'
    });
  }

  if (!name) {
    await Student.logRegistration({
      register_number: studentId,
      name: 'UNKNOWN',
      department,
      class_section: classSection,
      email,
      registration_status: 'PROCESSING_FAILED',
      face_status: 'FAILED',
      error_message: 'Student Name is required.',
      raw_payload: payload
    });
    return res.status(400).json({
      success: false,
      status: 'PROCESSING_FAILED',
      face_status: 'FAILED',
      error: 'Student Name is required.'
    });
  }

  // 2. Check Duplicate Student ID
  const existingStudent = await Student.findByRegisterNumber(studentId);
  if (existingStudent) {
    await Student.logRegistration({
      student_id: existingStudent.id,
      register_number: studentId,
      name,
      department,
      class_section: classSection,
      email,
      registration_status: 'DUPLICATE',
      face_status: 'DUPLICATE',
      error_message: `Student with ID '${studentId}' is already registered in the system.`,
      raw_payload: payload
    });
    return res.status(409).json({
      success: false,
      status: 'DUPLICATE',
      face_status: 'DUPLICATE',
      error: `Duplicate registration: Student ID '${studentId}' already exists.`
    });
  }

  // 3. Retrieve and Save Submitted Face Photo
  let photoFilename = null;
  let photoRelPath = null;
  let photoAbsPath = null;

  try {
    const uploadDir = path.join(__dirname, '../../uploads/students');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    if (req.file) {
      photoFilename = req.file.filename;
      photoRelPath = `/uploads/students/${photoFilename}`;
      photoAbsPath = path.join(uploadDir, photoFilename);
    } else if (payload.face_photo || payload.photo) {
      const photoData = String(payload.face_photo || payload.photo).trim();
      photoFilename = `gf-${Date.now()}-${studentId.replace(/[^a-zA-Z0-9]/g, '')}.jpg`;
      photoAbsPath = path.join(uploadDir, photoFilename);
      photoRelPath = `/uploads/students/${photoFilename}`;

      if (photoData.startsWith('data:image')) {
        const base64Content = photoData.split(';base64,').pop();
        fs.writeFileSync(photoAbsPath, Buffer.from(base64Content, 'base64'));
      } else if (/^[A-Za-z0-9+/=]+$/.test(photoData.substring(0, 100))) {
        fs.writeFileSync(photoAbsPath, Buffer.from(photoData, 'base64'));
      } else {
        // Fallback or URL
        return res.status(400).json({
          success: false,
          status: 'INVALID_FACE',
          face_status: 'INVALID_FORMAT',
          error: 'Face photograph data format is not recognized. Please submit as base64 or file upload.'
        });
      }
    } else {
      await Student.logRegistration({
        register_number: studentId,
        name,
        department,
        class_section: classSection,
        email,
        registration_status: 'INVALID_FACE',
        face_status: 'NO_PHOTO',
        error_message: 'No face photograph provided in submission.',
        raw_payload: payload
      });
      return res.status(400).json({
        success: false,
        status: 'INVALID_FACE',
        face_status: 'NO_PHOTO',
        error: 'Face photograph is required for biometric registration.'
      });
    }
  } catch (fileErr) {
    console.error('Error saving uploaded face photograph:', fileErr);
    return res.status(500).json({
      success: false,
      status: 'PROCESSING_FAILED',
      face_status: 'ERROR',
      error: 'Failed to save uploaded photograph file.'
    });
  }

  // 4. Send to FastAPI AI Service for YuNet face detection & SFace representation
  const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
  let aiResponseData;

  try {
    const formData = new FormData();
    formData.append('photo', fs.createReadStream(photoAbsPath));

    const response = await axios.post(`${aiServiceUrl}/yunet-sface/process-registration`, formData, {
      headers: { ...formData.getHeaders() },
      timeout: 15000
    });

    aiResponseData = response.data;
  } catch (aiErr) {
    console.error('FastAPI AI Service Error:', aiErr.message);
    const isOffline = aiErr.code === 'ECONNREFUSED' || aiErr.message.includes('connect ECONNREFUSED');
    const statusMsg = isOffline ? 'AI Service currently offline or unreachable.' : `AI Service error: ${aiErr.message}`;

    await Student.logRegistration({
      register_number: studentId,
      name,
      department,
      class_section: classSection,
      email,
      photo_url: photoRelPath,
      registration_status: 'PROCESSING_FAILED',
      face_status: isOffline ? 'AI_OFFLINE' : 'AI_ERROR',
      error_message: statusMsg,
      raw_payload: payload
    });

    return res.status(503).json({
      success: false,
      status: 'PROCESSING_FAILED',
      face_status: isOffline ? 'AI_OFFLINE' : 'AI_ERROR',
      error: statusMsg
    });
  }

  // 5. Handle AI Quality / Detection Outcomes (INVALID_FACE, MULTIPLE_FACES, LOW_QUALITY, etc.)
  if (!aiResponseData.success || !aiResponseData.embedding) {
    const outcomeStatus = aiResponseData.status || 'PROCESSING_FAILED';
    const faceStatus = aiResponseData.face_status || 'FAILED';
    const errorDetail = aiResponseData.error || 'Face verification failed.';

    await Student.logRegistration({
      register_number: studentId,
      name,
      department,
      class_section: classSection,
      email,
      photo_url: photoRelPath,
      registration_status: outcomeStatus,
      face_status: faceStatus,
      error_message: errorDetail,
      raw_payload: payload
    });

    return res.status(422).json({
      success: false,
      status: outcomeStatus,
      face_status: faceStatus,
      error: errorDetail
    });
  }

  // 6. Registration Succeeded: Resolve Class, Save Student & SFace Embedding in MySQL
  try {
    const { year, section } = parseClassSection(classSection);
    const classId = await resolveClassId(department, year, section);

    const newStudentId = await Student.create({
      register_number: studentId,
      name,
      email,
      phone: payload.phone || payload.phone_number || null,
      class_id: classId,
      photo_url: photoRelPath,
      face_embedding: aiResponseData.embedding,
      registration_status: 'REGISTERED',
      face_status: 'VERIFIED',
      consent_given: consentGiven
    });

    // Save SFace biometric representation in StudentEmbeddings
    await Student.saveEmbedding(newStudentId, aiResponseData.embedding, photoRelPath, 'SFace');

    // Add primary photo
    await Student.addPhotos(newStudentId, [photoRelPath]);

    // Log successful registration in RegistrationLogs
    await Student.logRegistration({
      student_id: newStudentId,
      register_number: studentId,
      name,
      department,
      class_section: classSection,
      email,
      photo_url: photoRelPath,
      registration_status: 'REGISTERED',
      face_status: 'VERIFIED',
      error_message: null,
      raw_payload: payload
    });

    const createdStudent = await Student.findById(newStudentId);

    return res.status(201).json({
      success: true,
      status: 'REGISTERED',
      face_status: 'VERIFIED',
      message: 'Student successfully registered with verified SFace facial representation. Now available for classroom attendance.',
      student: {
        id: createdStudent.id,
        register_number: createdStudent.register_number,
        name: createdStudent.name,
        department: createdStudent.department_name,
        class_section: `${createdStudent.year}-${createdStudent.section}`,
        photo_url: createdStudent.photo_url,
        registration_status: createdStudent.registration_status,
        face_status: createdStudent.face_status
      }
    });
  } catch (dbErr) {
    console.error('Database Error during student registration:', dbErr);
    await Student.logRegistration({
      register_number: studentId,
      name,
      department,
      class_section: classSection,
      email,
      photo_url: photoRelPath,
      registration_status: 'PROCESSING_FAILED',
      face_status: 'DB_ERROR',
      error_message: `Database error: ${dbErr.message}`,
      raw_payload: payload
    });

    return res.status(500).json({
      success: false,
      status: 'PROCESSING_FAILED',
      face_status: 'DB_ERROR',
      error: 'Failed to record student details in database.'
    });
  }
};

// @desc    Get Google Form Registration Logs for Admin Dashboard
// @route   GET /api/students/registration-logs
// @access  Private (Teacher JWT)
const getRegistrationLogs = async (req, res, next) => {
  try {
    const { status } = req.query;
    const logs = await Student.getRegistrationLogs(status);
    res.json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    next(error);
  }
};

// @desc    Retry Failed Registration
// @route   POST /api/students/registration-logs/:id/retry
// @access  Private (Teacher JWT)
const retryRegistrationLog = async (req, res, next) => {
  try {
    const logId = req.params.id;
    const log = await Student.getRegistrationLogById(logId);

    if (!log) {
      return res.status(404).json({ success: false, message: 'Registration log not found.' });
    }

    // Determine photo to use: either newly uploaded file or previously stored file
    let photoAbsPath;
    let photoRelPath = log.photo_url;

    if (req.file) {
      photoRelPath = `/uploads/students/${req.file.filename}`;
      photoAbsPath = path.join(__dirname, '../../uploads/students', req.file.filename);
    } else if (log.photo_url) {
      photoAbsPath = path.join(__dirname, '../../', log.photo_url);
    } else {
      return res.status(400).json({ success: false, message: 'No photo available to retry. Please upload a replacement photo.' });
    }

    if (!fs.existsSync(photoAbsPath)) {
      return res.status(400).json({ success: false, message: 'Photo file not found on disk. Please upload a new photo.' });
    }

    // Check if student now exists
    let existing = await Student.findByRegisterNumber(log.register_number);
    if (existing && existing.face_embedding) {
      await Student.updateRegistrationLog(logId, {
        registration_status: 'REGISTERED',
        face_status: 'VERIFIED',
        student_id: existing.id,
        error_message: null
      });
      return res.json({ success: true, message: 'Student is already successfully registered.', status: 'REGISTERED', face_status: 'VERIFIED' });
    }

    // Re-run AI validation
    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
    const formData = new FormData();
    formData.append('photo', fs.createReadStream(photoAbsPath));

    const response = await axios.post(`${aiServiceUrl}/yunet-sface/process-registration`, formData, {
      headers: { ...formData.getHeaders() },
      timeout: 15000
    });

    const aiData = response.data;
    if (!aiData.success || !aiData.embedding) {
      await Student.updateRegistrationLog(logId, {
        photo_url: photoRelPath,
        registration_status: aiData.status || 'PROCESSING_FAILED',
        face_status: aiData.face_status || 'FAILED',
        error_message: aiData.error || 'Retry face verification failed.'
      });
      return res.status(422).json({
        success: false,
        status: aiData.status,
        face_status: aiData.face_status,
        message: aiData.error
      });
    }

    // Create or update student
    const { year, section } = parseClassSection(log.class_section);
    const classId = await resolveClassId(log.department, year, section);

    let studentId;
    if (existing) {
      studentId = existing.id;
      await Student.saveEmbedding(studentId, aiData.embedding, photoRelPath, 'SFace');
    } else {
      studentId = await Student.create({
        register_number: log.register_number,
        name: log.name,
        email: log.email,
        class_id: classId,
        photo_url: photoRelPath,
        face_embedding: aiData.embedding,
        registration_status: 'REGISTERED',
        face_status: 'VERIFIED',
        consent_given: true
      });
      await Student.saveEmbedding(studentId, aiData.embedding, photoRelPath, 'SFace');
      await Student.addPhotos(studentId, [photoRelPath]);
    }

    await Student.updateRegistrationLog(logId, {
      student_id: studentId,
      photo_url: photoRelPath,
      registration_status: 'REGISTERED',
      face_status: 'VERIFIED',
      error_message: null
    });

    res.json({
      success: true,
      status: 'REGISTERED',
      face_status: 'VERIFIED',
      message: 'Registration retry successful! Student is now verified and available for attendance.'
    });
  } catch (err) {
    console.error('Error retrying registration:', err);
    res.status(500).json({ success: false, message: `Retry failed: ${err.message}` });
  }
};

// @desc    Get Google Form integration configuration
// @route   GET /api/students/google-form-config
// @access  Private
const getGoogleFormConfig = async (req, res, next) => {
  try {
    const configPath = path.join(__dirname, '../config/google_form_config.json');
    let config = {
      form_url: '',
      sheet_url: '',
      webhook_url: `${req.protocol}://${req.get('host')}/api/students/google-form-register`,
      api_key: process.env.GOOGLE_FORM_API_KEY || 'smart_attend_gf_sec_2026_x9k'
    };
    if (fs.existsSync(configPath)) {
      try {
        const fileContent = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        config = { ...config, ...fileContent };
      } catch (e) {}
    }
    config.webhook_url = `${req.protocol}://${req.get('host')}/api/students/google-form-register`;
    res.json({ success: true, data: config });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Google Form integration configuration
// @route   POST /api/students/google-form-config
// @access  Private
const saveGoogleFormConfig = async (req, res, next) => {
  try {
    const { form_url, sheet_url, api_key } = req.body;
    const configPath = path.join(__dirname, '../config/google_form_config.json');
    let current = {};
    if (fs.existsSync(configPath)) {
      try {
        current = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      } catch (e) {}
    }
    const updated = {
      ...current,
      form_url: form_url !== undefined ? String(form_url).trim() : (current.form_url || ''),
      sheet_url: sheet_url !== undefined ? String(sheet_url).trim() : (current.sheet_url || ''),
      api_key: api_key !== undefined ? String(api_key).trim() : (current.api_key || 'smart_attend_gf_sec_2026_x9k'),
      webhook_url: `${req.protocol}://${req.get('host')}/api/students/google-form-register`,
      updated_at: new Date().toISOString()
    };
    fs.writeFileSync(configPath, JSON.stringify(updated, null, 2), 'utf8');
    res.json({ success: true, message: 'Google Form details saved successfully!', data: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Google Form real-time database stats for testing
// @route   GET /api/students/google-form-stats
// @access  Private
const getGoogleFormStats = async (req, res, next) => {
  try {
    const [totalLogs] = await pool.query('SELECT COUNT(*) as total FROM RegistrationLogs');
    const [verifiedLogs] = await pool.query('SELECT COUNT(*) as verified FROM RegistrationLogs WHERE registration_status = "REGISTERED"');
    const [classBreakdown] = await pool.query(`
      SELECT 
        c.id as class_id,
        d.name as department_name,
        d.code as department_code,
        c.year,
        c.section,
        COUNT(DISTINCT s.id) as student_count
      FROM Students s
      JOIN Classes c ON s.class_id = c.id
      JOIN Departments d ON c.department_id = d.id
      JOIN StudentEmbeddings se ON se.student_id = s.id
      GROUP BY c.id, d.name, d.code, c.year, c.section
      ORDER BY student_count DESC
    `);

    const [recentStudents] = await pool.query(`
      SELECT rl.id, rl.register_number, rl.name, rl.department, rl.class_section, rl.photo_url, rl.registration_status, rl.face_status, rl.created_at
      FROM RegistrationLogs rl
      ORDER BY rl.created_at DESC
      LIMIT 10
    `);

    res.json({
      success: true,
      data: {
        total_submissions: totalLogs[0]?.total || 0,
        verified_count: verifiedLogs[0]?.verified || 0,
        classes_ready_for_attendance: classBreakdown,
        recent_registered: recentStudents
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Sync / Batch Import from Google Sheet CSV or array
// @route   POST /api/students/google-sheet-sync
// @access  Private
const syncGoogleSheet = async (req, res, next) => {
  try {
    const { sheet_url, rows_data } = req.body;
    let rowsToProcess = [];

    if (Array.isArray(rows_data) && rows_data.length > 0) {
      rowsToProcess = rows_data;
    } else if (sheet_url) {
      const cleanUrl = String(sheet_url).trim();
      if (cleanUrl.includes('docs.google.com/forms/')) {
        return res.status(400).json({
          success: false,
          is_form_url: true,
          message: 'You entered a Google Form URL instead of a Google Sheet URL. Google Forms collect responses into a Google Sheet. In your Google Form, click the "Responses" tab -> click "Link to Sheets", and copy that spreadsheet URL here.'
        });
      }
      let csvUrl = cleanUrl;
      const match = csvUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (match && !csvUrl.includes('export?format=csv')) {
        csvUrl = `https://docs.google.com/spreadsheets/d/${match[1]}/export?format=csv`;
      }
      const response = await axios.get(csvUrl, { timeout: 15000 });
      const csvText = response.data;
      
      const workbook = xlsx.read(csvText, { type: 'string' });
      const firstSheet = workbook.SheetNames[0];
      rowsToProcess = xlsx.utils.sheet_to_json(workbook.Sheets[firstSheet]);
    } else {
      return res.status(400).json({ success: false, message: 'Either sheet_url or rows_data must be provided.' });
    }

    if (!rowsToProcess || rowsToProcess.length === 0) {
      return res.status(400).json({ success: false, message: 'No rows found in the provided Google Sheet data.' });
    }

    let successCount = 0;
    let duplicateCount = 0;
    let failedCount = 0;
    const results = [];

    for (const row of rowsToProcess) {
      const findKey = (candidates) => {
        for (const k of candidates) {
          if (row[k] !== undefined && row[k] !== null && String(row[k]).trim() !== '') return row[k];
          for (const realKey in row) {
            if (realKey.toLowerCase() === k.toLowerCase() && String(row[realKey]).trim() !== '') return row[realKey];
          }
        }
        return '';
      };

      const studentId = String(findKey(['Student ID', 'Register Number', 'Reg No', 'student_id', 'Roll No', 'Roll Number'])).trim();
      const name = String(findKey(['Student Name', 'Name', 'name', 'Full Name'])).trim();
      const department = String(findKey(['Department', 'Dept', 'department']) || 'Computer Science').trim();
      const classSection = String(findKey(['Class/Section', 'Class', 'Section', 'class_section']) || 'III-A').trim();
      const email = String(findKey(['Email', 'Email Address', 'email']) || '').trim();
      const photoVal = findKey(['Face Photograph', 'Face Photo', 'Photograph', 'Photo', 'face_photo', 'Image']);

      if (!studentId || !name) {
        failedCount++;
        results.push({ student_id: studentId || 'N/A', name: name || 'N/A', status: 'FAILED', reason: 'Missing Student ID or Name' });
        continue;
      }

      const existing = await Student.findByRegisterNumber(studentId);
      if (existing) {
        duplicateCount++;
        results.push({ student_id: studentId, name, status: 'DUPLICATE', reason: 'Already registered' });
        continue;
      }

      if (!photoVal) {
        failedCount++;
        results.push({ student_id: studentId, name, status: 'FAILED', reason: 'No face photo link/data' });
        continue;
      }

      let photoBuffer = null;
      try {
        const photoStr = String(photoVal).trim();
        if (photoStr.startsWith('data:image')) {
          const b64 = photoStr.split(';base64,').pop();
          photoBuffer = Buffer.from(b64, 'base64');
        } else if (photoStr.startsWith('http://') || photoStr.startsWith('https://')) {
          let downloadUrl = photoStr;
          const driveMatch = photoStr.match(/[-\w]{25,}/);
          if (photoStr.includes('drive.google.com') && driveMatch) {
            downloadUrl = `https://drive.google.com/uc?export=download&id=${driveMatch[0]}`;
          }
          const imgRes = await axios.get(downloadUrl, { responseType: 'arraybuffer', timeout: 10000 });
          photoBuffer = Buffer.from(imgRes.data);
        }
      } catch (err) {
        failedCount++;
        results.push({ student_id: studentId, name, status: 'FAILED', reason: `Photo fetch error: ${err.message}` });
        continue;
      }

      if (!photoBuffer) {
        failedCount++;
        results.push({ student_id: studentId, name, status: 'FAILED', reason: 'Invalid photo data' });
        continue;
      }

      try {
        const uploadDir = path.join(__dirname, '../../uploads/students');
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
        const photoFilename = `gs-${Date.now()}-${studentId.replace(/[^a-zA-Z0-9]/g, '')}.jpg`;
        const photoAbsPath = path.join(uploadDir, photoFilename);
        const photoRelPath = `/uploads/students/${photoFilename}`;
        fs.writeFileSync(photoAbsPath, photoBuffer);

        const aiFormData = new FormData();
        aiFormData.append('photo', fs.createReadStream(photoAbsPath));

        const aiRes = await axios.post(`${process.env.AI_SERVICE_URL || 'http://localhost:8000'}/yunet-sface/process-registration`, aiFormData, {
          headers: aiFormData.getHeaders(),
          timeout: 10000
        });

        if (aiRes.data && aiRes.data.success && aiRes.data.face_status === 'VERIFIED') {
          const classId = await resolveClassId(department, '3', classSection);
          const studentDbId = await Student.create({
            register_number: studentId,
            name,
            email: email || `${studentId.toLowerCase()}@college.edu`,
            phone: null,
            class_id: classId,
            photo_url: photoRelPath,
            face_embedding: aiRes.data.embedding
          });

          await Student.addPhotos(studentDbId, [photoRelPath]);
          await Student.addEmbedding(studentDbId, aiRes.data.embedding, 'SFace', photoRelPath);

          await Student.logRegistration({
            student_id: studentDbId,
            register_number: studentId,
            name,
            department,
            class_section: classSection,
            email,
            photo_url: photoRelPath,
            registration_status: 'REGISTERED',
            face_status: 'VERIFIED',
            error_message: null
          });

          successCount++;
          results.push({ student_id: studentId, name, status: 'REGISTERED', face_status: 'VERIFIED' });
        } else {
          failedCount++;
          const reason = aiRes.data?.error || aiRes.data?.status || 'Face check failed';
          results.push({ student_id: studentId, name, status: 'FAILED', reason });
        }
      } catch (aiErr) {
        failedCount++;
        results.push({ student_id: studentId, name, status: 'FAILED', reason: aiErr.message });
      }
    }

    res.json({
      success: true,
      message: `Google Sheet Sync complete: ${successCount} registered, ${duplicateCount} duplicates, ${failedCount} failed.`,
      data: {
        total: rowsToProcess.length,
        registered: successCount,
        duplicates: duplicateCount,
        failed: failedCount,
        details: results
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  uploadStudentPhoto,
  deleteStudentPhoto,
  importStudentsFromExcel,
  importStudentsFromJSON,
  importPhotosFromZip,
  downloadSampleExcel,
  uploadPhotoDirect,
  googleFormRegister,
  getRegistrationLogs,
  retryRegistrationLog,
  getGoogleFormConfig,
  saveGoogleFormConfig,
  getGoogleFormStats,
  syncGoogleSheet
};
