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