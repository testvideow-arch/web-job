class JobSearch {
    constructor() {
        this.currentPage = 1;
        this.totalPages = 1;
        this.currentFilters = {};
        this.savedJobs = new Set();
        this.init();
    }

    init() {
        this.loadCategories();
        this.loadSavedJobs();
        this.searchJobs();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Tìm kiếm khi thay đổi filter
        document.querySelectorAll('.filter-sidebar input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.applyFilters());
        });

        // Tìm kiếm real-time
        document.getElementById('keywordInput').addEventListener('input', 
            this.debounce(() => this.searchJobs(), 500));
        
        document.getElementById('locationSelect').addEventListener('change', 
            () => this.searchJobs());
        document.getElementById('categorySelect').addEventListener('change', 
            () => this.searchJobs());
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    async loadCategories() {
        try {
            const response = await fetch('/api/categories');
            const result = await response.json();
            
            if (result.success) {
                this.populateCategoryFilter(result.data);
            }
        } catch (error) {
            console.error('Load categories error:', error);
        }
    }

    populateCategoryFilter(categories) {
        const select = document.getElementById('categorySelect');
        select.innerHTML = '<option value="">Tất cả ngành nghề</option>';
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.name;
            option.textContent = category.name;
            select.appendChild(option);
        });
    }

    async loadSavedJobs() {
        try {
            const user = AUTH.getUser();
            if (!user) return;

            const response = await fetch(`/api/students/${user.id}/saved-jobs`);
            const result = await response.json();
            
            if (result.success) {
                this.savedJobs = new Set(result.data.map(job => job.job_id));
            }
        } catch (error) {
            console.error('Load saved jobs error:', error);
        }
    }

    async searchJobs(page = 1) {
        try {
            this.currentPage = page;
            const filters = this.getCurrentFilters();
            
            const queryParams = new URLSearchParams({
                ...filters,
                page: page,
                limit: 10
            });

            const response = await fetch(`/api/jobs/search?${queryParams}`);
            const result = await response.json();

            if (result.success) {
                this.displayJobs(result.data);
                this.updatePagination(result.totalPages, result.total);
                this.currentFilters = filters;
            }
        } catch (error) {
            console.error('Search jobs error:', error);
            this.showError('Có lỗi xảy ra khi tải việc làm');
        }
    }

    getCurrentFilters() {
        const filters = {
            keyword: document.getElementById('keywordInput').value,
            location: document.getElementById('locationSelect').value,
            category: document.getElementById('categorySelect').value
        };

        // Job types
        const jobTypes = [];
        if (document.getElementById('fulltime').checked) jobTypes.push('full_time');
        if (document.getElementById('parttime').checked) jobTypes.push('part_time');
        if (document.getElementById('internship').checked) jobTypes.push('internship');
        if (document.getElementById('remote').checked) jobTypes.push('remote');
        if (jobTypes.length > 0) filters.jobTypes = jobTypes.join(',');

        // Experience levels
        const experience = [];
        if (document.getElementById('intern').checked) experience.push('intern');
        if (document.getElementById('fresher').checked) experience.push('fresher');
        if (document.getElementById('junior').checked) experience.push('junior');
        if (document.getElementById('middle').checked) experience.push('middle');
        if (experience.length > 0) filters.experience = experience.join(',');

        return filters;
    }

    displayJobs(jobs) {
        const container = document.getElementById('jobResults');
        
        if (jobs.length === 0) {
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="bi bi-search display-1 text-muted"></i>
                    <h4 class="mt-3 text-muted">Không tìm thấy việc làm phù hợp</h4>
                    <p class="text-muted">Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm</p>
                </div>
            `;
            return;
        }

        container.innerHTML = jobs.map(job => this.createJobCard(job)).join('');
    }

    createJobCard(job) {
        const isSaved = this.savedJobs.has(job.job_id);
        const salaryText = job.salary_min && job.salary_max ? 
            `${this.formatSalary(job.salary_min)} - ${this.formatSalary(job.salary_max)}` : 'Thương lượng';
        
        const timeAgo = this.getTimeAgo(new Date(job.created_at));
        const deadline = new Date(job.deadline).toLocaleDateString('vi-VN');

        return `
            <div class="job-card" data-job-id="${job.job_id}">
                <div class="row align-items-center">
                    <div class="col-auto">
                        <img src="${job.logo_url || '../assets/company-logo.png'}" 
                             alt="${job.company_name}" class="company-logo">
                    </div>
                    <div class="col">
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <h5 class="fw-bold mb-1">${job.title}</h5>
                                <p class="text-muted mb-2">${job.company_name} • ${job.location}</p>
                                <div class="d-flex flex-wrap gap-2 mb-2">
                                    <span class="badge bg-light text-dark">${this.getJobTypeText(job.job_type)}</span>
                                    <span class="badge bg-light text-dark">${this.getExperienceText(job.experience_level)}</span>
                                    <span class="badge salary-badge">${salaryText}</span>
                                </div>
                                <p class="text-muted small mb-0">${job.description.substring(0, 150)}...</p>
                            </div>
                            <div class="text-end">
                                <small class="text-muted d-block">Đăng ${timeAgo}</small>
                                <small class="text-muted d-block">Hạn nộp: ${deadline}</small>
                                <div class="mt-2">
                                    <button class="btn btn-sm ${isSaved ? 'btn-success' : 'btn-outline-primary'} me-1" 
                                            onclick="jobSearch.toggleSaveJob(${job.job_id}, this)">
                                        <i class="bi ${isSaved ? 'bi-bookmark-check' : 'bi-bookmark'}"></i>
                                    </button>
                                    <a href="job-detail.html?id=${job.job_id}" class="btn btn-sm btn-primary">Xem chi tiết</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    formatSalary(amount) {
        if (amount >= 1000000) {
            return (amount / 1000000).toFixed(1) + ' triệu';
        }
        return amount.toLocaleString('vi-VN') + ' VND';
    }

    getJobTypeText(jobType) {
        const types = {
            'full_time': 'Toàn thời gian',
            'part_time': 'Bán thời gian',
            'internship': 'Thực tập',
            'freelance': 'Freelance',
            'remote': 'Làm việc từ xa'
        };
        return types[jobType] || jobType;
    }

    getExperienceText(experience) {
        const levels = {
            'intern': 'Thực tập sinh',
            'fresher': 'Fresher',
            'junior': 'Junior',
            'middle': 'Middle',
            'senior': 'Senior'
        };
        return levels[experience] || experience;
    }

    getTimeAgo(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins} phút trước`;
        if (diffHours < 24) return `${diffHours} giờ trước`;
        if (diffDays < 30) return `${diffDays} ngày trước`;
        return date.toLocaleDateString('vi-VN');
    }

    updatePagination(totalPages, totalJobs) {
        const pagination = document.querySelector('.pagination');
        const countElement = document.querySelector('.text-muted .fw-semibold');
        
        if (countElement) {
            countElement.textContent = totalJobs;
        }

        if (totalPages <= 1) {
            pagination.style.display = 'none';
            return;
        }

        pagination.style.display = 'flex';
        
        let paginationHTML = `
            <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="jobSearch.searchJobs(${this.currentPage - 1})">Trước</a>
            </li>
        `;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
                paginationHTML += `
                    <li class="page-item ${i === this.currentPage ? 'active' : ''}">
                        <a class="page-link" href="#" onclick="jobSearch.searchJobs(${i})">${i}</a>
                    </li>
                `;
            } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
                paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
            }
        }

        paginationHTML += `
            <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="jobSearch.searchJobs(${this.currentPage + 1})">Tiếp</a>
            </li>
        `;

        pagination.innerHTML = paginationHTML;
    }

    async toggleSaveJob(jobId, button) {
        try {
            const user = AUTH.getUser();
            if (!user) {
                alert('Vui lòng đăng nhập để lưu việc làm');
                return;
            }

            const isCurrentlySaved = this.savedJobs.has(jobId);
            
            const response = await fetch(`/api/jobs/${jobId}/save`, {
                method: isCurrentlySaved ? 'DELETE' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ studentId: user.id })
            });

            const result = await response.json();

            if (result.success) {
                if (isCurrentlySaved) {
                    this.savedJobs.delete(jobId);
                    button.classList.remove('btn-success');
                    button.classList.add('btn-outline-primary');
                    button.innerHTML = '<i class="bi bi-bookmark"></i>';
                } else {
                    this.savedJobs.add(jobId);
                    button.classList.remove('btn-outline-primary');
                    button.classList.add('btn-success');
                    button.innerHTML = '<i class="bi bi-bookmark-check"></i>';
                }
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Toggle save job error:', error);
            alert('Có lỗi xảy ra khi lưu việc làm');
        }
    }

    applyFilters() {
        this.searchJobs(1);
    }

    resetFilters() {
        document.querySelectorAll('.filter-sidebar input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Reset default values
        document.getElementById('fulltime').checked = true;
        document.getElementById('fresher').checked = true;
        document.getElementById('salary2').checked = true;
        document.getElementById('startup').checked = true;
        
        document.getElementById('keywordInput').value = '';
        document.getElementById('locationSelect').value = '';
        document.getElementById('categorySelect').value = '';
        
        this.searchJobs(1);
    }

    sortJobs(criteria) {
        this.searchJobs(1);
    }

    showError(message) {
        // Tạo thông báo lỗi
        const alert = document.createElement('div');
        alert.className = 'alert alert-danger alert-dismissible fade show position-fixed top-0 end-0 m-3';
        alert.style.zIndex = '9999';
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(alert);
        
        setTimeout(() => alert.remove(), 5000);
    }
}

// Khởi tạo khi trang load
let jobSearch;

document.addEventListener('DOMContentLoaded', function() {
    if (!AUTH.requireAuth()) return;
    
    const user = AUTH.getUser();
    if (user) {
        document.querySelector('.dropdown-toggle').innerHTML = 
            `<i class="bi bi-person-circle me-1"></i>${user.fullName}`;
    }
    
    jobSearch = new JobSearch();
});