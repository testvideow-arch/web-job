// Job Data
const featuredJobs = [
    {
        id: "1",
        title: "Frontend Developer Intern",
        company: "Tech Corp Vietnam",
        location: "Hà Nội",
        type: "Thực tập",
        salary: "5-8 triệu",
        postedTime: "2 ngày trước",
        tags: ["React", "TypeScript", "Tailwind"]
    },
    {
        id: "2",
        title: "Marketing Assistant",
        company: "Digital Agency VN",
        location: "TP.HCM",
        type: "Part-time",
        salary: "6-10 triệu",
        postedTime: "1 ngày trước",
        tags: ["Social Media", "Content", "SEO"]
    },
    {
        id: "3",
        title: "Data Analyst Intern",
        company: "FinTech Solutions",
        location: "Đà Nẵng",
        type: "Thực tập",
        salary: "7-9 triệu",
        postedTime: "3 ngày trước",
        tags: ["Python", "Excel", "SQL"]
    },
    {
        id: "4",
        title: "UX/UI Designer Intern",
        company: "Creative Studio",
        location: "TP.HCM",
        type: "Thực tập",
        salary: "6-9 triệu",
        postedTime: "4 ngày trước",
        tags: ["Figma", "Adobe XD", "Design"]
    },
    {
        id: "5",
        title: "Content Writer",
        company: "Media Group",
        location: "Hà Nội",
        type: "Part-time",
        salary: "5-7 triệu",
        postedTime: "5 ngày trước",
        tags: ["Writing", "SEO", "Content"]
    },
    {
        id: "6",
        title: "Backend Developer Intern",
        company: "Tech Startup",
        location: "Đà Nẵng",
        type: "Thực tập",
        salary: "7-10 triệu",
        postedTime: "1 ngày trước",
        tags: ["Node.js", "Python", "API"]
    }
];

// Company Data
const topCompanies = [
    {
        id: "1",
        name: "TechViet Solutions",
        industry: "Công nghệ thông tin",
        location: "TP.HCM",
        employeeCount: "100-500",
        openPositions: 12
    },
    {
        id: "2",
        name: "VN Digital Group",
        industry: "Marketing & Media",
        location: "Hà Nội",
        employeeCount: "50-100",
        openPositions: 8
    },
    {
        id: "3",
        name: "StartupHub Vietnam",
        industry: "Đa ngành",
        location: "Đà Nẵng",
        employeeCount: "20-50",
        openPositions: 15
    },
    {
        id: "4",
        name: "Innovation Lab",
        industry: "Công nghệ thông tin",
        location: "TP.HCM",
        employeeCount: "50-100",
        openPositions: 10
    },
    {
        id: "5",
        name: "Creative Agency",
        industry: "Marketing & Media",
        location: "Hà Nội",
        employeeCount: "20-50",
        openPositions: 6
    },
    {
        id: "6",
        name: "FinTech Vietnam",
        industry: "Tài chính",
        location: "TP.HCM",
        employeeCount: "100-500",
        openPositions: 20
    }
];

// Function to render job cards
function renderJobs() {
    const container = document.getElementById('jobsContainer');
    if (!container) return;
    
    container.innerHTML = featuredJobs.map(job => `
        <div class="col-md-6 col-lg-4">
            <div class="job-card">
                <div class="job-card-header">
                    <div>
                        <h4 class="job-title">${job.title}</h4>
                        <div class="job-company">${job.company}</div>
                    </div>
                    <span class="job-badge">${job.type}</span>
                </div>
                <div class="job-meta">
                    <span><i class="bi bi-geo-alt me-1"></i>${job.location}</span>
                    <span><i class="bi bi-cash me-1"></i>${job.salary}</span>
                </div>
                <div class="job-tags">
                    ${job.tags.map(tag => `<span class="job-tag">${tag}</span>`).join('')}
                </div>
                <div class="job-footer">
                    <span class="job-date"><i class="bi bi-clock me-1"></i>${job.postedTime}</span>
                    <a href="#job-${job.id}" class="btn btn-sm btn-primary">Xem chi tiết</a>
                </div>
            </div>
        </div>
    `).join('');
}

// Function to render company cards
function renderCompanies() {
    const container = document.getElementById('companiesContainer');
    if (!container) return;
    
    container.innerHTML = topCompanies.map(company => `
        <div class="col-md-6 col-lg-4">
            <div class="company-card">
                <h4 class="company-name">${company.name}</h4>
                <div class="company-industry">${company.industry}</div>
                <div class="company-info">
                    <div class="company-info-item">
                        <i class="bi bi-geo-alt"></i>
                        <span>${company.location}</span>
                    </div>
                    <div class="company-info-item">
                        <i class="bi bi-people"></i>
                        <span>${company.employeeCount} nhân viên</span>
                    </div>
                </div>
                <div class="company-positions">
                    <span><strong>${company.openPositions}</strong> vị trí đang tuyển</span>
                    <a href="#company-${company.id}" class="btn btn-sm btn-outline-primary">Xem chi tiết</a>
                </div>
            </div>
        </div>
    `).join('');
}

// Search function
function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const locationSelect = document.getElementById('locationSelect');
    
    const query = searchInput.value.trim();
    const location = locationSelect.value;
    
    console.log('Searching for:', query, 'in', location);
    
    // Here you would typically make an API call or filter jobs
    // For now, we'll just show an alert
    if (query || location) {
        alert(`Đang tìm kiếm: "${query}" tại "${location || 'Tất cả địa điểm'}"`);
    } else {
        alert('Vui lòng nhập từ khóa hoặc chọn địa điểm');
    }
}

// Allow Enter key to trigger search
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }
    
    // Render jobs and companies when page loads
    renderJobs();
    renderCompanies();
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

