document.addEventListener("DOMContentLoaded", function() {
    const projectsPages = Array.from(document.querySelectorAll(".project-page"));
    const prevButton = document.querySelector(".carousel-nav.prev");
    const nextButton = document.querySelector(".carousel-nav.next");

    let currentPage = 0;
    let projectsPerPage = window.innerWidth > 768 ? 2 : 1; // Default

    // Function to adjust the number of visible projects according to screen size
    function updateProjectsPerPage() {
        projectsPerPage = window.innerWidth > 768 ? 2 : 1;
        displayProjects();
    }

    // Display projects according to the number of projects per page
    function displayProjects() {
        projectsPages.forEach((page, index) => {
            page.style.display = (index >= currentPage && index < currentPage + projectsPerPage) ? "flex" : "none";
        });
    }

    // Navigation function to display the next/previous projects
    function navigateCarousel(direction) {
        const maxPage = projectsPages.length - projectsPerPage;

        currentPage += direction * projectsPerPage;

        if (currentPage < 0) {
            currentPage = maxPage;
        } else if (currentPage > maxPage) {
            currentPage = 0;
        }

        displayProjects();
    }

    // Listen to navigation button clicks
    prevButton.addEventListener("click", () => navigateCarousel(-1));
    nextButton.addEventListener("click", () => navigateCarousel(1));

    // Reset the display when the window is resized
    window.addEventListener("resize", updateProjectsPerPage);

    // Initialization
    displayProjects();
});