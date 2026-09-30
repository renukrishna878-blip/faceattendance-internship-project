const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { verifyApiKey } = require('../middleware/apiKeyMiddleware');
const upload = require('../config/multerConfig');
const {
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
} = require('../controllers/studentController');

const router = express.Router();

// Sample Download (Public / Template)
router.get('/sample-excel', downloadSampleExcel);

// Google Form Registration Webhook (Protected via X-API-KEY header)
router.post('/google-form-register', verifyApiKey, upload.single('face_photo'), googleFormRegister);

// Apply auth middleware to remaining endpoints
router.use(protect);

// Google Form Details & Real-Time Testing Endpoints
router.route('/google-form-config')
  .get(getGoogleFormConfig)
  .post(saveGoogleFormConfig);

router.get('/google-form-stats', getGoogleFormStats);
router.post('/google-sheet-sync', syncGoogleSheet);

// Registration Logs & Verification Dashboard
router.get('/registration-logs', getRegistrationLogs);
router.post('/registration-logs/:id/retry', upload.single('face_photo'), retryRegistrationLog);

// Import Routes
router.post('/import-excel', upload.single('file'), importStudentsFromExcel);
router.post('/import-json', importStudentsFromJSON);
router.post('/import-photo-zip', upload.single('zipFile'), importPhotosFromZip);
router.post('/upload-photo', upload.array('photos', 5), uploadPhotoDirect);

// Photo Upload & Delete per Student
router.route('/:id/photo')
  .post(upload.single('photo'), uploadStudentPhoto)
  .put(upload.single('photo'), uploadStudentPhoto)
  .delete(deleteStudentPhoto);

// Standard CRUD
router.route('/')
  .get(getStudents)
  .post(upload.array('photos', 5), createStudent);

router.route('/:id')
  .get(getStudentById)
  .put(upload.array('photos', 5), updateStudent)
  .delete(deleteStudent);

module.exports = router;
