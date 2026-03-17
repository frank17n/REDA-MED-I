const dropdowns = document.querySelectorAll(".dropdown");

dropdowns.forEach(drop => {
  drop.addEventListener("click", () => {
    drop.classList.toggle("active");
  });
});