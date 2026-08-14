const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../config/multerConfig');
const {
  processClassroomImage,
  getSessionData,
  overrideStudentStatus,
  finalizeSession,
  getAttendanceHistory
} = require('../controllers/attendanceController');

const router = express.Router();
router.use(protect);

router.post('/process', upload.array('classroom_image', 1), processClassroomImage);
router.get('/session/:id', getSessionData);
router.post('/session/:id/finalize', finalizeSession);
router.put('/record/:id/override', overrideStudentStatus);
router.get('/history', getAttendanceHistory);

module.exports = router;
