document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. الدوال الأساسية لجلب البيانات
    // ==========================================

    function getEnrolledCourses() {
        const courses = localStorage.getItem('enrolledCourses');
        return courses ? JSON.parse(courses) : [];
    }
    
    // دالة لجلب تقدم الكورسات (مطلوبة لحساب التقدم الجديد)
    function getEnrolledCoursesProgress() {
        const progress = localStorage.getItem('enrolledCoursesProgress');
        return progress ? JSON.parse(progress) : {};
    }

    // البيانات الثابتة للكورسات (يجب أن تتطابق العناوين مع الموجودة في courses.html)
    // *ملاحظة*: تم حذف مفتاح 'progress' هنا لأنه سيتم حسابه ديناميكياً.
    const availableCoursesData = {
        "مقدمة في HTML": {
            image: "images/html.avif",
            time: 7, // إجمالي وقت الكورس بالساعات
            videos: 6 // يجب أن يتطابق مع العدد الفعلي للفيديوهات في course_viewer.js
        },
        "أساسيات JavaScript": {
            image: "images/javascript.webp",
            time: 17.5,
            videos: 11
        },
        "برمجة CSS للمبتدئين": {
            image: "images/css.jpg",
            time: 1,
            videos: 10
        }
        // أضف المزيد هنا بنفس التنسيق
    };

    // ==========================================
    // 2. دالة عرض الكورسات (RENDER)
    // ==========================================

    const myCoursesList = document.getElementById('my-courses-list');
    const enrolledCoursesTitles = getEnrolledCourses();
    const enrolledCoursesProgress = getEnrolledCoursesProgress();

    function renderMyCourses() {
        myCoursesList.innerHTML = ''; // تفريغ القائمة قبل الإضافة
        
        if (enrolledCoursesTitles.length === 0) {
            // رسالة "لا يوجد كورسات" قابلة للترجمة (باستخدام data-lang)
            myCoursesList.innerHTML = `
                <p class="no-courses-message" data-lang="no-courses-msg" 
                   style="text-align: center; width: 100%; margin-top: 50px;">
                </p>`;
            return;
        }

        enrolledCoursesTitles.forEach(title => {
            const data = availableCoursesData[title];
            
            if (data) {
                
                // 1. حساب التقدم الفعلي 📊
                const progressArray = enrolledCoursesProgress[title] || [];
                const completedVideos = progressArray.filter(isCompleted => isCompleted).length;
                const totalVideos = data.videos; 
                
                let progressPercentage = 0;
                if (totalVideos > 0) {
                    progressPercentage = (completedVideos / totalVideos) * 100;
                }
                const progressText = progressPercentage.toFixed(0);

                const progressBarHTML = `
                    <div class="progress-bar">
                        <div class="progress" style="width: ${progressText}%;">
                            ${progressText}%
                        </div>
                    </div>
                `;

                // 2. إنشاء رابط "دخول" بشكل صحيح (التعديل الأساسي) ✅
                const viewerLink = `course_viewer.html?course=${encodeURIComponent(title)}`;

                // 3. إنشاء كارد الكورس الجديد
                const cardHTML = `
                    <div class="course-card">
                        <div class="course-image-container">
                            <img src="${data.image}" alt="${title}" class="course-img"> 
                        </div>
                        
                        <div class="course-info">
                            <h3 class="course-title">${title}</h3>
                            
                            ${progressBarHTML} 
                            
                            <div class="course-stats">
                                <span class="stat-item">
                                    <i class="fab fa-youtube"></i> 
                                    <span class="stat-value">${totalVideos}</span> فيديو
                                </span>
                                <span class="stat-item">
                                    <i class="far fa-clock"></i> 
                                    <span class="stat-value">${data.time}</span> ساعة
                                </span>
                            </div>
                            
                            <a href="${viewerLink}" class="enroll-btn access" data-lang="enroll-access">دخول</a>
                        </div>
                    </div>
                `;
                myCoursesList.insertAdjacentHTML('beforeend', cardHTML);
            }
        });
    }

    renderMyCourses();
});