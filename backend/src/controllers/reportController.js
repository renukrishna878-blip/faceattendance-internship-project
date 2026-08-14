const Report = require('../models/reportModel');

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

module.exports = {
  getDashboardReports
};
