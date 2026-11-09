/* =========================================================
   Nyaralás Balatonlellén — site scripts (vanilla JS, no deps)
   ========================================================= */
(function () {
  "use strict";

  var header = document.getElementById("header");
  var navToggle = document.querySelector(".nav-toggle");
  var navMenu = document.querySelector(".nav-menu");
  var backToTop = document.querySelector(".back-to-top");
  var navLinks = document.querySelectorAll(".nav-menu a[href^='#']");
  var sections = document.querySelectorAll("main section[id]");

  /* ---- header + back-to-top on scroll ---- */
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle("scrolled", y > 40);
    if (backToTop) backToTop.classList.toggle("show", y > 500);

    var current = "";
    sections.forEach(function (sec) {
      var top = sec.offsetTop - 140;
      if (y >= top) current = sec.id;
    });
    navLinks.forEach(function (a) {
      a.parentElement.classList.toggle("active", a.getAttribute("href") === "#" + current);
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- mobile nav ---- */
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      navMenu.classList.toggle("open");
      var icon = navToggle.querySelector("i");
      if (icon) icon.className = navMenu.classList.contains("open") ? "bx bx-x" : "bx bx-menu";
    });
    navLinks.forEach(function (a) {
      a.addEventListener("click", function () {
        navMenu.classList.remove("open");
        var icon = navToggle.querySelector("i");
        if (icon) icon.className = "bx bx-menu";
      });
    });
  }

  /* ---- back to top click ---- */
  if (backToTop) {
    backToTop.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---- reveal on scroll ---- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ---- gallery filter ---- */
  var filterButtons = document.querySelectorAll(".filters button");
  var galleryItems = document.querySelectorAll(".gallery-item");
  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterButtons.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      var filter = btn.getAttribute("data-filter");
      galleryItems.forEach(function (item) {
        var match = filter === "*" || item.getAttribute("data-category") === filter;
        item.classList.toggle("hide", !match);
      });
    });
  });

  /* ---- lightbox ---- */
  var lightbox = document.querySelector(".lightbox");
  if (lightbox && galleryItems.length) {
    var lbImg = lightbox.querySelector("img");
    var lbCap = lightbox.querySelector(".lb-cap");
    var visibleItems = function () {
      return Array.prototype.filter.call(galleryItems, function (el) {
        return !el.classList.contains("hide");
      });
    };
    var currentIndex = 0;

    function openLightbox(index) {
      var items = visibleItems();
      if (!items.length) return;
      currentIndex = ((index % items.length) + items.length) % items.length;
      var item = items[currentIndex];
      var img = item.querySelector("img");
      lbImg.src = img.getAttribute("src");
      lbCap.textContent = img.getAttribute("alt") || "";
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
    }
    function closeLightbox() {
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
    }
    function show(delta) {
      var items = visibleItems();
      var idx = items.indexOf(items[currentIndex]);
      openLightbox((idx === -1 ? 0 : idx) + delta);
    }

    galleryItems.forEach(function (item) {
      item.addEventListener("click", function () {
        var items = visibleItems();
        openLightbox(items.indexOf(item));
      });
    });
    lightbox.querySelector(".lb-close").addEventListener("click", closeLightbox);
    lightbox.querySelector(".lb-prev").addEventListener("click", function () { show(-1); });
    lightbox.querySelector(".lb-next").addEventListener("click", function () { show(1); });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") show(1);
      if (e.key === "ArrowLeft") show(-1);
    });
  }

  /* ---- footer year ---- */
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
