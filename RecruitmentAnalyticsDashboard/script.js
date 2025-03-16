const FIREBASE_URL = "https://recruitmentanalyticsdashboard-default-rtdb.firebaseio.com/";

function switchTab() {
    const analyticsDiv = document.getElementById("recruitmentAnalytics");
    const jobPostingsDiv = document.getElementById("jobPostings");
    const tabs = document.querySelectorAll(".tab");
    const headerContainer = document.querySelector(".header-container");
    const headerTitle = document.getElementById("header-section-title");
    const tabContainer = document.querySelector(".tab-container");

    // Determine current active section
    const isAnalyticsActive = !analyticsDiv.classList.contains("hidden");

    // Toggle visibility
    analyticsDiv.classList.toggle("hidden", isAnalyticsActive);
    jobPostingsDiv.classList.toggle("hidden", !isAnalyticsActive);

    // Toggle active tab
    tabs.forEach(tab => tab.classList.toggle("active"));

    // Define styles for each tab
    const themes = {
        analytics: { title: "Recruitment Analytics", body: "#A5E4F9", header: "#008cba", tabBg: "#CBEDF9" },
        jobPostings: { title: "Job Postings", body: "#FDD999", header: "#FB9F00", tabBg: "#f5d08f" }
    };

    // Apply the correct theme
    const activeTheme = isAnalyticsActive ? themes.jobPostings : themes.analytics;
    document.body.style.backgroundColor = activeTheme.body;
    headerContainer.style.backgroundColor = activeTheme.header;
    tabContainer.style.backgroundColor = activeTheme.tabBg;
    headerTitle.innerText = activeTheme.title;
}

function fetchCandidate() {

    var candidateList = [];
    var applicationList = [];
    axios.get(`${FIREBASE_URL}.json`)
        .then(response => {
            candidateList = Object.values(response.data.candidates);
            applicationList = Object.values(response.data.applications);
            renderTable(candidateList, applicationList);
        }).catch(error => {
            console.log("Error");
        })
}


function renderTable(candidateList, applicationList) {

    var tablebody = document.getElementById('candidate-table-body');
    tablebody.innerHTML = ""; // Clear existing rows
    candidateList.forEach(candidate => {
        const application = applicationList.find(app => app.candidate_id === candidate.candidateId);
        tablebody.innerHTML += `<tr>
                <td>${candidate.candidateId}</td>
                <td>${candidate.firstName} ${candidate.lastName}</td>
                <td>${application.application_date}</td>
                <td><button class="download-button"><img src="images/view-svgrepo-com.svg" alt="View Icon"></button></td>
                <td>
                    <label class="switch">
                        <input type="checkbox">
                        <span class="slider"></span>
                    </label>
                </td>
            </tr>`;
    });
}