const API_KEY = 'AIzaSyCbxrgYKEG8IJEhRP_9WO4QwE0vaAJkRM0';
const PHOTO_FOLDER_ID = '1-awTAFwWVFINBHTe2LrdQqgIyogqpTSV'; 

const slideshow = document.querySelector('.slideshow');
let currentSlide = 0;
let slides = [];
let autoPlayInterval;

async function initEventsGallery() {
    if (!slideshow) return;

    try {
        const apiUrl = `https://www.googleapis.com/drive/v3/files?q='${PHOTO_FOLDER_ID}'+in+parents+and+mimeType+contains+'image/'&fields=files(id,name)&key=${API_KEY}`;
        
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (!data.files || data.files.length === 0) return;

        // 1. Build the HTML string for all slides using the thumbnail trick
        const slidesHtml = data.files.map((file, index) => {
            const imgUrl = `https://drive.google.com/thumbnail?id=${file.id}&sz=w1200`;
            const activeClass = index === 0 ? 'active' : '';
            
            return `
                <div class="slide ${activeClass}">
                    <img src="${imgUrl}" alt="${file.name}" loading="lazy">
                </div>
            `;
        }).join("");

        // 2. Insert the slides at the beginning of the container (safeguarding the buttons)
        slideshow.insertAdjacentHTML('afterbegin', slidesHtml);

        // 3. Grab the newly created slides and initialize controls
        slides = slideshow.querySelectorAll('.slide');
        
        setupControls();
        startAutoPlay();

    } catch (error) {
        console.error('Failed to load events gallery:', error);
    }
}

// --- SLIDER LOGIC ---

function updateSlidePosition() {
    // Remove active class from all slides, add to the current one
    slides.forEach(slide => slide.classList.remove('active'));
    slides[currentSlide].classList.add('active');
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlidePosition();
    resetAutoPlay();
}

function prevSlide() {
    currentSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
    updateSlidePosition();
    resetAutoPlay();
}

// --- TIMERS & CONTROLS ---

function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, 3000); // 3 seconds
}

function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
}

function setupControls() {
    const nextBtn = slideshow.querySelector('.next');
    const prevBtn = slideshow.querySelector('.prev');
    
    // Mouse Clicks
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    // Keyboard Arrow Keys
    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight') {
            nextSlide();
        } else if (event.key === 'ArrowLeft') {
            prevSlide();
        }
    });
}

// Run initialization when page loads
document.addEventListener('DOMContentLoaded', initEventsGallery);

// --- MOBILE NAVIGATION TOGGLE ---
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        // Toggles the 'open' class on the menu to show/hide it
        navMenu.classList.toggle('open');
        
        // Updates the accessibility attribute for screen readers
        const isExpanded = navMenu.classList.contains('open');
        navToggle.setAttribute('aria-expanded', isExpanded);
    });
}