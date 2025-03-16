const FIREBASE_URL = "https://recruitmentanalyticsdashboard-default-rtdb.firebaseio.com/";
var JOBID=null;
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

// function fetchCandidate() {

//     var candidateList = [];
//     var applicationList = [];
//     axios.get(`${FIREBASE_URL}.json`)
//         .then(response => {
//             candidateList = Object.values(response.data.candidates);
//             applicationList = Object.values(response.data.applications);
//             renderTable(candidateList, applicationList);
//         }).catch(error => {
//             console.log("Error");
//         })
// }


// function renderTable(candidateList, applicationList) {

//     var tablebody = document.getElementById('candidate-table-body');
//     tablebody.innerHTML = ""; // Clear existing rows
//     candidateList.forEach(candidate => {
//         const application = applicationList.find(app => app.candidate_id === candidate.candidateId);
//         tablebody.innerHTML += `<tr>
//                 <td>${candidate.candidateId}</td>
//                 <td>${candidate.firstName} ${candidate.lastName}</td>
//                 <td>${application.application_date}</td>
//                 <td><button class="download-button"><img src="images/view-svgrepo-com.svg" alt="View Icon"></button></td>
//                 <td>
//                     <label class="switch">
//                         <input type="checkbox" checked>
//                         <span class="slider"></span>
//                     </label>
//                 </td>
//             </tr>`;
//     });
// }
let recruitmentData = {};

window.toggleDropdown = function(id) {
    const element = document.getElementById(id);
    if (id === 'filterOptions' || id === 'sortOptions') {
        const otherMainDropdown = id === 'filterOptions' ? 'sortOptions' : 'filterOptions';
        const otherElement = document.getElementById(otherMainDropdown);
        if (otherElement && otherElement.classList.contains('show')) {
            otherElement.classList.remove('show');
        }
        element.classList.toggle('show');
    } else if (element.classList.contains('sub-dropdown')) {
        element.classList.toggle('show');
    }
}

window.selectOption = function(element, event) {
    event.stopPropagation();
    const parent = element.closest('.sub-dropdown');
    const isSortingCategory = parent.id === 'sortDate' || parent.id === 'sortAge';

    if (isSortingCategory) {
        document.querySelectorAll('#sortDate .sub-dropdown-item, #sortAge .sub-dropdown-item').forEach(item => {
            item.classList.remove('selected');
        });
    } else {
        if (element.classList.contains('selected')) {
            element.classList.remove('selected');
            return;
        }
        parent.querySelectorAll('.sub-dropdown-item').forEach(item => {
            item.classList.remove('selected');
        });
    }
    element.classList.add('selected');
    applyFilters();
}

async function fetchData() {
    try {
        const response = await axios.get("https://recruitmentanalyticsdashboard-default-rtdb.firebaseio.com/.json");
        const data = response.data || {};
        const candidates = Array.isArray(data.candidates) ? data.candidates : Object.values(data.candidates || {});
        const applications = Object.values(data.applications || {});
        JOBID
        
        recruitmentData = applications.map(app => {
            const candidate = candidates.find(c => c.candidateId === app.candidate_id) || {};
            return {
                ...app,
                ...candidate,
            };
        });
        console.log("Fetched Data:", recruitmentData);
    } catch (error) {
        console.error("Error fetching data:", error);
        recruitmentData = [];
    }
}

function getSelectedFilters() {
    return {
        experience: document.querySelector('#expLevel .selected')?.textContent || null,
        status: document.querySelector('#appStatus .selected')?.textContent || null,
        source: document.querySelector('#source .selected')?.textContent || null,
        sortByDate: document.querySelector('#sortDate .selected')?.textContent || null,
        sortByAge: document.querySelector('#sortAge .selected')?.textContent || null
    };
}

function filterApplications(filters) {
    let applications = [...recruitmentData];
    
    if (filters.experience) {
        const expRanges = {
            "Entry Level (0-2 years)": [0, 2],
            "Mid Level (3-5 years)": [3, 5],
            "Senior Level (6+ years)": [6, Infinity]
        };
        let [minExp, maxExp] = expRanges[filters.experience];
        applications = applications.filter(app => app.experience >= minExp && app.experience <= maxExp);
    }

    if (filters.status) {
        applications = applications.filter(app => filters.status === "Shortlisted" ? app.shortlisted : !app.shortlisted);
    }

    if (filters.source) {
        applications = applications.filter(app => app.source === filters.source);
    }

    if (filters.sortByDate) {
        applications.sort((a, b) => filters.sortByDate === "Newest First" ? new Date(b.applicationDate) - new Date(a.application_date) : new Date(a.application_date) - new Date(b.application_date));
    }

    if (filters.sortByAge) {
        applications.sort((a, b) => filters.sortByAge === "Youngest First" ? a.age - b.age : b.age - a.age);
    }

    return applications;
}

async function applyFilters() {
    const filters = getSelectedFilters();
    const filteredApplications = filterApplications(filters);
    console.log("Filtered Applications:");
    renderTable2(filteredApplications);
    filteredApplications.forEach(app => {
        console.log(`ID: ${app.candidateId}, Name: ${app.firstName} ${app.lastName}, Age: ${app.age}, Experience: ${app.experience} years, Application Date: ${app.application_date}, Shortlisted?: ${app.shortlisted}, Application Source: ${app.source}`);
    });
}
function renderTable2(candidates) {
    var tablebody = document.getElementById('candidate-table-body');
    tablebody.innerHTML = ""; // Clear existing rows
    candidates.forEach(candidate => {
        checked=(candidate.shortlisted)?'checked':'';
        tablebody.innerHTML += `<tr>
                <td>${candidate.candidateId}</td>
                <td>${candidate.firstName} ${candidate.lastName}</td>
                <td>${candidate.age}</td>
                <td>${candidate.experience}</td>
                <td>${candidate.application_date}</td>
                <td>${candidate.source}</td>
                <td><button class="download-button"><img src="images/view-svgrepo-com.svg" alt="View Icon"></button></td>
                <td>
                    <label class="switch">
                        <input type="checkbox" ${checked}>
                        <span class="slider"></span>
                    </label>
                </td>
            </tr>`;
    });
}


fetchData().then(applyFilters);