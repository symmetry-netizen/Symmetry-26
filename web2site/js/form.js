// ==========================================
// DEADLINE CONTROLS (KILL SWITCHES)
// ==========================================
const REGISTRATION_OPEN = true; 
const UPLOADS_OPEN = true;
/* =========================================================
   SYMMETRY 2026
   REGISTRATION FORM
   STRICT VALIDATION + JSON OUTPUT
========================================================= */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, addDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

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
    
    const closedMessage = document.getElementById("closedMessage");
    const allSetMessage = document.getElementById("allSetMessage");
    const registrationForm = document.getElementById("registrationForm");
    
    // Updated these two lines to use IDs!
    const participantSection = document.getElementById("participantSection"); 
    const eventSection = document.getElementById("eventSection");       
    
    const paymentSection = document.getElementById("paymentSection");
    const submitSection = document.querySelector(".submit-section");

    // Returning User Flow
    if (isReturningUser) {
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

    /* =====================================================
       FORM ELEMENTS
    ===================================================== */

    const form = document.getElementById("registrationForm");

    const eventCheckboxes =
        document.querySelectorAll('input[name="events"]');

    const eventError =
        document.getElementById("eventError");

    const submissionsSection =
        document.getElementById("submissionsSection");


    /* =====================================================
       SUBMISSION CARDS
    ===================================================== */

    const entropySubmission =
        document.getElementById("entropySubmission");

    const recursionSubmission =
        document.getElementById("recursionSubmission");

    const representationSubmission =
        document.getElementById("representationSubmission");


    /* =====================================================
       FILE INPUTS
    ===================================================== */

    const entropyFile =
        document.getElementById("entropyFile");

    const recursionFile =
        document.getElementById("recursionFile");

    const representationFile =
        document.getElementById("representationFile");

    const paymentFile = document.getElementById("paymentFile");
    /* =====================================================
       FILE NAME DISPLAY
    ===================================================== */

    const entropyFileName =
        document.getElementById("entropyFileName");

    const recursionFileName =
        document.getElementById("recursionFileName");

    const representationFileName =
        document.getElementById("representationFileName");

    const paymentFileName = document.getElementById("paymentFileName");
    /* =====================================================
       MODAL
    ===================================================== */

    const modal =
        document.getElementById("successModal");

    const closeModal =
        document.getElementById("closeModal");

    const modalOkay =
        document.getElementById("modalOkay");


    /* =====================================================
       EMAIL
       
       IMPORTANT:
       Add this field to your HTML if it does not already exist.

       Example:

       <input
           type="email"
           id="email"
           name="email"
           required
       >
    ===================================================== */

    const emailInput =
        document.getElementById("email");

    /* =====================================================
       SHOW / HIDE SUBMISSIONS & CHECK CONFLICTS
    ===================================================== */

    function updateSubmissionCards(event) {
        
        // If an event was passed, grab the specific checkbox that triggered it
        const clickedBox = event ? event.target : null;

        let selectedEvents = Array.from(eventCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        // CONFLICT CHECK: Inquisition vs Sudoku
        if (selectedEvents.includes("Inquisition") && selectedEvents.includes("Sudoku")) {
            
            alert("⚠️ You cannot participate in both Inquisition and Crack the Grid (Sudoku) at the same time. Please choose only one.");
            
            // Force the box they just clicked to uncheck
            if (clickedBox) {
                clickedBox.checked = false;
            } else {
                // Failsafe: if we don't know which one was clicked last, uncheck Sudoku
                document.querySelector('input[value="Sudoku"]').checked = false;
            }
            
            // Recalculate the selected events after forcing the uncheck
            selectedEvents = Array.from(eventCheckboxes)
                .filter(checkbox => checkbox.checked)
                .map(checkbox => checkbox.value);
        }

        // Hide all sections first
        entropySubmission.classList.remove("visible");
        recursionSubmission.classList.remove("visible");
        representationSubmission.classList.remove("visible");

        let requiresSubmission = false;

        // Reveal selected sections
        if (selectedEvents.includes("Entropy")) {
            entropySubmission.classList.add("visible");
            requiresSubmission = true;
        }
        if (selectedEvents.includes("Recursion")) {
            recursionSubmission.classList.add("visible");
            requiresSubmission = true;
        }
        if (selectedEvents.includes("Re-Presentation")) {
            representationSubmission.classList.add("visible");
            requiresSubmission = true;
        }

        // Hide event error if an event is selected
        if (selectedEvents.length > 0) {
            eventError.classList.remove("show");
        }
    }

    // Attach listener to checkboxes, passing the entire event object
    eventCheckboxes.forEach(checkbox => {
        checkbox.addEventListener("change", updateSubmissionCards);
    });


    /* =====================================================
       FILE NAME DISPLAY
    ===================================================== */

    function displayFileName(
        input,
        displayElement
    ) {

        input.addEventListener("change", () => {

            if (
                input.files &&
                input.files.length > 0
            ) {

                displayElement.textContent =
                    input.files[0].name;

            } else {

                displayElement.textContent =
                    "No file selected";

            }

        });

    }


    displayFileName(
        entropyFile,
        entropyFileName
    );

    displayFileName(
        recursionFile,
        recursionFileName
    );

    displayFileName(
        representationFile,
        representationFileName
    );

    displayFileName(
        paymentFile,
        paymentFileName
    );

    /* =====================================================
       FILE EXTENSION VALIDATION
    ===================================================== */

    function validateExtension(
        file,
        allowedExtensions
    ) {

        if (!file) {

            return false;

        }


        const filename =
            file.name.toLowerCase();


        const extension =
            filename.split(".").pop();


        return allowedExtensions.includes(
            extension
        );

    }


    /* =====================================================
       FILE SIZE VALIDATION
       
       Maximum file size:
       10 MB
    ===================================================== */

    const MAX_FILE_SIZE =
        10 * 1024 * 1024;


    function validateFileSize(file) {

        if (!file) {

            return false;

        }

        return file.size <= MAX_FILE_SIZE;

    }


    /* =====================================================
       EMAIL VALIDATION
    ===================================================== */

    function validateEmail(email) {

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return emailRegex.test(email);

    }


    /* =====================================================
       DUPLICATE EMAIL CHECK
       
       FRONTEND SAFEGUARD ONLY
       
       This prevents repeated registration from the
       same browser.

       It does NOT prevent the same email from another
       browser/device.

       A backend check is required for real enforcement.
    ===================================================== */
    /* =====================================================
        FIRESTORE DUPLICATE EMAIL CHECK
    ===================================================== */
    async function checkDuplicateEmailFirestore(email) {
        try {
            const participantsRef = collection(db, "participant_list");
            // Query the database for an exact email match
            const q = query(participantsRef, where("email", "==", email));
            const querySnapshot = await getDocs(q);
            
            return !querySnapshot.empty; // Returns true if a document already exists
        } catch (error) {
            console.error("Error querying Firestore:", error);
            return false; 
        }
    }

    /* =====================================================
       SAVE EMAIL LOCALLY
    ===================================================== */

    function saveRegistrationLocally(
        registration
    ) {

        const registrations =
            JSON.parse(
                localStorage.getItem(
                    "symmetry2026Registrations"
                ) || "[]"
            );


        registrations.push(registration);


        localStorage.setItem(
            "symmetry2026Registrations",
            JSON.stringify(
                registrations
            )
        );

    }


    /* =====================================================
       CONVERT FILE TO BASE64
       
       This allows the uploaded work to be represented
       inside the JSON object.

       IMPORTANT:
       Base64 increases file size significantly.

       For the production version, it is better to upload
       the file to Google Drive / cloud storage and put
       only its URL inside the JSON.
    ===================================================== */

    function fileToBase64(file) {

        return new Promise(
            (resolve, reject) => {

                const reader =
                    new FileReader();


                reader.onload = () => {

                    resolve(
                        reader.result
                    );

                };


                reader.onerror = () => {

                    reject(
                        new Error(
                            "Unable to read file."
                        )
                    );

                };


                reader.readAsDataURL(file);

            }
        );

    }

    /* =====================================================
    TIMEOUT WRAPPER
    ===================================================== */

    function withTimeout(promise, ms, timeoutMessage = "Request timed out.") {
        let timeoutId;
        const timeout = new Promise((_, reject) => {
            timeoutId = setTimeout(() => reject(new Error(timeoutMessage)), ms);
        });
        return Promise.race([promise, timeout]).finally(() => clearTimeout(timeoutId));
    }
    /* =====================================================
       FORM SUBMISSION
    ===================================================== */

    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            /* =============================================
            0. IMMEDIATE VISUAL FEEDBACK
            ============================================= */

            const submitBtn = document.querySelector(".submit-button");
            const originalBtnText = submitBtn.innerHTML;

            function setSubmitLoading(isLoading, text = "Processing... Please wait") {
                if (isLoading) {
                    submitBtn.innerHTML = `<span>${text}</span>`;
                    submitBtn.style.pointerEvents = "none";
                    submitBtn.style.opacity = "0.7";
                } else {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.style.pointerEvents = "auto";
                    submitBtn.style.opacity = "1";
                }
            }

            setSubmitLoading(true);

            try {
            

            /* =============================================
               PENDING-UPLOAD FLOW (returning user)
            ============================================= */
            if (isReturningUser) {

                const filesToUpload = {};
                if (pendingUploads.includes("Entropy") && entropyFile.files.length > 0) {
                    filesToUpload.Entropy = entropyFile.files[0];
                }
                if (pendingUploads.includes("Recursion") && recursionFile.files.length > 0) {
                    filesToUpload.Recursion = recursionFile.files[0];
                }
                if (pendingUploads.includes("Re-Presentation") && representationFile.files.length > 0) {
                    filesToUpload["Re-Presentation"] = representationFile.files[0];
                }

                if (Object.keys(filesToUpload).length === 0) {
                    alert("Please choose at least one pending file to upload.");
                    return;
                }

                const extensionRules = {
                    Entropy: ["jpg", "jpeg", "png", "svg"],
                    Recursion: ["pdf"],
                    "Re-Presentation": ["pdf"]
                };
                const MAX_SIZE_PENDING = 10 * 1024 * 1024;

                for (const [eventName, file] of Object.entries(filesToUpload)) {
                    if (!validateExtension(file, extensionRules[eventName])) {
                        alert(`${eventName} file must be a valid format (${extensionRules[eventName].join(", ").toUpperCase()}).`);
                        return;
                    }
                    if (file.size > MAX_SIZE_PENDING) {
                        alert(`${eventName} file must be under 10MB.`);
                        return;
                    }
                }

                const buildFileData = async (file) => file
                    ? { fileName: file.name, fileType: file.type, fileSize: file.size, data: await fileToBase64(file) }
                    : null;

                const pendingEntropyData = await buildFileData(filesToUpload.Entropy);
                const pendingRecursionData = await buildFileData(filesToUpload.Recursion);
                const pendingRepresentationData = await buildFileData(filesToUpload["Re-Presentation"]);

                setSubmitLoading(true, "Uploading... Please wait");

                const activeEmail = localStorage.getItem("symmetry2026_email");
                const activeName = localStorage.getItem("symmetry2026_name");
                const docId = localStorage.getItem("symmetry2026_docId");
                const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzVjnGrjKdq2vKdiqnjYR1byO5n38v4h3RCL8_wGBYZsEjituQZZO7JiDDzGA5fz4S9/exec";

                try {
                    const response = await fetch(GOOGLE_SCRIPT_URL, {
                        method: "POST",
                        body: JSON.stringify({
                            participant: { name: activeName, email: activeEmail },
                            isReturningUser: true,
                            submissions: {
                                entropy: pendingEntropyData,
                                recursion: pendingRecursionData,
                                re_presentation: pendingRepresentationData,
                                payment: null
                            }
                        }),
                    });

                    const result = await response.json();

                    if (result.status === "success") {
                        const updatePayload = {};
                        if (result.fileUrls.entropy) updatePayload.file_entropy = result.fileUrls.entropy;
                        if (result.fileUrls.recursion) updatePayload.file_recursion = result.fileUrls.recursion;
                        if (result.fileUrls.re_presentation) updatePayload.file_representation = result.fileUrls.re_presentation;

                        await updateDoc(doc(db, "participant_list", docId), updatePayload);

                        let currentPending = JSON.parse(localStorage.getItem("symmetry2026_pending") || "[]");
                        Object.keys(filesToUpload).forEach(eventName => {
                            currentPending = currentPending.filter(e => e !== eventName);
                        });
                        localStorage.setItem("symmetry2026_pending", JSON.stringify(currentPending));

                        modal.classList.add("active");
                        document.body.style.overflow = "hidden";

                        setTimeout(() => {
                            window.location.reload();
                        }, 2000);

                    } else {
                        alert("Upload Error: " + result.message);
                    }
                } catch (error) {
                    console.error("Submission Error:", error);
                    alert("Failed to complete submission. Please check your connection.");
                }

                return;
            }

            /* =============================================
            1. CHECK HTML REQUIRED FIELDS
            ============================================= */

            if (!form.checkValidity()) {

                form.reportValidity();

                return;

            }


            /* =============================================
               2. PARTICIPANT DETAILS
            ============================================= */

            const name =
                document
                    .getElementById("name")
                    .value
                    .trim();


            const year =
                document
                    .getElementById("year")
                    .value;


            const department =
                document
                    .getElementById("department")
                    .value
                    .trim();


            const institute =
                document
                    .getElementById("institute")
                    .value
                    .trim();


            const food =
                document.querySelector(
                    'input[name="food"]:checked'
                )?.value;


            /* =============================================
               3. EMAIL
            ============================================= */

            if (!emailInput) {

                alert(
                    "Email field is missing from the form."
                );

                return;

            }


            const email =
                emailInput.value
                    .trim()
                    .toLowerCase();


            if (!validateEmail(email)) {

                alert(
                    "Please enter a valid email address."
                );

                emailInput.focus();

                return;

            }


            /* =============================================
               4. EVENT SELECTION
            ============================================= */

            const selectedEvents =
                Array.from(eventCheckboxes)
                    .filter(
                        checkbox =>
                            checkbox.checked
                    )
                    .map(
                        checkbox =>
                            checkbox.value
                    );


            if (
                selectedEvents.length === 0
            ) {

                eventError.classList.add("show");


                document
                    .querySelector(".events-grid")
                    .scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });


                return;

            }


            /* =============================================
               5. DUPLICATE EMAIL CHECK (FIRESTORE)
            ============================================= */
            let isDuplicate;
            try {
                isDuplicate = await withTimeout(
                    checkDuplicateEmailFirestore(email),
                    8000,
                    "Duplicate check timed out."
                );
            } catch (err) {
                console.error("Duplicate check failed or timed out:", err);
                alert("We couldn't verify your registration right now. Please check your connection and try again.");
                return;
            }

            if (isDuplicate) {
                alert("A registration already exists in our database for this email address.");
                return;
            }


           /* =============================================
               6. CHECK PAYMENT SUBMISSION (MANDATORY)
            ============================================= */
            if (!paymentFile.files || paymentFile.files.length === 0) {
                alert("Please upload your proof of payment to complete registration.");
                document.getElementById("paymentSection").scrollIntoView({ behavior: "smooth", block: "center" });
                return;
            }


            /* =============================================
               9. CREATE UNIQUE REGISTRATION ID
            ============================================= */

            const registrationID =
                "SYM26-" +
                Date.now().toString(36).toUpperCase();

            /* =============================================
               VALIDATE FILE EXTENSIONS AND SIZE (SAFE)
            ============================================= */
            const MAX_SIZE = 10 * 1024 * 1024; // 10 MB limit

            // Entropy Validation
            if (entropyFile.files && entropyFile.files.length > 0) {
                const file = entropyFile.files[0];
                if (!validateExtension(file, ["jpg", "jpeg", "png", "svg"])) {
                    alert("Entropy file must be an image (JPG, JPEG, PNG, SVG).");
                    return;
                }
                if (file.size > MAX_SIZE) { 
                    alert("Entropy file must be under 10MB."); 
                    return; 
                }
            }

            // Recursion Validation
            if (recursionFile.files && recursionFile.files.length > 0) {
                const file = recursionFile.files[0];
                if (!validateExtension(file, ["pdf"])) {
                    alert("Recursion file must be a PDF.");
                    return;
                }
                if (file.size > MAX_SIZE) { 
                    alert("Recursion file must be under 10MB."); 
                    return; 
                }
            }

            // Re-Presentation Validation
            if (representationFile.files && representationFile.files.length > 0) {
                const file = representationFile.files[0];
                if (!validateExtension(file, ["pdf"])) {
                    alert("Re-Presentation file must be a PDF.");
                    return;
                }
                if (file.size > MAX_SIZE) { 
                    alert("Re-Presentation file must be under 10MB."); 
                    return; 
                }
            }

            // Payment Validation (We know this one exists because of our earlier mandatory check)
            if (paymentFile.files && paymentFile.files.length > 0) {
                const file = paymentFile.files[0];
                if (!validateExtension(file, ["jpg", "jpeg", "png", "pdf"])) {
                    alert("Payment file must be an image (JPG, JPEG, PNG) or a PDF.");
                    return;
                }
                if (file.size > MAX_SIZE) { 
                    alert("Payment file must be under 10MB."); 
                    return; 
                }
            }
            /* =============================================
               10. PREPARE FILE DATA (SAFE CHECK)
            ============================================= */
            let entropyData = null, recursionData = null, representationData = null, paymentData = null;

            if (entropyFile.files && entropyFile.files.length > 0) {
                const file = entropyFile.files[0];
                entropyData = { fileName: file.name, fileType: file.type, fileSize: file.size, data: await fileToBase64(file) };
            }
            if (recursionFile.files && recursionFile.files.length > 0) {
                const file = recursionFile.files[0];
                recursionData = { fileName: file.name, fileType: file.type, fileSize: file.size, data: await fileToBase64(file) };
            }
            if (representationFile.files && representationFile.files.length > 0) {
                const file = representationFile.files[0];
                representationData = { fileName: file.name, fileType: file.type, fileSize: file.size, data: await fileToBase64(file) };
            }
            if (paymentFile.files && paymentFile.files.length > 0) {
                const file = paymentFile.files[0];
                paymentData = { fileName: file.name, fileType: file.type, fileSize: file.size, data: await fileToBase64(file) };
            }

            /* =============================================
               11. CREATE FIRESTORE PAYLOAD
            ============================================= */
            const registrationData = {
                registration_id: registrationID,
                timestamp: new Date().toISOString(),
                
                // Participant Details
                name: name,
                email: email,
                year: year,
                department: department,
                institute: institute,
                food_preference: food,

                // Event Booleans (True/False)
                event_entropy: selectedEvents.includes("Entropy"),
                event_recursion: selectedEvents.includes("Recursion"),
                event_overflow: selectedEvents.includes("Overflow"),
                event_predicta: selectedEvents.includes("Predicta"),
                event_inquisition: selectedEvents.includes("Inquisition"),
                event_representation: selectedEvents.includes("Re-Presentation"),
                event_sudoku: selectedEvents.includes("Sudoku"),

                // File Drive URLs (will be populated after Apps Script upload)
                file_entropy: null,
                file_recursion: null,
                file_representation: null,
                file_payment: null,

                status: "registered"
            };

            /* =============================================
               12. SAVE LOCALLY
            ============================================= */

            saveRegistrationLocally(
                registrationData
            );


            /* =============================================
               13. SEND DATA TO APPS SCRIPT BACKEND
            ============================================= */
            
            const submitBtn = document.querySelector(".submit-button");
            const originalBtnText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = "<span>Uploading... Please wait</span>";
            submitBtn.style.pointerEvents = "none";
            submitBtn.style.opacity = "0.7";

            // Replace with your actual deployed Web App URL
            const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzVjnGrjKdq2vKdiqnjYR1byO5n38v4h3RCL8_wGBYZsEjituQZZO7JiDDzGA5fz4S9/exec"; 

            try {
                // 1. Identify User State
                const isReturningUser = localStorage.getItem("symmetry2026_registered") === "true";
                const activeEmail = isReturningUser ? localStorage.getItem("symmetry2026_email") : email;
                const activeName = isReturningUser ? localStorage.getItem("symmetry2026_name") : name;

                // 2. Upload files to Drive via Apps Script
                const participantPayload = { name: activeName, email: activeEmail };

                // Only include these on a brand-new registration — a returning
                // user's form fields are hidden/empty, so there's nothing to send.
                if (!isReturningUser) {
                    participantPayload.year = year;
                    participantPayload.department = department;
                    participantPayload.institute = institute;
                    participantPayload.food_preference = food;
                }

                const response = await fetch(GOOGLE_SCRIPT_URL, {
                    method: "POST",
                    body: JSON.stringify({
                        participant: participantPayload,
                        isReturningUser: isReturningUser,
                        registration_id: !isReturningUser ? registrationID : undefined,
                        events: !isReturningUser ? selectedEvents : undefined,
                        submissions: {
                            entropy: entropyData,
                            recursion: recursionData,
                            re_presentation: representationData,
                            payment: paymentData
                        }
                    }),
                });

                const result = await response.json();

                if (result.status === "success") {
                    
                    if (isReturningUser) {
                        /* =====================================
                           SCENARIO A: RETURNING USER (UPDATE)
                        ===================================== */
                        const docId = localStorage.getItem("symmetry2026_docId");
                        const updatePayload = {};
                        
                        if (result.fileUrls.entropy) updatePayload.file_entropy = result.fileUrls.entropy;
                        if (result.fileUrls.recursion) updatePayload.file_recursion = result.fileUrls.recursion;
                        if (result.fileUrls.re_presentation) updatePayload.file_representation = result.fileUrls.re_presentation;
                        
                        // Update the existing row in Firestore
                        await updateDoc(doc(db, "participant_list", docId), updatePayload);
                        
                        // Remove uploaded items from the pending list
                        let currentPending = JSON.parse(localStorage.getItem("symmetry2026_pending") || "[]");
                        if (entropyData) currentPending = currentPending.filter(e => e !== "Entropy");
                        if (recursionData) currentPending = currentPending.filter(e => e !== "Recursion");
                        if (representationData) currentPending = currentPending.filter(e => e !== "Re-Presentation");
                        
                        localStorage.setItem("symmetry2026_pending", JSON.stringify(currentPending));

                    } else {
                        /* =====================================
                           SCENARIO B: NEW USER (CREATE)
                        ===================================== */
                        if (result.fileUrls.entropy) registrationData.file_entropy = result.fileUrls.entropy;
                        if (result.fileUrls.recursion) registrationData.file_recursion = result.fileUrls.recursion;
                        if (result.fileUrls.re_presentation) registrationData.file_representation = result.fileUrls.re_presentation;
                        if (result.fileUrls.payment) registrationData.file_payment = result.fileUrls.payment;

                        // Create new row in Firestore
                        const docRef = await addDoc(collection(db, "participant_list"), registrationData);

                        // Save identity & doc ID to memory so they can update later
                        localStorage.setItem("symmetry2026_docId", docRef.id);
                        localStorage.setItem("symmetry2026_email", email);
                        localStorage.setItem("symmetry2026_name", name);
                        
                        // Determine skipped uploads
                        const pendingUploads = [];
                        if (selectedEvents.includes("Entropy") && !entropyData) pendingUploads.push("Entropy");
                        if (selectedEvents.includes("Recursion") && !recursionData) pendingUploads.push("Recursion");
                        if (selectedEvents.includes("Re-Presentation") && !representationData) pendingUploads.push("Re-Presentation");
                        
                        localStorage.setItem("symmetry2026_registered", "true");
                        localStorage.setItem("symmetry2026_pending", JSON.stringify(pendingUploads));
                    }

                    // 4. SHOW SUCCESS MODAL
                    modal.classList.add("active");
                    document.body.style.overflow = "hidden";
                    
                    // Reload the page after 2 seconds to trigger the split-phase view
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);

                } else {
                    alert("Upload Error: " + result.message);
                }
            } catch (error) {
                console.error("Submission Error:", error);
                alert("Failed to complete submission. Please check your connection.");
            }
            }
            finally {
                setSubmitLoading(false);
            }
        }
    );


    /* =====================================================
       MODAL
    ===================================================== */

    function closeSuccessModal() {

        modal.classList.remove(
            "active"
        );

        document.body.style.overflow =
            "";

    }


    closeModal.addEventListener(
        "click",
        closeSuccessModal
    );


    modalOkay.addEventListener(
        "click",
        closeSuccessModal
    );


    modal.addEventListener(
        "click",
        event => {

            if (
                event.target === modal
            ) {

                closeSuccessModal();

            }

        }
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                modal.classList.contains("active")
            ) {

                closeSuccessModal();

            }

        }
    );

});
