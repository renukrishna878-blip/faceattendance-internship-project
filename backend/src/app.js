const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware configuration
app.use(cors());
app.use(express.json({ limit: '50mb' })); // JSON parsing with base64 support
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(morgan('dev')); // Logging HTTP requests

const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');

// Serve uploaded files statically
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running normally' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/departments', require('./routes/departmentRoutes'));
app.use('/api/subjects', require('./routes/subjectRoutes'));
app.use('/api/classes', require('./routes/classRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

// Centralized error handling must be the last middleware
app.use(errorHandler);

module.exports = app;
