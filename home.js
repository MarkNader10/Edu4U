// =============================
// 1. تعريف العناصر
// =============================
const body = document.body;
const themeToggleBtn = document.getElementById('theme-toggle');
const langToggleBtn = document.getElementById('lang-toggle');
const themeImg = document.getElementById('theme-img');

// =============================
// 2. قاموس الترجمة
// =============================
const translations = {
    ar: {
        "nav-home": "الرئيسية",
        "nav-mycourses": "كورساتي",
        "my-courses-title": "كورساتي", // مفتاح الرأس (Header)
        "nav-courses": "جميع الكورسات",
        "nav-calc": "الحاسبة",
        "acc-profile": "حسابي",
        "acc-logout": "تسجيل الخروج",
        "hero-title": 'منصة <span class="brand-name">Edu4U</span> التعليمية',
        "hero-desc": "Edu4U هي المنصة الأولى والوحيدة اللي هتساعدك تحول البرمجة جزء أساسي من يومك، معانا هتعيش رحلة تعلم ممتعة مليانة تحديات.",
        "hero-btn": "ابدأ التعلم الآن"
    },
    en: {
        "nav-home": "Home",
        "nav-mycourses": "My Courses",
        "my-courses-title": "My Courses", // مفتاح الرأس (Header) الجديد
        "nav-courses": "All Courses",
        "nav-calc": "Calculator",
        "acc-profile": "My Profile",
        "acc-logout": "Logout",
        "hero-title": 'Welcome to <span class="brand-name">Edu4U</span>',
        "hero-desc": "Edu4U is the first and only platform that will help you make programming an essential part of your day. Join us for an enjoyable learning journey full of challenges.",
        "hero-btn": "Start Learning Now"
    }
};

// =============================
// 3. وظائف الوضع الليلي (Dark/Light)
// =============================
function applyTheme(theme) {
    // اللوجو يتم تبديله تلقائيا بواسطة CSS
    if (theme === 'dark') {
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
        if (themeImg) themeImg.src = "icons/sun (3).png"; // صورة الشمس في الوضع الليلي
    } else {
        body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
        if (themeImg) themeImg.src = "icons/moon.png"; // صورة القمر في الوضع النهاري
    }
}

// =============================
// 4. وظائف الترجمة (Ar/En)
// =============================
function applyLanguage(lang) {
    // 1. تغيير اتجاه الصفحة ولغتها
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    // 2. تحديث النصوص بناءً على data-lang
    const elements = document.querySelectorAll('[data-lang]');
    elements.forEach(element => {
        const key = element.getAttribute('data-lang');
        if (translations[lang][key]) {
            element.innerHTML = translations[lang][key]; 
        }
    });

    // 3. حفظ اللغة
    localStorage.setItem('lang', lang);
}

// =============================
// 5. عند تحميل الصفحة (تشغيل الإعدادات المحفوظة)
// =============================
document.addEventListener('DOMContentLoaded', () => {
    // تحميل الثيم
    const savedTheme = localStorage.getItem('theme');
    applyTheme(savedTheme ? savedTheme : 'light');

    // تحميل اللغة
    const savedLang = localStorage.getItem('lang');
    applyLanguage(savedLang ? savedLang : 'ar');
});

// =============================
// 6. مستمعات الأحداث (الأزرار)
// =============================

// زر الوضع الليلي
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    });
}

// زر الترجمة
if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
        const currentLang = document.documentElement.lang;
        const newLang = currentLang === 'ar' ? 'en' : 'ar';
        applyLanguage(newLang);
    });
    document.addEventListener('DOMContentLoaded', () => {
    const startLearningBtn = document.getElementById('start-learning-btn');

    if (startLearningBtn) {
        startLearningBtn.addEventListener('click', () => {
            // توجيه المتصفح إلى صفحة كورساتي
            window.location.href = 'my_courses.html';
        });
    }
});
}