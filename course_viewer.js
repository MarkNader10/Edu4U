document.addEventListener('DOMContentLoaded', () => {
    const videoIframe = document.getElementById('main-video-iframe');
    const videoListContainer = document.getElementById('video-list');
    const courseTitleHeader = document.getElementById('course-title-header');
    const markCompletedBtn = document.getElementById('mark-completed-btn');
    const thumbnailContainer = document.getElementById('thumbnail-container');
    const videoThumbnailImg = document.getElementById('video-thumbnail-img');

    // ==========================================
    // 1. بيانات صور الكورسات الرئيسية (يجب عليك تحديث هذه الروابط) ✅
    // ==========================================
    const COURSE_THUMBNAILS = {
        // ضع هنا اسم ملف الصورة الرئيسية لكل كورس، ويجب أن تكون هذه الملفات موجودة في مجلد مشروعك
        "مقدمة في HTML": "html.avif", 
        "أساسيات JavaScript": "javascript.webp",
        "برمجة CSS للمبتدئين": "css.jpg"
    };

    // دالة مساعدة: (تم إبقاؤها لكن لن نستخدمها لجلب صور يوتيوب بعد الآن)
    function getVideoId(embedLink) {
        const match = embedLink.match(/\/embed\/([^/?]+)/);
        if (match && match[1] && match[1].length === 11) {
            return match[1];
        }
        return null;
    }
    
    // ==========================================
    // 2. البيانات الثابتة (روابط الفيديوهات)
    // ... (الكود لم يتغير هنا) ...
    // ==========================================
    const COURSES_DATA = {
        "مقدمة في HTML": [
            { id: 1, title: "مقدمة وأساسيات HTML", link: "https://www.youtube.com/embed/videoseries?list=PLDoPjvoNmBAw_2jJDEdAXiG-tTfR3bF0d" },
            { id: 2, title: "إنشاء الروابط والصور", link: "https://www.youtube.com/embed/2u3s80eN-c0" },
            { id: 3, title: "الجداول والقوائم", link: "https://www.youtube.com/embed/VvH1pQc3s6o" },
            { id: 4, title: "النماذج (Forms) الأساسية", link: "https://www.youtube.com/embed/8b515w_hB0c" },
            { id: 5, title: "الوسوم الدلالية (Semantic Tags)", link: "https://www.youtube.com/embed/3vM31JqD30U" },
            { id: 6, title: "الفرق بين HTML5 و HTML القديمة", link: "https://www.youtube.com/embed/7V8n9sUu23Q" },
        ],
        "أساسيات JavaScript": [
            { id: 1, title: "المدخل إلى جافاسكريبت", link: "https://www.youtube.com/embed/Yp_4k1rQ6oQ" },
            { id: 2, title: "المتغيرات وأنواع البيانات", link: "https://www.youtube.com/embed/gT41y_t7tLw" },
            { id: 3, title: "العمليات الحسابية والمنطقية", link: "https://www.youtube.com/embed/v9C1kE4501Q" },
            { id: 4, title: "الشروط (If, Else)", link: "https://www.youtube.com/embed/p171h08_94w" },
            { id: 5, title: "الحلقات التكرارية (Loops)", link: "https://www.youtube.com/embed/6i2xO2Qv1yQ" },
            { id: 6, title: "الدوال (Functions)", link: "https://www.youtube.com/embed/gI8uWb8N6Dk" },
            { id: 7, title: "المصفوفات (Arrays)", link: "https://www.youtube.com/embed/w8Jk8L3M9q4" },
            { id: 8, title: "الكائنات (Objects)", link: "https://www.youtube.com/embed/2rYJ_E2b43g" },
            { id: 9, title: "التعامل مع DOM", link: "https://www.youtube.com/embed/n4y_Xy917Dk" },
            { id: 10, title: "الأحداث (Events)", link: "https://www.youtube.com/embed/R-rQ_5p1wBw" },
            { id: 11, title: "مقدمة في AJAX", link: "https://www.youtube.com/embed/MhB48w5oT1c" },
        ],
        "برمجة CSS للمبتدئين": [
            { id: 1, title: "ما هي CSS؟", link: "https://www.youtube.com/embed/Q0aT-Bw2f6E" },
            { id: 2, title: "طرق كتابة CSS", link: "https://www.youtube.com/embed/kYc70Yj-w7c" },
            { id: 3, title: "المحددات (Selectors)", link: "https://www.youtube.com/embed/v8x1u8rYg0w" },
            { id: 4, title: "الألوان والخلفيات", link: "https://www.youtube.com/embed/sA753457nCg" },
            { id: 5, title: "الخطوط والنصوص", link: "https://www.youtube.com/embed/tK_z78HlS-g" },
            { id: 6, title: "نموذج الصندوق (Box Model)", link: "https://www.youtube.com/embed/Y9h5zUqG3oA" },
            { id: 7, title: "المرونة (Flexbox) - الجزء 1", link: "https://www.youtube.com/embed/B8J_lQ1X5X8" },
            { id: 8, title: "المرونة (Flexbox) - الجزء 2", link: "https://www.youtube.com/embed/A8g33K6e3k0" },
            { id: 9, title: "الشبكات (Grid)", link: "https://www.youtube.com/embed/qJg5iQ3l39w" },
            { id: 10, title: "الوسائط (Media Queries) والاستجابة", link: "https://www.youtube.com/embed/t-W55Wn7yXQ" },
        ]
    };

    let courseTitle = '';
    let enrolledCoursesProgress = {}; 
    let currentVideoIndex = -1; 
    let currentVideoEmbedLink = ''; 

    // ==========================================
    // 3. إدارة الذاكرة المحلية (Local Storage)
    // ... (هذه الدوال كما هي) ...
    function loadProgress() {
        const storedProgress = localStorage.getItem('enrolledCoursesProgress');
        enrolledCoursesProgress = storedProgress ? JSON.parse(storedProgress) : {};
    }

    function saveProgress() {
        localStorage.setItem('enrolledCoursesProgress', JSON.stringify(enrolledCoursesProgress));
    }

    function initVideoProgress(course) {
        if (!COURSES_DATA[course]) return;
        
        if (!enrolledCoursesProgress[course] || enrolledCoursesProgress[course].length !== COURSES_DATA[course].length) {
            const videoCount = COURSES_DATA[course].length;
            enrolledCoursesProgress[course] = Array(videoCount).fill(false);
            saveProgress();
        }
    }

    function markVideoCompleted(index) {
        if (enrolledCoursesProgress[courseTitle] && index >= 0 && index < enrolledCoursesProgress[courseTitle].length) {
            enrolledCoursesProgress[courseTitle][index] = true;
            saveProgress();
            renderPlaylist(courseTitle); 
        }
    }

    // ==========================================
    // 4. عرض وتشغيل الفيديوهات
    // ==========================================

    function renderPlaylist(course) {
        if (!course || !COURSES_DATA[course]) return;

        videoListContainer.innerHTML = '';
        const videos = COURSES_DATA[course];
        const progress = enrolledCoursesProgress[course] || [];
        
        document.querySelectorAll('.video-item').forEach(item => item.classList.remove('active'));

        videos.forEach((video, index) => {
            const isCompleted = progress[index] === true;
            const isActive = index === currentVideoIndex;

            const videoItem = document.createElement('div');
            videoItem.classList.add('video-item');
            if (isActive) videoItem.classList.add('active');
            if (isCompleted) videoItem.classList.add('completed');
            
            videoItem.innerHTML = `
                <span>${video.id}.</span> ${video.title} 
                ${isCompleted ? '<i class="fas fa-check-circle" style="margin-right: 5px;"></i>' : ''}
            `;
            videoItem.dataset.index = index;
            
            videoItem.addEventListener('click', () => playVideo(index));
            videoListContainer.appendChild(videoItem);
        });
        
        if (currentVideoIndex !== -1 && progress[currentVideoIndex] === true) {
            markCompletedBtn.disabled = true;
            markCompletedBtn.textContent = 'مشاهد بالفعل ✅';
        } else {
            markCompletedBtn.disabled = false;
            markCompletedBtn.textContent = 'تعليم كـ"مشاهد"';
        }
    }

    function showVideoPlayer(isEmbed) {
        if (isEmbed) {
            videoIframe.style.display = 'block';
            thumbnailContainer.style.display = 'none';
        } else {
            videoIframe.style.display = 'none';
            thumbnailContainer.style.display = 'block';
        }
    }

    // دالة playVideo معدلة لاستخدام الصورة الثابتة دائماً عند الضغط على فيديو جديد
    function playVideo(index) {
        const videos = COURSES_DATA[courseTitle];
        if (index < 0 || index >= videos.length) return;

        const video = videos[index];
        currentVideoIndex = index;
        currentVideoEmbedLink = video.link; 

        // 1. تحديث عنوان الصفحة
        courseTitleHeader.textContent = `${courseTitle} - الدرس ${video.id}: ${video.title}`;
        
        // 2. تحديث الصورة المصغرة باستخدام الصورة الثابتة للكورس دائماً
        const courseImageLink = COURSE_THUMBNAILS[courseTitle] || 'placeholder.jpg';
        videoThumbnailImg.src = courseImageLink;

        // 3. عرض الصورة المصغرة أولاً
        showVideoPlayer(false);

        // 4. إعادة رسم القائمة لتحديث التحديد
        renderPlaylist(courseTitle);
    }
    
    // ==========================================
    // 5. تشغيل الفيديو فعلياً عند النقر على الصورة
    // ... (هذا الجزء لم يتغير) ...
    // ==========================================

    thumbnailContainer.addEventListener('click', () => {
        if (currentVideoIndex !== -1 && currentVideoEmbedLink) {
            // قم بتعيين رابط iframe (مع التشغيل التلقائي)
            videoIframe.src = `${currentVideoEmbedLink}?autoplay=1`;
            // عرض المشغل
            showVideoPlayer(true);
        }
    });

    // ==========================================
    // 6. تهيئة الصفحة
    // ==========================================

    function initializeViewer() {
        const urlParams = new URLSearchParams(window.location.search);
        courseTitle = urlParams.get('course');
        
        if (!courseTitle || !COURSES_DATA[courseTitle]) {
            courseTitleHeader.textContent = "خطأ: الكورس غير موجود أو بياناته غير مهيأة!";
            videoIframe.style.display = 'none';
            markCompletedBtn.style.display = 'none';
            thumbnailContainer.style.display = 'none';
            return;
        }

        document.title = `${courseTitle} | Edu4U`;
        courseTitleHeader.textContent = courseTitle;

        loadProgress(); 
        initVideoProgress(courseTitle); 

        // ابدأ بعرض الفيديو الأول (الذي سيعرض الصورة الثابتة للكورس)
        playVideo(0);

        markCompletedBtn.addEventListener('click', () => {
            if (currentVideoIndex !== -1 && !enrolledCoursesProgress[courseTitle][currentVideoIndex]) {
                markVideoCompleted(currentVideoIndex);
                alert('تم تسجيل الفيديو كمشاهد! يمكنك الانتقال إلى الفيديو التالي.');
                
                const nextIndex = currentVideoIndex + 1;
                if (nextIndex < COURSES_DATA[courseTitle].length) {
                    playVideo(nextIndex); 
                } else {
                    alert('تهانينا! لقد أكملت جميع فيديوهات هذا الكورس.');
                }
            }
        });
    }

    initializeViewer();
});