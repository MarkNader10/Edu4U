document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('course-search');
    const coursesGrid = document.getElementById('courses-list');
    const courseCards = Array.from(document.querySelectorAll('.course-card'));
    const displayedCountSpan = document.getElementById('displayed-count'); 

    // ==========================================
    // دالة تحديث العداد المعروض (محتفظ بها من قبل)
    // ==========================================
    function updateDisplayedCount() {
        const visibleCourses = courseCards.filter(card => card.style.display !== 'none').length;
        displayedCountSpan.textContent = visibleCourses;
    }

    // ==========================================
    // دالة البحث والتصفية والترتيب (محتفظ بها من قبل)
    // ==========================================
    function filterCourses() {
        // ... (نفس كود filterCourses السابق) ...
        const query = searchInput.value.trim().toLowerCase();
        let firstMatch = null;
        
        courseCards.forEach(card => {
            const title = card.querySelector('.course-title').textContent.toLowerCase();
            
            if (title.includes(query) || query === '') {
                card.style.display = 'block'; 
                if (firstMatch === null && query !== '') {
                    firstMatch = card; 
                }
            } else {
                card.style.display = 'none'; 
            }
        });

        if (firstMatch && query !== '') {
             coursesGrid.prepend(firstMatch);
        }
        updateDisplayedCount();
    }
    
    // ربط البحث بحدث الكتابة
    searchInput.addEventListener('input', filterCourses);
    updateDisplayedCount();

    // ==========================================
    // منطق إضافة الكورس (الجديد)
    // ==========================================

    // دالة لحفظ حالة الكورسات في LocalStorage
    function saveEnrolledCourses(courses) {
        localStorage.setItem('enrolledCourses', JSON.stringify(courses));
    }

    // دالة لجلب الكورسات المُضافة
    function getEnrolledCourses() {
        const courses = localStorage.getItem('enrolledCourses');
        return courses ? JSON.parse(courses) : [];
    }

    // دالة تحديث حالة زر "مجاناً" عند تحميل الصفحة
    function updateEnrollmentButtons() {
        const enrolled = getEnrolledCourses();
        courseCards.forEach(card => {
            const courseTitle = card.querySelector('.course-title').textContent.trim();
            const enrollBtn = card.querySelector('.enroll-btn');

            if (enrolled.includes(courseTitle)) {
                // الكورس مُضاف بالفعل
                enrollBtn.textContent = 'Added'; // الخطوة الأولى: Added
                enrollBtn.href = 'my_courses.html'; // الخطوة الثانية: يذهب لكورساتي
                enrollBtn.classList.remove('free');
            } else {
                // الكورس غير مُضاف
                enrollBtn.textContent = 'مجاناً';
                enrollBtn.href = '#'; // أو 'my_courses.html' حسب ما تفضله للضغط الثاني
                enrollBtn.classList.add('free');
            }
        });
    }

    // دالة لمعالجة النقر على زر "مجاناً"
    coursesGrid.addEventListener('click', (e) => {
        const btn = e.target.closest('.enroll-btn');
        if (!btn) return;

        const card = btn.closest('.course-card');
        const courseTitle = card.querySelector('.course-title').textContent.trim();
        let enrolled = getEnrolledCourses();

        // 1. إذا كان الزر "مجاناً" (الكورس غير مُضاف)
        if (btn.classList.contains('free')) {
            enrolled.push(courseTitle);
            saveEnrolledCourses(enrolled);
            
            // تحديث حالة الزر فوراً
            btn.textContent = 'Added';
            btn.href = 'my_courses.html'; // يذهب لصفحة كورساتي في الضغطة التالية
            btn.classList.remove('free');

            // منع التنقل المباشر ليرى المستخدم كلمة Added
            e.preventDefault(); 
            
        } 
        // 2. إذا كان الزر "Added" (الكورس مُضاف)
        else if (btn.textContent.trim() === 'Added') {
            // سيتم تنفيذ الـ href='my_courses.html' (سيذهب إلى كورساتي)
        }
    });

    // استدعاء التحديث عند تحميل الصفحة لأول مرة
    updateEnrollmentButtons();
});