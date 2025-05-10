document.addEventListener("DOMContentLoaded", function () {
  const projectsPages = Array.from(document.querySelectorAll(".project-page"));
  const prevButton = document.querySelector(".carousel-nav.prev");
  const nextButton = document.querySelector(".carousel-nav.next");
  const carousel = document.querySelector(".carousel");
  const carouselInner = document.querySelector(".carousel-inner");

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
      const isVisible =
        index >= currentPage && index < currentPage + projectsPerPage;
      page.style.display = isVisible ? "flex" : "none";
      page.setAttribute("aria-hidden", !isVisible);
    });

    // Update aria-live region to announce current page
    const currentProjects = projectsPages.slice(
      currentPage,
      currentPage + projectsPerPage
    );
    const projectTitles = currentProjects
      .map((page) => page.querySelector("h3").textContent)
      .join(", ");
    carousel.setAttribute("aria-live", "polite");
    carousel.setAttribute("aria-label", `Projets affichés : ${projectTitles}`);
  }

  // Navigation function to display the next/previous projects
  function navigateCarousel(direction, event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation(); // Empêche la propagation vers le gestionnaire de scroll
    }

    const maxPage = projectsPages.length - projectsPerPage;
    currentPage += direction * projectsPerPage;

    if (currentPage < 0) {
      currentPage = maxPage;
    } else if (currentPage > maxPage) {
      currentPage = 0;
    }

    displayProjects();
  }

  // Make carousel and buttons focusable
  carousel.setAttribute("tabindex", "0");
  [prevButton, nextButton].forEach((button) => {
    button.setAttribute("tabindex", "0");
    button.setAttribute("role", "button");
  });

  // Handle button clicks
  prevButton.addEventListener("click", (e) => navigateCarousel(-1, e));
  nextButton.addEventListener("click", (e) => navigateCarousel(1, e));

  // Handle keyboard navigation for buttons
  [prevButton, nextButton].forEach((button, index) => {
    button.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        navigateCarousel(index === 0 ? -1 : 1, event);
      }
    });
  });

  // Handle keyboard navigation for carousel
  document.addEventListener("keydown", (event) => {
    // Vérifier si le carousel ou un de ses enfants a le focus
    const isCarouselFocused =
      document.activeElement === carousel ||
      carousel.contains(document.activeElement) ||
      document.activeElement === prevButton ||
      document.activeElement === nextButton;

    if (isCarouselFocused) {
      switch (event.key) {
        case "ArrowLeft":
          navigateCarousel(-1, event);
          break;
        case "ArrowRight":
          navigateCarousel(1, event);
          break;
        case "Home":
          currentPage = 0;
          displayProjects();
          event.preventDefault();
          break;
        case "End":
          currentPage = projectsPages.length - projectsPerPage;
          displayProjects();
          event.preventDefault();
          break;
      }
    }
  });

  // Make project pages focusable
  projectsPages.forEach((page) => {
    page.setAttribute("tabindex", "0");
  });

  // Handle focus management
  carousel.addEventListener("focusin", () => {
    carousel.setAttribute("aria-activedescendant", `project-${currentPage}`);
  });

  // Initial focus on carousel
  carousel.focus();

  // Reset the display when the window is resized
  window.addEventListener("resize", updateProjectsPerPage);

  // Initialization
  displayProjects();
});
