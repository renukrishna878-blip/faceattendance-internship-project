const pool = require('../config/db');

const Student = {
  create: async (studentData) => {
    const { register_number, name, email, phone, class_id } = studentData;
    const [result] = await pool.query(
      'INSERT INTO Students (register_number, name, email, phone, class_id) VALUES (?, ?, ?, ?, ?)',
      [register_number, name, email || null, phone || null, class_id || null]
    );
    return result.insertId;
  },

  update: async (id, studentData) => {
    const { register_number, name, email, phone, class_id } = studentData;
    await pool.query(
      'UPDATE Students SET register_number = ?, name = ?, email = ?, phone = ?, class_id = ? WHERE id = ?',
      [register_number, name, email || null, phone || null, class_id || null, id]
    );
  },

  delete: async (id) => {
    // Delete linked StudentPhotos first if any
    await pool.query('DELETE FROM StudentPhotos WHERE student_id = ?', [id]);
    await pool.query('DELETE FROM StudentEmbeddings WHERE student_id = ?', [id]);
    await pool.query('DELETE FROM Students WHERE id = ?', [id]);
  },

  saveEmbedding: async (id, embedding, imagePath = null) => {
    // 1. Update Students table
    await pool.query(
      'UPDATE Students SET face_embedding = ? WHERE id = ?',
      [JSON.stringify(embedding), id]
    );
    // 2. Clear old embedding from StudentEmbeddings table
    await pool.query('DELETE FROM StudentEmbeddings WHERE student_id = ?', [id]);
    // 3. Insert new embedding entry in StudentEmbeddings table
    await pool.query(
      'INSERT INTO StudentEmbeddings (student_id, embedding, embedding_model, image_path) VALUES (?, ?, ?, ?)',
      [id, JSON.stringify(embedding), 'ArcFace', imagePath]
    );
  },

  findByRegisterNumber: async (regNo) => {
    const [rows] = await pool.query('SELECT * FROM Students WHERE register_number = ?', [regNo]);
    return rows[0];
  },

  findById: async (id) => {
    const [students] = await pool.query(`
      SELECT s.*, c.year, c.section, d.name as department_name, d.id as department_id
      FROM Students s
      LEFT JOIN Classes c ON s.class_id = c.id
      LEFT JOIN Departments d ON c.department_id = d.id
      WHERE s.id = ?
    `, [id]);
    
    if (students.length === 0) return null;

    const [photos] = await pool.query('SELECT id, photo_url, is_primary FROM StudentPhotos WHERE student_id = ?', [id]);
    
    let embedding = null;
    if (students[0].face_embedding) {
      try {
        embedding = typeof students[0].face_embedding === 'string' 
          ? JSON.parse(students[0].face_embedding) 
          : students[0].face_embedding;
      } catch(e) {}
    }

    return { ...students[0], face_embedding: embedding, photos };
  },

  findAll: async (filters = {}, searchQuery = '') => {
    let query = `
      SELECT s.id, s.id as student_id, s.register_number, s.name, s.email, s.phone, s.photo_url, c.year, c.section, d.name as department_name 
      FROM Students s
      LEFT JOIN Classes c ON s.class_id = c.id
      LEFT JOIN Departments d ON c.department_id = d.id
      WHERE 1=1
    `;
    const queryParams = [];

    if (searchQuery) {
      query += ` AND (s.name LIKE ? OR s.register_number LIKE ? OR d.name LIKE ?)`;
      queryParams.push(`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`);
    }

    if (filters.class_id) {
      query += ` AND s.class_id = ?`;
      queryParams.push(filters.class_id);
    }

    query += ` ORDER BY s.register_number ASC`;

    const [rows] = await pool.query(query, queryParams);
    
    // Attach primary photos if photo_url is null
    for (let student of rows) {
      if (!student.photo_url) {
        const [photos] = await pool.query('SELECT photo_url FROM StudentPhotos WHERE student_id = ? ORDER BY is_primary DESC, id ASC LIMIT 1', [student.id]);
        student.photo_url = photos.length > 0 ? photos[0].photo_url : null;
      }
      student.primary_photo = student.photo_url;
    }

    return rows;
  },

  addPhotos: async (studentId, filePaths) => {
    if (!filePaths || filePaths.length === 0) return;
    
    const [existing] = await pool.query('SELECT COUNT(*) as count FROM StudentPhotos WHERE student_id = ?', [studentId]);
    const hasExisting = existing[0].count > 0;

    const values = filePaths.map((path, idx) => [studentId, path, !hasExisting && idx === 0]);

    await pool.query(
      'INSERT INTO StudentPhotos (student_id, photo_url, is_primary) VALUES ?',
      [values]
    );

    // Update Students.photo_url with the first photo path
    await pool.query('UPDATE Students SET photo_url = ? WHERE id = ?', [filePaths[0], studentId]);
  },

  replacePhoto: async (studentId, filePath) => {
    await pool.query('UPDATE Students SET photo_url = ? WHERE id = ?', [filePath, studentId]);
    await pool.query('DELETE FROM StudentPhotos WHERE student_id = ?', [studentId]);
    if (filePath) {
      await pool.query('INSERT INTO StudentPhotos (student_id, photo_url, is_primary) VALUES (?, ?, TRUE)', [studentId, filePath]);
    }
  },

  setPhotoUrl: async (studentId, filePath) => {
    await pool.query('UPDATE Students SET photo_url = ? WHERE id = ?', [filePath, studentId]);
    await pool.query('DELETE FROM StudentPhotos WHERE student_id = ?', [studentId]);
    if (filePath) {
      await pool.query('INSERT INTO StudentPhotos (student_id, photo_url, is_primary) VALUES (?, ?, TRUE)', [studentId, filePath]);
    } else {
      // If photo is deleted, explicitly clear embeddings
      await pool.query('UPDATE Students SET face_embedding = NULL WHERE id = ?', [studentId]);
      await pool.query('DELETE FROM StudentEmbeddings WHERE student_id = ?', [studentId]);
    }
  }
};

module.exports = Student;
