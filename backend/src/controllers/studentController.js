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
  uploadPhotoDirect
};
