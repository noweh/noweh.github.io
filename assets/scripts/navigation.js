document.addEventListener('DOMContentLoaded', () => {
    let lastScrollY = 0;
    let ticking = false;
    const content = document.querySelector('.content');
    const introText = document.querySelector('.intro-text');
    const introElements = Array.from(document.querySelectorAll('.intro-text .name, .intro-text .job, .profile-image, .keywords, .socials'));
    const arrowDown = document.querySelector('.arrow-down');

    // Masque le contenu au départ
    content.style.opacity = 0;
    content.style.pointerEvents = 'none'; // Empêche l'interaction au départ
    arrowDown.style.opacity = 1; // Affiche la flèche au départ

    // Fonction pour faire apparaître les éléments un par un
    const showElements = () => {
        introElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = 1; // Affiche l'élément
                element.style.transform = 'scale(1)'; // Réinitialise le scale
            }, index * 300); // Délai de 300ms entre chaque élément
        });
    };

    // Lancer l'affichage des éléments
    showElements();

    // Ajouter la classe active après que tous les éléments aient été affichés
    setTimeout(() => {
        introText.classList.add('active');
    }, introElements.length * 300 + 500);

    // Calcule la hauteur totale des éléments d'introduction
    const totalIntroHeight = introElements.reduce((total, element) => total + element.offsetHeight, 0);
    const extraScrollSpace = window.innerHeight * 0.5; // Ajout de 50% de la hauteur de la fenêtre comme espace supplémentaire
    const maxScrollHeight = totalIntroHeight + extraScrollSpace; // Hauteur totale plus espace supplémentaire

    // Fonction pour gérer le scroll
    const onScroll = (event) => {
        const scrollAmount = event.deltaY;

        // Calcule la nouvelle position de défilement
        lastScrollY += scrollAmount;

        // S'assure que lastScrollY ne devient pas négatif et ne dépasse pas la hauteur totale
        lastScrollY = Math.max(0, Math.min(lastScrollY, maxScrollHeight));

        // Ajuste l'opacité des éléments de l'intro
        introElements.forEach((element, index) => {
            const fadeStart = (introElements.length - 1 - index) * (window.innerHeight / introElements.length);
            const fadeEnd = (introElements.length - index) * (window.innerHeight / introElements.length);
            let opacity = 1;

            if (lastScrollY > fadeStart) {
                opacity = 1 - (lastScrollY - fadeStart) / (fadeEnd - fadeStart);
            }
            if (lastScrollY > fadeEnd) {
                opacity = 0;
            }

            // Réapparition en scrollant vers le haut
            if (lastScrollY < fadeEnd && lastScrollY > fadeStart) {
                opacity = (fadeEnd - lastScrollY) / (fadeEnd - fadeStart);
            }

            element.style.opacity = Math.max(opacity, 0);
        });

        // Vérifiez si le premier élément est caché pour faire disparaître la flèche
        const firstElement = introElements[0];
        const firstElementOpacity = getComputedStyle(firstElement).opacity;

        arrowDown.style.opacity = firstElementOpacity; // La flèche disparaît avec le premier élément

        // Utiliser requestAnimationFrame pour vérifier l'opacité après l'application des styles
        requestAnimationFrame(() => {
            const allElementsHidden = introElements.every(element => parseFloat(getComputedStyle(element).opacity) === 0);
            if (allElementsHidden) { // Cache le contenu un peu avant
                content.style.opacity = 1; // Montre le contenu
                content.style.pointerEvents = 'auto'; // Permet l'interaction
            } else {
                content.style.opacity = 0; // Cache le contenu
                content.style.pointerEvents = 'none'; // Empêche l'interaction
            }
        });
    };

    // Écoutez l'événement de défilement
    document.addEventListener('wheel', (event) => {
        event.preventDefault();
        if (!ticking) {
            window.requestAnimationFrame(() => {
                onScroll(event);
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: false });
});
