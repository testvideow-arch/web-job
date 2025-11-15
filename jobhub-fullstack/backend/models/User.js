const { getPool, sql } = require('../config/database');

class User {
  // Đăng ký user mới
  static async register(userData) {
    try {
      const pool = getPool();
      
      const result = await pool.request()
        .input('email', sql.NVarChar, userData.email)
        .input('password_hash', sql.NVarChar, userData.password_hash)
        .input('full_name', sql.NVarChar, userData.full_name)
        .input('phone', sql.NVarChar, userData.phone)
        .input('user_type', sql.NVarChar, userData.user_type)
        .query(`
          INSERT INTO Users (email, password_hash, full_name, phone, user_type)
          OUTPUT INSERTED.user_id
          VALUES (@email, @password_hash, @full_name, @phone, @user_type)
        `);
      
      const userId = result.recordset[0].user_id;

      // Tạo profile tương ứng
      if (userData.user_type === 'student') {
        await pool.request()
          .input('user_id', sql.Int, userId)
          .input('university', sql.NVarChar, userData.university || '')
          .input('major', sql.NVarChar, userData.major || '')
          .query(`
            INSERT INTO Students (user_id, university, major)
            VALUES (@user_id, @university, @major)
          `);
      } else if (userData.user_type === 'employer') {
        await pool.request()
          .input('user_id', sql.Int, userId)
          .input('company_name', sql.NVarChar, userData.company_name || '')
          .query(`
            INSERT INTO Employers (user_id, company_name)
            VALUES (@user_id, @company_name)
          `);
      }

      return userId;
    } catch (error) {
      throw error;
    }
  }

  // Đăng nhập
  static async login(email, password) {
    try {
      const pool = getPool();
      
      const result = await pool.request()
        .input('email', sql.NVarChar, email)
        .query(`
          SELECT u.*, 
                 s.student_id, s.university, s.major,
                 e.employer_id, e.company_name
          FROM Users u
          LEFT JOIN Students s ON u.user_id = s.user_id
          LEFT JOIN Employers e ON u.user_id = e.user_id
          WHERE u.email = @email AND u.is_active = 1
        `);
      
      if (result.recordset.length === 0) {
        return null;
      }

      const user = result.recordset[0];
      
      // Trong thực tế, nên dùng bcrypt để so sánh mật khẩu
      if (user.password_hash !== password) {
        return null;
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  // Kiểm tra email tồn tại
  static async checkEmailExists(email) {
    try {
      const pool = getPool();
      
      const result = await pool.request()
        .input('email', sql.NVarChar, email)
        .query('SELECT user_id FROM Users WHERE email = @email');
      
      return result.recordset.length > 0;
    } catch (error) {
      throw error;
    }
  }

  // Lấy user by ID
  static async getById(userId) {
    try {
      const pool = getPool();
      
      const result = await pool.request()
        .input('user_id', sql.Int, userId)
        .query(`
          SELECT u.*, 
                 s.student_id, s.university, s.major,
                 e.employer_id, e.company_name
          FROM Users u
          LEFT JOIN Students s ON u.user_id = s.user_id
          LEFT JOIN Employers e ON u.user_id = e.user_id
          WHERE u.user_id = @user_id
        `);
      
      return result.recordset[0] || null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;