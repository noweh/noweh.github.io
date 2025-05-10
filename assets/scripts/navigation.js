document.addEventListener("DOMContentLoaded", () => {
  let lastScrollY = 0;
  let ticking = false;
  let resizeTimeout;
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
  content.style.pointerEvents = "none";
  arrowDown.style.opacity = 1;
  arrowDown.setAttribute("aria-hidden", "true");

  // Function to show elements one by one
  const showElements = () => {
    introElements.forEach((element, index) => {
      setTimeout(() => {
        element.style.opacity = 1;
        element.style.transform = "scale(1)";
        element.setAttribute("aria-hidden", "false");
      }, index * 700);
    });
  };

  showElements();

  setTimeout(() => {
    introText.classList.add("active");
  }, introElements.length * 300 + 500);

  // Calculate the total height of the intro elements
  const calculateHeights = () => {
    const totalIntroHeight = introElements.reduce(
      (total, element) => total + element.offsetHeight,
      0
    );
    const isMobile = window.innerWidth <= 768;
    const extraScrollSpace = isMobile
      ? window.innerHeight * 2
      : window.innerHeight * 0.5;
    return totalIntroHeight + extraScrollSpace;
  };

  let maxScrollHeight = calculateHeights();

  // Update heights on resize
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      maxScrollHeight = calculateHeights();
    }, 250);
  });

  // Function to handle scrolling
  const onScroll = (scrollAmount) => {
    lastScrollY += scrollAmount;
    lastScrollY = Math.max(0, Math.min(lastScrollY, maxScrollHeight));

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
      element.setAttribute("aria-hidden", opacity === 0 ? "true" : "false");
    });

    const firstElement = introElements[0];
    const firstElementOpacity = getComputedStyle(firstElement).opacity;

    arrowDown.style.opacity = firstElementOpacity;
    arrowDown.setAttribute(
      "aria-hidden",
      firstElementOpacity === "0" ? "true" : "false"
    );

    requestAnimationFrame(() => {
      const allElementsHidden = introElements.every(
        (element) => parseFloat(getComputedStyle(element).opacity) === 0
      );
      if (allElementsHidden) {
        content.style.opacity = 1;
        content.style.pointerEvents = "auto";
        content.setAttribute("aria-hidden", "false");
      } else {
        content.style.opacity = 0;
        content.style.pointerEvents = "none";
        content.setAttribute("aria-hidden", "true");
      }
    });
  };

  // Handle wheel events
  const handleWheel = (event) => {
    event.preventDefault();
    if (!ticking) {
      window.requestAnimationFrame(() => {
        onScroll(event.deltaY);
        ticking = false;
      });
      ticking = true;
    }
  };

  document.addEventListener("wheel", handleWheel, { passive: false });

  // Handle keyboard navigation
  const handleKeydown = (event) => {
    if (
      event.key === "ArrowDown" ||
      event.key === "PageDown" ||
      event.key === " "
    ) {
      event.preventDefault();
      if (!ticking) {
        window.requestAnimationFrame(() => {
          onScroll(window.innerHeight * 0.8);
          ticking = false;
        });
        ticking = true;
      }
    } else if (event.key === "ArrowUp" || event.key === "PageUp") {
      event.preventDefault();
      if (!ticking) {
        window.requestAnimationFrame(() => {
          onScroll(-window.innerHeight * 0.8);
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
  };

  document.addEventListener("keydown", handleKeydown);

  // Variables to track touch events
  let touchStartY = 0;
  let touchEndY = 0;

  // Listen to touch events
  const handleTouchStart = (event) => {
    touchStartY = event.touches[0].clientY;
  };

  const handleTouchMove = (event) => {
    touchEndY = event.touches[0].clientY;
    const scrollAmount = touchStartY - touchEndY;

    if (!ticking) {
      window.requestAnimationFrame(() => {
        onScroll(scrollAmount);
        ticking = false;
      });
      ticking = true;
    }
  };

  const handleTouchEnd = () => {
    touchStartY = 0;
    touchEndY = 0;
  };

  document.addEventListener("touchstart", handleTouchStart, { passive: true });
  document.addEventListener("touchmove", handleTouchMove, { passive: true });
  document.addEventListener("touchend", handleTouchEnd, { passive: true });

  // Cleanup function
  const cleanup = () => {
    document.removeEventListener("wheel", handleWheel);
    document.removeEventListener("keydown", handleKeydown);
    document.removeEventListener("touchstart", handleTouchStart);
    document.removeEventListener("touchmove", handleTouchMove);
    document.removeEventListener("touchend", handleTouchEnd);
    window.removeEventListener("resize", calculateHeights);
  };

  // Cleanup on page unload
  window.addEventListener("unload", cleanup);
});
