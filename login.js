const toggleBtn = document.getElementById('theme-toggle');
const langBtn = document.getElementById('lang-toggle');
const body = document.body;

// النصوص لكل لغة
const texts = {
    ar: {
        welcomeTitle: "مرحباً بك في منصة التعليم لأجلك",
        feature1Title: "جاهز للبدء",
        feature1Text: "ابدأ رحلتك التعليمية معنا واحصل على أفضل المهارات.",
        feature2Title: "وفر وقتك",
        feature2Text: "تعلم في أي وقت ومن أي مكان بسهولة وراحة.",
        loginTitle: "تسجيل الدخول",
        emailLabel: "البريد الإلكتروني",
        passwordLabel: "كلمة المرور",
        loginBtn: "تسجيل الدخول",
        registerText: "ليس لديك حساب؟",
        registerLink: "سجل الآن"
    },
    en: {
        welcomeTitle: "Welcome to Edu4u",
        feature1Title: "Ready to Start",
        feature1Text: "Start your learning journey with us and gain the best skills.",
        feature2Title: "Save Your Time",
        feature2Text: "Learn anytime, anywhere with ease and comfort.",
        loginTitle: "Login",
        emailLabel: "Email",
        passwordLabel: "Password",
        loginBtn: "Login",
        registerText: "Don't have an account?",
        registerLink: "Register now"
    }
};

// اللغة الحالية (افتراضي عربي)
let currentLang = 'ar';

// =======================================
// وضع الليل/النهار
// =======================================
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    toggleBtn.src = 'icons/sun (3).png';
} else {
    toggleBtn.src = 'icons/moon.png';
}

toggleBtn.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        toggleBtn.src = 'icons/sun (3).png';
    } else {
        localStorage.setItem('theme', 'light');
        toggleBtn.src = 'icons/moon.png';
    }
});

// =======================================
// تبديل اللغة عند الضغط على أيقونة واحدة (صورة)
// =======================================
function setLanguage(lang) {
    currentLang = lang;
    document.getElementById('welcome-title').textContent = texts[lang].welcomeTitle;
    document.getElementById('feature1-title').textContent = texts[lang].feature1Title;
    document.getElementById('feature1-text').textContent = texts[lang].feature1Text;
    document.getElementById('feature2-title').textContent = texts[lang].feature2Title;
    document.getElementById('feature2-text').textContent = texts[lang].feature2Text;
    document.getElementById('login-title').textContent = texts[lang].loginTitle;
    document.getElementById('email-label').textContent = texts[lang].emailLabel;
    document.getElementById('password-label').textContent = texts[lang].passwordLabel;
    document.getElementById('login-btn').textContent = texts[lang].loginBtn;
    document.getElementById('register-text').childNodes[0].textContent = texts[lang].registerText + " ";
    document.getElementById('register-link').textContent = texts[lang].registerLink;

    // تغيير صورة أيقونة اللغة حسب اللغة
    if(lang === 'ar'){
        langBtn.src = 'icons/planet.png';
    } else {
        langBtn.src = 'icons/planet.png';
    }
}

// عند الضغط على الأيقونة: التبديل بين اللغتين
langBtn.addEventListener('click', () => {
    if(currentLang === 'ar'){
        setLanguage('en');
    } else {
        setLanguage('ar');
    }
});