# SinhVienWorks - Frontend (HTML + Bootstrap 5 + CSS + JavaScript)

Thư mục này chứa **giao diện thuần HTML, CSS, Bootstrap 5 và JavaScript** của ứng dụng SinhVienWorks.

## 📦 Nội dung

### Files chính:

- **`index.html`** - Trang chủ (HTML thuần)
- **`login.html`** - Trang đăng nhập
- **`register.html`** - Trang đăng ký
- **`blog.html`** - Trang blog hướng nghiệp
- **`about.html`** - Trang giới thiệu về JobHub
- **`help.html`** - Trang hỗ trợ và FAQ
- **`css/style.css`** - CSS tùy chỉnh
- **`js/script.js`** - JavaScript cho trang chủ
- **`js/auth.js`** - JavaScript cho đăng nhập/đăng ký
- **`js/blog.js`** - JavaScript cho trang blog
- **`js/help.js`** - JavaScript cho trang hỗ trợ

### Thư mục:

- **`assets/`** - Hình ảnh (từ build React)
- **`css/`** - File CSS
- **`js/`** - File JavaScript

## 🚀 Cách sử dụng

### Cách 1: VS Code Live Server (Khuyến nghị - Dễ nhất)

1. Mở folder `frontend-only` trong VS Code
2. Cài đặt extension **Live Server** (nếu chưa có):
   - Nhấn `Ctrl+Shift+X` để mở Extensions
   - Tìm "Live Server" và cài đặt
3. Click chuột phải vào file `index.html`
4. Chọn **"Open with Live Server"**
5. Trình duyệt sẽ tự động mở tại: `http://localhost:5500`

### Cách 2: Dùng `serve` (npm)

```bash
# Cài đặt serve (nếu chưa có)
npm install -g serve

# Chạy server
serve

# Hoặc chỉ định port
serve -p 3000
```

Sau đó truy cập: `http://localhost:3000`

### Cách 3: Dùng Python

```bash
# Python 3
python -m http.server 8000

# Sau đó truy cập: http://localhost:8000
```

### Cách 4: Mở trực tiếp

⚠️ **Lưu ý**: Mở trực tiếp file `index.html` có thể gặp lỗi với một số tính năng (CORS).

- Double-click vào file `index.html`
- Hoặc kéo thả file vào trình duyệt

## 📁 Cấu trúc files

```
frontend-only/
├── index.html              ← Trang chủ (HTML thuần)
├── login.html              ← Trang đăng nhập
├── register.html           ← Trang đăng ký
├── css/
│   └── style.css           ← CSS tùy chỉnh
├── js/
│   ├── script.js           ← JavaScript cho trang chủ
│   └── auth.js             ← JavaScript cho đăng nhập/đăng ký
├── assets/                 ← Hình ảnh
├── favicon.png             ← Icon
└── README.md               ← File này
```

## ✨ Tính năng

### Trang chủ (`index.html`):

- ✅ Header với navigation và mobile menu
- ✅ Hero section với search box
- ✅ Stats section hiển thị số liệu
- ✅ Featured jobs section
- ✅ How it works section
- ✅ Companies section
- ✅ CTA section (Call to Action)
- ✅ Footer với thông tin liên hệ
- ✅ Responsive design (hoạt động tốt trên mobile)

### Trang đăng nhập (`login.html`):

- ✅ Form đăng nhập (Email/Username + Password)
- ✅ Hiển thị/ẩn mật khẩu
- ✅ Nhớ đăng nhập (checkbox)
- ✅ Quên mật khẩu (link)
- ✅ Đăng nhập bằng Google/Facebook
- ✅ Responsive design

### Trang đăng ký (`register.html`):

- ✅ Form đăng ký đầy đủ (Họ tên, Email, SĐT, Loại tài khoản, Password)
- ✅ Kiểm tra độ mạnh mật khẩu (yếu/trung bình/mạnh)
- ✅ Xác nhận mật khẩu (kiểm tra khớp)
- ✅ Auto-format số điện thoại Việt Nam
- ✅ Validation đầy đủ
- ✅ Đăng ký bằng Google/Facebook
- ✅ Responsive design

### Trang Blog (`blog.html`):

- ✅ Danh sách bài viết hướng nghiệp
- ✅ Featured post (bài viết nổi bật)
- ✅ Lọc theo danh mục (Hướng nghiệp, CV & Hồ sơ, Kỹ năng, etc.)
- ✅ Tìm kiếm bài viết
- ✅ Newsletter đăng ký nhận tin
- ✅ Responsive design

### Trang Giới thiệu (`about.html`):

- ✅ Giới thiệu về JobHub
- ✅ Sứ mệnh và giá trị cốt lõi
- ✅ Thống kê số liệu
- ✅ Tại sao chọn JobHub
- ✅ Giới thiệu đội ngũ
- ✅ Responsive design

### Trang Hỗ trợ (`help.html`):

- ✅ Câu hỏi thường gặp (FAQ) với accordion
- ✅ Tìm kiếm FAQ
- ✅ Phân loại hỗ trợ (Tài khoản, Tìm việc, Ứng tuyển, Liên hệ)
- ✅ Form liên hệ
- ✅ Thông tin liên hệ (Email, Điện thoại, Giờ làm việc)
- ✅ Responsive design

## 🔧 Sửa đổi

### Thay đổi màu sắc:

Mở file `css/style.css` và sửa các biến CSS trong `:root`:

```css
:root {
  --primary-color: #0d6efd; /* Màu chính */
  --primary-hover: #0b5ed7; /* Màu hover */
  /* ... */
}
```

### Thêm/sửa việc làm:

Mở file `js/script.js` và sửa mảng `featuredJobs`:

```javascript
const featuredJobs = [
  {
    id: "1",
    title: "Frontend Developer Intern",
    company: "Tech Corp Vietnam",
    // ...
  },
  // Thêm job mới ở đây
];
```

### Thêm/sửa công ty:

Mở file `js/script.js` và sửa mảng `topCompanies`.

### Sửa nội dung trang:

Mở trực tiếp file HTML (`index.html`, `login.html`, `register.html`) và sửa code HTML.

## 📱 Responsive

Giao diện tự động responsive cho:

- 📱 Mobile (< 768px)
- 💻 Tablet (768px - 992px)
- 🖥️ Desktop (> 992px)

## 🎨 Bootstrap 5

Ứng dụng sử dụng **Bootstrap 5.3.2** qua CDN:

- ✅ Không cần cài đặt
- ✅ Tự động cập nhật
- ✅ Nhẹ và nhanh
- ✅ Icons từ Bootstrap Icons

## 📝 Lưu ý

- **Không cần React**: Đây là HTML/CSS/JS thuần, không có React
- **Không cần backend**: Đây là frontend tĩnh, không cần server backend
- **Không cần database**: Dữ liệu được hardcode trong JavaScript
- **Dễ chỉnh sửa**: Code HTML/CSS/JS thuần, dễ đọc và chỉnh sửa
- **Không cần build**: Mở trực tiếp bằng Live Server là chạy được

## 🔍 Troubleshooting

**Nếu gặp lỗi 404 với CSS/JS:**

- Đảm bảo đang chạy qua HTTP server (không phải mở trực tiếp file)
- Kiểm tra đường dẫn files trong HTML

**Nếu không thấy styles:**

- Kiểm tra kết nối internet (Bootstrap và Fonts cần CDN)
- Refresh lại trình duyệt (Ctrl+F5)
- Kiểm tra file `css/style.css` có tồn tại không

**Nếu JavaScript không chạy:**

- Mở Console (F12) để xem lỗi
- Kiểm tra file `js/script.js` và `js/auth.js` có tồn tại không
- Đảm bảo đang chạy qua HTTP server

## 💡 Tips

- Dùng **VS Code Live Server** để có trải nghiệm tốt nhất
- Code được viết rõ ràng, có comments, dễ hiểu
- Có thể dễ dàng chỉnh sửa màu sắc, nội dung, layout
- Bootstrap 5 components sẵn có, chỉ cần copy-paste

## 🎯 Files quan trọng

1. **`index.html`** - Trang chủ, đây là file chính
2. **`login.html`** - Trang đăng nhập
3. **`register.html`** - Trang đăng ký
4. **`css/style.css`** - Tất cả styles tùy chỉnh
5. **`js/script.js`** - JavaScript cho trang chủ
6. **`js/auth.js`** - JavaScript cho authentication

---

**Hoàn tất!** Chỉ cần mở `index.html` bằng Live Server là xem được ngay! 🚀
