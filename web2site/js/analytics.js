/* =========================================================
   SYMMETRY '26
   COOKIE CONSENT + FIREBASE ANALYTICS
   Add this file's <script> tag to every page you want
   tracked. Analytics (and the cookies it sets) only loads
   after the visitor accepts the banner.
========================================================= */

const CONSENT_KEY = "symmetry26_cookie_consent"; // "granted" | "denied"
window.symmetryManageCookiePreferences = () => {
    localStorage.removeItem(CONSENT_KEY);
    window.location.reload();
};

const firebaseConfig = {
    apiKey: "AIzaSyAiq2xnBHR5oRvRgTxVCuA1J2aJYS7nwrM",
    authDomain: "symmetry-annual-fest.firebaseapp.com",
    projectId: "symmetry-annual-fest",
    storageBucket: "symmetry-annual-fest.firebasestorage.app",
    messagingSenderId: "854008910944",
    appId: "1:854008910944:web:cf20ff04a22831cb6b5f05",
    measurementId: "G-FEDPP8GWRR"
};

/* =====================================================
   START FIREBASE ANALYTICS
   Dynamically imported — nothing analytics-related is
   even downloaded until consent is granted.
===================================================== */
async function startAnalytics() {

    if (window.__symmetryAnalyticsStarted) return;
    window.__symmetryAnalyticsStarted = true;

    try {
        const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js");
        const { getAnalytics, logEvent } = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js");

        const app = initializeApp(firebaseConfig);
        const analytics = getAnalytics(app);

        // Optional: lets any page log a custom event later,
        // e.g. window.symmetryLogEvent("registration_completed").
        window.symmetryLogEvent = (name, params) => {
            try {
                logEvent(analytics, name, params);
            } catch (err) {
                console.error("Analytics log failed:", err);
            }
        };

    } catch (err) {
        console.error("Failed to start Firebase Analytics:", err);
    }
}

/* =====================================================
   COOKIE CONSENT BANNER
===================================================== */
function showBanner() {
    const banner = document.getElementById("cookieConsent");
    if (banner) banner.classList.add("visible");
}

function hideBanner() {
    const banner = document.getElementById("cookieConsent");
    if (banner) banner.classList.remove("visible");
}

document.addEventListener("DOMContentLoaded", () => {

    const existingConsent = localStorage.getItem(CONSENT_KEY);

    if (existingConsent === "granted") {
        startAnalytics();
        return;
    }

    if (existingConsent === "denied") {
        return; // respect their choice, stay silent
    }

    // No choice recorded yet — ask.
    showBanner();

    const acceptBtn = document.getElementById("cookieAccept");
    const declineBtn = document.getElementById("cookieDecline");

    if (acceptBtn) {
        acceptBtn.addEventListener("click", () => {
            localStorage.setItem(CONSENT_KEY, "granted");
            hideBanner();
            startAnalytics();
        });
    }

    if (declineBtn) {
        declineBtn.addEventListener("click", () => {
            localStorage.setItem(CONSENT_KEY, "denied");
            hideBanner();
        });
    }

});