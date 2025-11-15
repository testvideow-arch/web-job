// js/auth.js - HOÀN CHỈNH

// =============================================
// QUẢN LÝ AUTHENTICATION
// =============================================

const AUTH = {
    currentUser: JSON.parse(localStorage.getItem('jobhub_current_user') || 'null'),

    // Kiểm tra đăng nhập
    isLoggedIn() {
        return !!this.currentUser;
    },

    // Lưu thông tin đăng nhập
    login(userData) {
        this.currentUser = userData;
        localStorage.setItem('jobhub_current_user', JSON.stringify(userData));
    },

    // Đăng xuất
    logout() {
        this.currentUser = null;
        localStorage.removeItem('jobhub_current_user');
        window.location.href = '../index.html';
    },

    // Kiểm tra và chuyển hướng nếu chưa đăng nhập
    requireAuth(redirectUrl = '../login.html') {
        if (!this.isLoggedIn()) {
            window.location.href = redirectUrl;
            return false;
        }
        return true;
    },

    // Cập nhật header theo trạng thái đăng nhập
    updateHeader() {
        if (this.currentUser) {
            // Cập nhật tên user trong header
            const userElements = document.querySelectorAll('#userFullName, #userName, .user-name');
            userElements.forEach(element => {
                if (element) {
                    element.textContent = this.currentUser.fullName || this.currentUser.email;
                }
            });

            // Hiển thị menu đã đăng nhập, ẩn menu chưa đăng nhập
            const authElements = document.querySelectorAll('.auth-required');
            authElements.forEach(element => {
                element.style.display = 'block';
            });

            const nonAuthElements = document.querySelectorAll('.non-auth');
            nonAuthElements.forEach(element => {
                element.style.display = 'none';
            });
        }
    },

    // Lấy thông tin user hiện tại
    getUser() {
        return this.currentUser;
    }
};

// =============================================
// XỬ LÝ PASSWORD
// =============================================

// Toggle password visibility
function togglePassword(inputId = "password", iconId = "togglePasswordIcon") {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);

    if (!input || !icon) return;

    if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("bi-eye");
        icon.classList.add("bi-eye-slash");
    } else {
        input.type = "password";
        icon.classList.remove("bi-eye-slash");
        icon.classList.add("bi-eye");
    }
}

// Check password strength
function checkPasswordStrength() {
    const password = document.getElementById("password")?.value;
    const strengthDiv = document.getElementById("passwordStrength");

    if (!strengthDiv || !password) return;

    if (password.length === 0) {
        strengthDiv.textContent = "";
        strengthDiv.className = "password-strength";
        return;
    }

    let strength = 0;
    let feedback = "";

    // Check length
    if (password.length >= 8) strength++;
    else feedback = "Mật khẩu phải có ít nhất 8 ký tự. ";

    // Check lowercase
    if (/[a-z]/.test(password)) strength++;
    else feedback += "Thiếu chữ thường. ";

    // Check uppercase
    if (/[A-Z]/.test(password)) strength++;
    else feedback += "Thiếu chữ hoa. ";

    // Check numbers
    if (/[0-9]/.test(password)) strength++;
    else feedback += "Thiếu số. ";

    // Check special characters
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    else feedback += "Thiếu ký tự đặc biệt. ";

    if (strength <= 2) {
        strengthDiv.textContent = "Mật khẩu yếu. " + feedback.trim();
        strengthDiv.className = "password-strength weak";
    } else if (strength === 3) {
        strengthDiv.textContent = "Mật khẩu trung bình. " + feedback.trim();
        strengthDiv.className = "password-strength medium";
    } else if (strength >= 4) {
        strengthDiv.textContent = "Mật khẩu mạnh ✓";
        strengthDiv.className = "password-strength strong";
    }
}

// Check password match
function checkPasswordMatch() {
    const password = document.getElementById("password")?.value;
    const confirmPassword = document.getElementById("confirmPassword")?.value;
    const matchDiv = document.getElementById("passwordMatch");

    if (!matchDiv) return;

    if (!confirmPassword) {
        matchDiv.textContent = "";
        matchDiv.className = "password-strength";
        return;
    }

    if (password === confirmPassword) {
        matchDiv.textContent = "Mật khẩu khớp ✓";
        matchDiv.className = "password-strength strong";
    } else {
        matchDiv.textContent = "Mật khẩu không khớp";
        matchDiv.className = "password-strength weak";
    }
}

// =============================================
// XỬ LÝ FORM
// =============================================

// Handle Login
async function handleLogin(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    const email = formData.get("email");
    const password = formData.get("password");

    // Validation
    if (!email || !password) {
        alert("Vui lòng điền đầy đủ thông tin");
        return;
    }

    // Show loading
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Đang đăng nhập...';

    try {
        // Kiểm tra thông tin đăng nhập với localStorage
        const existingUsers = JSON.parse(localStorage.getItem('jobhub_users') || '[]');
        
        // Tìm user khớp (cho phép đăng nhập bằng email hoặc phone)
        const user = existingUsers.find(u => 
            (u.email === email || u.phone === email) && u.password === password
        );

        if (user) {
            // Lưu thông tin user đang đăng nhập
            const currentUser = {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                userType: user.userType,
                loginTime: new Date().toISOString()
            };
            
            AUTH.login(currentUser);
            
            // Hiển thị thông báo thành công
            alert(`Đăng nhập thành công! Chào mừng ${user.fullName}`);
            
            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;

            // Chuyển hướng theo user type
            setTimeout(() => {
                if (user.userType === 'student') {
                    window.location.href = 'STUDENT/student-dashboard.html';
                } else if (user.userType === 'employer') {
                    window.location.href = 'EMPLOYER/employer-dashboard.html';
                } else {
                    window.location.href = 'index.html';
                }
            }, 500);
        } else {
            alert('Email/số điện thoại hoặc mật khẩu không đúng!');
            
            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    } catch (error) {
        console.error('Lỗi đăng nhập:', error);
        alert('Có lỗi xảy ra khi đăng nhập');
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// Handle Register
async function handleRegister(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    const fullName = formData.get("fullName");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const userType = formData.get("userType");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
    const terms = document.getElementById("terms")?.checked;

    // Validation
    if (!fullName || !email || !phone || !userType || !password || !confirmPassword) {
        alert("Vui lòng điền đầy đủ thông tin");
        return;
    }

    if (!terms) {
        alert("Vui lòng đồng ý với điều khoản sử dụng");
        return;
    }

    if (password !== confirmPassword) {
        alert("Mật khẩu không khớp");
        return;
    }

    if (password.length < 8) {
        alert("Mật khẩu phải có ít nhất 8 ký tự");
        return;
    }

    // Kiểm tra email hợp lệ
    if (!validateEmail(email)) {
        alert("Email không hợp lệ");
        return;
    }

    // Kiểm tra số điện thoại hợp lệ
    if (!validatePhone(phone)) {
        alert("Số điện thoại không hợp lệ");
        return;
    }

    // Show loading
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Đang đăng ký...';

    try {
        // Lấy danh sách users hiện có
        const existingUsers = JSON.parse(localStorage.getItem('jobhub_users') || '[]');
        
        // Kiểm tra email đã tồn tại chưa
        if (existingUsers.find(user => user.email === email)) {
            alert('Email đã được đăng ký! Vui lòng sử dụng email khác.');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            return;
        }

        // Kiểm tra số điện thoại đã tồn tại chưa
        if (existingUsers.find(user => user.phone === phone)) {
            alert('Số điện thoại đã được đăng ký! Vui lòng sử dụng số điện thoại khác.');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            return;
        }

        // Tạo user mới
        const userData = {
            id: Date.now().toString(),
            fullName: fullName,
            email: email,
            phone: phone,
            userType: userType,
            password: password, // Trong thực tế nên hash password
            createdAt: new Date().toISOString(),
            profileComplete: false
        };

        // Thêm user mới
        existingUsers.push(userData);
        localStorage.setItem('jobhub_users', JSON.stringify(existingUsers));

        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        // Hiển thị thông báo thành công
        alert(`Đăng ký thành công! Bạn đã đăng ký với vai trò ${userType === 'student' ? 'Sinh viên' : 'Nhà tuyển dụng'}`);
        
        // Tự động đăng nhập
        AUTH.login(userData);
        
        // Chuyển hướng theo user type
        setTimeout(() => {
            if (userType === 'student') {
                window.location.href = 'STUDENT/student-dashboard.html';
            } else {
                window.location.href = 'EMPLOYER/employer-dashboard.html';
            }
        }, 1000);

    } catch (error) {
        console.error('Lỗi đăng ký:', error);
        alert('Có lỗi xảy ra khi đăng ký');
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// =============================================
// UTILITY FUNCTIONS
// =============================================

// Email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Phone validation (Vietnamese format)
function validatePhone(phone) {
    const re = /^(\+84|0)[0-9]{9,10}$/;
    return re.test(phone.replace(/\s/g, ""));
}

// Format số điện thoại Việt Nam
function formatPhoneNumber(phone) {
    let cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.startsWith('84')) {
        cleaned = '0' + cleaned.substring(2);
    }
    
    if (cleaned.startsWith('0') && cleaned.length === 10) {
        return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
    }
    
    return phone;
}

// Auto-format phone number
document.addEventListener("DOMContentLoaded", function () {
    const phoneInput = document.getElementById("phone");
    if (phoneInput) {
        phoneInput.addEventListener("input", function (e) {
            let value = e.target.value.replace(/\D/g, "");
            if (value.startsWith("84")) {
                value = "0" + value.substring(2);
            }
            if (value.length > 10) {
                value = value.substring(0, 10);
            }
            
            const formatted = formatPhoneNumber(value);
            if (formatted !== e.target.value) {
                e.target.value = formatted;
            }
        });
    }

    // Kiểm tra đăng nhập trên các trang cần auth
    const currentPath = window.location.pathname;
    const authRequiredPaths = [
        '/STUDENT/', '/EMPLOYER/', '/PAGES/'
    ];

    const requiresAuth = authRequiredPaths.some(path => currentPath.includes(path));
    
    if (requiresAuth && !AUTH.isLoggedIn()) {
        window.location.href = '../login.html';
        return;
    }

    // Cập nhật header nếu đã đăng nhập
    if (AUTH.isLoggedIn()) {
        AUTH.updateHeader();
    }
});

// Đăng xuất
function handleLogout() {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        AUTH.logout();
    }
}