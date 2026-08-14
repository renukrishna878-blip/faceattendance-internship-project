const pool = require('../config/db');
const Class = require('../models/classModel');

const getClasses = async (req, res, next) => {
  try {
    const classes = await Class.findAll();
    res.json({ success: true, count: classes.length, data: classes });
  } catch (error) { next(error); }
};

const getClassById = async (req, res, next) => {
  try {
    const cls = await Class.findById(req.params.id);
    if (!cls) return res.status(404).json({ success: false, message: 'Class not found' });
    res.json({ success: true, data: cls });
  } catch (error) { next(error); }
};

const createClass = async (req, res, next) => {
  try {
    const { department_id, year, section } = req.body;
    if (!department_id || !year || !section) return res.status(400).json({ success: false, message: 'Missing fields' });
    const id = await Class.create({ department_id, year, section });
    const newClass = await Class.findById(id);
    res.status(201).json({ success: true, data: newClass });
  } catch (error) { next(error); }
};

const updateClass = async (req, res, next) => {
  try {
    const cls = await Class.findById(req.params.id);
    if (!cls) return res.status(404).json({ success: false, message: 'Class not found' });
    await Class.update(req.params.id, req.body);
    const updated = await Class.findById(req.params.id);
    res.json({ success: true, data: updated });
  } catch (error) { next(error); }
};

const deleteClass = async (req, res, next) => {
  try {
    const cls = await Class.findById(req.params.id);
    if (!cls) return res.status(404).json({ success: false, message: 'Class not found' });
    await Class.delete(req.params.id);
    res.json({ success: true, message: 'Class deleted' });
  } catch (error) { next(error); }
};

const getStudentsByClass = async (req, res, next) => {
  try {
    const students = await Class.getStudentsByClass(req.params.id);
    res.json({ success: true, count: students.length, data: students });
  } catch (error) { next(error); }
};

const assignStudentsToClass = async (req, res, next) => {
  try {
    const { student_ids } = req.body;
    if (!student_ids || !Array.isArray(student_ids)) {
      return res.status(400).json({ success: false, message: 'Please provide an array of student_ids' });
    }
    const cls = await Class.findById(req.params.id);
    if (!cls) return res.status(404).json({ success: false, message: 'Class not found' });

    await Class.assignStudents(req.params.id, student_ids);
    res.json({ success: true, message: `Successfully assigned ${student_ids.length} students to the class` });
  } catch (error) { next(error); }
};

// --- Custom Combobox Helpers & Options ---

const getDepartmentsList = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT id as department_id, name as department_name, code FROM Departments ORDER BY name');
    res.json({ success: true, data: rows });
  } catch (error) { next(error); }
};

const getYearsList = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT DISTINCT year FROM Classes ORDER BY year');
    let years = rows.map(r => ({ year_id: String(r.year), year_name: `Year ${r.year}` }));
    if (years.length === 0) {
      years = [
        { year_id: '1', year_name: 'Year 1' },
        { year_id: '2', year_name: 'Year 2' },
        { year_id: '3', year_name: 'Year 3' },
        { year_id: '4', year_name: 'Year 4' }
      ];
    }
    res.json({ success: true, data: years });
  } catch (error) { next(error); }
};

const getSectionsList = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT DISTINCT section FROM Classes ORDER BY section');
    let sections = rows.map(r => ({ section_id: r.section, section_name: `Section ${r.section}` }));
    if (sections.length === 0) {
      sections = [
        { section_id: 'A', section_name: 'Section A' },
        { section_id: 'B', section_name: 'Section B' },
        { section_id: 'C', section_name: 'Section C' }
      ];
    }
    res.json({ success: true, data: sections });
  } catch (error) { next(error); }
};

const getSubjectsList = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT id as subject_id, name as subject_name, code, department_id FROM Subjects ORDER BY name');
    res.json({ success: true, data: rows });
  } catch (error) { next(error); }
};

// Ensure or create Class combination (Department, Year, Section, Subject)
const ensureClassCombination = async (req, res, next) => {
  try {
    let { department_name, year_val, section_val, subject_name } = req.body;
    if (!department_name || !year_val || !section_val || !subject_name) {
      return res.status(400).json({ success: false, message: 'Department, Year, Section, and Subject are required.' });
    }

    // Clean values
    department_name = String(department_name).trim();
    year_val = parseInt(String(year_val).replace(/\D/g, ''), 10) || 1;
    section_val = String(section_val).replace(/^Section\s*/i, '').trim().toUpperCase() || 'A';
    subject_name = String(subject_name).trim();

    // 1. Ensure Department in MySQL
    let [deptRows] = await pool.query('SELECT id FROM Departments WHERE name = ? OR code = ?', [department_name, department_name.substring(0, 5).toUpperCase()]);
    let deptId;
    if (deptRows.length > 0) {
      deptId = deptRows[0].id;
    } else {
      const code = department_name.substring(0, 5).toUpperCase() + Math.floor(Math.random() * 100);
      const [insertDept] = await pool.query('INSERT INTO Departments (name, code) VALUES (?, ?)', [department_name, code]);
      deptId = insertDept.insertId;
    }

    // 2. Ensure Subject in MySQL
    let [subRows] = await pool.query('SELECT id FROM Subjects WHERE name = ?', [subject_name]);
    let subId;
    if (subRows.length > 0) {
      subId = subRows[0].id;
    } else {
      const subCode = 'SUB' + Math.floor(100 + Math.random() * 900);
      const [insertSub] = await pool.query('INSERT INTO Subjects (name, code, department_id) VALUES (?, ?, ?)', [subject_name, subCode, deptId]);
      subId = insertSub.insertId;
    }

    // 3. Ensure Class in MySQL
    let [classRows] = await pool.query('SELECT id FROM Classes WHERE department_id = ? AND year = ? AND section = ?', [deptId, year_val, section_val]);
    let classId;
    if (classRows.length > 0) {
      classId = classRows[0].id;
    } else {
      const [insertClass] = await pool.query('INSERT INTO Classes (department_id, year, section) VALUES (?, ?, ?)', [deptId, year_val, section_val]);
      classId = insertClass.insertId;
    }

    const classData = {
      class_id: classId,
      department_id: deptId,
      department_name,
      year: year_val,
      section: section_val,
      section_name: `Section ${section_val}`,
      subject_id: subId,
      subject_name
    };

    res.json({
      success: true,
      data: [classData]
    });
  } catch (error) {
    next(error);
  }
};

const searchClass = async (req, res, next) => {
  try {
    const { department_id, year_id, section_id, subject_id } = req.query;
    
    // Check if params are numbers or names
    let [classes] = await pool.query(`
      SELECT c.id as class_id, c.department_id, d.name as department_name, 
             c.year, c.section, concat('Section ', c.section) as section_name,
             s.id as subject_id, s.name as subject_name
      FROM Classes c
      LEFT JOIN Departments d ON c.department_id = d.id
      LEFT JOIN Subjects s ON s.department_id = d.id
      WHERE (c.department_id = ? OR d.name = ?)
        AND (c.year = ? OR concat('Year ', c.year) = ?)
        AND (c.section = ? OR concat('Section ', c.section) = ?)
        AND (s.id = ? OR s.name = ?)
      LIMIT 1
    `, [department_id, department_id, year_id, year_id, section_id, section_id, subject_id, subject_id]);

    if (classes.length > 0) {
      return res.json({ success: true, data: classes });
    }

    // Fallback: search just class
    let [fallback] = await pool.query(`
      SELECT c.id as class_id, c.department_id, d.name as department_name,
             c.year, c.section, concat('Section ', c.section) as section_name
      FROM Classes c
      LEFT JOIN Departments d ON c.department_id = d.id
      WHERE (c.department_id = ? OR d.name = ?)
    `, [department_id, department_id]);

    if (fallback.length > 0) {
      return res.json({
        success: true,
        data: [{
          ...fallback[0],
          subject_id: subject_id,
          subject_name: 'Selected Subject'
        }]
      });
    }

    res.json({ success: false, message: 'Class combination not found' });
  } catch (error) {
    next(error);
  }
};

module.exports = { 
  getClasses, getClassById, createClass, updateClass, deleteClass,
  getStudentsByClass, assignStudentsToClass,
  getDepartmentsList, getYearsList, getSectionsList, getSubjectsList,
  ensureClassCombination, searchClass
};
