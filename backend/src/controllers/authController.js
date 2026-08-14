const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Teacher = require('../models/teacherModel');
const pool = require('../config/db');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret_key_123', {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
};

// @desc    Register a new teacher
// @route   POST /api/auth/register
// @access  Public
const registerTeacher = async (req, res, next) => {
  try {
    const { name, email, password, department, phone, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    const existingTeacher = await Teacher.findByEmail(email);
    if (existingTeacher) {
      return res.status(400).json({ success: false, message: 'Account already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const teacherId = await Teacher.create({
      name,
      email,
      password_hash: hashedPassword,
      department,
      phone,
      role: role || 'Teacher'
    });

    const newTeacher = await Teacher.findById(teacherId);

    res.status(201).json({
      success: true,
      message: 'Account created successfully. Please sign in.',
      data: newTeacher
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate a teacher
// @route   POST /api/auth/login
// @access  Public
const loginTeacher = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const teacher = await Teacher.findByEmail(email);

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'User not found. Please check your email address.' });
    }

    const isMatch = await bcrypt.compare(password, teacher.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid password. Please try again.' });
    }

    const token = generateToken(teacher.id);

    const teacherData = {
      id: teacher.id,
      teacher_id: teacher.id,
      name: teacher.name,
      email: teacher.email,
      department: teacher.department,
      phone: teacher.phone,
      role: teacher.role,
      department_id: teacher.department_id,
      token
    };

    res.json({
      success: true,
      data: teacherData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get teacher profile
// @route   GET /api/auth/profile
// @access  Private
const getTeacherProfile = async (req, res, next) => {
  try {
    const teacher = await Teacher.findById(req.teacher.id);
    res.json({
      success: true,
      data: teacher
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update teacher profile
// @route   PUT /api/auth/profile
// @access  Private
const updateTeacherProfile = async (req, res, next) => {
  try {
    const teacherId = req.teacher.id;
    const { name, department, phone } = req.body;

    await pool.query(
      'UPDATE Teachers SET name = ?, department = ?, phone = ? WHERE id = ?',
      [name, department, phone, teacherId]
    );

    const updated = await Teacher.findById(teacherId);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change teacher password
// @route   PUT /api/auth/password
// @access  Private
const changeTeacherPassword = async (req, res, next) => {
  try {
    const teacherId = req.teacher.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Both old and new passwords are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    }

    const [rows] = await pool.query('SELECT password_hash FROM Teachers WHERE id = ?', [teacherId]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Teacher not found' });

    const isMatch = await bcrypt.compare(oldPassword, rows[0].password_hash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect old password' });
    }

    const newHashed = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE Teachers SET password_hash = ? WHERE id = ?', [newHashed, teacherId]);

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout teacher
// @route   POST /api/auth/logout
// @access  Public/Private
const logoutTeacher = (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};

const checkSetupStatus = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM Teachers');
    res.json({ success: true, needsSetup: rows[0].count === 0 });
  } catch (error) {
    if (error.code === 'ER_NO_SUCH_TABLE' || error.code === 'ER_BAD_DB_ERROR') {
      res.json({ success: true, needsSetup: true, databaseMissing: true });
    } else {
      res.status(500).json({ success: false, message: 'Database error. Backend running but DB unreachable.' });
    }
  }
};

const setupInitialAdmin = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM Teachers');
    if (rows[0].count > 0) {
      return res.status(403).json({ success: false, message: 'Admin already exists. Setup disabled.' });
    }
    
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
       return res.status(400).json({ success: false, message: 'Missing fields' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    await Teacher.create({ name, email, password_hash: hashedPassword, role: 'Admin' });
    
    res.json({ success: true, message: 'Admin created successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerTeacher,
  loginTeacher,
  getTeacherProfile,
  updateTeacherProfile,
  changeTeacherPassword,
  logoutTeacher,
  checkSetupStatus,
  setupInitialAdmin
};
