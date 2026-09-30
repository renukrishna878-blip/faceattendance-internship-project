const pool = require('../config/db');

const Attendance = {
  createSession: async (teacherId, classId, subjectId, imageUrl) => {
    const [result] = await pool.query(
      'INSERT INTO AttendanceSessions (teacher_id, class_id, subject_id, classroom_image_url, status) VALUES (?, ?, ?, ?, ?)',
      [teacherId, classId, subjectId, imageUrl, 'processing']
    );
    return result.insertId;
  },

  createAttendanceRecords: async (records) => {
    if (records.length === 0) return;
    // records is an array of [session_id, student_id, ai_prediction, final_status, confidence_score]
    await pool.query(
      'INSERT INTO Attendance (session_id, student_id, ai_prediction, final_status, confidence_score) VALUES ?',
      [records]
    );
  },

  getSessionById: async (sessionId) => {
    const [sessions] = await pool.query(`
      SELECT s.*, c.year, c.section, sub.name as subject_name
      FROM AttendanceSessions s
      LEFT JOIN Classes c ON s.class_id = c.id
      LEFT JOIN Subjects sub ON s.subject_id = sub.id
      WHERE s.id = ?
    `, [sessionId]);

    if (sessions.length === 0) return null;

    const [attendance] = await pool.query(`
      SELECT a.id as attendance_id, a.ai_prediction, a.final_status, a.confidence_score,
             st.id as student_id, st.register_number, st.name,
             COALESCE((SELECT photo_url FROM StudentPhotos p WHERE p.student_id = st.id AND is_primary = TRUE LIMIT 1), st.photo_url) as photo_url
      FROM Attendance a
      LEFT JOIN Students st ON a.student_id = st.id
      WHERE a.session_id = ?
      ORDER BY st.register_number ASC
    `, [sessionId]);

    return { ...sessions[0], attendance };
  },

  updateAttendanceStatus: async (attendanceId, finalStatus) => {
    await pool.query('UPDATE Attendance SET final_status = ? WHERE id = ?', [finalStatus, attendanceId]);
  },

  getAttendanceRecordById: async (attendanceId) => {
    const [records] = await pool.query('SELECT * FROM Attendance WHERE id = ?', [attendanceId]);
    return records[0];
  },

  logCorrection: async (attendanceId, teacherId, oldStatus, newStatus, reason) => {
    await pool.query(
      'INSERT INTO AttendanceCorrections (attendance_id, teacher_id, old_status, new_status, reason) VALUES (?, ?, ?, ?, ?)',
      [attendanceId, teacherId, oldStatus, newStatus, reason || 'Manual Override']
    );
  },

  updateSessionStatus: async (sessionId, status) => {
    await pool.query('UPDATE AttendanceSessions SET status = ? WHERE id = ?', [status, sessionId]);
  },

  getHistory: async (teacherId, classId = null) => {
    let query = `
      SELECT s.*, c.year, c.section, sub.name as subject_name,
             (SELECT COUNT(*) FROM Attendance a WHERE a.session_id = s.id AND a.final_status = 'Present') as present_count,
             (SELECT COUNT(*) FROM Attendance a WHERE a.session_id = s.id AND a.final_status = 'Absent') as absent_count
      FROM AttendanceSessions s
      LEFT JOIN Classes c ON s.class_id = c.id
      LEFT JOIN Subjects sub ON s.subject_id = sub.id
      WHERE s.teacher_id = ? AND s.status = 'completed'
    `;
    const params = [teacherId];

    if (classId) {
      query += ` AND s.class_id = ?`;
      params.push(classId);
    }

    query += ` ORDER BY s.date DESC`;
    const [rows] = await pool.query(query, params);
    return rows;
  }
};

module.exports = Attendance;
