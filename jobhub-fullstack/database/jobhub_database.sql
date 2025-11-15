-- =============================================
-- JobHub Database Schema - FIXED VERSION
-- =============================================

CREATE DATABASE JobHub;
GO

USE JobHub;
GO

-- =============================================
-- 1. BẢNG NGƯỜI DÙNG (USERS)
-- =============================================
CREATE TABLE Users (
    user_id INT PRIMARY KEY IDENTITY(1,1),
    email NVARCHAR(255) UNIQUE NOT NULL,
    password_hash NVARCHAR(255) NOT NULL,
    full_name NVARCHAR(100) NOT NULL,
    phone NVARCHAR(20),
    user_type NVARCHAR(20) NOT NULL CHECK (user_type IN ('student', 'employer', 'admin')),
    avatar_url NVARCHAR(500),
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
);
GO

-- =============================================
-- 2. BẢNG SINH VIÊN (STUDENTS)
-- =============================================
CREATE TABLE Students (
    student_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT UNIQUE NOT NULL FOREIGN KEY REFERENCES Users(user_id),
    student_code NVARCHAR(20),
    university NVARCHAR(200),
    major NVARCHAR(100),
    graduation_year INT,
    gpa DECIMAL(3,2),
    skills NVARCHAR(MAX),
    bio NVARCHAR(1000),
    resume_url NVARCHAR(500)
);
GO

-- =============================================
-- 3. BẢNG NHÀ TUYỂN DỤNG (EMPLOYERS)
-- =============================================
CREATE TABLE Employers (
    employer_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT UNIQUE NOT NULL FOREIGN KEY REFERENCES Users(user_id),
    company_name NVARCHAR(200) NOT NULL,
    company_size NVARCHAR(50),
    industry NVARCHAR(100),
    website NVARCHAR(255),
    description NVARCHAR(1000),
    logo_url NVARCHAR(500),
    tax_code NVARCHAR(50),
    is_verified BIT DEFAULT 0
);
GO

-- =============================================
-- 4. BẢNG VIỆC LÀM (JOBS)
-- =============================================
CREATE TABLE Jobs (
    job_id INT PRIMARY KEY IDENTITY(1,1),
    employer_id INT NOT NULL FOREIGN KEY REFERENCES Employers(employer_id),
    title NVARCHAR(200) NOT NULL,
    description NVARCHAR(MAX) NOT NULL,
    requirements NVARCHAR(MAX),
    benefits NVARCHAR(MAX),
    job_type NVARCHAR(50) NOT NULL CHECK (job_type IN ('full_time', 'part_time', 'internship', 'freelance')),
    salary_min DECIMAL(12,2),
    salary_max DECIMAL(12,2),
    salary_unit NVARCHAR(20) DEFAULT 'VND',
    location NVARCHAR(200) NOT NULL,
    address NVARCHAR(500),
    experience_level NVARCHAR(50) CHECK (experience_level IN ('intern', 'fresher', 'junior', 'middle', 'senior')),
    deadline DATE,
    is_active BIT DEFAULT 1,
    view_count INT DEFAULT 0,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
);
GO

-- =============================================
-- 5. BẢNG ỨNG TUYỂN (APPLICATIONS)
-- =============================================
CREATE TABLE Applications (
    application_id INT PRIMARY KEY IDENTITY(1,1),
    job_id INT NOT NULL FOREIGN KEY REFERENCES Jobs(job_id),
    student_id INT NOT NULL FOREIGN KEY REFERENCES Students(student_id),
    cover_letter NVARCHAR(MAX),
    resume_url NVARCHAR(500),
    status NVARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'accepted', 'rejected', 'cancelled')),
    applied_at DATETIME2 DEFAULT GETDATE(),
    reviewed_at DATETIME2,
    notes NVARCHAR(1000)
);
GO

-- Thêm constraint UNIQUE sau khi tạo bảng
ALTER TABLE Applications ADD CONSTRAINT UQ_Job_Student UNIQUE(job_id, student_id);
GO

-- =============================================
-- 6. BẢNG DANH MỤC (CATEGORIES)
-- =============================================
CREATE TABLE Categories (
    category_id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(100) NOT NULL,
    description NVARCHAR(500),
    icon_url NVARCHAR(500),
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE()
);
GO

-- =============================================
-- 7. BẢNG PHÂN LOẠI VIỆC LÀM (JOB_CATEGORIES)
-- =============================================
CREATE TABLE JobCategories (
    job_id INT NOT NULL FOREIGN KEY REFERENCES Jobs(job_id),
    category_id INT NOT NULL FOREIGN KEY REFERENCES Categories(category_id),
    PRIMARY KEY (job_id, category_id)
);
GO

-- =============================================
-- 8. BẢNG KỸ NĂNG (SKILLS)
-- =============================================
CREATE TABLE Skills (
    skill_id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(100) NOT NULL,
    description NVARCHAR(500),
    category_id INT FOREIGN KEY REFERENCES Categories(category_id),
    is_active BIT DEFAULT 1
);
GO

-- =============================================
-- 9. BẢNG KỸ NĂNG SINH VIÊN (STUDENT_SKILLS)
-- =============================================
CREATE TABLE StudentSkills (
    student_id INT NOT NULL FOREIGN KEY REFERENCES Students(student_id),
    skill_id INT NOT NULL FOREIGN KEY REFERENCES Skills(skill_id),
    proficiency_level NVARCHAR(50) CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    years_of_experience INT,
    PRIMARY KEY (student_id, skill_id)
);
GO

-- =============================================
-- 10. BẢNG VIỆC LÀM ĐÃ LƯU (SAVED_JOBS)
-- =============================================
CREATE TABLE SavedJobs (
    saved_id INT PRIMARY KEY IDENTITY(1,1),
    student_id INT NOT NULL FOREIGN KEY REFERENCES Students(student_id),
    job_id INT NOT NULL FOREIGN KEY REFERENCES Jobs(job_id),
    saved_at DATETIME2 DEFAULT GETDATE(),
    notes NVARCHAR(500)
);
GO

-- Thêm constraint UNIQUE sau khi tạo bảng
ALTER TABLE SavedJobs ADD CONSTRAINT UQ_SavedJob_Student UNIQUE(student_id, job_id);
GO

-- =============================================
-- 11. BẢNG BLOG POSTS
-- =============================================
CREATE TABLE BlogPosts (
    post_id INT PRIMARY KEY IDENTITY(1,1),
    title NVARCHAR(255) NOT NULL,
    content NVARCHAR(MAX) NOT NULL,
    excerpt NVARCHAR(500),
    author_id INT NOT NULL FOREIGN KEY REFERENCES Users(user_id),
    category NVARCHAR(100),
    featured_image NVARCHAR(500),
    is_published BIT DEFAULT 0,
    view_count INT DEFAULT 0,
    created_at DATETIME2 DEFAULT GETDATE(),
    published_at DATETIME2,
    updated_at DATETIME2 DEFAULT GETDATE()
);
GO

-- =============================================
-- 12. BẢNG ĐÁNH GIÁ (REVIEWS)
-- =============================================
CREATE TABLE Reviews (
    review_id INT PRIMARY KEY IDENTITY(1,1),
    employer_id INT NOT NULL FOREIGN KEY REFERENCES Employers(employer_id),
    student_id INT NOT NULL FOREIGN KEY REFERENCES Students(student_id),
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment NVARCHAR(1000),
    is_anonymous BIT DEFAULT 0,
    created_at DATETIME2 DEFAULT GETDATE()
);
GO

-- =============================================
-- 13. BẢNG THÔNG BÁO (NOTIFICATIONS)
-- =============================================
CREATE TABLE Notifications (
    notification_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL FOREIGN KEY REFERENCES Users(user_id),
    title NVARCHAR(255) NOT NULL,
    message NVARCHAR(1000) NOT NULL,
    type NVARCHAR(50) CHECK (type IN ('info', 'success', 'warning', 'error')),
    is_read BIT DEFAULT 0,
    related_url NVARCHAR(500),
    created_at DATETIME2 DEFAULT GETDATE()
);
GO

-- =============================================
-- =============================================
-- 14. DỮ LIỆU MẪU (SAMPLE DATA) - CLEANED VERSION
-- =============================================

-- Thêm categories (CẦN THIẾT - giữ lại)
INSERT INTO Categories (name, description) VALUES
('IT & Phần mềm', 'Công việc về công nghệ thông tin và phát triển phần mềm'),
('Kinh doanh & Marketing', 'Công việc về kinh doanh, marketing và bán hàng'),
('Thiết kế & Sáng tạo', 'Công việc về thiết kế đồ họa, UI/UX'),
('Kế toán & Tài chính', 'Công việc về kế toán, tài chính, ngân hàng'),
('Giáo dục & Đào tạo', 'Công việc về giảng dạy và đào tạo');
GO

-- Thêm skills (CẦN THIẾT - giữ lại)
INSERT INTO Skills (name, category_id) VALUES
('JavaScript', 1),
('Python', 1),
('ReactJS', 1),
('Node.js', 1),
('Photoshop', 3),
('Figma', 3),
('Digital Marketing', 2),
('Content Writing', 2);
GO

-- Thêm admin user (CẦN THIẾT - giữ lại)
INSERT INTO Users (email, password_hash, full_name, phone, user_type) VALUES
('admin@jobhub.vn', 'hashed_password_123', 'Admin JobHub', '0123456789', 'admin');
GO

-- XÓA HOÀN TOÀN các sample students và applications
-- CHỈ GIỮ LẠI 2 employers mẫu để demo (không bắt buộc)
INSERT INTO Users (email, password_hash, full_name, phone, user_type) VALUES
('hr@techcorp.vn', 'hashed_password_123', 'Nguyễn Văn A', '0987654321', 'employer'),
('tuyendung@fpt.com', 'hashed_password_123', 'Trần Thị B', '0912345678', 'employer');
GO

INSERT INTO Employers (user_id, company_name, industry, website, is_verified) VALUES
(2, 'Tech Corp Vietnam', 'Công nghệ phần mềm', 'https://techcorp.vn', 1),
(3, 'FPT Software', 'Công nghệ thông tin', 'https://fptsoftware.com', 1);
GO

-- XÓA HOÀN TOÀN phần thêm sample students và users
-- KHÔNG THÊM sample students nào cả

-- XÓA HOÀN TOÀN phần thêm sample jobs
-- KHÔNG THÊM sample jobs nào cả

-- XÓA HOÀN TOÀN phần thêm sample applications
-- KHÔNG THÊM sample applications nào cả

-- =============================================
-- 15. TẠO INDEX ĐỂ TỐI ƯU HIỆU SUẤT
-- =============================================

-- Index cho users
CREATE INDEX IX_Users_Email ON Users(email);
CREATE INDEX IX_Users_UserType ON Users(user_type);
GO

-- Index cho jobs
CREATE INDEX IX_Jobs_Employer ON Jobs(employer_id);
CREATE INDEX IX_Jobs_Location ON Jobs(location);
CREATE INDEX IX_Jobs_JobType ON Jobs(job_type);
CREATE INDEX IX_Jobs_Deadline ON Jobs(deadline);
GO

-- Index cho applications
CREATE INDEX IX_Applications_Job ON Applications(job_id);
CREATE INDEX IX_Applications_Student ON Applications(student_id);
CREATE INDEX IX_Applications_Status ON Applications(status);
GO

-- Index cho blog posts
CREATE INDEX IX_BlogPosts_Author ON BlogPosts(author_id);
CREATE INDEX IX_BlogPosts_Published ON BlogPosts(is_published, published_at);
GO

-- =============================================
-- 16. TẠO VIEWS ĐỂ TRUY VẤN THUẬN TIỆN
-- =============================================

-- View hiển thị thông tin việc làm chi tiết
CREATE VIEW JobDetails AS
SELECT 
    j.job_id,
    j.title,
    j.description,
    j.requirements,
    j.benefits,
    j.job_type,
    j.salary_min,
    j.salary_max,
    j.salary_unit,
    j.location,
    j.experience_level,
    j.deadline,
    j.created_at,
    e.company_name,
    e.industry,
    u.email as employer_email,
    u.phone as employer_phone
FROM Jobs j
INNER JOIN Employers e ON j.employer_id = e.employer_id
INNER JOIN Users u ON e.user_id = u.user_id
WHERE j.is_active = 1;
GO

-- View hiển thị ứng tuyển chi tiết
CREATE VIEW ApplicationDetails AS
SELECT 
    a.application_id,
    a.status,
    a.applied_at,
    j.title as job_title,
    e.company_name,
    s.student_id,
    u.full_name as student_name,
    u.email as student_email,
    u.phone as student_phone
FROM Applications a
INNER JOIN Jobs j ON a.job_id = j.job_id
INNER JOIN Employers e ON j.employer_id = e.employer_id
INNER JOIN Students s ON a.student_id = s.student_id
INNER JOIN Users u ON s.user_id = u.user_id;
GO

-- =============================================
-- 17. STORED PROCEDURES
-- =============================================

-- Procedure đăng ký user mới
CREATE PROCEDURE RegisterUser
    @email NVARCHAR(255),
    @password_hash NVARCHAR(255),
    @full_name NVARCHAR(100),
    @phone NVARCHAR(20),
    @user_type NVARCHAR(20)
AS
BEGIN
    INSERT INTO Users (email, password_hash, full_name, phone, user_type)
    VALUES (@email, @password_hash, @full_name, @phone, @user_type);
    
    SELECT SCOPE_IDENTITY() as user_id;
END;
GO

-- Procedure tạo job mới
CREATE PROCEDURE CreateJob
    @employer_id INT,
    @title NVARCHAR(200),
    @description NVARCHAR(MAX),
    @requirements NVARCHAR(MAX),
    @job_type NVARCHAR(50),
    @salary_min DECIMAL(12,2),
    @salary_max DECIMAL(12,2),
    @location NVARCHAR(200)
AS
BEGIN
    INSERT INTO Jobs (employer_id, title, description, requirements, job_type, salary_min, salary_max, location)
    VALUES (@employer_id, @title, @description, @requirements, @job_type, @salary_min, @salary_max, @location);
    
    SELECT SCOPE_IDENTITY() as job_id;
END;
GO

-- =============================================
-- XONG! DATABASE ĐÃ SẴN SÀNG
-- =============================================

PRINT '✅ JobHub database đã được tạo thành công!';
PRINT '📊 Tổng số bảng: 14 bảng';
PRINT '👥 Sample data: 2 employers, 2 students, 2 jobs';
PRINT '🚀 Sẵn sàng sử dụng!';