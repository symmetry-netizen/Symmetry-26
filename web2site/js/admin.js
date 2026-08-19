

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { 
    getFirestore, collection, onSnapshot, doc, updateDoc, 
    serverTimestamp, query, orderBy 
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AlzaSyDjJ_i5yOGcUL5jn8MTTCm_fS8Ic5W74F0",
    authDomain: "symmetry-505819.firebaseapp.com",
    projectId: "symmetry-505819",
    storageBucket: "symmetry-505819.firebasestorage.app",
    messagingSenderId: "598103005832",
    appId: "1:598103005832:web:047c15a1494a582e2f5d3d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "symmetry");








/* =========================================================
   SYMMETRY ADMIN PANEL
========================================================= */


/*
   IMPORTANT

   Replace this with the URL of your deployed
   Google Apps Script Web App.
*/

const API_URL =
    "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL";



/* =========================================================
   STATE
========================================================= */

let participants = [];

let queries = [];

let selectedEvent = "all";



/* =========================================================
   API
========================================================= */

async function api(action, data = {}) {

    const response = await fetch(API_URL, {

        method: "POST",

        headers: {
            "Content-Type": "text/plain;charset=utf-8"
        },

        body: JSON.stringify({

            action,

            ...data

        })

    });


    if (!response.ok) {

        throw new Error(
            "Unable to communicate with server."
        );

    }


    return await response.json();

}



/* =========================================================
   PAGE NAVIGATION
========================================================= */

document
    .querySelectorAll(".nav-item")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const page =
                    button.dataset.page;


                document
                    .querySelectorAll(".nav-item")
                    .forEach(item =>
                        item.classList.remove("active")
                    );


                button.classList.add("active");


                document
                    .querySelectorAll(".admin-page")
                    .forEach(section =>
                        section.classList.remove("active")
                    );


                document
                    .getElementById(page)
                    .classList.add("active");


                if (page === "dashboard") {

                    loadDashboard();

                }


                if (page === "participants") {

                    loadParticipants();

                }


                if (page === "queries") {

                    loadQueries();

                }

            }
        );

    });



/* =========================================================
   DASHBOARD
========================================================= */

async function loadDashboard() {

    try {

        const data =
            await api("analytics");


        document
            .getElementById("totalParticipants")
            .textContent =
            data.totalParticipants;


        document
            .getElementById("totalRegistrations")
            .textContent =
            data.totalRegistrations;


        document
            .getElementById("totalEvents")
            .textContent =
            data.totalEvents;


        document
            .getElementById("unansweredQueries")
            .textContent =
            data.unansweredQueries;


        renderAnalytics(
            data.events
        );


    } catch (error) {

        console.error(error);

    }

}



/* =========================================================
   EVENT ANALYTICS
========================================================= */

function renderAnalytics(events) {

    const container =
        document.getElementById(
            "eventAnalytics"
        );


    container.innerHTML = "";


    const maximum =
        Math.max(
            ...events.map(
                event => event.count
            ),
            1
        );


    events.forEach(event => {

        const row =
            document.createElement("div");


        row.className =
            "analytics-row";


        const percentage =
            (event.count / maximum) * 100;


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
   PARTICIPANTS
========================================================= */

async function loadParticipants() {

    try {

        const data =
            await api("participants");


        participants =
            data.participants || [];


        renderParticipants();


    } catch (error) {

        console.error(error);

    }

}



/* =========================================================
   FILTER PARTICIPANTS
========================================================= */

function renderParticipants() {

    const table =
        document.getElementById(
            "participantTable"
        );


    const search =
        document
            .getElementById(
                "participantSearch"
            )
            .value
            .toLowerCase();


    let filtered =
        participants.filter(
            participant => {

                const matchesEvent =
                    selectedEvent === "all" ||
                    participant.eventSlug ===
                    selectedEvent;


                const matchesSearch =
                    !search ||
                    participant.name
                        .toLowerCase()
                        .includes(search) ||
                    participant.email
                        .toLowerCase()
                        .includes(search);


                return (
                    matchesEvent &&
                    matchesSearch
                );

            }
        );


    table.innerHTML = "";


    filtered.forEach(participant => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${escapeHTML(participant.name)}
            </td>

            <td>
                ${escapeHTML(participant.email)}
            </td>

            <td>
                ${escapeHTML(participant.event)}
            </td>

            <td class="${
                participant.payment === "Paid"
                    ? "payment-paid"
                    : "payment-pending"
            }">
                ${escapeHTML(participant.payment)}
            </td>

            <td>
                ${escapeHTML(participant.submitted)}
            </td>

        `;


        table.appendChild(row);

    });

}



/* =========================================================
   EVENT FILTER BUTTONS
========================================================= */

document
    .querySelectorAll(".event-tab")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".event-tab")
                    .forEach(item =>
                        item.classList.remove("active")
                    );


                button.classList.add("active");


                selectedEvent =
                    button.dataset.event;


                renderParticipants();

            }
        );

    });



/* =========================================================
   SEARCH
========================================================= */

document
    .getElementById("participantSearch")
    .addEventListener(
        "input",
        renderParticipants
    );



/* =========================================================
   DOWNLOAD CSV
========================================================= */

document
    .getElementById("downloadParticipants")
    .addEventListener(
        "click",
        () => {

            const search =
                document
                    .getElementById(
                        "participantSearch"
                    )
                    .value
                    .toLowerCase();


            let filtered =
                participants.filter(
                    participant => {

                        const matchesEvent =
                            selectedEvent === "all" ||
                            participant.eventSlug ===
                            selectedEvent;


                        const matchesSearch =
                            !search ||
                            participant.name
                                .toLowerCase()
                                .includes(search) ||
                            participant.email
                                .toLowerCase()
                                .includes(search);


                        return (
                            matchesEvent &&
                            matchesSearch
                        );

                    }
                );


            downloadCSV(filtered);

        }
    );



function downloadCSV(data) {

    const headers = [
        "Name",
        "Email",
        "Event",
        "Payment",
        "Submitted"
    ];


    const rows = data.map(item => [

        item.name,
        item.email,
        item.event,
        item.payment,
        item.submitted

    ]);


    const csv = [

        headers,

        ...rows

    ]

    .map(row =>
        row
            .map(value =>
                `"${String(value)
                    .replace(/"/g, '""')}"`
            )
            .join(",")
    )

    .join("\n");


    const blob =
        new Blob(
            [csv],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;

    link.download =
        selectedEvent === "all"
            ? "symmetry-participants.csv"
            : `symmetry-${selectedEvent}.csv`;


    link.click();


    URL.revokeObjectURL(url);

}



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
        // PASTE YOUR WEB APP URL BELOW
        const scriptURL = "https://script.google.com/macros/s/AKfycbxePM5KxNnmGoq60GpCme6gpxPFJ7x7oXVw-wbcscNM_J95A3ZDsabXuUt6pVtD_ID2/exec"; 
        
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
========================================================= */

document
    .getElementById("refreshDashboard")
    .addEventListener(
        "click",
        loadDashboard
    );



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

loadDashboard();