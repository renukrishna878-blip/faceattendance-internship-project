const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getDashboardReports, triggerWarningEmails } = require('../controllers/reportController');

const router = express.Router();
router.use(protect);

router.get('/dashboard', getDashboardReports);
router.post('/send-warning-emails', triggerWarningEmails);

module.exports = router;
