const fs = require('fs');
const path = require('path');

const EMAIL_LOG_DIR = path.join(__dirname, '../../logs/sent_emails');

// Ensure email log folder exists
if (!fs.existsSync(EMAIL_LOG_DIR)) {
  fs.mkdirSync(EMAIL_LOG_DIR, { recursive: true });
}

const emailService = {
  sendLowAttendanceWarning: async (student, attendanceRate) => {
    try {
      const emailContent = `
=========================================
WARNING: LOW ATTENDANCE ALERT
=========================================
Date: ${new Date().toISOString()}
To: ${student.email || 'student@university.edu'}
Subject: Academic Alert - Low Attendance (${attendanceRate}%)

Dear ${student.name},

This is an automated notification to inform you that your attendance for your current course(s) has fallen to ${attendanceRate}%, which is below the university's required threshold of 75%.

As of today, your attendance details are:
- Register Number: ${student.register_number}
- Department: ${student.department_name || 'N/A'}
- Current Attendance: ${attendanceRate}%

Please contact your course instructor or department head as soon as possible to address this issue and avoid any academic penalties.

Regards,
Academic Dean / Smart Attendance Automated System
=========================================
`;

      const filename = `email_student_${student.id || 'unknown'}_${Date.now()}.txt`;
      const filePath = path.join(EMAIL_LOG_DIR, filename);

      fs.writeFileSync(filePath, emailContent);
      console.log(`[EmailService] Simulated email warning sent to ${student.name} (${student.email}) - Logged to ${filename}`);
      return { success: true, filePath, filename };
    } catch (error) {
      console.error('[EmailService] Error writing simulated email file:', error.message);
      return { success: false, error: error.message };
    }
  }
};

module.exports = emailService;
