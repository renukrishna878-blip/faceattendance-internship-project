const pool = require('../config/db');

const Class = {
  findAll: async () => {
    const [rows] = await pool.query(`
      SELECT c.*, d.name as department_name, d.code as department_code 
      FROM Classes c
      LEFT JOIN Departments d ON c.department_id = d.id
      ORDER BY c.year ASC, c.section ASC
    `);
    return rows;
  },

  findById: async (id) => {
    const [rows] = await pool.query(`
      SELECT c.*, d.name as department_name, d.code as department_code 
      FROM Classes c
      LEFT JOIN Departments d ON c.department_id = d.id
      WHERE c.id = ?
    `, [id]);
    return rows[0];
  },

  create: async (data) => {
    const { department_id, year, section } = data;
    const [result] = await pool.query('INSERT INTO Classes (department_id, year, section) VALUES (?, ?, ?)', [department_id, year, section]);
    return result.insertId;
  },

  update: async (id, data) => {
    const { department_id, year, section } = data;
    await pool.query('UPDATE Classes SET department_id = ?, year = ?, section = ? WHERE id = ?', [department_id, year, section, id]);
  },

  delete: async (id) => {
    await pool.query('DELETE FROM Classes WHERE id = ?', [id]);
  },

  getStudentsByClass: async (classId) => {
    const [rows] = await pool.query(`
      SELECT s.id, s.register_number, s.name, s.email, s.face_embedding,
        COALESCE((SELECT photo_url FROM StudentPhotos p WHERE p.student_id = s.id AND is_primary = TRUE LIMIT 1), s.photo_url) as primary_photo,
        s.photo_url
      FROM Students s
      WHERE s.class_id = ?
      ORDER BY s.register_number ASC
    `, [classId]);
    return rows;
  },

  assignStudents: async (classId, studentIds) => {
    if (!studentIds || studentIds.length === 0) return;
    // We create placeholders like (?,?,?)
    const placeholders = studentIds.map(() => '?').join(',');
    
    await pool.query(`
      UPDATE Students 
      SET class_id = ? 
      WHERE id IN (${placeholders})
    `, [classId, ...studentIds]);
  }
};

module.exports = Class;
