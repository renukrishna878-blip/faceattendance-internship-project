const Attendance = require('../models/attendanceModel');
const ClassModel = require('../models/classModel');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const Report = require('../models/reportModel');
const emailService = require('../services/emailService');

// @desc    Process classroom image and generate mock attendance
// @route   POST /api/attendance/process
// @access  Private
const processClassroomImage = async (req, res, next) => {
  try {
    let { class_id, subject_id } = req.body;
    const teacher_id = req.teacher.id; // From authMiddleware

    if (!class_id || !req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Class ID and Classroom Image are required' });
    }

    const pool = require('../config/db');

    // Resolve string class_id (e.g. "cs-3-A") to numeric database class_id
    if (typeof class_id === 'string' && isNaN(class_id)) {
      const match = class_id.match(/^([a-z]+)-(\d+)-([a-z])$/i);
      if (match) {
        const deptCode = match[1].toUpperCase();
        const year = parseInt(match[2]);
        const section = match[3].toUpperCase();
        
        const [classRows] = await pool.query(
          `SELECT c.id FROM Classes c 
           JOIN Departments d ON c.department_id = d.id 
           WHERE d.code = ? AND c.year = ? AND c.section = ?`,
          [deptCode, year, section]
        );
        if (classRows.length > 0) {
          class_id = classRows[0].id;
        } else {
          return res.status(404).json({ success: false, message: `Class ${deptCode} Year ${year} Section ${section} not found in database.` });
        }
      }
    }

    // Resolve string subject_id (e.g. "CS-5-OS") to numeric database subject_id
    if (typeof subject_id === 'string' && isNaN(subject_id)) {
      const [subRows] = await pool.query('SELECT id FROM Subjects WHERE code = ?', [subject_id]);
      if (subRows.length > 0) {
        subject_id = subRows[0].id;
      } else {
        const [firstSub] = await pool.query('SELECT id FROM Subjects LIMIT 1');
        subject_id = firstSub.length > 0 ? firstSub[0].id : 1;
      }
    }

    const imageUrl = `/uploads/students/${req.files[0].filename}`;

    // 1. Create Attendance Session
    const sessionId = await Attendance.createSession(teacher_id, class_id, subject_id, imageUrl);

    // 2. Fetch Students for the class
    let students = await ClassModel.getStudentsByClass(class_id);

    // If no students in this specific section, fall back to all active registered students from Google Form dataset
    if (!students || students.length === 0) {
      const [allRegistered] = await pool.query(`
        SELECT s.id, s.register_number, s.name, s.email, s.face_embedding, s.photo_url as primary_photo, s.photo_url
        FROM Students s
        WHERE s.registration_status = 'REGISTERED' AND s.face_embedding IS NOT NULL
        ORDER BY s.register_number ASC
      `);
      if (allRegistered && allRegistered.length > 0) {
        students = allRegistered;
      }
    }

    if (!students || students.length === 0) {
      return res.status(400).json({ 
        success: false, 
        noEmbeddings: true, 
        message: 'No registered students found in this class. Please add students before taking attendance.' 
      });
    }

    // Prepare roster format with parsed embeddings
    const roster = students.map(s => {
      let embedding = null;
      if (s.face_embedding) {
        try {
          embedding = typeof s.face_embedding === 'string' ? JSON.parse(s.face_embedding) : s.face_embedding;
        } catch(e) {}
      }
      return {
        id: s.id,
        register_number: s.register_number,
        name: s.name,
        embedding: embedding
      };
    });

    const validEmbeddings = roster.filter(s => s.embedding && Array.isArray(s.embedding) && s.embedding.length > 0);

    if (validEmbeddings.length === 0) {
      return res.status(400).json({ 
        success: false, 
        noEmbeddings: true, 
        message: 'No registered student face data found. Please register students before taking attendance.' 
      });
    }

    // 3. Send to FastAPI Python AI Service
    const aiApiUrl = 'http://localhost:8000/recognize-class';
    const formData = new FormData();
    const filePath = path.join(__dirname, '../../', imageUrl);
    formData.append('classroom_image', fs.createReadStream(filePath));
    formData.append('students_json', JSON.stringify(roster));

    let aiResults = [];
    let unrecognizedFaces = [];
    let attempts = 0;
    const maxRetries = 2;
    let success = false;

    while (attempts < maxRetries && !success) {
      try {
        attempts++;
        console.log(`Sending image to Python AI service (Attempt ${attempts}/${maxRetries})...`);
        const response = await axios.post(aiApiUrl, formData, {
          headers: { ...formData.getHeaders() },
          timeout: 15000 // 15s timeout for deep learning inference
        });
        if (response.data.success) {
          aiResults = response.data.results || [];
          unrecognizedFaces = response.data.unrecognized_faces || [];
          success = true;
          console.log('Successfully received recognition results from Python AI.');
        }
      } catch (err) {
        console.error(`FastAPI error on attempt ${attempts}:`, err.message);
        if (attempts >= maxRetries) {
          console.error('FastAPI unreachable. Returning fallback error.');
          return res.status(500).json({ success: false, message: 'AI face recognition service is unreachable.' });
        } else {
          await new Promise(res => setTimeout(res, 1000));
        }
      }
    }

    const records = aiResults.map(result => {
      return [sessionId, result.student_id, result.status, result.status, result.confidence_score || 0.0];
    });

    // 4. Save to DB
    if (records.length > 0) {
      await Attendance.createAttendanceRecords(records);
    }

    // 5. Return Full Session Data with AI results and Bounding Boxes
    const sessionData = await Attendance.getSessionById(sessionId);

    res.status(201).json({ 
      success: true, 
      session_id: sessionId,
      data: {
        ...sessionData,
        ai_results: aiResults.map(r => {
          const student = students.find(s => String(s.id) === String(r.student_id));
          return {
            ...r,
            register_number: student ? student.register_number : null
          };
        }),
        unrecognized_faces: unrecognizedFaces
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get session details (for verification screen)
// @route   GET /api/attendance/session/:id
// @access  Private
const getSessionData = async (req, res, next) => {
  try {
    const session = await Attendance.getSessionById(req.params.id);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    res.json({ success: true, data: session });
  } catch (error) {
    next(error);
  }
};

// @desc    Override student attendance status manually
// @route   PUT /api/attendance/record/:id/override
// @access  Private
const overrideStudentStatus = async (req, res, next) => {
  try {
    const attendanceId = req.params.id;
    const { new_status, reason } = req.body;
    const teacherId = req.teacher.id;

    if (!['Present', 'Absent'].includes(new_status)) {
      return res.status(400).json({ success: false, message: 'Status must be Present or Absent' });
    }

    const record = await Attendance.getAttendanceRecordById(attendanceId);
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });

    const oldStatus = record.final_status;
    if (oldStatus !== new_status) {
      await Attendance.updateAttendanceStatus(attendanceId, new_status);
      await Attendance.logCorrection(attendanceId, teacherId, oldStatus, new_status, reason);
    }

    res.json({ success: true, message: 'Status updated successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Finalize the attendance session
// @route   POST /api/attendance/session/:id/finalize
// @access  Private
const finalizeSession = async (req, res, next) => {
  try {
    const sessionId = req.params.id;
    await Attendance.updateSessionStatus(sessionId, 'completed');
    
    // Auto-trigger low attendance email checks in the background (does not block HTTP response)
    const teacherId = req.teacher.id;
    setImmediate(async () => {
      try {
        console.log(`[Auto-Trigger] Checking for low-attendance warning emails for teacher ID ${teacherId}...`);
        const atRiskStudents = await Report.getLowAttendanceStudents(teacherId, 75);
        for (const student of atRiskStudents) {
          await emailService.sendLowAttendanceWarning(student, student.rate);
        }
      } catch (autoErr) {
        console.error(`[Auto-Trigger Error] Failed to run automated email warning task:`, autoErr.message);
      }
    });

    res.json({ success: true, message: 'Session finalized' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get attendance history (for reports)
// @route   GET /api/attendance/history
// @access  Private
const getAttendanceHistory = async (req, res, next) => {
  try {
    const teacherId = req.teacher.id;
    const { class_id } = req.query;
    const history = await Attendance.getHistory(teacherId, class_id);
    res.json({ success: true, count: history.length, data: history });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  processClassroomImage,
  getSessionData,
  overrideStudentStatus,
  finalizeSession,
  getAttendanceHistory
};
