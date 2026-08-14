const Subject = require('../models/subjectModel');

const getSubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.findAll(req.query.department_id);
    res.json({ success: true, count: subjects.length, data: subjects });
  } catch (error) { next(error); }
};

const getSubjectById = async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ success: false, message: 'Subject not found' });
    res.json({ success: true, data: subject });
  } catch (error) { next(error); }
};

const createSubject = async (req, res, next) => {
  try {
    const { code, name, department_id } = req.body;
    if (!name || !code || !department_id) return res.status(400).json({ success: false, message: 'Missing fields' });
    const id = await Subject.create({ code, name, department_id });
    const newSubject = await Subject.findById(id);
    res.status(201).json({ success: true, data: newSubject });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(400).json({ success: false, message: 'Subject code already exists' });
    next(error);
  }
};

const updateSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ success: false, message: 'Subject not found' });
    await Subject.update(req.params.id, req.body);
    const updated = await Subject.findById(req.params.id);
    res.json({ success: true, data: updated });
  } catch (error) { next(error); }
};

const deleteSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ success: false, message: 'Subject not found' });
    await Subject.delete(req.params.id);
    res.json({ success: true, message: 'Subject deleted' });
  } catch (error) { next(error); }
};

module.exports = { getSubjects, getSubjectById, createSubject, updateSubject, deleteSubject };
