const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getDepartments, getDepartmentById, createDepartment, updateDepartment, deleteDepartment } = require('../controllers/departmentController');

const router = express.Router();
router.use(protect);

router.route('/').get(getDepartments).post(createDepartment);
router.route('/:id').get(getDepartmentById).put(updateDepartment).delete(deleteDepartment);

module.exports = router;
