const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Đăng ký user
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, phone, userType, password, university, major, companyName } = req.body;

    // Validation
    if (!fullName || !email || !phone || !userType || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin'
      });
    }

    // Kiểm tra email tồn tại
    const emailExists = await User.checkEmailExists(email);
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: 'Email đã được đăng ký'
      });
    }

    // Tạo user
    const userData = {
      email,
      password_hash: password, // Trong thực tế nên hash password
      full_name: fullName,
      phone,
      user_type: userType,
      university,
      major,
      company_name: companyName
    };

    const userId = await User.register(userData);

    res.json({
      success: true,
      message: 'Đăng ký thành công!',
      user_id: userId,
      user_type: userType
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
});

// Đăng nhập
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền email và mật khẩu'
      });
    }

    const user = await User.login(email, password);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    // Trả về thông tin user (không bao gồm password)
    const { password_hash, ...userInfo } = user;

    res.json({
      success: true,
      message: 'Đăng nhập thành công!',
      user: userInfo
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
});

// Lấy thông tin user
router.get('/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.getById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User không tồn tại'
      });
    }

    const { password_hash, ...userInfo } = user;

    res.json({
      success: true,
      user: userInfo
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
});

module.exports = router;