/* =========================================================
   SYMMETRY WEBSITE
   MAIN JAVASCRIPT
========================================================= */


/* =========================================================
   CONFIGURATION
========================================================= */

const CONFIG = {

    /*
     * IMPORTANT:
     *
     * Replace these with your Google Drive FILE IDs.
     *
     * The Drive files must be shared as:
     *
     * "Anyone with the link -> Viewer"
     *
     */


    DRIVE: {

        images: {

            logo:
                "GOOGLE_DRIVE_FILE_ID_LOGO",

            hero:
                "GOOGLE_DRIVE_FILE_ID_HERO",

            speaker1:
                "GOOGLE_DRIVE_FILE_ID_SPEAKER_1",

            speaker2:
                "GOOGLE_DRIVE_FILE_ID_SPEAKER_2",

            gallery1:
                "GOOGLE_DRIVE_FILE_ID_GALLERY_1",

            gallery2:
                "GOOGLE_DRIVE_FILE_ID_GALLERY_2",

            gallery3:
                "GOOGLE_DRIVE_FILE_ID_GALLERY_3",

            gallery4:
                "GOOGLE_DRIVE_FILE_ID_GALLERY_4",

            gallery5:
                "GOOGLE_DRIVE_FILE_ID_GALLERY_5",

            gallery6:
                "GOOGLE_DRIVE_FILE_ID_GALLERY_6",

            gallery7:
                "GOOGLE_DRIVE_FILE_ID_GALLERY_7",

            photoSlide1:
                "GOOGLE_DRIVE_FILE_ID_PHOTO_SLIDE_1",

            photoSlide2:
                "GOOGLE_DRIVE_FILE_ID_PHOTO_SLIDE_2",

            photoSlide3:
                "GOOGLE_DRIVE_FILE_ID_PHOTO_SLIDE_3"

        },


        pdfs: {

            photography:
                "GOOGLE_DRIVE_FILE_ID_PHOTOGRAPHY_PDF",

            quiz:
                "GOOGLE_DRIVE_FILE_ID_QUIZ_PDF",

            creativeWriting:
                "GOOGLE_DRIVE_FILE_ID_CREATIVE_WRITING_PDF",

            paperPresentation:
                "GOOGLE_DRIVE_FILE_ID_PAPER_PRESENTATION_PDF",

            sudoku:
                "GOOGLE_DRIVE_FILE_ID_SUDOKU_PDF",

            memeMaking:
                "GOOGLE_DRIVE_FILE_ID_MEME_MAKING_PDF",

            timetable:
                "GOOGLE_DRIVE_FILE_ID_TIMETABLE_PDF"

        }

    },


    /*
     * Official university/SBI payment portal.
     *
     * Replace this with the real portal URL.
     */

    PAYMENT_PORTAL:
        "YOUR_OFFICIAL_SBI_UNIVERSITY_PAYMENT_URL",


    /*
     * Backend endpoint.
     *
     * This will eventually be your Google Apps Script
     * Web App URL or another backend API.
     */

    API_ENDPOINT:
        "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL",


    /*
     * Event information.
     */

    EVENTS: [

        {
            id: "photography",

            name: "Photography",

            description:
                "Capture mathematical beauty through photography.",

            icon:
                "fa-camera",

            guideline:
                "photography"

        },

        {
            id: "quiz",

            name: "Mathematics Quiz",

            description:
                "Test your mathematical knowledge and problem-solving skills.",

            icon:
                "fa-circle-question",

            guideline:
                "quiz"

        },

        {
            id: "creative-writing",

            name: "Creative Writing",

            description:
                "Explore mathematical ideas through creative writing.",

            icon:
                "fa-pen-fancy",

            guideline:
                "creativeWriting"

        },

        {
            id: "paper-presentation",

            name: "Paper Presentation",

            description:
                "Present mathematical research and ideas.",

            icon:
                "fa-file-powerpoint",

            guideline:
                "paperPresentation"

        },

        {
            id: "sudoku",

            name: "Sudoku",

            description:
                "Challenge your logical thinking with mathematical puzzles.",

            icon:
                "fa-table-cells",

            guideline:
                "sudoku"

        },

        {
            id: "meme-making",

            name: "Meme Making",

            description:
                "Create mathematics-related humour and visual content.",

            icon:
                "fa-face-laugh-squint",

            guideline:
                "memeMaking"

        }

    ],


    /*
     * Speaker information.
     */

    SPEAKERS: [

        {
            name:
                "Prof. Neena Gupta",

            role:
                "Professor, Statistics & Mathematical Unit, Indian Statistical Institute, Kolkata",

            topic:
                "Fermat's Descent Principle",

            image:
                "speaker1"

        },

        {
            name:
                "Prof. Koyel Das",

            role:
                "Professor, Mathematics and Statistics, IISER Kolkata",

            topic:
                "Understanding Cognitive Neuroscience through the Lens of Machine Learning",

            image:
                "speaker2"

        }

    ]

};
/* =========================================================
   SPONSOR SLIDESHOW — ONE AT A TIME
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const sponsors =
        Array.from(
            document.querySelectorAll(".sponsor")
        );

    if (!sponsors.length) return;


    const currentLabel =
        document.getElementById("sponsorCurrent");

    const totalLabel =
        document.getElementById("sponsorTotal");

    if (totalLabel) {

        totalLabel.textContent =
            String(sponsors.length).padStart(2, "0");

    }


    let currentIndex = 0;


    function updateCounter(index) {

        if (!currentLabel) return;

        currentLabel.textContent =
            String(index + 1).padStart(2, "0");

    }


    function showSlide(index) {

        sponsors.forEach(sponsor => {

            sponsor.classList.remove(
                "active",
                "previous"
            );

        });

        if (sponsors[index]) {

            sponsors[index]
                .classList.add("active");

        }

        updateCounter(index);

    }


    /*
       Show the first sponsor immediately.
    */

    showSlide(currentIndex);


    /*
       Advance to the next sponsor every 4 seconds.
    */

    setInterval(() => {

        const oldIndex =
            currentIndex;

        currentIndex =
            (currentIndex + 1) % sponsors.length;


        /*
           Move current sponsor out.
        */

        if (sponsors[oldIndex]) {

            sponsors[oldIndex]
                .classList.remove("active");

            sponsors[oldIndex]
                .classList.add("previous");

        }


        /*
           Bring the next sponsor in.
        */

        if (sponsors[currentIndex]) {

            sponsors[currentIndex]
                .classList.add("active");

        }

        updateCounter(currentIndex);


        /*
           Clean up after animation.
        */

        setTimeout(() => {

            sponsors.forEach(sponsor => {

                sponsor.classList.remove(
                    "previous"
                );

            });

        }, 1000);


    }, 4000);

});

(function () {
    const slides = document.querySelectorAll('.event-photo-slideshow img');
    if (slides.length < 2) return;

    let current = 0;

    setInterval(() => {
        slides[current].classList.remove('is-active');
        current = (current + 1) % slides.length;
        slides[current].classList.add('is-active');
    }, 3500);
})();

/* =========================================================
   GOOGLE DRIVE HELPERS
========================================================= */


/*
 * Google Drive image URL.
 *
 * For a publicly shared Drive file:
 *
 * https://drive.google.com/uc?export=view&id=FILE_ID
 */

function driveImage(fileId) {

    if (!fileId || fileId.startsWith("GOOGLE_")) {
        return "";
    }

    return `https://drive.google.com/uc?export=view&id=${fileId}`;
}


/*
 * Google Drive file viewer.
 *
 * Useful for PDFs.
 */

function driveFile(fileId) {

    if (!fileId || fileId.startsWith("GOOGLE_")) {
        return "#";
    }

    return `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
}


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeImages();

        initializeSpeakers();

        initializeEvents();

        initializeRegistration();

        initializeNavigation();

        initializeFAQ();

        initializeContactForm();

        initializeLightbox();

        initializePayment();

        const currentYearEl =
            document.getElementById("currentYear");

        if (currentYearEl) {

            currentYearEl.textContent =
                new Date().getFullYear();

        }

    }
);


/* =========================================================
   DRIVE IMAGES
========================================================= */

function initializeImages() {

    document
        .querySelectorAll("[data-drive-image]")
        .forEach(image => {

            const key =
                image.dataset.driveImage;

            const fileId =
                CONFIG.DRIVE.images[key];

            const url =
                driveImage(fileId);

            if (url) {
                image.src = url;
            }

        });

}

/* =========================================================
   GEOMETRIC CLOCK & COUNTDOWN
========================================================= */

(function () {

    const geometry = document.querySelector(".geometry");

    if (!geometry) return;


    const dayLayer = geometry.querySelector(".geometry-day");
    const hourLayer = geometry.querySelector(".geometry-hour");
    const minuteLayer = geometry.querySelector(".geometry-minute");
    const secondLayer = geometry.querySelector(".geometry-second");

    // Target elements for the countdown text
    const clockDaySpan = document.querySelector(".geometry-clock-day");
    const clockDividerSpan = document.querySelector(".geometry-clock-divider");
    const clockTimeSpan = document.querySelector(".geometry-clock-time");

    // Set your target date here
    const targetDate = new Date("September 25, 2026 00:00:00").getTime();


    /*
     * -------------------------------------------------------
     * TIME SOURCE
     * -------------------------------------------------------
     */

    const TIME_MODE = "real";

    const MANUAL_TIME = {
        hours: 14,
        minutes: 37,
        seconds: 52
    };


    /* =====================================================
       GET TIME
    ===================================================== */

    function getTime() {

        if (TIME_MODE === "manual") {
            return {
                hours: MANUAL_TIME.hours,
                minutes: MANUAL_TIME.minutes,
                seconds: MANUAL_TIME.seconds,
                milliseconds: 0,
                timestamp: new Date().getTime() // Always use real time for the countdown
            };
        }

        const now = new Date();

        return {
            hours: now.getHours(),
            minutes: now.getMinutes(),
            seconds: now.getSeconds(),
            milliseconds: now.getMilliseconds(),
            timestamp: now.getTime()
        };
    }


    /* =====================================================
       UPDATE GEOMETRY & COUNTDOWN
    ===================================================== */

    function updateClock() {

        const time = getTime();

        const hours = time.hours;
        const minutes = time.minutes;
        const seconds = time.seconds;
        const milliseconds = time.milliseconds;


        /*
         * -------------------------------------------------
         * COUNTDOWN TEXT UPDATE
         * -------------------------------------------------
         */
        
        const distance = targetDate - time.timestamp;

        if (distance > 0) {
            const d = Math.floor(distance / (1000 * 60 * 60 * 24));
            const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((distance % (1000 * 60)) / 1000);

            if (clockTimeSpan) {
                clockTimeSpan.innerHTML = `${d} <span class="time-unit">D</span> ${h} <span class="time-unit">H</span> ${m} <span class="time-unit">M</span> ${s} <span class="time-unit">s</span>`;
            }
        } else {
            if (clockTimeSpan) {
                clockTimeSpan.innerHTML = `0 <span class="time-unit">D</span> 0 <span class="time-unit">H</span> 0 <span class="time-unit">M</span> 0 <span class="time-unit">s</span>`;
            }
        }

        // Hide original day and divider to clean up the layout
        if (clockDaySpan) clockDaySpan.style.display = "none";
        if (clockDividerSpan) clockDividerSpan.style.display = "none";


        /*
         * -------------------------------------------------
         * SECOND
         * -------------------------------------------------
         */

        const secondAngle =
            ((seconds + milliseconds / 1000) / 60) * 360;


        /*
         * -------------------------------------------------
         * MINUTE
         * -------------------------------------------------
         */

        const minuteAngle =
            ((minutes + seconds / 60) / 60) * 360;


        /*
         * -------------------------------------------------
         * HOUR
         * -------------------------------------------------
         */

        const twelveHour =
            hours % 12;

        const hourAngle =
            (
                (twelveHour + minutes / 60 + seconds / 3600)
                / 12
            ) * 360;


        /*
         * -------------------------------------------------
         * DAY
         * -------------------------------------------------
         */

        const dayAngle =
            (
                (hours + minutes / 60 + seconds / 3600)
                / 24
            ) * 360;


        /*
         * -------------------------------------------------
         * APPLY ROTATION
         * -------------------------------------------------
         */

        if (dayLayer) {
            dayLayer.style.transform = `rotate(${dayAngle}deg)`;
        }

        if (hourLayer) {
            hourLayer.style.transform = `rotate(${hourAngle}deg)`;
        }

        if (minuteLayer) {
            minuteLayer.style.transform = `rotate(${minuteAngle}deg)`;
        }

        if (secondLayer) {
            secondLayer.style.transform = `rotate(${secondAngle}deg)`;
        }

        /*
         * Continue synchronizing.
         */
        requestAnimationFrame(updateClock);
    }

    /* =====================================================
       START
    ===================================================== */

    updateClock();

})();


/* =========================================================
   SPEAKERS
========================================================= */

function initializeSpeakers() {

    const container =
        document.getElementById("speakerGrid");

    if (!container) return;

    container.innerHTML =
        CONFIG.SPEAKERS
            .map(speaker => {

                const image =
                    driveImage(
                        CONFIG.DRIVE.images[
                            speaker.image
                        ]
                    );

                return `

                    <article class="speaker-card">

                        <div class="speaker-image">

                            <img
                                src="${image}"
                                alt="${speaker.name}"
                                loading="lazy"
                            >

                        </div>

                        <div class="speaker-content">

                            <h3>
                                ${speaker.name}
                            </h3>

                            <div class="speaker-role">
                                ${speaker.role}
                            </div>

                            <p class="speaker-talk">
                                <strong>
                                    Topic:
                                </strong>
                                ${speaker.topic}
                            </p>

                        </div>

                    </article>

                `;

            })
            .join("");

}


/* =========================================================
   EVENTS
========================================================= */

function initializeEvents() {

    const container =
        document.getElementById("eventGrid");

    if (!container) return;

    container.innerHTML =
        CONFIG.EVENTS
            .map(event => {

                const pdfId =
                    CONFIG.DRIVE.pdfs[
                        event.guideline
                    ];

                const pdfUrl =
                    driveFile(pdfId);

                return `

                    <article class="event-card">

                        <div class="event-icon">

                            <i class="fa-solid ${event.icon}"></i>

                        </div>

                        <h3>
                            ${event.name}
                        </h3>

                        <p>
                            ${event.description}
                        </p>

                        <div class="event-actions">

                            <a
                                href="${pdfUrl}"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <i class="fa-regular fa-file-pdf"></i>
                                Guidelines
                            </a>

                        </div>

                    </article>

                `;

            })
            .join("");

}
// photography slideshow.
// Add the specific folder ID for the photography contest
const API_KEY = 'AIzaSyCbxrgYKEG8IJEhRP_9WO4QwE0vaAJkRM0';
const PHOTO_FOLDER_ID = '1-awTAFwWVFINBHTe2LrdQqgIyogqpTSV'; 

async function initPhotographySlideshow() {
    // Target the specific container using its class
    const photoContainer = document.querySelector('.event-photo-slideshow');
    if (!photoContainer) return;

    try {
        // 1. Fetch files from the new Drive folder
        const apiUrl = `https://www.googleapis.com/drive/v3/files?q='${PHOTO_FOLDER_ID}'+in+parents+and+mimeType+contains+'image/'&fields=files(id,name)&key=${API_KEY}`;
        
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (!data.files || data.files.length === 0) return;

        // 2. Clear out any old HTML and build the new images
        photoContainer.innerHTML = ''; 
        
        data.files.forEach((file, index) => {
            // Using the thumbnail trick for reliable loading (sz=w800 is a good size for this card)
            const imgUrl = `https://drive.google.com/thumbnail?id=${file.id}&sz=w800`;
            
            const img = document.createElement('img');
            img.src = imgUrl;
            img.alt = file.name || `Photography entry ${index + 1}`;
            
            // Add 'is-active' only to the very first image
            if (index === 0) {
                img.className = 'is-active';
            }
            
            photoContainer.appendChild(img);
        });

        // 3. Start the fade/swap loop
        startPhotoLoop(photoContainer);

    } catch (error) {
        console.error('Failed to load photography images:', error);
    }
}

function startPhotoLoop(container) {
    const photos = container.querySelectorAll('img');
    const totalPhotos = photos.length;
    let currentPhotoIndex = 0;

    // If there is only 1 photo, no need to run a slideshow
    if (totalPhotos <= 1) return; 

    // Swap images every 3 seconds
    setInterval(() => {
        // Remove active class from old photo
        photos[currentPhotoIndex].classList.remove('is-active');
        
        // Move to next photo index
        currentPhotoIndex = (currentPhotoIndex + 1) % totalPhotos;
        
        // Add active class to new photo
        photos[currentPhotoIndex].classList.add('is-active');
    }, 3000); 
}

// Ensure this runs when the page loads
document.addEventListener('DOMContentLoaded', initPhotographySlideshow);

// Gallery slideshow using Google Drive API
const FOLDER_ID = '1VXcG-RYyZY1UfyK7hdXwnTCvhm_B2V7c';
const galleryTrack = document.getElementById('galleryTrack');

let currentSlide = 0;
let totalSlides = 0;
let slideInterval;
let slides = []; // Accessible globally so buttons can use them

async function initDriveGallery() {
    // 1. Fetch files from the Drive folder
    const apiUrl = `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents&fields=files(id,name)&key=${API_KEY}`;
    
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (!data.files || data.files.length === 0) {
            console.warn('No images found in the Drive folder.');
            return;
        }

        totalSlides = data.files.length;

        // 2. Clear track and inject new image slides
        galleryTrack.innerHTML = ''; 
        
        data.files.forEach((file, index) => {
            const imgUrl = `https://drive.google.com/thumbnail?id=${file.id}&sz=w1200`;
            const slideDiv = document.createElement('div');
            slideDiv.className = index === 0 ? 'gallery-slide active' : 'gallery-slide';
            // Stack them left-to-right initially
            slideDiv.style.transform = `translateX(${index * 100}%)`; 
            
            const img = document.createElement('img');
            img.src = imgUrl;
            img.alt = file.name || `Gallery Image ${index + 1}`;
            
            slideDiv.appendChild(img);
            galleryTrack.appendChild(slideDiv);
        });

        // Store the slides so our manual buttons can find them
        slides = document.querySelectorAll('.gallery-slide');

        // 3. Initialize controls, counter, and start the automatic loop
        setupControls();
        updateCounter();
        startSlideshow();
        
    } catch (error) {
        console.error('Failed to load images from Google Drive:', error);
    }
}

// --- SLIDER MOVEMENT LOGIC ---

function updateSlidePosition() {
    // Remove active class from all slides
    slides.forEach(s => s.classList.remove('active'));
    
    // Add active class to new slide
    slides[currentSlide].classList.add('active');
    
    // Update transform values for the sliding effect
    slides.forEach((slide, index) => {
        slide.style.transform = `translateX(${100 * (index - currentSlide)}%)`;
    });
    
    updateCounter();
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlidePosition();
    resetAutoPlay(); // Restart timer when clicked manually
}

function prevSlide() {
    currentSlide = currentSlide === 0 ? totalSlides - 1 : currentSlide - 1;
    updateSlidePosition();
    resetAutoPlay(); // Restart timer when clicked manually
}

function updateCounter() {
    const counter = document.querySelector('.gallery-counter');
    if (counter) {
        const currentStr = String(currentSlide + 1).padStart(2, '0');
        const totalStr = String(totalSlides).padStart(2, '0');
        counter.innerText = `${currentStr} / ${totalStr}`;
    }
}

// --- TIMERS & CLICKS ---

function startSlideshow() {
    // Change slide every 3 seconds (3000ms)
    slideInterval = setInterval(nextSlide, 3000); 
}

function resetAutoPlay() {
    clearInterval(slideInterval);
    startSlideshow();
}

function setupControls() {
    const nextBtn = document.getElementById('galleryNext');
    const prevBtn = document.getElementById('galleryPrev');
    
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
}

// Run the initialization when the webpage loads
document.addEventListener('DOMContentLoaded', initDriveGallery);

/* =========================================================
   NAVIGATION
========================================================= */

function initializeNavigation() {

    const navbar =
        document.getElementById("siteHeader");

    const hamburger =
        document.getElementById("navToggle");

    const navMenu =
        document.getElementById("navMenu");

    if (!navbar || !hamburger || !navMenu) return;


    window.addEventListener(
        "scroll",
        () => {

            if (window.scrollY > 20) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }

        }
    );


    function closeMenu() {

        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
        document.body.classList.remove("menu-open");

        hamburger.setAttribute("aria-expanded", "false");

    }

    function toggleMenu() {

        const isOpen =
            navMenu.classList.toggle("active");

        hamburger.classList.toggle("active", isOpen);
        document.body.classList.toggle("menu-open", isOpen);

        hamburger.setAttribute(
            "aria-expanded",
            isOpen ? "true" : "false"
        );

    }

    hamburger.addEventListener(
        "click",
        toggleMenu
    );


    document
        .querySelectorAll(".nav-link")
        .forEach(link => {

            link.addEventListener(
                "click",
                closeMenu
            );

        });

}


/* =========================================================
   FAQ
========================================================= */

function initializeFAQ() {

    document
        .querySelectorAll(".faq-question")
        .forEach(question => {

            question.addEventListener(
                "click",
                () => {

                    const item =
                        question.closest(".faq-item");

                    item.classList.toggle("open");

                }
            );

        });

}


/* =========================================================
   REGISTRATION MODAL
========================================================= */

function initializeRegistration() {

    const modal =
        document.getElementById(
            "registrationModal"
        );

    const closeButton =
        document.getElementById(
            "closeRegistrationModal"
        );

    const overlay =
        document.getElementById(
            "modalOverlay"
        );


    const buttons = [

        document.getElementById(
            "navRegisterButton"
        ),

        document.getElementById(
            "heroRegisterButton"
        ),

        document.getElementById(
            "guidelineRegisterButton"
        ),

        document.getElementById(
            "footerRegisterButton"
        )

    ].filter(Boolean);


    /*
       This page doesn't have a registration modal in the DOM
       (registration lives on register.html instead), so there's
       nothing to wire up. Bail out quietly rather than throwing —
       an uncaught error here would otherwise abort every init
       call still queued after this one.
    */

    if (!modal || !closeButton || !overlay) return;


    buttons
        .forEach(button => {

            button.addEventListener(
                "click",
                openRegistrationModal
            );

        });


    closeButton.addEventListener(
        "click",
        closeRegistrationModal
    );


    overlay.addEventListener(
        "click",
        closeRegistrationModal
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                modal.classList.contains("open")
            ) {

                closeRegistrationModal();

            }

        }
    );


    initializeProgrammeSelection();

    initializeRegistrationForm();

}


function openRegistrationModal() {

    const modal =
        document.getElementById(
            "registrationModal"
        );

    if (!modal) return;

    modal.classList.add("open");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "modal-open"
    );

}


function closeRegistrationModal() {

    const modal =
        document.getElementById(
            "registrationModal"
        );

    if (!modal) return;

    modal.classList.remove("open");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "modal-open"
    );

}


/* =========================================================
   PROGRAMME SELECTION
========================================================= */

function initializeProgrammeSelection() {

    const container =
        document.getElementById(
            "programmeSelection"
        );

    if (!container) return;


    container.innerHTML =
        CONFIG.EVENTS
            .map(event => {

                return `

                    <div class="programme-option">

                        <input
                            type="checkbox"
                            id="programme-${event.id}"
                            name="programmes"
                            value="${event.id}"
                        >

                        <label
                            for="programme-${event.id}"
                        >

                            <strong>
                                ${event.name}
                            </strong>

                            <span>
                                ${event.description}
                            </span>

                        </label>

                    </div>

                `;

            })
            .join("");

}


/* =========================================================
   PAYMENT
========================================================= */

function initializePayment() {

    const paymentButtons = [

        document.getElementById(
            "paymentPortalButton"
        ),

        document.getElementById(
            "modalPaymentLink"
        )

    ];


    paymentButtons
        .filter(Boolean)
        .forEach(button => {

            button.href =
                CONFIG.PAYMENT_PORTAL;

        });

}


/* =========================================================
   REGISTRATION FORM
========================================================= */

function initializeRegistrationForm() {

    const form =
        document.getElementById(
            "registrationForm"
        );

    if (!form) return;


    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            await submitRegistration(form);

        }
    );

}


async function submitRegistration(form) {

    const message =
        document.getElementById(
            "registrationMessage"
        );

    const submitButton =
        document.getElementById(
            "registrationSubmitButton"
        );


    /*
     * Check programme selection.
     */

    const selectedProgrammes =
        Array.from(
            form.querySelectorAll(
                'input[name="programmes"]:checked'
            )
        )
        .map(input => input.value);


    if (selectedProgrammes.length === 0) {

        showMessage(
            message,
            "Please select at least one programme.",
            "error"
        );

        return;

    }


    /*
     * Check receipt.
     */

    const receipt =
        document.getElementById(
            "paymentReceipt"
        ).files[0];


    if (!receipt) {

        showMessage(
            message,
            "Please upload your payment receipt.",
            "error"
        );

        return;

    }


    /*
     * Maximum file size:
     * 10 MB
     */

    if (
        receipt.size >
        10 * 1024 * 1024
    ) {

        showMessage(
            message,
            "The payment receipt must be smaller than 10 MB.",
            "error"
        );

        return;

    }


    /*
     * Allowed file types.
     */

    const allowedTypes = [

        "image/jpeg",
        "image/png",
        "application/pdf"

    ];


    if (
        !allowedTypes.includes(
            receipt.type
        )
    ) {

        showMessage(
            message,
            "Please upload a JPG, PNG or PDF receipt.",
            "error"
        );

        return;

    }


    /*
     * Collect form data.
     */

    const formData =
        new FormData(form);


    const registrationData = {

        action:
            "register",

        name:
            formData.get("name"),

        email:
            formData.get("email"),

        phone:
            formData.get("phone"),

        institution:
            formData.get("institution"),

        studentId:
            formData.get("studentId"),

        programmes:
            selectedProgrammes,

        paymentReference:
            formData.get(
                "paymentReference"
            )

    };


    try {

        submitButton.disabled = true;

        submitButton.classList.add(
            "loading"
        );


        /*
         * Convert receipt to Base64.
         *
         * The backend will decode this and save
         * it into the Google Drive receipt folder.
         */

        const receiptBase64 =
            await fileToBase64(receipt);


        const payload = {

            ...registrationData,

            receipt: {

                name:
                    receipt.name,

                type:
                    receipt.type,

                size:
                    receipt.size,

                data:
                    receiptBase64

            }

        };


        /*
         * Send to backend.
         */

        const response =
            await fetch(
                CONFIG.API_ENDPOINT,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "text/plain;charset=utf-8"
                    },

                    body:
                        JSON.stringify(payload)

                }
            );


        const result =
            await response.json();


        if (!result.success) {

            throw new Error(
                result.message ||
                "Registration failed."
            );

        }


        showMessage(
            message,
            "Registration submitted successfully. Please check your email for confirmation.",
            "success"
        );


        form.reset();


        setTimeout(
            closeRegistrationModal,
            3000
        );


    } catch (error) {

        console.error(
            "Registration error:",
            error
        );


        showMessage(
            message,
            "Unable to submit registration right now. Please try again or contact the organisers.",
            "error"
        );


    } finally {

        submitButton.disabled = false;

        submitButton.classList.remove(
            "loading"
        );

    }

}


/* =========================================================
   FILE -> BASE64
========================================================= */

function fileToBase64(file) {

    return new Promise(
        (resolve, reject) => {

            const reader =
                new FileReader();


            reader.onload =
                () => {

                    /*
                     * Remove:
                     * data:image/png;base64,
                     */

                    const result =
                        reader.result;

                    const base64 =
                        result.split(",")[1];

                    resolve(base64);

                };


            reader.onerror =
                reject;


            reader.readAsDataURL(file);

        }
    );

}


/* =========================================================
   CONTACT FORM
========================================================= */

// 1. Import Firebase Core and Firestore using the same CDN versions as your login page
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// 2. Your Firebase configuration (copied from your login.html)
const firebaseConfig = {
  apiKey: "AIzaSyAiq2xnBHR5oRvRgTxVCuA1J2aJYS7nwrM",
  authDomain: "symmetry-annual-fest.firebaseapp.com",
  projectId: "symmetry-annual-fest",
  storageBucket: "symmetry-annual-fest.firebasestorage.app",
  messagingSenderId: "854008910944",
  appId: "1:854008910944:web:cf20ff04a22831cb6b5f05",
  measurementId: "G-FEDPP8GWRR"
};

// 3. Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "symmetry"); // Using the specific database name from your setup

// 4. Contact Form Logic
function initializeContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        await submitContactQuery(form);
    });
}

async function submitContactQuery(form) {
    const message = document.getElementById("formMessage");
    const button = document.getElementById("querySubmit");
    const formData = new FormData(form);

    const name = formData.get("name");
    const email = formData.get("email");
    const subject = formData.get("subject");
    const userMessage = formData.get("message");

    if (!name || !email || !subject || !userMessage) {
        showMessage(
            message,
            "Please fill in all fields before sending your query.",
            "error"
        );
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        showMessage(
            message,
            "Please enter a valid email address.",
            "error"
        );
        return;
    }
    try {
        button.disabled = true;
        button.innerHTML = "Sending... <span>↗</span>";
        button.classList.add("loading");

        // Construct the document to save in Firestore
        const queryData = {
            name: formData.get("name"),
            email: formData.get("email"),
            subject: formData.get("subject"),
            message: formData.get("message"),
            status: "pending",             
            replyText: "",                 
            timestamp: serverTimestamp()   
        };

        // Push to the 'queries' collection in Firestore
        await addDoc(collection(db, "queries"), queryData);

        showMessage(
            message,
            "Your query has been sent successfully. The Symmetry team will reply to your email.",
            "success"
        );

        form.reset();
        
        const countDisplay = document.getElementById('messageCount');
        if(countDisplay) countDisplay.textContent = '0';

    } catch (error) {
        console.error("Firestore error:", error);
        showMessage(
            message,
            "Unable to send your query right now. Please try again later.",
            "error"
        );
    } finally {
        button.disabled = false;
        button.innerHTML = "Send query <span>↗</span>";
        button.classList.remove("loading");
    }
}


initializeContactForm();


/* =========================================================
   LIGHTBOX
========================================================= */

function initializeLightbox() {

    const lightbox =
        document.getElementById(
            "lightbox"
        );

    const lightboxImage =
        document.getElementById(
            "lightboxImage"
        );

    const closeButton =
        document.getElementById(
            "lightboxClose"
        );

    const galleryGrid =
        document.getElementById(
            "galleryGrid"
        );

    /*
       No gallery/lightbox markup on this page — nothing to
       wire up. Bail out quietly rather than throwing, since
       an uncaught error here would abort every init call
       still queued after this one.
    */

    if (!lightbox || !lightboxImage || !closeButton || !galleryGrid) return;


    galleryGrid
        .addEventListener(
            "click",
            event => {

                const item =
                    event.target.closest(
                        ".gallery-item"
                    );


                if (!item) return;


                const image =
                    item.querySelector("img");


                lightboxImage.src =
                    image.src;

                lightboxImage.alt =
                    image.alt;


                lightbox.classList.add(
                    "open"
                );

            }
        );


    closeButton.addEventListener(
        "click",
        () => {

            lightbox.classList.remove(
                "open"
            );

        }
    );


    lightbox.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                lightbox
            ) {

                lightbox.classList.remove(
                    "open"
                );

            }

        }
    );

}


/* =========================================================
   UI HELPERS
========================================================= */

function showMessage(
    element,
    text,
    type
) {

    if (!element) return;

    element.textContent =
        text;

    element.className =
        `form-message ${type}`;

}


/* =========================================================
   ANALYTICS HOOK
========================================================= */


/*
 * This does NOT need to be active immediately.
 *
 * Once the backend exists, we can enable this to record:
 *
 * - page views
 * - registration modal opens
 * - registration attempts
 * - successful registrations
 * - queries
 * - device/browser information
 *
 * The admin dashboard will read these records.
 */

async function trackEvent(
    eventName,
    metadata = {}
) {

    if (
        !CONFIG.API_ENDPOINT ||
        CONFIG.API_ENDPOINT.startsWith("YOUR_")
    ) {
        return;
    }


    try {

        await fetch(
            CONFIG.API_ENDPOINT,
            {

                method: "POST",

                headers: {
                    "Content-Type":
                        "text/plain;charset=utf-8"
                },

                body:
                    JSON.stringify({

                        action:
                            "analytics",

                        event:
                            eventName,

                        metadata

                    })

            }
        );

    } catch (error) {

        /*
         * Analytics failure should NEVER
         * interfere with the website.
         */

        console.debug(
            "Analytics unavailable."
        );

    }

}
/* =========================================================
   GALLERY CAROUSEL
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const track = document.getElementById("galleryTrack");
    const slides = document.querySelectorAll(".gallery-slide");

    const currentCounter =
        document.getElementById("galleryCurrent");

    const totalCounter =
        document.getElementById("galleryTotal");


    if (!track || !slides.length) return;


    /* =====================================================
       SETTINGS
    ===================================================== */

    let currentIndex = 0;

    const slideDuration = 4500;

    const transitionDuration = 900;


    /* =====================================================
       TOTAL COUNTER
    ===================================================== */

    totalCounter.textContent =
        String(slides.length).padStart(2, "0");


    /* =====================================================
       INITIAL STATE
    ===================================================== */

    slides.forEach((slide, index) => {

        slide.classList.remove("active");

        slide.style.transform =
            `translateX(${(index - currentIndex) * 100}%)`;

    });


    slides[currentIndex].classList.add("active");


    /* =====================================================
       UPDATE COUNTER
    ===================================================== */

    function updateCounter() {

        currentCounter.textContent =
            String(currentIndex + 1).padStart(2, "0");

    }


    /* =====================================================
       MOVE GALLERY
    ===================================================== */

    function moveGallery() {

        currentIndex++;

        /*
           Loop back to the first image
           after the final image.
        */

        if (currentIndex >= slides.length) {
            currentIndex = 0;
        }


        slides.forEach((slide, index) => {

            const position =
                index - currentIndex;

            slide.style.transform =
                `translateX(${position * 100}%)`;

        });


        /*
           Active slide
        */

        slides.forEach(slide => {
            slide.classList.remove("active");
        });

        slides[currentIndex]
            .classList.add("active");


        updateCounter();

    }


    /* =====================================================
       START AUTOMATIC MOTION
    ===================================================== */

    let galleryTimer =
        setInterval(
            moveGallery,
            slideDuration
        );


    /* =====================================================
       PAUSE WHEN HOVERING
    ===================================================== */

    const galleryStage =
        document.querySelector(".gallery-stage");


    if (galleryStage) {

        galleryStage.addEventListener(
            "mouseenter",
            () => {

                clearInterval(galleryTimer);

            }
        );


        galleryStage.addEventListener(
            "mouseleave",
            () => {

                galleryTimer =
                    setInterval(
                        moveGallery,
                        slideDuration
                    );

            }
        );

    }


    /* =====================================================
       INITIAL COUNTER
    ===================================================== */

    updateCounter();

});


/* =========================================================
   HERO GEOMETRY — CLOCK-HAND ROTATION
   The three intersecting lines rotate clockwise at
   the exact speed of a seconds hand, the inner red
   square rotates anticlockwise at the exact speed of
   a minutes hand, and the larger black square rotates
   clockwise at the exact speed of an hours hand.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

    if (reducedMotion) return;


    const lines = [

        {
            el: document.querySelector(".line-1"),
            base: 0
        },

        {
            el: document.querySelector(".line-2"),
            base: 45
        },

        {
            el: document.querySelector(".line-3"),
            base: -45
        }

    ];

    const squareHour =
        document.querySelector(".square-one");

    const squareMinute =
        document.querySelector(".square-two");

    const hasGeometry =
        lines.every(line => line.el) &&
        squareHour &&
        squareMinute;

    if (!hasGeometry) return;


    /*
       Digital readout, sitting quietly beneath the shape.
       Same DOM elements are reused every tick — only their
       text changes, so nothing re-flows or re-renders.
    */

    const clockDay =
        document.querySelector(".geometry-clock-day");

    const clockTime =
        document.querySelector(".geometry-clock-time");

    const dayNames = [
        "Sunday", "Monday", "Tuesday", "Wednesday",
        "Thursday", "Friday", "Saturday"
    ];

    function pad(value) {

        return String(value).padStart(2, "0");

    }

    function updateClock(now) {

        if (!clockDay || !clockTime) return;

        clockDay.textContent =
            dayNames[now.getDay()];

        clockTime.textContent =
            `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

        /*
           A brief opacity dip on the changing digits gives
           the readout the same tick-tock feel as the shape,
           instead of the text flatly swapping in place.
        */

        clockTime.classList.add("is-updating");

        window.setTimeout(() => {

            clockTime.classList.remove("is-updating");

        }, 120);

    }


    /*
       TICK-TOCK MODE
       Instead of interpolating a fresh angle on every
       animation frame (smooth glide), we only recompute
       angles once per whole second, and let a short CSS
       transition give each step its snap. This reproduces
       the classic mechanical tick-tock-tick-tock motion.
    */

    const TICK_TRANSITION =
        "transform 0.12s cubic-bezier(0.34, 1.56, 0.64, 1)";

    lines.forEach(line => {

        line.el.style.transition =
            TICK_TRANSITION;

    });

    squareMinute.style.transition =
        TICK_TRANSITION;

    squareHour.style.transition =
        TICK_TRANSITION;


    let lastSecond =
        null;

    function tick() {

        const now = new Date();

        const wholeSeconds =
            now.getSeconds();


        /*
           Only move the hands when the whole second
           actually changes — this is what produces the
           discrete "tick" instead of a smooth glide.
        */

        if (wholeSeconds !== lastSecond) {

            lastSecond =
                wholeSeconds;

            const minutes =
                now.getMinutes();

            const hours =
                now.getHours() % 12;


            /*
               Seconds hand — steps 6° per second, clockwise.
            */

            const secondsAngle =
                (wholeSeconds / 60) * 360;

            /*
               Minutes hand — steps once per minute,
               applied anticlockwise (negated).
            */

            const minutesAngle =
                -((minutes / 60) * 360);

            /*
               Hours hand — steps gradually across the hour,
               clockwise.
            */

            const hoursAngle =
                ((hours + minutes / 60) / 12) * 360;


            lines.forEach(line => {

                line.el.style.transform =
                    `rotate(${line.base + secondsAngle}deg)`;

            });

            squareMinute.style.transform =
                `rotate(${20 + minutesAngle}deg)`;

            squareHour.style.transform =
                `rotate(${45 + hoursAngle}deg)`;


            updateClock(now);

        }

        requestAnimationFrame(tick);

    }

    requestAnimationFrame(tick);

});
