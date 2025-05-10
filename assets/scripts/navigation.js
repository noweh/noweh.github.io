document.addEventListener("DOMContentLoaded", () => {
  let lastScrollY = 0;
  let ticking = false;
  const content = document.querySelector(".content");
  const introText = document.querySelector(".intro-text");
  const introElements = Array.from(
    document.querySelectorAll(
      ".intro-text .name, .intro-text .job, .profile-image, .keywords, .socials"
    )
  );
  const arrowDown = document.querySelector(".arrow-down");

  // Hide content initially
  content.style.opacity = 0;
  content.style.pointerEvents = "none"; // Prevent interaction initially
  arrowDown.style.opacity = 1; // Show the arrow initially

  // Function to show elements one by one
  const showElements = () => {
    introElements.forEach((element, index) => {
      setTimeout(() => {
        element.style.opacity = 1; // Show the element
        element.style.transform = "scale(1)"; // Reset the scale
      }, index * 700); // 1s delay between each element
    });
  };

  // Start showing elements
  showElements();

  // Add the active class after all elements have been shown
  setTimeout(() => {
    introText.classList.add("active");
  }, introElements.length * 300 + 500);

  // Calculate the total height of the intro elements
  const totalIntroHeight = introElements.reduce(
    (total, element) => total + element.offsetHeight,
    0
  );
  const extraScrollSpace = window.innerHeight * 0.5; // Add 50% of the window height as extra space
  const maxScrollHeight = totalIntroHeight + extraScrollSpace; // Total height plus extra space

  // Function to handle scrolling
  const onScroll = (scrollAmount) => {
    // Calculate the new scroll position
    lastScrollY += scrollAmount;

    // Ensure lastScrollY does not become negative and does not exceed the total height
    lastScrollY = Math.max(0, Math.min(lastScrollY, maxScrollHeight));

    // Adjust the opacity of the intro elements
    introElements.forEach((element, index) => {
      const fadeStart =
        (introElements.length - 1 - index) *
        (window.innerHeight / introElements.length);
      const fadeEnd =
        (introElements.length - index) *
        (window.innerHeight / introElements.length);
      let opacity = 1;

      if (lastScrollY > fadeStart) {
        opacity = 1 - (lastScrollY - fadeStart) / (fadeEnd - fadeStart);
      }
      if (lastScrollY > fadeEnd) {
        opacity = 0;
      }

      // Reappear when scrolling up
      if (lastScrollY < fadeEnd && lastScrollY > fadeStart) {
        opacity = (fadeEnd - lastScrollY) / (fadeEnd - fadeStart);
      }

      element.style.opacity = Math.max(opacity, 0);
    });

    // Check if the first element is hidden to make the arrow disappear
    const firstElement = introElements[0];
    const firstElementOpacity = getComputedStyle(firstElement).opacity;

    arrowDown.style.opacity = firstElementOpacity; // The arrow disappears with the first element

    // Use requestAnimationFrame to check opacity after applying styles
    requestAnimationFrame(() => {
      const allElementsHidden = introElements.every(
        (element) => parseFloat(getComputedStyle(element).opacity) === 0
      );
      if (allElementsHidden) {
        // Hide the content a bit earlier
        content.style.opacity = 1; // Show the content
        content.style.pointerEvents = "auto"; // Allow interaction
      } else {
        content.style.opacity = 0; // Hide the content
        content.style.pointerEvents = "none"; // Prevent interaction
      }
    });
  };

  // Handle wheel events
  document.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();
      if (!ticking) {
        window.requestAnimationFrame(() => {
          onScroll(event.deltaY);
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: false }
  );

  // Handle keyboard navigation
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "ArrowDown" ||
      event.key === "PageDown" ||
      event.key === " "
    ) {
      event.preventDefault();
      if (!ticking) {
        window.requestAnimationFrame(() => {
          onScroll(window.innerHeight * 0.8); // Smooth scroll down
          ticking = false;
        });
        ticking = true;
      }
    } else if (event.key === "ArrowUp" || event.key === "PageUp") {
      event.preventDefault();
      if (!ticking) {
        window.requestAnimationFrame(() => {
          onScroll(-window.innerHeight * 0.8); // Smooth scroll up
          ticking = false;
        });
        ticking = true;
      }
    } else if (event.key === "Home") {
      event.preventDefault();
      lastScrollY = 0;
      onScroll(0);
    } else if (event.key === "End") {
      event.preventDefault();
      lastScrollY = maxScrollHeight;
      onScroll(0);
    }
  });

  // Variables to track touch events
  let touchStartY = 0;
  let touchEndY = 0;

  // Listen to touch events
  document.addEventListener("touchstart", (event) => {
    touchStartY = event.touches[0].clientY;
  });

  document.addEventListener("touchmove", (event) => {
    touchEndY = event.touches[0].clientY;
    const scrollAmount = touchStartY - touchEndY;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        onScroll(scrollAmount);
        ticking = false;
      });
      ticking = true;
    }
  });

  document.addEventListener("touchend", () => {
    touchStartY = 0;
    touchEndY = 0;
  });
});
