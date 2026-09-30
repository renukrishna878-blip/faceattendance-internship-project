const Report = require('../models/reportModel');
const emailService = require('../services/emailService');

// @desc    Get dashboard metrics (Summary, Trends, At-Risk Students)
// @route   GET /api/reports/dashboard
// @access  Private
const getDashboardReports = async (req, res, next) => {
  try {
    const teacherId = req.teacher.id;

    const summary = await Report.getSummary(teacherId);
    const trends = await Report.getWeeklyTrends(teacherId);
    const atRiskStudents = await Report.getLowAttendanceStudents(teacherId, 75);

    res.json({
      success: true,
      data: {
        summary,
        trends,
        atRiskStudents
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Trigger simulated warning emails manually or automatically to students below 75% attendance
// @route   POST /api/reports/send-warning-emails
// @access  Private
const triggerWarningEmails = async (req, res, next) => {
  try {
    const teacherId = req.teacher.id;
    const atRiskStudents = await Report.getLowAttendanceStudents(teacherId, 75);
    
    const sentList = [];
    for (const student of atRiskStudents) {
      const emailResult = await emailService.sendLowAttendanceWarning(student, student.rate);
      if (emailResult.success) {
        sentList.push({
          id: student.id,
          name: student.name,
          email: student.email,
          rate: student.rate,
          filename: emailResult.filename
        });
      }
    }

    res.json({
      success: true,
      count: sentList.length,
      data: sentList
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardReports,
  triggerWarningEmails
};
