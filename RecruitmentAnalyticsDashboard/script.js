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