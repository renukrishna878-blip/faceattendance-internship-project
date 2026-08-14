const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { 
  getClasses, getClassById, createClass, updateClass, deleteClass, 
  getStudentsByClass, assignStudentsToClass,
  getDepartmentsList, getYearsList, getSectionsList, getSubjectsList,
  ensureClassCombination, searchClass
} = require('../controllers/classController');

const router = express.Router();
router.use(protect);

router.get('/departments', getDepartmentsList);
router.get('/years', getYearsList);
router.get('/sections', getSectionsList);
router.get('/subjects', getSubjectsList);
router.get('/search', searchClass);
router.post('/ensure', ensureClassCombination);

router.route('/').get(getClasses).post(createClass);
router.route('/:id').get(getClassById).put(updateClass).delete(deleteClass);

router.route('/:id/students').get(getStudentsByClass);
router.route('/:id/assign-students').post(assignStudentsToClass);

module.exports = router;
