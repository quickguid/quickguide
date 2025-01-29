/*let currentSlideIndex = 0; // الشريحة الحالية
let audio = null; // الصوت الحالي
let isAudioPlaying = false;
let isMuted = false; // حالة الكتم

const slides = [
    {
        id: "slide1",
        content: `
            <div id="slide1">
                <img src="/static/x1.png" alt="Presentation Background">
                <button class="start-button" onclick="navigateForward()">ابدأ</button>
            </div>
        `,
        progress: 1,
        audio: null, // لا صوت لهذه الشريحة
        guidance: null //النص الارشادي

    },
    {
        id: "slide2",
        content: `
            <div id="slide2">
                <div class="main-content">
                    <img src="/static/2.png" alt="Main Image">
                </div>
                <div class="footer">
                    <button onclick="navigateBackward()">&#8592;</button> <!-- زر الرجوع -->
                    <button onclick="toggleAudio(this)">&#10074;&#10074;</button> <!-- زر تشغيل/إيقاف الصوت -->
                    <button onclick="navigateForward()">&#8594;</button> <!-- زر التقدم -->
                </div>
                <div class="gov">
                    <img src="/static/gov.png" alt="GOV.SA Logo">
                </div>
            </div>
        `,
        progress: 50,
        audio: "khalid.mp3", // صوت لهذه الشريحة
        guidance: null

    },
    
        {
            id: "slide3",
            content: `
                <div id="slide3">
                    <h1>الشريحة الثالثة</h1>
                    <div class="input-container">
                        <input type="text" id="user-input" placeholder="أدخل النص هنا" />
                        <button onclick="sendDataToServer()">إرسال</button>
                    </div>
                    <div class="response-container">
                        <p id="response-message"></p>
                    </div>
                    <div class="footer">
                        <button onclick="navigateBackward()">&#8592;</button> <!-- زر الرجوع -->
                        <button onclick="toggleAudio(this)">&#10074;&#10074;</button> <!-- زر تشغيل/إيقاف الصوت -->
                        <button onclick="navigateForward()">&#8594;</button> <!-- زر التقدم -->
                    </div>
                </div>
            `,
            progress: 100,
            audio: null ,// لا صوت لهذه الشريحة
            guidance: "شاهد المحتوى الرئيسي واستمع للصوت، ثم اضغط على السهم للانتقال."

        }
        
    
];

//------------------------ FUNCTIONS ------------------------------------------

function showSlide(index) {
    const rectangle = document.getElementById("presentation-rectangle");
    const progressBar = document.getElementById("custom-progress-bar");
    const guidanceBar = document.querySelector(".guidance-bar"); // الشريط الإرشادي
    const guidanceText = document.getElementById("guidance-text");


    // تحديث محتوى الشريحة
    rectangle.innerHTML = slides[index].content;

    // تحديث شريط التقدم
    progressBar.style.width = `${slides[index].progress}%`;

     // تحديث النص الإرشادي وإظهار/إخفاء الشريط
     if (slides[index].guidance) {
        guidanceBar.style.display = "block"; // إظهار الشريط
        guidanceText.textContent = slides[index].guidance;
    } else {
        guidanceBar.style.display = "none"; // إخفاء الشريط
    }

    // إعادة الصوت إذا كان موجودًا
    resetAudio();
    if (slides[index].audio) {
        audio = new Audio(`/static/${slides[index].audio}`);
        audio.play(); // تشغيل الصوت تلقائيًا
        isAudioPlaying = true;
    } else {
        audio = null;
        isAudioPlaying = false;
    }

    // تحديث زر التشغيل في الشريط
    syncPlayPauseIcons();
}

//-------------------------- BAR BUTTON -------------------------

// إعادة العرض
function resetSlideShow() {
    currentSlideIndex = 0; // العودة إلى الشريحة الأولى
    showSlide(currentSlideIndex); // عرض الشريحة الأولى
}


// التحكم في الصوت (تشغيل/إيقاف)
function toggleAudio(button) {
    const barButton = document.querySelector(".custom-nav-btn.play-btn");
    const slideButton = document.querySelector(".footer button:nth-child(2)"); // زر الشريحة الحالية

    if (audio) {
        if (isAudioPlaying) {
            audio.pause();
            button.innerHTML = "&#9658;"; // ▶
            if (barButton) barButton.innerHTML = "&#9658;"; // ▶
        } else {
            audio.play();
            button.innerHTML = "&#10074;&#10074;"; // ⏸
            if (barButton) barButton.innerHTML = "&#10074;&#10074;"; // ⏸
        }
        isAudioPlaying = !isAudioPlaying;
    } else {
        // إذا لم يكن هناك صوت، انتقل إلى الشريحة التالية
        navigateForward();
    }
}

// العودة إلى الشريحة السابقة
function navigateBackward() {
    if (currentSlideIndex > 0) {
        currentSlideIndex--;
        showSlide(currentSlideIndex);
    }
}

// الانتقال إلى الشريحة التالية
function navigateForward() {
    if (currentSlideIndex < slides.length - 1) {
        currentSlideIndex++;
        showSlide(currentSlideIndex);
    }
}

// إعادة الصوت
function resetAudio() {
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
    }
    isAudioPlaying = false;
}

//كتم الصوت 
function toggleMute(button) {
    if (audio) {
        isMuted = !isMuted; // عكس حالة الكتم
        audio.muted = isMuted; // تفعيل/تعطيل الكتم
        
        // تحديث أيقونة الزر
        button.innerHTML = isMuted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
    }
}

// تحديث أيقونات التشغيل/الإيقاف
function syncPlayPauseIcons() {
    const barButton = document.querySelector(".custom-nav-btn.play-btn");
    const slideButton = document.querySelector(".start-button");

    if (barButton) {
        barButton.innerHTML = isAudioPlaying ? "&#10074;&#10074;" : "&#9658;";
    }
}

//تحديث الشريط الازرق 
function updateGuidanceText(text) {
    const guidanceText = document.getElementById('guidance-text');
    guidanceText.textContent = text; // تحديث النص
}

//------------------------------------- server ---------------------------------
function sendDataToServer() {
    const userInput = document.getElementById('user-input').value; // قراءة النص المدخل
    const responseMessage = document.getElementById('response-message'); // مكان عرض الرد

    // التحقق من أن المستخدم أدخل نصاً
    if (!userInput) {
        responseMessage.textContent = "يرجى إدخال نص أولاً.";
        return;
    }

    // إرسال البيانات إلى الخادم
    fetch('http://127.0.0.1:5000/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: userInput }),
    })
        .then((response) => response.json())
        .then((data) => {
            // عرض الرد في الشريحة
            responseMessage.textContent = data.message;
        })
        .catch((error) => {
            console.error('Error:', error);
            responseMessage.textContent = "حدث خطأ أثناء معالجة الطلب.";
        });
}


//------------------------ INITIALIZATION --------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    // عرض الشريحة الأولى عند تحميل الصفحة
    showSlide(currentSlideIndex);
});
*/

//-------------------------------RAZAN-------------------------------
let currentSlideIndex = 0; // الشريحة الحالية
let audio = null; // الصوت الحالي
let isAudioPlaying = false;
let isMuted = false; // حالة الكتم

const slides = [
    {
        id: "slide1",
        content: `
                <div id="slide1">
                    <img src="/static/x1.png" alt="Presentation Background">
                    <button class="start-button" onclick="navigateForward()">ابدأ</button>
                </div>
            `,
        progress: 1,
        audio: null,
        guidance: null,
    },
    {
        id: "slide2",
        content: `
                <div id="maindesgin">
                    <div class="main-content">
                        <img src="/static/2.png" alt="Main Image">
                    </div>
                    <div class="footer">
                        <button onclick="navigateBackward()">&#8592;</button>
                <button class="slide-play-btn" onclick="toggleAudio(this)">&#10074;&#10074;</button>
                        <button onclick="navigateForward()">&#8594;</button>
                    </div>
                    <div class="gov">
                        <img src="/static/gov.png" alt="GOV.SA Logo">
                    </div>
                </div>
            `,
        progress: 10,
        audio: "s2.mp3",
        guidance: null,
    },
    {
        id: "slide3",
        content: `
                <div id="maindesgin">
                    <div class="main-content">
                        <img src="/static/3.png"  alt="Main Image">
                    </div>
                    <div class="footer">
                        <button onclick="navigateBackward()">&#8592;</button>
                <button class="slide-play-btn" onclick="toggleAudio(this)">&#10074;&#10074;</button>
                        <button onclick="navigateForward()">&#8594;</button>
                    </div>
                    <div class="gov">
                        <img src="/static/gov.png" alt="GOV.SA Logo">
                    </div>
                </div>
            `,
        progress: 20,
        audio: "s3.mp3",
        guidance: null,
    },
    {
        id: "slide4",
        content: `
                <div id="maindesgin">
                    <div class="main-content">
                        <img src="/static/4.png"  alt="Main Image">
                    </div>
                    <div class="footer">
                        <button onclick="navigateBackward()">&#8592;</button>
                <button class="slide-play-btn" onclick="toggleAudio(this)">&#10074;&#10074;</button>
                        <button onclick="navigateForward()">&#8594;</button>
                    </div>
                    <div class="gov">
                        <img src="/static/gov.png"  alt="GOV.SA Logo">
                    </div>
                </div>
            `,
        progress: 30,
        audio: "s4.mp3",
        guidance: null,
    },
    {
        id: "slide5",
        content: `
                <div id="maindesgin">
                    <div class="main-content">
                        <img src="/static/5.png"  alt="Main Image">
                    </div>
                    <div class="slide5">
                        <div class="highlight-box" onclick=""></div>
                        <div class="pointer"></div>
                        </div>
                    <div class="footer">
                        <button onclick="navigateBackward()">&#8592;</button>
                <button class="slide-play-btn" onclick="toggleAudio(this)">&#10074;&#10074;</button>
                        <button onclick="navigateForward()">&#8594;</button>
                    </div>
                    <div class="gov">
                        <img src="/static/gov.png" alt="GOV.SA Logo">
                    </div>
                </div>
            `,
        progress: 45,
        audio: "s5.mp3",
        guidance: " قم بالدخول إلى منصة أبشر، واختر أبشر أفراد",
    },
    {
        id: "slide6",
        content: `
            <div id="maindesgin">
                <div class="main-content">
                    <img src="/static/6.png" alt="Main Image">
                </div>
                <div class="slide6">
                    <video id="video-slide6" width="400" controls style="display: none; position: absolute; top: 36%; left: 50%; transform: translate(-50%, -50%); z-index: 100; background-color: black;">
                        <source src="/static/video.mp4" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                </div>
                <div class="footer">
                    <button onclick="navigateBackward()">&#8592;</button>
                    <button class="slide-play-btn" onclick="toggleAudio(this)">&#10074;&#10074;</button>
                    <button onclick="navigateForward()">&#8594;</button>
                </div>
                <div class="gov">
                    <img src="/static/gov.png" alt="GOV.SA Logo">
                </div>
            </div>
        `,
        progress: 65,
        audio: "s6.mp3",
        guidance: 'سجل دخولك إلى حسابك إذا كنت تحتاج إلى مساعدة...',
    },
    {
        id: "slide7",
        content: `
                <div id="maindesgin">
                    <div class="main-content">
                        <img src="/static/7.png" alt="Main Image">
                    </div>
                    <div class="slide7">
                        <div class="pointer"></div>
                        
                    </div>
                    <div class="footer">
                        <button onclick="navigateBackward()">&#8592;</button>
                <button class="slide-play-btn" onclick="toggleAudio(this)">&#10074;&#10074;</button>
                        <button onclick="navigateForward()">&#8594;</button>
                    </div>
                    <div class="gov">
                        <img src="/static/gov.png" alt="GOV.SA Logo">
                    </div>
                </div>
            `,
        progress: 85,
        audio: "s7.mp3",
        guidance: " ستصلك رسالة نصية على هاتفك تحتوي على رمز التحقق، قم بإدخاله",
    },
    {
        id: "slide8",
        content: `
                <div id="maindesgin">
                    <div class="main-content">
                        <img src="/static/8.png"  alt="Main Image">
                    </div>
                    <div id="slide8">
                        <div class="highlight-box" onclick=""></div>
                        <div class="pointer"></div>
                       
                    </div>
                    <div class="footer">
                        <button onclick="navigateBackward()">&#8592;</button>
                <button class="slide-play-btn" onclick="toggleAudio(this)">&#10074;&#10074;</button>
                        <button onclick="navigateForward()">&#8594;</button>
                    </div>
                    <div class="gov">
                        <img src="/static/gov.png" alt="GOV.SA Logo">
                    </div>
                </div>
            `,
        progress: 100,
        audio: "s8.mp3",
        guidance: "ستظهر لك الصفحة الرئيسية، انقر على قائمة خدماتي",
    },


];

//------------------------ FUNCTIONS ------------------------------------------

function showSlide(index) {
    if (index < 0 || index >= slides.length) return;

    const rectangle = document.getElementById("presentation-rectangle");
    while (rectangle.firstChild) {
        rectangle.removeChild(rectangle.firstChild);
    }
    rectangle.appendChild(document.createRange().createContextualFragment(slides[index].content));

    const progressBar = document.getElementById("custom-progress-bar");
    if (progressBar) {
        progressBar.style.width = `${slides[index].progress}%`;
    }

    resetAudio();

    // إخفاء الفيديو عند تحميل الشريحة
    if (slides[index].id === "slide6") {
        const video = document.getElementById("video-slide6");
        if (video) {
            video.style.display = "none";
            video.pause();
            video.currentTime = 0; // إعادة تعيين وقت الفيديو
        }
    }

    if (slides[index].audio) {
        audio = new Audio(`/static/${slides[index].audio}`);
        audio.play();
        isAudioPlaying = true;

        if (slides[index].id === "slide6") {
            audio.addEventListener("ended", handleAudioEnded);
        }
    } else {
        audio = null;
        isAudioPlaying = false;
    }

    syncPlayPauseIcons();
    currentSlideIndex = index;
}

function handleAudioEnded() {
    console.log("Audio ended. Attempting to play video.");
    const video = document.getElementById("video-slide6");
    if (video) {
        video.style.display = "block";
        video.play().catch((error) => {
            console.error("Error playing video:", error);
        });
    } else {
        console.error("Video element not found in slide6!");
    }
}

function toggleAudio(button) {
    if (audio) {
        if (isAudioPlaying) {
            audio.pause();
            isAudioPlaying = false;
        } else {
            audio.play();
            isAudioPlaying = true;
        }
    } else {
        alert("لا يوجد صوت لتشغيله.");
    }
}

function navigateBackward() {
    if (currentSlideIndex > 0) {
        currentSlideIndex--;
        showSlide(currentSlideIndex);
    }
}

function navigateForward() {
    if (currentSlideIndex < slides.length - 1) {
        currentSlideIndex++;
        showSlide(currentSlideIndex);
    }
}

function resetAudio() {
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
        audio.removeEventListener("ended", handleAudioEnded);
    }
    isAudioPlaying = false;
}

function syncPlayPauseIcons() {
    const barButton = document.querySelector(".custom-nav-btn.play-btn");
    if (barButton) {
        barButton.innerHTML = isAudioPlaying ? "&#10074;&#10074;" : "&#9658;";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    showSlide(currentSlideIndex);
});
