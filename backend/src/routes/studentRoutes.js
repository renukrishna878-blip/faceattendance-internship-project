const express = require('express');
const { protect } = require('../middleware/authMiddleware');
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
  uploadPhotoDirect
} = require('../controllers/studentController');

const router = express.Router();

// Sample Download (Public / Template)
router.get('/sample-excel', downloadSampleExcel);

// Apply auth middleware to remaining endpoints
router.use(protect);

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
