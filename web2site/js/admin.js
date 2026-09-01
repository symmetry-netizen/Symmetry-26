import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
    getFirestore, collection, onSnapshot, getDocs, doc, updateDoc,
    serverTimestamp, query, orderBy
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAiq2xnBHR5oRvRgTxVCuA1J2aJYS7nwrM",
  authDomain: "symmetry-annual-fest.firebaseapp.com",
  projectId: "symmetry-annual-fest",
  storageBucket: "symmetry-annual-fest.firebasestorage.app",
  messagingSenderId: "854008910944",
  appId: "1:854008910944:web:cf20ff04a22831cb6b5f05",
  measurementId: "G-FEDPP8GWRR"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "symmetry");


/* =========================================================
   SYMMETRY ADMIN PANEL
========================================================= */


/* =========================================================
   EVENT CONFIG
   Maps the Firestore boolean field suffix (event_<key>) to
   the label shown in the UI. Keep this as the single source
   of truth for which 7 events exist.
========================================================= */

const EVENT_LABELS = {
    entropy: "Entropy",
    recursion: "Recursion",
    representation: "Re-Presentation",
    overflow: "Overflow",
    predicta: "Predicta",
    inquisition: "Inquisition",
    sudoku: "Crack the Grid"
};


/* =========================================================
   STATE
========================================================= */

let participants = [];

let queries = [];

// Multi-select: array of event keys currently filtered on.
// Empty array = "All".
let selectedEvents = [];



/* =========================================================
   PAGE NAVIGATION
========================================================= */

document
    .querySelectorAll(".nav-item")
    .forEach(button => {

        button.addEventListener("click", () => {

            const page = button.dataset.page;

            document
                .querySelectorAll(".nav-item")
                .forEach(item => item.classList.remove("active"));

            button.classList.add("active");

            document
                .querySelectorAll(".admin-page")
                .forEach(section => section.classList.remove("active"));

            document.getElementById(page).classList.add("active");

            // The participant listener runs continuously in the
            // background (see initParticipantListener below), so
            // switching tabs just re-renders whatever's currently
            // cached — it's already up to date.
            if (page === "dashboard") {
                renderDashboard();
            }

            if (page === "participants") {
                renderParticipants();
            }

            if (page === "queries") {
                loadQueries();
            }

        });

    });



/* =========================================================
   PARTICIPANT LISTENER (real-time, drives both
   Dashboard stats and the Participants table)
========================================================= */

function mapParticipant(docSnap) {

    const data = docSnap.data();

    // Used for the event-tab filtering logic (unchanged).
    const eventKeys = Object.keys(EVENT_LABELS)
        .filter(key => data[`event_${key}`] === true);

    return {
        id: docSnap.id,

        // Every raw Firestore field, 1:1 — each becomes its own
        // table column below.
        registration_id: data.registration_id || "",
        name: data.name || "",
        email: data.email || "",
        year: data.year || "",
        department: data.department || "",
        institute: data.institute || "",
        food_preference: data.food_preference || "",

        event_entropy: data.event_entropy === true,
        event_inquisition: data.event_inquisition === true,
        event_overflow: data.event_overflow === true,
        event_predicta: data.event_predicta === true,
        event_recursion: data.event_recursion === true,
        event_representation: data.event_representation === true,
        event_sudoku: data.event_sudoku === true,

        file_entropy: data.file_entropy || null,
        file_recursion: data.file_recursion || null,
        file_representation: data.file_representation || null,
        file_payment: data.file_payment || null,

        entropy_description: data.entropy_description || "",
        payment_reference_no: data.payment_reference_no || "",

        inquisition_type: data.inquisition_type || "",
        inquisition_group: data.inquisition_group || "",

        attendance: data.attendance || "",

        status: data.status || "",
        timestamp: data.timestamp || null,

        // Kept for the event-tab filtering logic only —
        // not rendered as its own column anymore.
        events: eventKeys
    };

}


function initParticipantListener() {

    try {

        const participantsRef = collection(db, "participant_list");
        const q = query(participantsRef, orderBy("timestamp", "desc"));

        onSnapshot(q, (snapshot) => {

            participants = snapshot.docs.map(mapParticipant);

            // Keep both views current regardless of which one is
            // visible right now, so switching tabs never shows stale data.
            renderDashboard();
            renderParticipants();

        }, (error) => {

            console.error("Participant listener error:", error);

        });

    } catch (error) {

        console.error("Error setting up participant listener:", error);

    }

}



/* =========================================================
   DASHBOARD
========================================================= */

function renderDashboard() {

    // "Total participants" is intentionally left untouched here —
    // it's reserved for day-of attendance headcount, tracked elsewhere.

    const totalRegistrations = participants
        .filter(participant => participant.file_payment)
        .length;

    document.getElementById("totalRegistrations").textContent =
        totalRegistrations;

    document.getElementById("totalEvents").textContent = 7;

    renderAnalytics();

}



/* =========================================================
   EVENT ANALYTICS
========================================================= */

function renderAnalytics() {

    const container = document.getElementById("eventAnalytics");
    container.innerHTML = "";

    const counts = Object.keys(EVENT_LABELS).map(key => ({
        name: EVENT_LABELS[key],
        count: participants.filter(p => p.events.includes(key)).length
    }));

    const maximum = Math.max(...counts.map(event => event.count), 1);

    counts.forEach(event => {

        const row = document.createElement("div");
        row.className = "analytics-row";

        const percentage = (event.count / maximum) * 100;

        row.innerHTML = `
            <div class="analytics-name">
                ${escapeHTML(event.name)}
            </div>

            <div class="analytics-bar">
                <div
                    class="analytics-fill"
                    style="width:${percentage}%"
                ></div>
            </div>

            <div class="analytics-number">
                ${event.count}
            </div>
        `;

        container.appendChild(row);

    });

}



/* =========================================================
   PARTICIPANT FILTERING LOGIC
========================================================= */

function getFilteredParticipants() {
    const search = document
        .getElementById("participantSearch")
        .value
        .trim()
        .toLowerCase();

    return participants.filter(participant => {

        // AND logic: every currently-selected event tab must be
        // true for this participant. Empty selection = show all.
        const matchesEvents =
            selectedEvents.length === 0 ||
            selectedEvents.every(key => participant.events.includes(key));

        const matchesSearch =
            !search ||
            participant.name.toLowerCase().includes(search);

        return matchesEvents && matchesSearch;

    });
}



/* =========================================================
   PARTICIPANTS TABLE
========================================================= */

function renderParticipants() {

    const table = document.getElementById("participantTable");
    
    // Retrieve the currently filtered list
    const filtered = getFilteredParticipants();

    table.innerHTML = "";

    filtered.forEach(participant => {

        const row = document.createElement("tr");

        const fileLink = (url) =>
            url
                ? `<a href="${escapeHTML(url)}" target="_blank" rel="noopener">View ↗</a>`
                : "—";

        const eventMark = (checked) =>
            checked ? "✓" : "—";

        const submitted = participant.timestamp
            ? new Date(participant.timestamp).toLocaleString()
            : "—";

        row.innerHTML = `
            <td>${escapeHTML(participant.registration_id) || "—"}</td>
            <td>${escapeHTML(participant.name)}</td>
            <td>${escapeHTML(participant.email)}</td>
            <td>${escapeHTML(participant.year) || "—"}</td>
            <td>${escapeHTML(participant.department) || "—"}</td>
            <td>${escapeHTML(participant.institute) || "—"}</td>
            <td>${escapeHTML(participant.food_preference) || "—"}</td>
            <td>${eventMark(participant.event_entropy)}</td>
            <td>${eventMark(participant.event_inquisition)}</td>
            <td>${eventMark(participant.event_overflow)}</td>
            <td>${eventMark(participant.event_predicta)}</td>
            <td>${eventMark(participant.event_recursion)}</td>
            <td>${eventMark(participant.event_representation)}</td>
            <td>${eventMark(participant.event_sudoku)}</td>
            <td>${fileLink(participant.file_entropy)}</td>
            <td title="${escapeHTML(participant.entropy_description)}">${escapeHTML(participant.entropy_description) || "—"}</td>
            <td>${fileLink(participant.file_recursion)}</td>
            <td>${fileLink(participant.file_representation)}</td>
            <td>${escapeHTML(participant.inquisition_type) || "—"}</td>
            <td>${escapeHTML(participant.inquisition_group) || "—"}</td>
            <td class="${participant.file_payment ? "payment-paid" : "payment-pending"}">
                ${
                    participant.file_payment
                        ? `<a href="${escapeHTML(participant.file_payment)}" target="_blank" rel="noopener">Paid ↗</a>`
                        : "Pending"
                }
            </td>
            <td>${escapeHTML(participant.payment_reference_no) || "—"}</td>
            <td>${escapeHTML(participant.status) || "—"}</td>
            <td>${escapeHTML(participant.attendance) || "—"}</td>
            <td>${escapeHTML(submitted)}</td>
        `;

        table.appendChild(row);

    });

}



/* =========================================================
   EVENT FILTER TABS (multi-select)
========================================================= */

document
    .querySelectorAll(".event-tab")
    .forEach(button => {

        button.addEventListener("click", () => {

            const key = button.dataset.event;
            const allTab = document.querySelector('.event-tab[data-event="all"]');

            if (key === "all") {

                selectedEvents = [];

                document
                    .querySelectorAll(".event-tab")
                    .forEach(item => item.classList.remove("active"));

                button.classList.add("active");

            } else {

                allTab.classList.remove("active");

                if (selectedEvents.includes(key)) {

                    selectedEvents = selectedEvents.filter(e => e !== key);
                    button.classList.remove("active");

                } else {

                    selectedEvents.push(key);
                    button.classList.add("active");

                }

                // Nothing selected anymore -> fall back to "All"
                if (selectedEvents.length === 0) {
                    allTab.classList.add("active");
                }

            }

            renderParticipants();

        });

    });



/* =========================================================
   SEARCH (by name)
========================================================= */

document
    .getElementById("participantSearch")
    .addEventListener("input", renderParticipants);



/* =========================================================
   CSV EXPORT LOGIC
========================================================= */

function convertToCSV(data) {
    const headers = [
        "Registration ID", "Name", "Email", "Year", "Department",
        "Institute", "Food Preference", "Entropy", "Inquisition",
        "Overflow", "Predicta", "Recursion", "Re-Presentation",
        "Crack the Grid", "Entropy File", "Entropy Description",
        "Recursion File", "Re-Presentation File", "Inquisition-Type",
        "Inquisition-Group", "Payment File", "Payment Reference No.",
        "Status", "Attendance", "Submitted"
    ];

    const rows = data.map(p => {
        // Map raw boolean values to Yes/No for cleaner CSV reading
        return [
            p.registration_id || "—",
            p.name || "—",
            p.email || "—",
            p.year || "—",
            p.department || "—",
            p.institute || "—",
            p.food_preference || "—",
            p.event_entropy ? "Yes" : "No",
            p.event_inquisition ? "Yes" : "No",
            p.event_overflow ? "Yes" : "No",
            p.event_predicta ? "Yes" : "No",
            p.event_recursion ? "Yes" : "No",
            p.event_representation ? "Yes" : "No",
            p.event_sudoku ? "Yes" : "No",
            p.file_entropy || "—",
            p.entropy_description || "—",
            p.file_recursion || "—",
            p.file_representation || "—",
            p.inquisition_type || "—",
            p.inquisition_group || "—",
            p.file_payment || "—",
            p.payment_reference_no || "—",
            p.status || "—",
            p.attendance || "—",
            p.timestamp ? new Date(p.timestamp).toLocaleString() : "—"
        ].map(val => `"${String(val).replace(/"/g, '""')}"`).join(","); // Escape quotes to prevent CSV breakage
    });

    return [headers.join(","), ...rows].join("\n");
}

document.getElementById("downloadCSV")?.addEventListener("click", () => {
    // 1. Get whatever is currently filtered by tabs and search
    const currentData = getFilteredParticipants(); 
    
    if (currentData.length === 0) {
        alert("No participants match the current filters.");
        return;
    }

    // 2. Convert to CSV format
    const csvString = convertToCSV(currentData);
    
    // 3. Create a downloadable blob
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    // 4. Trigger the download automatically
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Symmetry_Participants_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});



/* =========================================================
   QUERIES
========================================================= */

function loadQueries() {
    try {
        const queriesRef = collection(db, "queries");
        const q = query(queriesRef, orderBy("timestamp", "desc"));

        onSnapshot(q, (snapshot) => {
            queries = [];

            snapshot.forEach((docSnap) => {
                const data = docSnap.data();
                let dateStr = "Just now";
                if (data.timestamp) {
                    dateStr = data.timestamp.toDate().toLocaleDateString();
                }

                queries.push({
                    id: docSnap.id,
                    name: data.name || "Anonymous",
                    email: data.email || "No email",
                    message: data.message || "",
                    date: dateStr,
                    status: data.status || "pending",
                    replyText: data.replyText || ""
                });
            });

            const countDisplay = document.getElementById("queryCount");
            if (countDisplay) {
                countDisplay.textContent = queries.filter(q => q.status !== "replied").length;
            }

            renderQueries();
        });

    } catch (error) {
        console.error("Error setting up query listener:", error);
    }
}


/* =========================================================
   QUERY CARDS
========================================================= */

function renderQueries() {
    const container = document.getElementById("queryList");
    if (!container) return;

    container.innerHTML = "";

    if (!queries.length) {
        container.innerHTML = `
            <div class="loading">
                No queries at the moment.
            </div>
        `;
        return;
    }

    queries.forEach(query => {
        const card = document.createElement("article");
        card.className = "query-card";

        card.innerHTML = `
            <div class="query-header">
                <div>
                    <div class="query-name">${escapeHTML(query.name)}</div>
                    <div class="query-email">${escapeHTML(query.email)}</div>
                </div>
                <div class="query-date">${escapeHTML(query.date)}</div>
            </div>

            <div class="query-text">
                ${escapeHTML(query.message)}
            </div>

            ${
                query.status === "replied"
                ? `
                <div class="query-reply-view" style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #333;">
                    <div class="query-date" style="color: #4ade80; margin-bottom: 8px;">✓ Replied</div>
                    <div class="query-text" style="color: #a1a1aa;">${escapeHTML(query.replyText)}</div>
                </div>
                `
                : `
                <div class="query-reply">
                    <textarea
                        placeholder="Write your response..."
                        data-query="${query.id}"
                    ></textarea>
                    <button
                        class="reply-button"
                        data-query="${query.id}"
                    >
                        Send response ↗
                    </button>
                </div>
                `
            }
        `;

        container.appendChild(card);
    });

    document.querySelectorAll(".reply-button").forEach(button => {
        button.addEventListener("click", sendReply);
    });
}


/* =========================================================
   SEND REPLY
========================================================= */

async function sendReply(event) {
    const button = event.currentTarget;
    const id = button.dataset.query;
    const textarea = document.querySelector(`textarea[data-query="${id}"]`);
    const message = textarea.value.trim();

    if (!message) {
        alert("Please write a response first.");
        return;
    }

    button.disabled = true;
    button.textContent = "Sending...";

    try {
        // 1. Update Firestore
        const queryDocRef = doc(db, "queries", id);
        await updateDoc(queryDocRef, {
            replyText: message,
            status: "replied",
            repliedAt: serverTimestamp()
        });

        // 2. Fetch the specific query details
        const queryData = queries.find(q => q.id === id);

        // 3. Prepare the data
        const payload = {
            to_name: queryData.name,
            to_email: queryData.email,
            original_message: queryData.message,
            reply_message: message
        };

        // 4. Send the email using Google Apps Script
        const scriptURL = "https://script.google.com/macros/s/AKfycbzPhhcwPxg3Ge615xiFT75CpZv5ojJy7Z1QpUpajZ8c1OkAPY1v4yvf-OwlA95eKgQe/exec";

        await fetch(scriptURL, {
            method: "POST",
            body: JSON.stringify(payload)
        });

    } catch (error) {
        console.error("Error saving reply or sending email:", error);
        alert("Unable to process the response. Check the console for details.");
        button.disabled = false;
        button.textContent = "Send response ↗";
    }
}



/* =========================================================
   REFRESH
   The participant listener already keeps everything live —
   this button forces one extra one-time re-pull, mainly so
   the click visibly does something and to recover from any
   listener hiccup without a full page reload.
========================================================= */

document
    .getElementById("refreshDashboard")
    .addEventListener("click", async () => {

        const button = document.getElementById("refreshDashboard");
        const originalText = button.textContent;
        button.textContent = "Refreshing…";
        button.disabled = true;

        try {

            const snapshot = await getDocs(collection(db, "participant_list"));
            participants = snapshot.docs.map(mapParticipant);

            renderDashboard();
            renderParticipants();

        } catch (error) {

            console.error("Refresh failed:", error);

        } finally {

            button.textContent = originalText;
            button.disabled = false;

        }

    });



/* =========================================================
   SECURITY / HTML ESCAPE
========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(
            /[&<>"']/g,
            character => ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            })[character]
        );

}



/* =========================================================
   INITIAL LOAD
========================================================= */

initParticipantListener();
