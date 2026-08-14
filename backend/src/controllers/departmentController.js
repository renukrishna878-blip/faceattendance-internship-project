const Department = require('../models/departmentModel');

const getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.findAll();
    res.json({ success: true, count: departments.length, data: departments });
  } catch (error) { next(error); }
};

const getDepartmentById = async (req, res, next) => {
  try {
    const dept = await Department.findById(req.params.id);
    if (!dept) return res.status(404).json({ success: false, message: 'Department not found' });
    res.json({ success: true, data: dept });
  } catch (error) { next(error); }
};

const createDepartment = async (req, res, next) => {
  try {
    const { name, code } = req.body;
    if (!name || !code) return res.status(400).json({ success: false, message: 'Name and code required' });
    const id = await Department.create({ name, code });
    const newDept = await Department.findById(id);
    res.status(201).json({ success: true, data: newDept });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(400).json({ success: false, message: 'Code already exists' });
    next(error);
  }
};

const updateDepartment = async (req, res, next) => {
  try {
    const dept = await Department.findById(req.params.id);
    if (!dept) return res.status(404).json({ success: false, message: 'Department not found' });
    await Department.update(req.params.id, req.body);
    const updated = await Department.findById(req.params.id);
    res.json({ success: true, data: updated });
  } catch (error) { next(error); }
};

const deleteDepartment = async (req, res, next) => {
  try {
    const dept = await Department.findById(req.params.id);
    if (!dept) return res.status(404).json({ success: false, message: 'Department not found' });
    await Department.delete(req.params.id);
    res.json({ success: true, message: 'Department deleted' });
  } catch (error) { next(error); }
};

module.exports = { getDepartments, getDepartmentById, createDepartment, updateDepartment, deleteDepartment };
