const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getDashboardReports } = require('../controllers/reportController');

const router = express.Router();
router.use(protect);

router.get('/dashboard', getDashboardReports);

module.exports = router;
