document.addEventListener("DOMContentLoaded", () => {
  const progress = getProgressCookie();
  document.querySelectorAll(".puzzle-link[data-level]").forEach((link) => {
    if (progress[link.dataset.level]) {
      link.classList.add("completed");
    }
  });
});
