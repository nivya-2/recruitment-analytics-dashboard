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



const API_URL = 'https://recruitmentanalyticsdashboard-default-rtdb.firebaseio.com/recruitmentMetrics/dashboardMetrics.json';

// Function to fetch data from Firebase
const fetchMetrics = async () => {
  try {
    const response = await axios.get(API_URL);
    const data = response.data;

    // Assuming data structure is similar to the dummy data
    const dataMetrics = {
      totalHired: data.totalHired,
      applicationsPerHire: data.applicationsPerHire,
      daysPerHire: data.daysPerHire,
      costPerHire: data.costPerHire,
      openPositions: data.openPositions,
      closedPositions: data.closedPositions,
    };

    // Update the DOM with the data fetched from Firebase
    updateMetrics(dataMetrics);

  } catch (error) {
    console.error('Error fetching data from Firebase:', error);
  }
};

// Function to update the DOM with the fetched values
const updateMetrics = (dataMetrics) => {
  document.getElementById('totalHired').textContent = dataMetrics.totalHired;
  document.getElementById('applicationsPerHire').textContent = dataMetrics.applicationsPerHire;
  document.getElementById('daysPerHire').textContent = dataMetrics.daysPerHire;
  document.getElementById('costPerHire').textContent = `$${dataMetrics.costPerHire}`;
  document.getElementById('openPositions').textContent = dataMetrics.openPositions;
  document.getElementById('closedPositions').textContent = dataMetrics.closedPositions;
};

// Fetch and display the data after the DOM is loaded
document.addEventListener('DOMContentLoaded', fetchMetrics);