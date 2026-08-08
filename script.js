/* ============================================================
   gunaangs.github.io — progressive enhancement only.
   Nothing here is required for the page to be readable.
   ============================================================ */

(function () {
  "use strict";

  var root = document.documentElement;
  var STORAGE_KEY = "theme";

  /* ---------- Theme ---------- */

  function systemTheme() {
    return window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    var btn = document.getElementById("themeToggle");
    if (btn) {
      var next = theme === "dark" ? "light" : "dark";
      btn.setAttribute("aria-label", "Switch to " + next + " theme");
    }
  }

  var stored;
  try {
    stored = localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    stored = null;
  }
  applyTheme(stored || systemTheme());

  // Follow the OS while the user hasn't made an explicit choice.
  window
    .matchMedia("(prefers-color-scheme: light)")
    .addEventListener("change", function (e) {
      var saved = null;
      try {
        saved = localStorage.getItem(STORAGE_KEY);
      } catch (err) {
        /* storage blocked — fall through to following the OS */
      }
      if (!saved) applyTheme(e.matches ? "light" : "dark");
    });

  var toggle = document.getElementById("themeToggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch (e) {
        /* private mode — the choice just won't persist */
      }
    });
  }

  /* ---------- Reveal on scroll ---------- */

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealables = document.querySelectorAll(".reveal");

  if (reduced || !("IntersectionObserver" in window)) {
    revealables.forEach(function (el) {
      el.classList.add("is-in");
    });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealables.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ---------- Nav: border on scroll + active section ---------- */

  var nav = document.getElementById("nav");
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll(".nav__links a")
  );
  var sections = navLinks
    .map(function (a) {
      return document.querySelector(a.getAttribute("href"));
    })
    .filter(Boolean);

  var ticking = false;

  function onScroll() {
    if (nav) nav.classList.toggle("is-stuck", window.scrollY > 8);

    // The section whose top has most recently passed the nav line wins.
    var line = window.scrollY + 140;
    var current = null;
    sections.forEach(function (section) {
      if (section.offsetTop <= line) current = section;
    });

    navLinks.forEach(function (link) {
      var isActive =
        current !== null && link.getAttribute("href") === "#" + current.id;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    ticking = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(onScroll);
    },
    { passive: true }
  );
  onScroll();

  /* ---------- Footer year ---------- */

  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
