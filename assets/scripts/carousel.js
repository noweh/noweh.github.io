document.addEventListener("DOMContentLoaded", function() {
    const projectsPages = Array.from(document.querySelectorAll(".project-page"));
    const prevButton = document.querySelector(".carousel-nav.prev");
    const nextButton = document.querySelector(".carousel-nav.next");

    let currentPage = 0;
    let projectsPerPage = window.innerWidth > 768 ? 2 : 1; // Par défaut

    // Fonction pour ajuster le nombre de projets visibles selon la taille de l'écran
    function updateProjectsPerPage() {
        projectsPerPage = window.innerWidth > 768 ? 2 : 1;
        displayProjects();
    }

    // Afficher les projets selon le nombre de projets par page
    function displayProjects() {
        projectsPages.forEach((page, index) => {
            page.style.display = (index >= currentPage && index < currentPage + projectsPerPage) ? "flex" : "none";
        });
    }

    // Fonction de navigation pour afficher les projets suivants/précédents
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

    // Écouter les clics des boutons de navigation
    prevButton.addEventListener("click", () => navigateCarousel(-1));
    nextButton.addEventListener("click", () => navigateCarousel(1));

    // Réinitialiser l'affichage quand la fenêtre est redimensionnée
    window.addEventListener("resize", updateProjectsPerPage);

    // Initialisation
    displayProjects();
});
