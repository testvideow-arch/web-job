const express = require('express');
const router = express.Router();
const { executeQuery, sql } = require('../config/database');

// Lấy thông tin student theo user_id
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const query = `
            SELECT 
                s.*, 
                u.email, 
                u.full_name, 
                u.phone, 
                u.avatar_url,
                u.user_type
            FROM Students s
            RIGHT JOIN Users u ON s.user_id = u.user_id
            WHERE u.user_id = @userId
        `;

        const result = await executeQuery(query, { userId: parseInt(userId) });

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy thông tin sinh viên'
            });
        }

        const studentData = result.recordset[0];
        
        res.json({
            success: true,
            data: {
                user_id: studentData.user_id,
                full_name: studentData.full_name,
                email: studentData.email,
                phone: studentData.phone,
                avatar_url: studentData.avatar_url,
                student_code: studentData.student_code,
                university: studentData.university,
                major: studentData.major,
                graduation_year: studentData.graduation_year,
                gpa: studentData.gpa,
                skills: studentData.skills,
                bio: studentData.bio,
                resume_url: studentData.resume_url
            }
        });

    } catch (error) {
        console.error('Get student error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi lấy thông tin sinh viên: ' + error.message
        });
    }
});

// Cập nhật thông tin sinh viên
router.put('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { 
            full_name, 
            phone, 
            student_code, 
            university, 
            major, 
            graduation_year, 
            gpa, 
            bio, 
            skills 
        } = req.body;

        console.log('Updating student profile:', { userId, ...req.body });

        const pool = require('../config/database').getPool();
        const transaction = new sql.Transaction(pool);
        
        await transaction.begin();

        try {
            const request = new sql.Request(transaction);

            // Cập nhật thông tin user
            await request
                .input('userId', sql.Int, userId)
                .input('fullName', sql.NVarChar, full_name)
                .input('phone', sql.NVarChar, phone)
                .query(`
                    UPDATE Users 
                    SET full_name = @fullName, phone = @phone, updated_at = GETDATE()
                    WHERE user_id = @userId
                `);

            // Kiểm tra xem student đã tồn tại chưa
            const studentCheck = await request
                .input('userId', sql.Int, userId)
                .query('SELECT student_id FROM Students WHERE user_id = @userId');

            if (studentCheck.recordset.length > 0) {
                // Cập nhật thông tin student
                await request
                    .input('userId', sql.Int, userId)
                    .input('studentCode', sql.NVarChar, student_code)
                    .input('university', sql.NVarChar, university)
                    .input('major', sql.NVarChar, major)
                    .input('graduationYear', sql.Int, graduation_year)
                    .input('gpa', sql.Decimal(3,2), gpa)
                    .input('bio', sql.NVarChar, bio)
                    .input('skills', sql.NVarChar, skills)
                    .query(`
                        UPDATE Students 
                        SET student_code = @studentCode, 
                            university = @university, 
                            major = @major, 
                            graduation_year = @graduationYear, 
                            gpa = @gpa, 
                            bio = @bio, 
                            skills = @skills,
                            updated_at = GETDATE()
                        WHERE user_id = @userId
                    `);
            } else {
                // Tạo mới thông tin student
                await request
                    .input('userId', sql.Int, userId)
                    .input('studentCode', sql.NVarChar, student_code)
                    .input('university', sql.NVarChar, university)
                    .input('major', sql.NVarChar, major)
                    .input('graduationYear', sql.Int, graduation_year)
                    .input('gpa', sql.Decimal(3,2), gpa)
                    .input('bio', sql.NVarChar, bio)
                    .input('skills', sql.NVarChar, skills)
                    .query(`
                        INSERT INTO Students (user_id, student_code, university, major, graduation_year, gpa, bio, skills)
                        VALUES (@userId, @studentCode, @university, @major, @graduationYear, @gpa, @bio, @skills)
                    `);
            }

            await transaction.commit();

            res.json({
                success: true,
                message: 'Cập nhật thông tin sinh viên thành công'
            });

        } catch (error) {
            await transaction.rollback();
            throw error;
        }

    } catch (error) {
        console.error('Update student error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi cập nhật thông tin sinh viên: ' + error.message
        });
    }
});

// Tạo student profile mới
router.post('/', async (req, res) => {
    try {
        const { user_id, full_name, email, phone, student_code, university, major } = req.body;

        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu user_id'
            });
        }

        // Kiểm tra xem student đã tồn tại chưa
        const existingStudent = await executeQuery(
            'SELECT student_id FROM Students WHERE user_id = @userId',
            { userId: parseInt(user_id) }
        );

        if (existingStudent.recordset.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Student profile đã tồn tại'
            });
        }

        // Tạo student profile mới
        const result = await executeQuery(
            `INSERT INTO Students (user_id, student_code, university, major) 
             OUTPUT INSERTED.student_id
             VALUES (@userId, @studentCode, @university, @major)`,
            { 
                userId: parseInt(user_id),
                studentCode: student_code || null,
                university: university || null,
                major: major || null
            }
        );

        res.json({
            success: true,
            message: 'Tạo student profile thành công',
            student_id: result.recordset[0].student_id
        });

    } catch (error) {
        console.error('Create student error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi tạo student profile: ' + error.message
        });
    }
});

// Lấy jobs đã lưu của student
router.get('/:userId/saved-jobs', async (req, res) => {
    try {
        const { userId } = req.params;

        const query = `
            SELECT 
                sj.saved_id, sj.saved_at,
                j.job_id, j.title, j.description, j.job_type, 
                j.salary_min, j.salary_max, j.location,
                j.experience_level, j.deadline,
                e.company_name, e.logo_url
            FROM SavedJobs sj
            INNER JOIN Jobs j ON sj.job_id = j.job_id
            INNER JOIN Employers e ON j.employer_id = e.employer_id
            INNER JOIN Students s ON sj.student_id = s.student_id
            WHERE s.user_id = @userId AND j.is_active = 1
            ORDER BY sj.saved_at DESC
        `;

        const result = await executeQuery(query, { userId: parseInt(userId) });

        res.json({
            success: true,
            data: result.recordset
        });

    } catch (error) {
        console.error('Get saved jobs error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi lấy việc làm đã lưu: ' + error.message
        });
    }
});

// Upload avatar
router.post('/upload-avatar', async (req, res) => {
    try {
        // Trong thực tế, cần xử lý upload file với multer
        // Ở đây chỉ giả lập
        const { userId } = req.body;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu userId'
            });
        }

        // Giả lập URL avatar
        const avatarUrl = `/uploads/avatars/${userId}-${Date.now()}.jpg`;

        // Cập nhật avatar_url trong database
        await executeQuery(
            'UPDATE Users SET avatar_url = @avatarUrl WHERE user_id = @userId',
            { 
                avatarUrl: avatarUrl, 
                userId: parseInt(userId) 
            }
        );

        res.json({
            success: true,
            message: 'Upload avatar thành công',
            avatarUrl: avatarUrl
        });

    } catch (error) {
        console.error('Upload avatar error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi upload avatar: ' + error.message
        });
    }
});

// Lấy tất cả students (cho admin)
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT 
                s.student_id, s.student_code, s.university, s.major,
                s.graduation_year, s.gpa, s.skills, s.bio,
                u.user_id, u.full_name, u.email, u.phone, u.avatar_url,
                u.created_at
            FROM Students s
            INNER JOIN Users u ON s.user_id = u.user_id
            WHERE u.is_active = 1
            ORDER BY u.created_at DESC
        `;

        const result = await executeQuery(query);

        res.json({
            success: true,
            data: result.recordset
        });

    } catch (error) {
        console.error('Get all students error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi lấy danh sách sinh viên: ' + error.message
        });
    }
});

// Xóa student (soft delete)
router.delete('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        await executeQuery(
            'UPDATE Users SET is_active = 0 WHERE user_id = @userId',
            { userId: parseInt(userId) }
        );

        res.json({
            success: true,
            message: 'Xóa sinh viên thành công'
        });

    } catch (error) {
        console.error('Delete student error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi xóa sinh viên: ' + error.message
        });
    }
});

// Cập nhật skills cho student
router.patch('/:userId/skills', async (req, res) => {
    try {
        const { userId } = req.params;
        const { skills } = req.body;

        if (!skills) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu thông tin skills'
            });
        }

        await executeQuery(
            'UPDATE Students SET skills = @skills WHERE user_id = @userId',
            { 
                skills: skills,
                userId: parseInt(userId) 
            }
        );

        res.json({
            success: true,
            message: 'Cập nhật kỹ năng thành công'
        });

    } catch (error) {
        console.error('Update skills error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi cập nhật kỹ năng: ' + error.message
        });
    }
});

// Thêm student skill với mức độ thành thạo
router.post('/:userId/skills', async (req, res) => {
    try {
        const { userId } = req.params;
        const { skill_name, proficiency_level, years_of_experience } = req.body;

        if (!skill_name) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu tên kỹ năng'
            });
        }

        // Tìm skill_id từ bảng Skills
        const skillResult = await executeQuery(
            'SELECT skill_id FROM Skills WHERE name = @skillName',
            { skillName: skill_name }
        );

        let skillId;
        if (skillResult.recordset.length === 0) {
            // Nếu skill chưa tồn tại, tạo mới
            const newSkillResult = await executeQuery(
                'INSERT INTO Skills (name) OUTPUT INSERTED.skill_id VALUES (@skillName)',
                { skillName: skill_name }
            );
            skillId = newSkillResult.recordset[0].skill_id;
        } else {
            skillId = skillResult.recordset[0].skill_id;
        }

        // Lấy student_id từ user_id
        const studentResult = await executeQuery(
            'SELECT student_id FROM Students WHERE user_id = @userId',
            { userId: parseInt(userId) }
        );

        if (studentResult.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sinh viên'
            });
        }

        const studentId = studentResult.recordset[0].student_id;

        // Thêm vào StudentSkills
        await executeQuery(
            `INSERT INTO StudentSkills (student_id, skill_id, proficiency_level, years_of_experience)
             VALUES (@studentId, @skillId, @proficiencyLevel, @yearsOfExperience)`,
            {
                studentId: studentId,
                skillId: skillId,
                proficiencyLevel: proficiency_level || 'beginner',
                yearsOfExperience: years_of_experience || null
            }
        );

        res.json({
            success: true,
            message: 'Thêm kỹ năng thành công'
        });

    } catch (error) {
        console.error('Add skill error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi thêm kỹ năng: ' + error.message
        });
    }
});

module.exports = router;