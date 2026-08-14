const pool = require('../config/db');

const Subject = {
  findAll: async (departmentId = null) => {
    let query = `
      SELECT s.*, d.name as department_name 
      FROM Subjects s 
      LEFT JOIN Departments d ON s.department_id = d.id
    `;
    const params = [];
    
    if (departmentId) {
      query += ` WHERE s.department_id = ?`;
      params.push(departmentId);
    }
    
    query += ` ORDER BY s.name ASC`;
    const [rows] = await pool.query(query, params);
    return rows;
  },

  findById: async (id) => {
    const [rows] = await pool.query(`
      SELECT s.*, d.name as department_name 
      FROM Subjects s 
      LEFT JOIN Departments d ON s.department_id = d.id 
      WHERE s.id = ?
    `, [id]);
    return rows[0];
  },

  create: async (data) => {
    const { code, name, department_id } = data;
    const [result] = await pool.query('INSERT INTO Subjects (code, name, department_id) VALUES (?, ?, ?)', [code, name, department_id]);
    return result.insertId;
  },

  update: async (id, data) => {
    const { code, name, department_id } = data;
    await pool.query('UPDATE Subjects SET code = ?, name = ?, department_id = ? WHERE id = ?', [code, name, department_id, id]);
  },

  delete: async (id) => {
    await pool.query('DELETE FROM Subjects WHERE id = ?', [id]);
  }
};

module.exports = Subject;
