const FIREBASE_DB_URL = 'https://recruitmentanalyticsdashboard-default-rtdb.firebaseio.com';

function switchTab() {
    const analyticsDiv = document.getElementById("recruitmentAnalytics");
    const jobPostingsDiv = document.getElementById("jobPostings");
    const tabs = document.querySelectorAll(".tab");
    const headerTitle = document.getElementById("header-section-title");
    const tabContainer = document.querySelector(".tab-container");
    const articleContainer = document.querySelector(".article-container");

  // Determine current active section
  const isAnalyticsActive = !analyticsDiv.classList.contains("hidden");

    // Toggle visibility correctly
    analyticsDiv.classList.toggle("hidden", isAnalyticsActive);
    jobPostingsDiv.classList.toggle("hidden", !isAnalyticsActive);

    // Remove 'active' class from all tabs and set the correct one
    tabs.forEach(tab => tab.classList.remove("active"));
    const activeTab = isAnalyticsActive ? tabs[1] : tabs[0]; // 0 = Analytics, 1 = Job Postings
    activeTab.classList.add("active");
    
    // Define styles for each tab
    const themes = {
        analytics: { 
            title: "Recruitment Analytics", 
            body: "#008cba", 
            tabBg: "#CBEDF9", 
            articleContainerBg: "#A5E4F9", 
            activeTabBg: "#FB9F00" 
        },
        jobPostings: { 
            title: "Job Postings", 
            body: "#FB9F00", 
            tabBg: "#f5d08f", 
            articleContainerBg: "#FDD999", 
            activeTabBg: "#008cba" 
        }
    };

    // Apply the correct theme
    const activeTheme = isAnalyticsActive ? themes.jobPostings : themes.analytics;

    document.body.style.backgroundColor = activeTheme.body;
    tabContainer.style.backgroundColor = activeTheme.tabBg;
    headerTitle.innerText = activeTheme.title;
    articleContainer.style.backgroundColor = activeTheme.articleContainerBg;
    articleContainer.style.transition = "background-color 0.5s ease-in-out";

    // Set active tab background color
    activeTab.style.backgroundColor = activeTheme.activeTabBg;

    // Reset inactive tab background to default (transparent or tab container color)
    tabs.forEach(tab => {
        if (!tab.classList.contains("active")) {
            tab.style.backgroundColor = "transparent";
        }
    });
//     if (!isAnalyticsActive) {
//       fetchJobPostings();
//   }
 }

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".tab-container__button").forEach(button => {
        button.addEventListener("click", () => switchTab(button));
    });
});




const fetchMetrics = async () => {
  try {
    const response = await axios.get(`${FIREBASE_DB_URL}/.json`);
    const data = response.data.recruitmentMetrics.dashboardMetrics;

    const dataMetrics = {
      totalHired: data.totalHired,
      applicationsPerHire: data.applicationsPerHire,
      daysPerHire: data.daysPerHire,
      costPerHire: data.costPerHire,
      openPositions: data.openPositions,
      closedPositions: data.closedPositions,
    };

    updateMetrics(dataMetrics);

  } catch (error) {
    console.error('Error fetching data from Firebase:', error);
  }
};

const updateMetrics = (dataMetrics) => {
  document.getElementById('totalHired').textContent = dataMetrics.totalHired;
  document.getElementById('applicationsPerHire').textContent = dataMetrics.applicationsPerHire;
  document.getElementById('daysPerHire').textContent = dataMetrics.daysPerHire;
  document.getElementById('costPerHire').textContent = `$${dataMetrics.costPerHire}`;
  document.getElementById('openPositions').textContent = dataMetrics.openPositions;
  document.getElementById('closedPositions').textContent = dataMetrics.closedPositions;
};

document.addEventListener('DOMContentLoaded', fetchMetrics);

async function fetchAndUpdateFunnelChart() {
    try {
        const response = await axios.get(`${FIREBASE_DB_URL}/.json`);

        if (!response.data || !response.data.recruitmentMetrics || !response.data.recruitmentMetrics.recruitmentFunnel) {
            console.error("No recruitment funnel data found!");
            return;
        }

        const funnelData = response.data.recruitmentMetrics.recruitmentFunnel;
        updateFunnelChart(funnelData);

    } catch (error) {
        console.error("Error fetching recruitment funnel data:", error);
    }
}

function updateFunnelChart(funnelData) {
    const stages = {
        "applicationReceived": "application",
        "reviewDone": "review",
        "assessmentCleared": "assessment",
        "interviewRound1": "interview-1",
        "interviewRound2": "interview-2",
        "finalOffer": "offer",
        "hired": "start"
    };

    // Find the maximum value for scaling (applications received is usually the highest)
    const maxApplicants = funnelData.applicationReceived || 1;
    let lastStagePercentage = 0;

    Object.entries(stages).forEach(([key, className]) => {
        const bar = document.querySelector(`.graph-bar.${className}`);
        if (bar && funnelData[key] !== undefined) {
            const percentage = (funnelData[key] / maxApplicants) * 100;
            bar.style.width = `${percentage}%`;
            bar.setAttribute("data-value", `${percentage.toFixed(1)}%`); // Optional: Show percentage in tooltip
            
            // Store last stage percentage (hired/start)
            if (key === "hired") {
                lastStagePercentage = percentage.toFixed(1);
            }
        }
    });

    // Update final percentage dynamically
    const finalPercentageElement = document.querySelector(".width-line-final p");
    if (finalPercentageElement) {
        finalPercentageElement.innerText = `${lastStagePercentage}%`;
    }
}

// Call the function on page load
document.addEventListener("DOMContentLoaded", fetchAndUpdateFunnelChart);

document.addEventListener('DOMContentLoaded', function() {
    // Fetch data from Firebase using Axios
    axios.get(`${FIREBASE_DB_URL}/.json`)
    .then(response => {
        const data = response.data;

        // Ensure recruitmentMetrics and applicationSources exist
        if (data.recruitmentMetrics && data.recruitmentMetrics.applicationSources) {
            const sourceCounts = data.recruitmentMetrics.applicationSources;

            // Convert data into an array for sorting
            const sourceArray = Object.entries(sourceCounts).map(([source, count]) => ({
                source,
                count
            }));

            // Sort by count in descending order
            sourceArray.sort((a, b) => b.count - a.count);

            // Find the max count to calculate percentages
            const maxCount = Math.max(...sourceArray.map(item => item.count));

            // Generate the chart HTML
            const chartContent = document.getElementById('sources-chart-content');
            chartContent.innerHTML = '';

            sourceArray.forEach(item => {
                const percentage = (item.count / maxCount) * 85;

                const chartRow = document.createElement('div');
                chartRow.className = 'sources-chart-row';

                chartRow.innerHTML = `
                    <div class="sources-chart-label">${item.source}</div>
                    <div class="sources-chart-bar-container">
                        <div class="sources-chart-bar" style="width: ${percentage}%;">
                        <div class="sources-chart-value">${item.count}</div>
                        </div>
                    </div>
                `;

                chartContent.appendChild(chartRow);
            });
        } else {
            console.error('Error: applicationSources data is missing.');
            document.getElementById('sources-chart-content').innerHTML = '<div class="error">No data available.</div>';
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        document.getElementById('sources-chart-content').innerHTML = '<div class="error">Error loading data. Please try again later.</div>';
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const genderRatioChart = document.getElementById('genderRatioChart');
    
    // Fetch data from Firebase using Axios
    axios.get(`${FIREBASE_DB_URL}/.json`)
    .then(response => {
        const data = response.data;

        if (data.recruitmentMetrics && data.recruitmentMetrics.genderRatio) {
            const { male, female } = data.recruitmentMetrics.genderRatio;
            const total = male + female;
            const maleRatio = male / total;
            const femaleRatio = female / total;

            renderGenderRatioChart(maleRatio, femaleRatio, male, female);
        } else {
            throw new Error('Gender ratio data is missing.');
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        genderRatioChart.innerHTML = `
            <div class="gender-ratio__error">Error loading data. Please try again later.</div>
        `;
    });

    function renderGenderRatioChart(maleRatio, femaleRatio, maleCount, femaleCount) {
        // Calculate SVG circle properties
        const radius = 60;
        const circumference = 2 * Math.PI * radius;
        const maleDash = circumference * maleRatio;
        const femaleDash = circumference * femaleRatio;
        
        // Generate SVG for donut chart with responsive sizing
        const svg = `
        <svg width="100%" height="100%" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet">
            <!-- Male segment -->
            <circle cx="100" cy="100" r="${radius}" fill="transparent" 
                    stroke="#FFA500" stroke-width="25"
                    stroke-dasharray="${maleDash} ${circumference}" 
                    stroke-dashoffset="0"
                    transform="rotate(-90 100 100)" />
            
            <!-- Female segment -->
            <circle cx="100" cy="100" r="${radius}" fill="transparent" 
                    stroke="#30c9e8" stroke-width="25"
                    stroke-dasharray="${femaleDash} ${circumference}" 
                    stroke-dashoffset="-${maleDash}"
                    transform="rotate(-90 100 100)" />
                    
            <!-- Center text showing percentages -->
            <text x="100" y="95" text-anchor="middle" font-size="14" fill="#333" font-weight="bold">
            ${Math.round(maleRatio * 100)}% / ${Math.round(femaleRatio * 100)}%
            </text>
            <text x="100" y="115" text-anchor="middle" font-size="12" fill="#666">
            (${maleCount}/${femaleCount})
            </text>
        </svg>
        `;
        
        // Update the DOM
        genderRatioChart.innerHTML = svg;
    }
});



// Function to create a card from a job object
function createJobCard(job) {
  const cardElement = document.createElement('div');
  cardElement.className = 'job-card';
  
  cardElement.innerHTML = `
    <div class="job-card__header">
      <h2 class="job-card__title">${job.title}</h2>
      <div class="job-card__avatar">${job.du}</div>
    </div>
    
    <div class="job-card__details">
      <div class="job-card__location">
        <svg class="job-card__icon" viewBox="0 0 24 24" width="18" height="18">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
        <span>${job.location}</span>
      </div>
      <div class="job-card__experience">${job.experience}</div>
    </div>
    
    <div class="job-card__footer">
      <div class="job-card__date">${job.date}</div>
      
      <div class="job-card__stats">
        <div class="job-card__stat">
          <span class="job-card__stat-label">Openings:</span>
          <span class="job-card__stat-value">${job.openings}</span>
        </div>
        <div class="job-card__stat">
          <span class="job-card__stat-label">Candidates:</span>
          <span class="job-card__stat-value">${job.candidates}</span>
        </div>
      </div>
    </div>
    
    <a href="#" class="job-card__link">
      Learn More
      <svg class="job-card__arrow" viewBox="0 0 24 24" width="16" height="16">
        <path d="M16.01 11H4v2h12.01v3L20 12l-3.99-4z"/>
      </svg>
    </a>
  `;
 


  const learnMoreLink = cardElement.querySelector('.job-card__link');
  learnMoreLink.addEventListener('click', function(e) {
      e.preventDefault();
      fetchData(job).then(applyFilters).then(openModal);
  });
  
  return cardElement;
}

// Function to create all job cards
function createJobCards(jobs, containerId) {
  const container = document.getElementById(containerId);
  // if (!container) {
  //   console.error(`Container with ID '${containerId}' not found`);
  //   return;
  // }    
  // Clear existing content
  container.innerHTML = '';
  
  // Create and append each job card
  jobs.forEach(job => {
    const card = createJobCard(job);
    container.appendChild(card);
  });
}

// Function to fetch jobs from firebase and create a cards for each job object

async function fetchJobPostings() {
  var jobListings=[];
  // if (document.getElementById("jobPostings").classList.contains("hidden")) {
  //     console.log("Job Postings tab is not active. Skipping data update.");

  //     return;
  //     }
  await axios.get(`${FIREBASE_DB_URL}/jobPostings.json`)
.then(response => {
  jobListings=Object.values(response.data);
 createJobCards(jobListings, "jobPostings");
}).catch(error => {
  console.error("Error fetching data:", error);
});}

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

async function fetchData(job) {
  try {
      const response = await axios.get("https://recruitmentanalyticsdashboard-default-rtdb.firebaseio.com/.json");
      const data = response.data || {};
      const candidates = Array.isArray(data.candidates) ? data.candidates : Object.values(data.candidates || {});
      const applications = Object.values(data.applications || {});
      const applicationList = applications.filter(app => app.job_id === job.id);
      
      recruitmentData = applicationList.map(app => {
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

function createModalBackdrop() {
if (!document.querySelector('.modal-backdrop')) {
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  document.body.appendChild(backdrop);
  
  // Add click event to close modal when clicking outside
  backdrop.addEventListener('click', function(e) {
    if (e.target === backdrop) {
      closeModal();
    }
  });
}
}

// Function to open modal
function openModal() {
createModalBackdrop();

const backdrop = document.querySelector('.modal-backdrop');
const modalBody = document.querySelector('.candidate-summary-body');

backdrop.style.display = 'block';
modalBody.style.cssText = 'display: flex !important'; // Fixed this line

 modalBody.classList.add('modal-fade-in');

document.body.classList.add('modal-open');
}

// Function to close modal
function closeModal() {
const backdrop = document.querySelector('.modal-backdrop');
const modalBody = document.querySelector('.candidate-summary-body');

backdrop.style.display = 'none';
modalBody.style.cssText = 'display: none !important'; // Fixed this line

document.body.classList.remove('modal-open');
}




// Add event listener to close button
document.addEventListener('DOMContentLoaded', function() {
const closeButton = document.querySelector('.close-button');
if (closeButton) {
  closeButton.addEventListener('click', closeModal);
}
});
