// Blog Posts Data
const blogPosts = [
  {
    id: "1",
    title: "10 Kỹ năng cần thiết để thành công trong phỏng vấn xin việc",
    excerpt:
      "Khám phá những kỹ năng quan trọng giúp bạn gây ấn tượng với nhà tuyển dụng và tăng cơ hội thành công trong buổi phỏng vấn...",
    category: "Hướng nghiệp",
    categoryId: "career",
    date: "20/12/2024",
    readTime: "5 phút đọc",
    image: "assets/Student_job_interview_success_1bbbe4ab-CGEG4isa.png",
  },
  {
    id: "2",
    title: "Cách viết CV ấn tượng cho sinh viên mới ra trường",
    excerpt:
      "Hướng dẫn chi tiết cách tạo CV chuyên nghiệp và thu hút nhà tuyển dụng...",
    category: "CV & Hồ sơ",
    categoryId: "cv",
    date: "18/12/2024",
    readTime: "4 phút đọc",
    image: "assets/Career_fair_networking_event_a36a70f1-NJ2r_s4t.png",
  },
  {
    id: "3",
    title: "Top 5 ngành nghề hot nhất cho sinh viên năm 2025",
    excerpt: "Phân tích xu hướng tuyển dụng và các ngành nghề có triển vọng...",
    category: "Xu hướng",
    categoryId: "trend",
    date: "15/12/2024",
    readTime: "6 phút đọc",
    image: "assets/Professional_office_team_environment_a3b7ecb9-CFEj1VoR.png",
  },
  {
    id: "4",
    title: "Kinh nghiệm thực tập: Những điều sinh viên cần biết",
    excerpt: "Chia sẻ từ những sinh viên đã trải qua kỳ thực tập thành công...",
    category: "Thực tập",
    categoryId: "internship",
    date: "12/12/2024",
    readTime: "5 phút đọc",
    image: "assets/Students_collaborating_on_campus_9760dec1-BNQb34qt.png",
  },
  {
    id: "5",
    title: "Làm thế nào để phát triển kỹ năng mềm trong môi trường học thuật",
    excerpt:
      "Các hoạt động và phương pháp giúp sinh viên rèn luyện soft skills...",
    category: "Kỹ năng",
    categoryId: "skills",
    date: "10/12/2024",
    readTime: "7 phút đọc",
    image: "assets/Student_job_interview_success_1bbbe4ab-CGEG4isa.png",
  },
  {
    id: "6",
    title: "Cách xây dựng mạng lưới quan hệ nghề nghiệp hiệu quả",
    excerpt:
      "Networking là chìa khóa thành công trong sự nghiệp. Tìm hiểu cách xây dựng mạng lưới quan hệ...",
    category: "Hướng nghiệp",
    categoryId: "career",
    date: "8/12/2024",
    readTime: "6 phút đọc",
    image: "assets/Career_fair_networking_event_a36a70f1-NJ2r_s4t.png",
  },
];

let currentCategory = "all";

// Render blog posts
function renderBlogPosts() {
  const container = document.getElementById("blogPostsContainer");
  if (!container) return;

  let filteredPosts = blogPosts;

  if (currentCategory !== "all") {
    filteredPosts = blogPosts.filter(
      (post) => post.categoryId === currentCategory
    );
  }

  container.innerHTML = filteredPosts
    .map(
      (post) => `
        <div class="col-md-6 col-lg-4">
            <div class="card border-0 shadow h-100">
                <img src="${post.image}" class="card-img-top" alt="${post.title}" style="height: 200px; object-fit: cover;" />
                <div class="card-body p-3">
                    <div class="d-flex gap-2 mb-2 flex-wrap">
                        <span class="badge bg-primary">${post.category}</span>
                        <small class="text-muted"><i class="bi bi-calendar me-1"></i>${post.date}</small>
                        <small class="text-muted"><i class="bi bi-clock me-1"></i>${post.readTime}</small>
                    </div>
                    <h5 class="card-title fw-bold mb-2">${post.title}</h5>
                    <p class="card-text text-muted small">${post.excerpt}</p>
                    <a href="#post-${post.id}" class="btn btn-sm btn-outline-primary mt-auto">Đọc thêm <i class="bi bi-arrow-right ms-1"></i></a>
                </div>
            </div>
        </div>
    `
    )
    .join("");
}

// Filter posts by category
function filterPosts(category) {
  currentCategory = category;
  renderBlogPosts();
}

// Search blog posts
function searchBlog() {
  const searchInput = document.getElementById("blogSearch");
  const query = searchInput.value.trim().toLowerCase();

  if (query) {
    const filteredPosts = blogPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query)
    );

    const container = document.getElementById("blogPostsContainer");
    if (!container) return;

    if (filteredPosts.length === 0) {
      container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="bi bi-search display-1 text-muted mb-3"></i>
                    <h4 class="text-muted">Không tìm thấy kết quả</h4>
                    <p class="text-muted">Hãy thử tìm kiếm với từ khóa khác</p>
                </div>
            `;
    } else {
      container.innerHTML = filteredPosts
        .map(
          (post) => `
                <div class="col-md-6 col-lg-4">
                    <div class="card border-0 shadow h-100">
                        <img src="${post.image}" class="card-img-top" alt="${post.title}" style="height: 200px; object-fit: cover;" />
                        <div class="card-body p-3">
                            <div class="d-flex gap-2 mb-2 flex-wrap">
                                <span class="badge bg-primary">${post.category}</span>
                                <small class="text-muted"><i class="bi bi-calendar me-1"></i>${post.date}</small>
                                <small class="text-muted"><i class="bi bi-clock me-1"></i>${post.readTime}</small>
                            </div>
                            <h5 class="card-title fw-bold mb-2">${post.title}</h5>
                            <p class="card-text text-muted small">${post.excerpt}</p>
                            <a href="#post-${post.id}" class="btn btn-sm btn-outline-primary mt-auto">Đọc thêm <i class="bi bi-arrow-right ms-1"></i></a>
                        </div>
                    </div>
                </div>
            `
        )
        .join("");
    }
  } else {
    renderBlogPosts();
  }
}

// Allow Enter key to trigger search
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("blogSearch");
  if (searchInput) {
    searchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        searchBlog();
      }
    });
  }

  // Render posts when page loads
  renderBlogPosts();
});
