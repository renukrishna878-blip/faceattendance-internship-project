const pool = require('../config/db');

const Department = {
  findAll: async () => {
    const [rows] = await pool.query('SELECT * FROM Departments ORDER BY name ASC');
    return rows;
  },

  findById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM Departments WHERE id = ?', [id]);
    return rows[0];
  },

  create: async (data) => {
    const { name, code } = data;
    const [result] = await pool.query('INSERT INTO Departments (name, code) VALUES (?, ?)', [name, code]);
    return result.insertId;
  },

  update: async (id, data) => {
    const { name, code } = data;
    await pool.query('UPDATE Departments SET name = ?, code = ? WHERE id = ?', [name, code, id]);
  },

  delete: async (id) => {
    await pool.query('DELETE FROM Departments WHERE id = ?', [id]);
  }
};

module.exports = Department;
