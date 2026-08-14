const pool = require('../config/db');

const Report = {
  getSummary: async (teacherId) => {
    // Get total present and absent for completed sessions
    const [rows] = await pool.query(`
      SELECT 
        SUM(CASE WHEN a.final_status = 'Present' THEN 1 ELSE 0 END) as total_present,
        SUM(CASE WHEN a.final_status = 'Absent' THEN 1 ELSE 0 END) as total_absent
      FROM Attendance a
      JOIN AttendanceSessions s ON a.session_id = s.id
      WHERE s.status = 'completed' AND s.teacher_id = ?
    `, [teacherId]);
    
    const present = rows[0].total_present || 0;
    const absent = rows[0].total_absent || 0;
    const total = Number(present) + Number(absent);
    const rate = total > 0 ? ((present / total) * 100).toFixed(1) : 0;

    return { total_present: Number(present), total_absent: Number(absent), rate: Number(rate) };
  },

  getWeeklyTrends: async (teacherId) => {
    // Get attendance rate per day for the last 7 days
    const [rows] = await pool.query(`
      SELECT 
        DATE(s.date) as day_date,
        SUM(CASE WHEN a.final_status = 'Present' THEN 1 ELSE 0 END) as daily_present,
        COUNT(a.id) as daily_total
      FROM Attendance a
      JOIN AttendanceSessions s ON a.session_id = s.id
      WHERE s.status = 'completed' AND s.teacher_id = ? AND s.date >= DATE(NOW()) - INTERVAL 7 DAY
      GROUP BY DATE(s.date)
      ORDER BY day_date ASC
    `, [teacherId]);
    
    return rows.map(r => ({
      date: r.day_date,
      rate: r.daily_total > 0 ? ((r.daily_present / r.daily_total) * 100).toFixed(1) : 0
    }));
  },

  getLowAttendanceStudents: async (teacherId, threshold = 75) => {
    // Get students with attendance below threshold across sessions taught by this teacher
    const [rows] = await pool.query(`
      SELECT 
        st.id, st.name, st.register_number,
        SUM(CASE WHEN a.final_status = 'Present' THEN 1 ELSE 0 END) as present_count,
        COUNT(a.id) as total_classes
      FROM Attendance a
      JOIN AttendanceSessions s ON a.session_id = s.id
      JOIN Students st ON a.student_id = st.id
      WHERE s.status = 'completed' AND s.teacher_id = ?
      GROUP BY st.id
      HAVING (present_count / total_classes) * 100 < ?
      ORDER BY (present_count / total_classes) ASC
      LIMIT 10
    `, [teacherId, threshold]);

    return rows.map(r => ({
      ...r,
      rate: ((r.present_count / r.total_classes) * 100).toFixed(1)
    }));
  }
};

module.exports = Report;
