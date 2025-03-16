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

const FIREBASE_DB_URL = "https://recruitmentanalyticsdashboard-default-rtdb.firebaseio.com/"; // Replace with your Firebase Realtime DB URL
  



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
  
  function fetchJobPostings() {
    var jobListings=[];
    // if (document.getElementById("jobPostings").classList.contains("hidden")) {
    //     console.log("Job Postings tab is not active. Skipping data update.");

    //     return;
    //     }
    axios.get(`${FIREBASE_DB_URL}/jobPostings.json`)
  .then(response => {
    jobListings=Object.values(response.data);
   createJobCards(jobListings, "jobPostings");
 }).catch(error => {
    console.error("Error fetching data:", error);
});}