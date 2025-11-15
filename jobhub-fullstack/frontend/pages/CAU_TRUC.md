# 📁 CẤU TRÚC DỰ ÁN - HTML/CSS TÁCH RIÊNG

## ✅ Nguyên tắc tổ chức code

### 1. **HTML - Chỉ chứa cấu trúc**

- ✅ Chỉ có các thẻ HTML và class CSS
- ✅ **KHÔNG có inline styles** (`style="..."`)
- ✅ **KHÔNG có CSS trong thẻ `<style>`**
- ✅ **KHÔNG có JavaScript trong thẻ `<script>` trong body** (chỉ link external)

### 2. **CSS - Tất cả trong file riêng**

- ✅ Tất cả CSS nằm trong `css/style.css`
- ✅ CSS được tổ chức theo sections rõ ràng
- ✅ Sử dụng CSS Variables (`:root`)
- ✅ Responsive design với media queries

### 3. **JavaScript - File riêng biệt**

- ✅ Mỗi trang có file JS riêng trong `js/`
- ✅ **KHÔNG có JS inline** trong HTML (trừ event handlers đơn giản như `onclick`)

---

## 📂 Cấu trúc thư mục

```
frontend-only/
├── index.html          ← Trang chủ (HTML thuần, không có inline styles)
├── login.html          ← Trang đăng nhập (HTML thuần)
├── register.html       ← Trang đăng ký (HTML thuần)
├── blog.html           ← Trang blog (HTML thuần)
├── about.html          ← Trang giới thiệu (HTML thuần)
├── help.html           ← Trang hỗ trợ (HTML thuần)
│
├── css/
│   └── style.css       ← TẤT CẢ CSS ở đây (không có inline styles trong HTML)
│
├── js/
│   ├── script.js       ← JavaScript cho trang chủ
│   ├── auth.js         ← JavaScript cho login/register
│   ├── blog.js         ← JavaScript cho trang blog
│   └── help.js         ← JavaScript cho trang hỗ trợ
│
└── assets/
    └── *.png           ← Hình ảnh
```

---

## 🎨 File CSS: `css/style.css`

### Cấu trúc CSS được tổ chức như sau:

1. **CSS Variables** (`:root`)

   - Màu sắc, fonts, spacing

2. **Reset & Base Styles**

   - `*`, `body`, `h1-h6`

3. **Component Styles** (theo thứ tự sử dụng)

   - Header & Navigation
   - Hero Section
   - Stats Section
   - Job Cards
   - Company Cards
   - Step Icons
   - Footer

4. **Page-specific Styles**

   - Blog Styles (`.blog-featured-image`, `.blog-card-image`)
   - Auth Pages Styles (`.auth-container`, `.auth-card`, `.auth-header`, `.auth-body`)
   - Step Icon Variations (`.step-icon-small`, `.step-icon-large`)
   - Logo Icon Variations (`.logo-icon-light`)
   - Button Link Clean (`.btn-link-clean`)

5. **Responsive Design**
   - Media queries cho mobile, tablet, desktop

---

## ✅ Đã loại bỏ tất cả inline styles

### Trước đây (❌ KHÔNG TỐT):

```html
<img src="..." style="height: 400px; object-fit: cover" />
<div class="step-icon" style="width: 64px; height: 64px; flex-shrink: 0">
  <button
    style="text-decoration: none; border: none; background: none"
  ></button>
</div>
```

### Bây giờ (✅ TỐT):

```html
<img src="..." class="card-img-top blog-featured-image" />
<div class="step-icon step-icon-small">
  <button class="btn-link-clean"></button>
</div>
```

**CSS tương ứng trong `css/style.css`:**

```css
.blog-featured-image {
  height: 400px;
  object-fit: cover;
}

.step-icon-small {
  width: 64px;
  height: 64px;
  flex-shrink: 0;
}

.btn-link-clean {
  text-decoration: none;
  border: none;
  background: none;
}
```

---

## 📝 Các class CSS đã tạo

### Blog Styles:

- `.blog-featured-image` - Ảnh bài viết nổi bật (400px height)
- `.blog-card-image` - Ảnh bài viết thường (200px height)

### Step Icon Variations:

- `.step-icon-small` - Icon nhỏ (64x64px)
- `.step-icon-large` - Icon lớn (120x120px, font-size 48px)

### Logo Icon:

- `.logo-icon-light` - Logo với background trong suốt

### Button:

- `.btn-link-clean` - Button link không có border và background

### Auth Pages:

- `.auth-container` - Container cho trang login/register
- `.auth-card` - Card chứa form
- `.auth-header` - Header của auth card
- `.auth-body` - Body của auth card
- `.auth-footer` - Footer của auth card

---

## 🚀 Cách sử dụng để code dự án mới

### 1. **Copy cấu trúc thư mục**

```
your-project/
├── index.html
├── css/
│   └── style.css
└── js/
    └── script.js
```

### 2. **HTML - Chỉ cấu trúc, không có style**

```html
<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your Page</title>
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="css/style.css" />
  </head>
  <body>
    <!-- Chỉ có HTML và class CSS -->
    <div class="container">
      <h1 class="fw-bold">Title</h1>
    </div>

    <script src="js/script.js"></script>
  </body>
</html>
```

### 3. **CSS - Tất cả trong file riêng**

```css
/* css/style.css */
:root {
  --primary-color: #0d6efd;
}

.container {
  max-width: 1200px;
}

.fw-bold {
  font-weight: 700;
}
```

### 4. **JavaScript - File riêng**

```javascript
// js/script.js
document.addEventListener("DOMContentLoaded", function () {
  // Your code here
});
```

---

## ✅ Checklist khi code dự án mới

- [ ] Tất cả HTML không có inline styles
- [ ] Tất cả CSS nằm trong file `css/style.css`
- [ ] Tất cả JavaScript nằm trong file `js/script.js`
- [ ] HTML chỉ chứa cấu trúc và class CSS
- [ ] CSS được tổ chức theo sections rõ ràng
- [ ] Sử dụng CSS Variables cho màu sắc, fonts
- [ ] Responsive design với media queries

---

## 📚 Lợi ích của việc tách riêng HTML/CSS

1. **Dễ bảo trì** - Tất cả CSS ở một chỗ, dễ sửa
2. **Tái sử dụng** - CSS có thể dùng lại cho nhiều trang
3. **Performance** - Browser cache CSS file hiệu quả hơn
4. **Dễ đọc** - HTML sạch, chỉ cấu trúc
5. **Dễ debug** - Tách biệt logic và presentation
6. **SEO tốt hơn** - HTML semantic, không lẫn CSS

---

## 💡 Tips

- **Luôn sử dụng class thay vì inline styles**
- **Đặt tên class theo BEM convention nếu có thể** (Block\_\_Element--Modifier)
- **Nhóm CSS theo components** (header, footer, card, etc.)
- **Sử dụng CSS Variables** cho màu sắc và fonts
- **Comment CSS** để dễ tìm kiếm sau này

---

**✅ Hoàn tất!** Code đã được tách riêng HTML/CSS hoàn toàn, sẵn sàng để tham khảo code dự án mới!
