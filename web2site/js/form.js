// ==========================================
// DEADLINE CONTROLS (KILL SWITCHES)
// ==========================================
const TEMPORARILY_DOWN = true; // NEW SWITCH: Set to true to show 7:30 PM down message
const REGISTRATION_OPEN = true; 
const UPLOADS_OPEN = true;

/* =========================================================
   SYMMETRY 2026
   REGISTRATION FORM
   STRICT VALIDATION + JSON OUTPUT
========================================================= */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, addDoc, doc, updateDoc, runTransaction } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAiq2xnBHR5oRvRgTxVCuA1J2aJYS7nwrM",
  authDomain: "symmetry-annual-fest.firebaseapp.com",
  projectId: "symmetry-annual-fest",
  storageBucket: "symmetry-annual-fest.firebasestorage.app",
  messagingSenderId: "854008910944",
  appId: "1:854008910944:web:cf20ff04a22831cb6b5f05",
  measurementId: "G-FEDPP8GWRR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "symmetry");

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       SPLIT-PHASE LOGIC (ON PAGE LOAD)
    ===================================================== */
    const isReturningUser = localStorage.getItem("symmetry2026_registered") === "true";
    const pendingUploads = JSON.parse(localStorage.getItem("symmetry2026_pending") || "[]");
    
    const tempDownMessage = document.getElementById("tempDownMessage");
    const closedMessage = document.getElementById("closedMessage");
    const allSetMessage = document.getElementById("allSetMessage");
    const registrationForm = document.getElementById("registrationForm");
    
    const participantSection = document.getElementById("participantSection"); 
    const eventSection = document.getElementById("eventSection");       
    const paymentSection = document.getElementById("paymentSection");
    const submitSection = document.querySelector(".submit-section");

    // ==========================================
    // 0. TEMPORARY DOWNTIME OVERRIDE
    // ==========================================
    if (TEMPORARILY_DOWN) {
        if (registrationForm) registrationForm.style.display = "none";
        if (tempDownMessage) tempDownMessage.style.display = "block";
        
        // Hide standard form elements just to be safe
        if (participantSection) participantSection.style.display = "none";
        if (eventSection) eventSection.style.display = "none";
        if (paymentSection) paymentSection.style.display = "none";
    }
    // Returning User Flow
    else if (isReturningUser) {
        // Hide standard registration stuff
        if (participantSection) participantSection.style.display = "none";
        if (eventSection) eventSection.style.display = "none";
        if (paymentSection) paymentSection.style.display = "none";

        if (pendingUploads.length === 0) {
            // SCENARIO 1: They uploaded everything during registration
            allSetMessage.style.display = "block";
            submitSection.style.display = "none"; 
            
            // Forcefully hide all upload wrappers just in case
            if (document.getElementById("entropySubmission")) document.getElementById("entropySubmission").style.display = "none";
            if (document.getElementById("recursionSubmission")) document.getElementById("recursionSubmission").style.display = "none";
            if (document.getElementById("representationSubmission")) document.getElementById("representationSubmission").style.display = "none";
            if (document.getElementById("inquisitionSubmission")) document.getElementById("inquisitionSubmission").style.display = "none";
            
        } else {
            // SCENARIO 2: They have pending uploads
            if (pendingUploads.includes("Entropy")) document.getElementById("entropySubmission").classList.add("visible");
            if (pendingUploads.includes("Recursion")) document.getElementById("recursionSubmission").classList.add("visible");
            if (pendingUploads.includes("Re-Presentation")) document.getElementById("representationSubmission").classList.add("visible");
            
            submitSection.querySelector(".submit-info p").innerText = "Submit your pending event files.";
        }
    } 
    // Buffer Period Flow (For New Users trying to register late)
    else if (!REGISTRATION_OPEN && UPLOADS_OPEN) {
        registrationForm.style.display = "none";
        closedMessage.style.display = "block";
    }
    // Fully Closed Flow
    else if (!REGISTRATION_OPEN && !UPLOADS_OPEN) {
        registrationForm.style.display = "none";
        closedMessage.style.display = "block";
        closedMessage.querySelector("h2").innerText = "Form Closed";
        closedMessage.querySelector("p").innerText = "All registrations and file uploads for Symmetry 2026 have concluded.";
    }

    // The rest of your script logic goes here unaltered...
    // (You can safely paste the remaining 950+ lines of your JS file directly below this point.)
