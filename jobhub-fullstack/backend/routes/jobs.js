const express = require('express');
const router = express.Router();
const { executeQuery, sql } = require('../config/database');

// Lấy danh sách jobs với bộ lọc và phân trang
router.get('/search', async (req, res) => {
  try {
    const {
      keyword = '',
      location = '',
      category = '',
      jobTypes = '',
      experience = '',
      salary = '',
      companySize = '',
      page = 1,
      limit = 10,
      sortBy = 'newest'
    } = req.query;

    // Build base query
    let query = `
      SELECT 
        j.job_id, j.title, j.description, j.job_type, 
        j.salary_min, j.salary_max, j.salary_unit,
        j.location, j.experience_level, j.deadline, j.created_at,
        j.view_count, j.requirements, j.benefits,
        e.company_name, e.industry, e.company_size,
        e.logo_url, e.description as company_description,
        u.full_name as employer_name,
        c.name as category_name,
        COUNT(*) OVER() as total_count
      FROM Jobs j
      INNER JOIN Employers e ON j.employer_id = e.employer_id
      INNER JOIN Users u ON e.user_id = u.user_id
      LEFT JOIN JobCategories jc ON j.job_id = jc.job_id
      LEFT JOIN Categories c ON jc.category_id = c.category_id
      WHERE j.is_active = 1 AND (j.deadline IS NULL OR j.deadline >= CAST(GETDATE() AS DATE))
    `;

    const params = {};

    // Apply filters
    if (keyword) {
      query += ` AND (j.title LIKE '%' + @keyword + '%' OR j.description LIKE '%' + @keyword + '%' OR e.company_name LIKE '%' + @keyword + '%')`;
      params.keyword = keyword;
    }

    if (location && location !== 'all') {
      query += ` AND j.location = @location`;
      params.location = location;
    }

    if (category && category !== 'all') {
      query += ` AND c.name = @category`;
      params.category = category;
    }

    if (jobTypes) {
      const types = jobTypes.split(',');
      const placeholders = types.map((_, index) => `@jobType${index}`).join(',');
      query += ` AND j.job_type IN (${placeholders})`;
      types.forEach((type, index) => {
        params[`jobType${index}`] = type;
      });
    }

    if (experience) {
      const levels = experience.split(',');
      const placeholders = levels.map((_, index) => `@expLevel${index}`).join(',');
      query += ` AND j.experience_level IN (${placeholders})`;
      levels.forEach((level, index) => {
        params[`expLevel${index}`] = level;
      });
    }

    // Apply sorting
    switch (sortBy) {
      case 'salary':
        query += ` ORDER BY COALESCE(j.salary_max, 0) DESC`;
        break;
      case 'deadline':
        query += ` ORDER BY j.deadline ASC`;
        break;
      case 'relevant':
        query += ` ORDER BY j.view_count DESC, j.created_at DESC`;
        break;
      default:
        query += ` ORDER BY j.created_at DESC`;
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    query += ` OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`;

    const result = await executeQuery(query, params);

    const jobs = result.recordset;
    const totalCount = jobs.length > 0 ? jobs[0].total_count : 0;

    res.json({
      success: true,
      data: jobs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalCount: totalCount,
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Search jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi tìm kiếm việc làm: ' + error.message
    });
  }
});

// Lấy chi tiết job
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        j.*,
        e.company_name, e.industry, e.company_size, e.description as company_description,
        e.website, e.logo_url, e.is_verified,
        u.full_name as employer_name, u.email as employer_email, u.phone as employer_phone,
        c.name as category_name, c.category_id
      FROM Jobs j
      INNER JOIN Employers e ON j.employer_id = e.employer_id
      INNER JOIN Users u ON e.user_id = u.user_id
      LEFT JOIN JobCategories jc ON j.job_id = jc.job_id
      LEFT JOIN Categories c ON jc.category_id = c.category_id
      WHERE j.job_id = @jobId AND j.is_active = 1
    `;

    const result = await executeQuery(query, { jobId: parseInt(id) });

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy việc làm'
      });
    }

    // Increase view count
    await executeQuery(
      'UPDATE Jobs SET view_count = view_count + 1 WHERE job_id = @jobId',
      { jobId: parseInt(id) }
    );

    res.json({
      success: true,
      data: result.recordset[0]
    });

  } catch (error) {
    console.error('Get job detail error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy chi tiết việc làm: ' + error.message
    });
  }
});

// Lưu job
router.post('/:id/save', async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId } = req.body;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu studentId'
      });
    }

    // Check if job exists
    const jobCheck = await executeQuery(
      'SELECT job_id FROM Jobs WHERE job_id = @jobId AND is_active = 1',
      { jobId: parseInt(id) }
    );

    if (jobCheck.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy việc làm'
      });
    }

    // Check if already saved
    const saveCheck = await executeQuery(
      'SELECT saved_id FROM SavedJobs WHERE student_id = @studentId AND job_id = @jobId',
      { studentId: parseInt(studentId), jobId: parseInt(id) }
    );

    if (saveCheck.recordset.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Đã lưu việc làm này trước đó'
      });
    }

    // Save job
    await executeQuery(
      'INSERT INTO SavedJobs (student_id, job_id) VALUES (@studentId, @jobId)',
      { studentId: parseInt(studentId), jobId: parseInt(id) }
    );

    res.json({
      success: true,
      message: 'Đã lưu việc làm thành công'
    });

  } catch (error) {
    console.error('Save job error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lưu việc làm: ' + error.message
    });
  }
});

// Bỏ lưu job
router.delete('/:id/save', async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId } = req.body;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu studentId'
      });
    }

    const result = await executeQuery(
      'DELETE FROM SavedJobs WHERE student_id = @studentId AND job_id = @jobId',
      { studentId: parseInt(studentId), jobId: parseInt(id) }
    );

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy việc làm đã lưu'
      });
    }

    res.json({
      success: true,
      message: 'Đã bỏ lưu việc làm'
    });

  } catch (error) {
    console.error('Unsave job error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi bỏ lưu việc làm: ' + error.message
    });
  }
});

// Lấy danh sách jobs đã lưu của student
router.get('/saved/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;

    const query = `
      SELECT 
        j.job_id, j.title, j.description, j.job_type, 
        j.salary_min, j.salary_max, j.location,
        j.experience_level, j.deadline, j.created_at,
        e.company_name, e.logo_url,
        sj.saved_at
      FROM SavedJobs sj
      INNER JOIN Jobs j ON sj.job_id = j.job_id
      INNER JOIN Employers e ON j.employer_id = e.employer_id
      WHERE sj.student_id = @studentId AND j.is_active = 1
      ORDER BY sj.saved_at DESC
    `;

    const result = await executeQuery(query, { studentId: parseInt(studentId) });

    res.json({
      success: true,
      data: result.recordset
    });

  } catch (error) {
    console.error('Get saved jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách việc làm đã lưu: ' + error.message
    });
  }
});

// Lấy danh sách jobs đơn giản (cho trang chủ)
router.get('/', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const query = `
      SELECT TOP ${limit}
        j.job_id, j.title, j.description, j.job_type, 
        j.salary_min, j.salary_max, j.location,
        j.experience_level, j.deadline, j.created_at,
        e.company_name, e.logo_url
      FROM Jobs j
      INNER JOIN Employers e ON j.employer_id = e.employer_id
      WHERE j.is_active = 1
      ORDER BY j.created_at DESC
    `;

    const result = await executeQuery(query);

    res.json({
      success: true,
      data: result.recordset
    });

  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách việc làm: ' + error.message
    });
  }
});

module.exports = router;