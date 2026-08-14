const pool = require('../config/db');

const Teacher = {
  create: async ({ name, email, password_hash, department, phone, role = 'Teacher' }) => {
    const [result] = await pool.query(
      `INSERT INTO Teachers (name, email, password_hash, department, phone, role) VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, password_hash, department || null, phone || null, role]
    );
    return result.insertId;
  },

  findByEmail: async (email) => {
    const [rows] = await pool.query('SELECT * FROM Teachers WHERE email = ?', [email]);
    return rows[0];
  },

  findById: async (id) => {
    const [rows] = await pool.query(
      'SELECT id, id as teacher_id, name, email, department, phone, role, department_id, created_at, updated_at FROM Teachers WHERE id = ?',
      [id]
    );
    return rows[0];
  }
};

module.exports = Teacher;
