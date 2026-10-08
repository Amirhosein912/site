/* =========================================================
   MOSIYO APP - Final Script
========================================================= */

// ==================== ELEMENTS ====================
const orderModal     = document.getElementById("orderModal");
const loginModal     = document.getElementById("loginModal");
const orderForm      = document.getElementById("orderForm");
const loginForm      = document.getElementById("loginForm");
const codeForm       = document.getElementById("codeForm");
const menu           = document.getElementById("menu");
const phoneStep      = document.getElementById("phoneStep");
const codeStep       = document.getElementById("codeStep");
const userName       = document.getElementById("userName");
const profileName    = document.getElementById("profileName");
const profilePhone   = document.getElementById("profilePhone");
const orderCount     = document.getElementById("orderCount");
const pendingCount   = document.getElementById("pendingCount");
const workingCount   = document.getElementById("workingCount");
const completedCount = document.getElementById("completedCount");
const ordersList     = document.getElementById("ordersList");
const dashboard      = document.getElementById("dashboard");

// ==================== STATE ====================
let currentOrderStep = 1;
let selectedService  = "";
let selectedBudget   = "";
let orderDetails     = {};
let loginPhone       = "";

// ==================== HELPERS ====================
const $$ = (sel) => document.querySelectorAll(sel);

function escapeHTML(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function showMessage(msg) {
    alert(msg);
}

// ==================== MOBILE MENU ====================
function toggleMenu() {
    menu?.classList.toggle("active");
}

$$(".menu a").forEach(link => {
    link.addEventListener("click", () => menu?.classList.remove("active"));
});

// ==================== ORDER MODAL ====================
function openOrder(service = "") {
    if (!orderModal) return;
    orderModal.style.display = "flex";
    document.body.style.overflow = "hidden";
    resetOrderWizard();
    if (service) selectService(service);
}

function closeOrder() {
    if (!orderModal) return;
    orderModal.style.display = "none";
    document.body.style.overflow = "";
}

function resetOrderWizard() {
    currentOrderStep = 1;
    selectedService  = "";
    selectedBudget   = "";
    orderDetails     = {};
    orderForm?.reset();

    $$(".service-option").forEach(el => el.classList.remove("selected"));
    $$(".budget-options button").forEach(el => el.classList.remove("selected"));

    renderDynamicQuestions();
    updateOrderStep();
}

// ==================== SERVICE SELECTION ====================
function selectService(service) {
    selectedService = service;

    $$(".service-option").forEach(option => {
        option.classList.toggle("selected", option.dataset.service === service);
    });

    renderDynamicQuestions();

    if (orderModal?.style.display === "flex") {
        setTimeout(() => goToOrderStep(2), 180);
    }
}

$$(".service-option").forEach(option => {
    option.addEventListener("click", () => selectService(option.dataset.service));
});

// ==================== DYNAMIC QUESTIONS ====================
function renderDynamicQuestions() {
    const container = document.getElementById("dynamicQuestions");
    if (!container) return;

    const templates = {
        "طراحی سایت": `
            <div class="dynamic-question">
                <label>نوع سایت</label>
                <select data-detail="نوع سایت">
                    <option value="">انتخاب کنید</option>
                    <option>شرکتی</option>
                    <option>فروشگاهی</option>
                    <option>شخصی</option>
                    <option>خدماتی</option>
                    <option>اختصاصی</option>
                </select>
            </div>
            <div class="dynamic-question">
                <label>وضعیت طراحی</label>
                <select data-detail="وضعیت طراحی">
                    <option value="">انتخاب کنید</option>
                    <option>طراحی از صفر</option>
                    <option>طراحی بر اساس نمونه</option>
                    <option>بازطراحی سایت فعلی</option>
                </select>
            </div>`,

        "ربات تلگرام": `
            <div class="dynamic-question">
                <label>کاربرد ربات</label>
                <select data-detail="کاربرد ربات">
                    <option value="">انتخاب کنید</option>
                    <option>فروشگاهی</option>
                    <option>پشتیبانی</option>
                    <option>پرداخت و سفارش</option>
                    <option>اتوماسیون</option>
                </select>
            </div>
            <div class="dynamic-question">
                <label>سیستم پرداخت</label>
                <select data-detail="سیستم پرداخت">
                    <option value="">انتخاب کنید</option>
                    <option>نیاز دارم</option>
                    <option>نیاز ندارم</option>
                    <option>بعداً تصمیم می‌گیرم</option>
                </select>
            </div>`,

        "برنامه‌نویسی": `
            <div class="dynamic-question">
                <label>نوع برنامه</label>
                <select data-detail="نوع برنامه">
                    <option value="">انتخاب کنید</option>
                    <option>وب</option>
                    <option>دسکتاپ</option>
                    <option>موبایل</option>
                    <option>سیستم اختصاصی</option>
                </select>
            </div>
            <div class="dynamic-question">
                <label>تکنولوژی خاص</label>
                <select data-detail="تکنولوژی">
                    <option value="">مهم نیست</option>
                    <option>Python</option>
                    <option>JavaScript</option>
                    <option>PHP</option>
                    <option>سایر</option>
                </select>
            </div>`,

        "طراحی گرافیک": `
            <div class="dynamic-question">
                <label>نوع طراحی</label>
                <select data-detail="نوع طراحی">
                    <option value="">انتخاب کنید</option>
                    <option>لوگو</option>
                    <option>بنر</option>
                    <option>پست اینستاگرام</option>
                    <option>برندینگ</option>
                </select>
            </div>
            <div class="dynamic-question">
                <label>تعداد تقریبی</label>
                <select data-detail="تعداد">
                    <option>۱ مورد</option>
                    <option>۲ تا ۵ مورد</option>
                    <option>بیشتر از ۵ مورد</option>
                </select>
            </div>`,

        "ساخت اپل آیدی": `
            <div class="dynamic-question">
                <label>کشور مورد نظر</label>
                <select data-detail="کشور">
                    <option value="">انتخاب کنید</option>
                    <option>آمریکا</option>
                    <option>انگلستان</option>
                    <option>ترکیه</option>
                    <option>سایر</option>
                </select>
            </div>
            <div class="dynamic-question">
                <label>نیاز به گارانتی</label>
                <select data-detail="گارانتی">
                    <option>بله</option>
                    <option>خیر</option>
                </select>
            </div>`,

        "فعال‌سازی اپل آیدی": `
            <div class="dynamic-question">
                <label>وضعیت فعلی</label>
                <select data-detail="وضعیت">
                    <option value="">انتخاب کنید</option>
                    <option>قفل شده</option>
                    <option>نیاز به آنلاک</option>
                    <option>مشکل ورود</option>
                </select>
            </div>`,

        "عیب‌یابی سیستم": `
            <div class="dynamic-question">
                <label>سیستم عامل</label>
                <select data-detail="سیستم عامل">
                    <option value="">انتخاب کنید</option>
                    <option>ویندوز</option>
                    <option>مک</option>
                    <option>اندروید</option>
                    <option>سایر</option>
                </select>
            </div>
            <div class="dynamic-question">
                <label>نوع مشکل</label>
                <select data-detail="نوع مشکل">
                    <option value="">انتخاب کنید</option>
                    <option>کندی سیستم</option>
                    <option>ویروس و بدافزار</option>
                    <option>مشکل نرم‌افزاری</option>
                    <option>سایر</option>
                </select>
            </div>`,

        "فروش فایل و آموزش": `
            <div class="dynamic-question">
                <label>نوع محصول</label>
                <select data-detail="نوع محصول">
                    <option value="">انتخاب کنید</option>
                    <option>فایل آماده</option>
                    <option>قالب</option>
                    <option>آموزش ویدیویی</option>
                    <option>پکیج آموزشی</option>
                </select>
            </div>`
    };

    container.innerHTML = templates[selectedService] || `
        <div class="dynamic-question">
            <label>نوع درخواست</label>
            <select data-detail="نوع درخواست">
                <option value="">انتخاب کنید</option>
                <option>مشاوره</option>
                <option>پروژه اختصاصی</option>
                <option>هنوز مشخص نیست</option>
            </select>
        </div>`;
}

// ==================== BUDGET ====================
$$(".budget-options button").forEach(btn => {
    btn.addEventListener("click", function () {
        selectedBudget = this.dataset.budget;
        $$(".budget-options button").forEach(b => b.classList.remove("selected"));
        this.classList.add("selected");
    });
});

// ==================== COLLECT DETAILS ====================
function collectOrderDetails() {
    orderDetails = {};
    $$("#dynamicQuestions select").forEach(select => {
        const key = select.dataset.detail;
        const value = select.value;
        if (key && value) orderDetails[key] = value;
    });
}

// ==================== VALIDATION ====================
function validateStep(step) {
    if (step === 1 && !selectedService) {
        showMessage("لطفاً نوع پروژه را انتخاب کنید.");
        return false;
    }

    if (step === 2) {
        const description = document.getElementById("orderDescription")?.value.trim();
        if (!description || description.length < 10) {
            showMessage("لطفاً توضیح کامل‌تری درباره پروژه بنویسید.");
            return false;
        }
        collectOrderDetails();
    }

    if (step === 3) {
        const name  = document.getElementById("orderName")?.value.trim();
        const phone = document.getElementById("orderPhone")?.value.trim();

        if (!name) {
            showMessage("لطفاً نام خود را وارد کنید.");
            return false;
        }
        if (!/^09\d{9}$/.test(phone)) {
            showMessage("شماره موبایل صحیح نیست.");
            return false;
        }
    }
    return true;
}

// ==================== STEP NAVIGATION ====================
function nextOrderStep() {
    if (!validateStep(currentOrderStep)) return;
    if (currentOrderStep < 4) {
        currentOrderStep++;
        updateOrderStep();
    }
}

function previousOrderStep() {
    if (currentOrderStep > 1) {
        currentOrderStep--;
        updateOrderStep();
    }
}

function goToOrderStep(step) {
    currentOrderStep = step;
    updateOrderStep();
}

function updateOrderStep() {
    $$(".order-step").forEach(step => {
        step.classList.toggle("active", Number(step.dataset.stepContent) === currentOrderStep);
    });

    $$(".progress-step").forEach(step => {
        const num = Number(step.dataset.step);
        step.classList.toggle("active", num === currentOrderStep);
        step.classList.toggle("completed", num < currentOrderStep);
    });

    const progressLine = document.getElementById("orderProgressLine");
    if (progressLine) {
        progressLine.style.width = ((currentOrderStep - 1) / 3 * 100) + "%";
    }

    if (currentOrderStep === 4) buildOrderSummary();
}

// ==================== SUMMARY ====================
function buildOrderSummary() {
    const summary = document.getElementById("orderSummary");
    if (!summary) return;

    const name        = document.getElementById("orderName")?.value.trim() || "-";
    const phone       = document.getElementById("orderPhone")?.value.trim() || "-";
    const description = document.getElementById("orderDescription")?.value.trim() || "-";

    collectOrderDetails();

    let detailsHTML = Object.entries(orderDetails)
        .map(([key, value]) => `
            <div class="summary-row">
                <span>${escapeHTML(key)}</span>
                <strong>${escapeHTML(value)}</strong>
            </div>
        `).join("");

    summary.innerHTML = `
        <div class="summary-row">
            <span>نوع پروژه</span>
            <strong>${escapeHTML(selectedService)}</strong>
        </div>
        ${detailsHTML}
        <div class="summary-row">
            <span>بودجه</span>
            <strong>${escapeHTML(selectedBudget || "مشخص نشده")}</strong>
        </div>
        <div class="summary-row">
            <span>نام</span>
            <strong>${escapeHTML(name)}</strong>
        </div>
        <div class="summary-row">
            <span>موبایل</span>
            <strong>${escapeHTML(phone)}</strong>
        </div>
        <div class="summary-row summary-description">
            <span>توضیحات</span>
            <strong>${escapeHTML(description)}</strong>
        </div>
    `;
}

// ==================== SUBMIT ORDER ====================
orderForm?.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validateStep(4)) return;

    const name        = document.getElementById("orderName")?.value.trim();
    const phone       = document.getElementById("orderPhone")?.value.trim();
    const description = document.getElementById("orderDescription")?.value.trim();

    const order = {
        id: Date.now(),
        trackingCode: "MOS-" + Math.floor(100000 + Math.random() * 900000),
        name,
        phone,
        service: selectedService,
        budget: selectedBudget || "مشخص نشده",
        description,
        details: orderDetails,
        status: "در انتظار بررسی",
        date: new Date().toLocaleDateString("fa-IR")
    };

    const orders = JSON.parse(localStorage.getItem("mosiyoOrders")) || [];
    orders.push(order);
    localStorage.setItem("mosiyoOrders", JSON.stringify(orders));
    localStorage.setItem("mosiyoUser", JSON.stringify({ name, phone }));

    closeOrder();
    resetOrderWizard();
    updateDashboard();

    setTimeout(() => {
        showMessage("سفارش با موفقیت ثبت شد 🚀\n\nکد پیگیری شما:\n" + order.trackingCode);
    }, 100);
});

// ==================== LOGIN ====================
function openLogin() {
    if (!loginModal) return;
    loginModal.style.display = "flex";
    document.body.style.overflow = "hidden";
    if (phoneStep) phoneStep.style.display = "block";
    if (codeStep)  codeStep.style.display  = "none";
}

function closeLogin() {
    if (!loginModal) return;
    loginModal.style.display = "none";
    document.body.style.overflow = "";
}

function backToPhone() {
    if (phoneStep) phoneStep.style.display = "block";
    if (codeStep)  codeStep.style.display  = "none";
}

loginForm?.addEventListener("submit", function (e) {
    e.preventDefault();
    const phone = document.getElementById("phoneNumber")?.value.trim();

    if (!/^09\d{9}$/.test(phone)) {
        showMessage("شماره موبایل صحیح نیست.");
        return;
    }

    loginPhone = phone;
    if (phoneStep) phoneStep.style.display = "none";
    if (codeStep)  codeStep.style.display  = "block";
    showMessage("کد تأیید آزمایشی: 123456");
});

codeForm?.addEventListener("submit", function (e) {
    e.preventDefault();
    const code = document.getElementById("verificationCode")?.value.trim();

    if (code !== "123456") {
        showMessage("کد وارد شده صحیح نیست.");
        return;
    }

    let user = JSON.parse(localStorage.getItem("mosiyoUser")) || {
        name: "کاربر موسیو",
        phone: loginPhone
    };
    user.phone = loginPhone;
    localStorage.setItem("mosiyoUser", JSON.stringify(user));

    closeLogin();
    updateDashboard();
    showMessage("با موفقیت وارد شدید 👋");

    if (dashboard) {
        dashboard.style.display = "block";
        dashboard.scrollIntoView({ behavior: "smooth" });
    }
});

// ==================== DASHBOARD ====================
function updateDashboard() {
    const user   = JSON.parse(localStorage.getItem("mosiyoUser"));
    const orders = JSON.parse(localStorage.getItem("mosiyoOrders")) || [];

    if (user) {
        if (userName)    userName.textContent    = user.name;
        if (profileName)  profileName.textContent  = user.name;
        if (profilePhone) profilePhone.textContent = user.phone;
    }

    if (orderCount)     orderCount.textContent     = orders.length;
    if (pendingCount)   pendingCount.textContent   = orders.filter(o => o.status === "در انتظار بررسی").length;
    if (workingCount)   workingCount.textContent   = orders.filter(o => o.status === "در حال انجام").length;
    if (completedCount) completedCount.textContent = orders.filter(o => o.status === "تکمیل شده").length;

    renderOrders(orders);
}

function renderOrders(orders) {
    if (!ordersList) return;

    if (orders.length === 0) {
        ordersList.innerHTML = `
            <div class="empty-orders" style="text-align:center;padding:40px 20px;">
                <div style="font-size:45px;margin-bottom:15px;">📋</div>
                <p style="color:#8d96a5;margin-bottom:20px;">هنوز سفارشی ثبت نکرده‌اید.</p>
                <button class="primary-btn" onclick="openOrder()">ثبت اولین سفارش 🚀</button>
            </div>`;
        return;
    }

    const icons = {
        "طراحی سایت": "🌐",
        "ربات تلگرام": "🤖",
        "برنامه‌نویسی": "💻",
        "طراحی گرافیک": "🎨",
        "ساخت اپل آیدی": "🍎",
        "فعال‌سازی اپل آیدی": "🔓",
        "عیب‌یابی سیستم": "🛠️",
        "فروش فایل و آموزش": "📁"
    };

    ordersList.innerHTML = [...orders].reverse().map(order => `
        <div class="order-item">
            <div class="order-icon">${icons[order.service] || "📋"}</div>
            <div class="order-info">
                <h4>${escapeHTML(order.service)}</h4>
                <p>${escapeHTML(order.description)}</p>
                <small>${escapeHTML(order.date)}</small>
                ${order.trackingCode ? `<small>کد پیگیری: ${escapeHTML(order.trackingCode)}</small>` : ""}
            </div>
            <div class="order-status">${escapeHTML(order.status)}</div>
        </div>
    `).join("");
}

function logout() {
    localStorage.removeItem("mosiyoUser");
    if (dashboard) dashboard.style.display = "none";
    showMessage("از حساب کاربری خارج شدید.");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function editProfile() {
    const user = JSON.parse(localStorage.getItem("mosiyoUser"));
    if (!user) {
        showMessage("ابتدا وارد حساب کاربری شوید.");
        return;
    }

    const newName = prompt("نام جدید را وارد کنید:", user.name);
    if (!newName) return;

    user.name = newName.trim();
    localStorage.setItem("mosiyoUser", JSON.stringify(user));
    updateDashboard();
    showMessage("اطلاعات با موفقیت ویرایش شد ✅");
}

// ==================== UTILS ====================
function goToServices() {
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
}

// Close modals
window.addEventListener("click", (e) => {
    if (e.target === orderModal) closeOrder();
    if (e.target === loginModal) closeLogin();
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeOrder();
        closeLogin();
    }
});

// Service cards click
$$(".service-clickable").forEach(card => {
    card.addEventListener("click", function () {
        const title = this.querySelector("h3")?.textContent?.trim();
        if (title) openOrder(title);
    });
});

// ==================== MATRIX RAIN ====================
const canvas = document.getElementById("matrixCanvas");
if (canvas) {
    const ctx = canvas.getContext("2d");
    let width, height, columns, matrixDrops = [];
    const fontSize = 14;
    const chars = "アカサタナハマヤラワ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    function resizeMatrix() {
        width  = canvas.width  = window.innerWidth  * devicePixelRatio;
        height = canvas.height = window.innerHeight * devicePixelRatio;
        canvas.style.width  = window.innerWidth  + "px";
        canvas.style.height = window.innerHeight + "px";
        ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

        columns = Math.floor(window.innerWidth / fontSize);
        matrixDrops = Array(columns).fill(0).map(() => Math.random() * -window.innerHeight);
    }

    function drawMatrix() {
        ctx.fillStyle = "rgba(5,6,8,0.075)";
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.font = fontSize + "px monospace";

        for (let i = 0; i < columns; i++) {
            const char = chars[Math.floor(Math.random() * chars.length)];
            const x = i * fontSize;
            const y = matrixDrops[i];
            const alpha = 0.18 + Math.random() * 0.45;

            ctx.fillStyle = `rgba(255,114,0,${alpha})`;
            ctx.fillText(char, x, y);

            matrixDrops[i] += Math.random() * 0.45 + 0.25;
            if (matrixDrops[i] > window.innerHeight + 100) {
                matrixDrops[i] = Math.random() * -300;
            }
        }
        requestAnimationFrame(drawMatrix);
    }

    resizeMatrix();
    window.addEventListener("resize", resizeMatrix);
    drawMatrix();
}

// ==================== ENERGY CORE INTERACTION ====================
const energyCore = document.getElementById("energyCore");
if (energyCore) {
    const wrap = energyCore.closest(".energy-core-wrap");
    if (wrap) {
        wrap.addEventListener("mousemove", (e) => {
            const rect = wrap.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 10;
            const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -10;

            energyCore.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
        });

        wrap.addEventListener("mouseleave", () => {
            energyCore.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
        });
    }
}

// ==================== INIT ====================
document.addEventListener("DOMContentLoaded", updateDashboard);