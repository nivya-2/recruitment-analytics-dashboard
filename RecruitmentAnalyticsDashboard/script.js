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
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".tab-container__button").forEach(button => {
        button.addEventListener("click", () => switchTab(button));
    });
});



const FIREBASE_DB_URL = 'https://recruitmentanalyticsdashboard-default-rtdb.firebaseio.com/.json';

const fetchMetrics = async () => {
  try {
    const response = await axios.get(FIREBASE_DB_URL);
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
        const response = await axios.get(FIREBASE_DB_URL);

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
    axios.get(FIREBASE_DB_URL)
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
    axios.get(FIREBASE_DB_URL)
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