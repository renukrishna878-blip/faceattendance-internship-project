const express = require('express');
const { 
  registerTeacher, 
  loginTeacher, 
  getTeacherProfile, 
  updateTeacherProfile,
  changeTeacherPassword,
  logoutTeacher, 
  checkSetupStatus, 
  setupInitialAdmin 
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerTeacher);
router.post('/login', loginTeacher);
router.post('/logout', logoutTeacher);
router.get('/status', checkSetupStatus);
router.post('/setup', setupInitialAdmin);

// Protected routes
router.get('/profile', protect, getTeacherProfile);
router.put('/profile', protect, updateTeacherProfile);
router.put('/password', protect, changeTeacherPassword);

module.exports = router;
