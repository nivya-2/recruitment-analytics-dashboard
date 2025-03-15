function switchTab() {
    const analyticsDiv = document.getElementById("recruitmentAnalytics");
    const jobPostingsDiv = document.getElementById("jobPostings");
    const tabs = document.querySelectorAll(".tab");
    const headerContainer = document.querySelector(".header-container");
    const headerTitle = document.getElementById("header-section-title");
    // Toggle visibility
    analyticsDiv.classList.toggle("hidden");
    jobPostingsDiv.classList.toggle("hidden");

    // Toggle active tab
    tabs.forEach(tab => tab.classList.toggle("active"));

    // Update background colors based on visibility
    if (!analyticsDiv.classList.contains("hidden")) {
        headerTitle.innerText = "Recruitment Analytics";
        document.body.style.backgroundColor = "#A5E4F9";  // Blue
        headerContainer.style.backgroundColor = "#008cba";
        document.querySelector(".jobpostings").style.backgroundColor = "#CBEDF9";
    } else {
        headerTitle.innerText = "Job Postings";
        document.body.style.backgroundColor = "#FDD999";  // Orange
        headerContainer.style.backgroundColor = "#FB9F00";
        document.querySelector(".jobpostings").style.backgroundColor = "#008cba";
    }
}