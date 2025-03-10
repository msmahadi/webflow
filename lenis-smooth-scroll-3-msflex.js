window.addEventListener("DOMContentLoaded", () => {
  let lenis = new Lenis({
    lerp: 0.1,
    wheelMultiplier: 1.2,
    gestureOrientation: "vertical",
    normalizeWheel: true, // Scroll fixing for overflow elements
    smoothTouch: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Fix for overflow: auto elements
  document.querySelectorAll("*").forEach((el) => {
    if (
      getComputedStyle(el).overflow === "auto" ||
      getComputedStyle(el).overflow === "scroll"
    ) {
      el.addEventListener(
        "wheel",
        (event) => {
          event.stopPropagation(); // Prevent Lenis from blocking inner scroll
        },
        { passive: true }
      );
    }
  });
});
