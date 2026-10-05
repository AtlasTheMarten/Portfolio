/* Card tilt + cursor glow, and the phone menu toggle. */
(function () {
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("pointermove", e => {
      const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      card.style.setProperty("--mx", x * 100 + "%");
      card.style.setProperty("--my", y * 100 + "%");
      if (!still) card.style.transform = `rotateY(${(x - .5) * 10}deg) rotateX(${(.5 - y) * 10}deg)`;
    });
    card.addEventListener("pointerleave", () => { card.style.transform = ""; });
  });

  const nav = document.querySelector(".nav"), btn = document.querySelector(".menu-btn");
  if (nav && btn) {
    btn.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open);
    });
    nav.querySelectorAll(".nav-links a").forEach(a => a.addEventListener("click", () => {
      nav.classList.remove("open"); btn.setAttribute("aria-expanded", "false");
    }));
  }
})();
