// FAQ Data
const faqs = [
  {
    id: 1,
    question: "Làm thế nào để tạo tài khoản trên JobHub?",
    answer:
      "Bạn có thể đăng ký tài khoản bằng cách nhấp vào nút 'Đăng ký' ở góc trên bên phải. Chọn loại tài khoản (Sinh viên hoặc Nhà tuyển dụng), điền thông tin cần thiết và xác thực email để hoàn tất.",
  },
  {
    id: 2,
    question: "Tôi có phải trả phí khi sử dụng JobHub không?",
    answer:
      "Không, JobHub hoàn toàn miễn phí cho sinh viên. Bạn có thể tìm kiếm việc làm, tạo hồ sơ và ứng tuyển mà không mất bất kỳ chi phí nào.",
  },
  {
    id: 3,
    question: "Làm thế nào để tìm kiếm việc làm phù hợp?",
    answer:
      "Sử dụng thanh tìm kiếm trên trang chủ hoặc trang Việc làm. Bạn có thể lọc theo vị trí, loại công việc, mức lương và các tiêu chí khác để tìm cơ hội phù hợp nhất.",
  },
  {
    id: 4,
    question: "Tôi cần chuẩn bị gì khi ứng tuyển?",
    answer:
      "Hãy đảm bảo hồ sơ của bạn đã được hoàn thiện với thông tin học vấn, kỹ năng và kinh nghiệm (nếu có). Chuẩn bị CV và thư xin việc chuyên nghiệp. Đọc kỹ mô tả công việc để hiểu rõ yêu cầu.",
  },
  {
    id: 5,
    question: "Làm thế nào để lưu việc làm để xem sau?",
    answer:
      "Nhấp vào biểu tượng dấu trang (bookmark) ở góc trên bên phải của mỗi thẻ việc làm. Các việc làm đã lưu sẽ được hiển thị trong trang 'Việc làm đã lưu' của bạn.",
  },
  {
    id: 6,
    question: "Tôi có thể theo dõi trạng thái ứng tuyển ở đâu?",
    answer:
      "Truy cập trang Hồ sơ của bạn và chọn tab 'Ứng tuyển'. Tại đây bạn có thể xem tất cả các đơn ứng tuyển và trạng thái của chúng.",
  },
  {
    id: 7,
    question: "Làm thế nào để cập nhật thông tin hồ sơ?",
    answer:
      "Vào trang Hồ sơ, nhấp nút 'Chỉnh sửa' để cập nhật thông tin cá nhân, học vấn, kỹ năng và kinh nghiệm làm việc.",
  },
  {
    id: 8,
    question: "Tôi quên mật khẩu, phải làm sao?",
    answer:
      "Tại trang đăng nhập, nhấp vào 'Quên mật khẩu?'. Nhập email đã đăng ký và làm theo hướng dẫn trong email để đặt lại mật khẩu.",
  },
  {
    id: 9,
    question: "Làm thế nào để liên hệ với nhà tuyển dụng?",
    answer:
      "Sau khi ứng tuyển, bạn có thể liên hệ với nhà tuyển dụng qua thông tin liên hệ được cung cấp trong mô tả công việc hoặc đợi họ liên hệ với bạn.",
  },
  {
    id: 10,
    question: "JobHub có hỗ trợ tạo CV không?",
    answer:
      "Có, JobHub cung cấp công cụ tạo CV trực tuyến miễn phí. Bạn có thể truy cập trang Hồ sơ và sử dụng tính năng tạo CV để tạo một CV chuyên nghiệp.",
  },
];

// Render FAQ
function renderFAQ() {
  const container = document.getElementById("faqAccordion");
  if (!container) return;

  container.innerHTML = faqs
    .map(
      (faq, index) => `
        <div class="accordion-item">
            <h2 class="accordion-header">
                <button class="accordion-button ${
                  index !== 0 ? "collapsed" : ""
                }" type="button" data-bs-toggle="collapse" data-bs-target="#faq${
        faq.id
      }">
                    <i class="bi bi-question-circle me-2 text-primary"></i>${
                      faq.question
                    }
                </button>
            </h2>
            <div id="faq${faq.id}" class="accordion-collapse collapse ${
        index === 0 ? "show" : ""
      }" data-bs-parent="#faqAccordion">
                <div class="accordion-body">
                    ${faq.answer}
                </div>
            </div>
        </div>
    `
    )
    .join("");
}

// Search FAQ
function searchFAQ() {
  const searchInput = document.getElementById("faqSearch");
  const query = searchInput.value.trim().toLowerCase();

  if (!query) {
    renderFAQ();
    return;
  }

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query)
  );

  const container = document.getElementById("faqAccordion");
  if (!container) return;

  if (filteredFAQs.length === 0) {
    container.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-search display-1 text-muted mb-3"></i>
                <h4 class="text-muted">Không tìm thấy kết quả</h4>
                <p class="text-muted">Hãy thử tìm kiếm với từ khóa khác</p>
            </div>
        `;
  } else {
    container.innerHTML = filteredFAQs
      .map(
        (faq, index) => `
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button ${
                      index !== 0 ? "collapsed" : ""
                    }" type="button" data-bs-toggle="collapse" data-bs-target="#faq${
          faq.id
        }">
                        <i class="bi bi-question-circle me-2 text-primary"></i>${
                          faq.question
                        }
                    </button>
                </h2>
                <div id="faq${faq.id}" class="accordion-collapse collapse ${
          index === 0 ? "show" : ""
        }" data-bs-parent="#faqAccordion">
                    <div class="accordion-body">
                        ${faq.answer}
                    </div>
                </div>
            </div>
        `
      )
      .join("");
  }
}

// Handle contact form
function handleContact(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  const name =
    formData.get("contactName") || document.getElementById("contactName").value;
  const email =
    formData.get("contactEmail") ||
    document.getElementById("contactEmail").value;
  const subject =
    formData.get("contactSubject") ||
    document.getElementById("contactSubject").value;
  const message =
    formData.get("contactMessage") ||
    document.getElementById("contactMessage").value;

  // Validation
  if (!name || !email || !subject || !message) {
    alert("Vui lòng điền đầy đủ thông tin");
    return;
  }

  // Simulate API call
  console.log("Gửi tin nhắn...", { name, email, subject, message });

  // Show loading
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML =
    '<span class="spinner-border spinner-border-sm me-2"></span>Đang gửi...';

  // Simulate API delay
  setTimeout(() => {
    alert(
      "Tin nhắn đã được gửi thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất. (Demo)"
    );

    // Reset form
    form.reset();
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }, 1500);
}

// Initialize when page loads
document.addEventListener("DOMContentLoaded", function () {
  renderFAQ();

  // Allow Enter key to trigger FAQ search
  const searchInput = document.getElementById("faqSearch");
  if (searchInput) {
    searchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        searchFAQ();
      }
    });
  }
});
