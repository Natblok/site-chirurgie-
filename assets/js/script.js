(() => {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const header = document.getElementById("site-header");
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY >= 80);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("site-menu");
  const megaNavItem = document.querySelector("[data-nav-item-mega]");
  const megaMenu = megaNavItem?.querySelector(".mega-menu");
  const megaToggle = megaNavItem?.querySelector(".mega-toggle");
  let megaCloseTimer = null;

  const closeMenu = () => {
    if (!nav || !toggle) return;
    nav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  const openMenu = () => {
    if (!nav || !toggle) return;
    nav.classList.add("is-open");
    document.body.classList.add("nav-open");
    toggle.setAttribute("aria-expanded", "true");
  };

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      if (nav.classList.contains("is-open")) closeMenu();
      else openMenu();
    });
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.matchMedia("(max-width: 767px)").matches) closeMenu();
      });
    });
  }

  const closeMega = () => {
    if (!megaMenu || !megaToggle) return;
    megaMenu.classList.add("is-hidden");
    megaMenu.classList.remove("is-open");
    megaToggle.setAttribute("aria-expanded", "false");
  };

  const openMega = () => {
    if (!megaMenu || !megaToggle) return;
    megaMenu.classList.remove("is-hidden");
    megaMenu.classList.add("is-open");
    megaToggle.setAttribute("aria-expanded", "true");
  };

  if (header) {
    const updateMegaTop = () => {
      document.documentElement.style.setProperty(
        "--mega-top",
        `${header.offsetHeight}px`,
      );
    };
    window.addEventListener("resize", updateMegaTop);
    updateMegaTop();
  }

  if (megaNavItem && megaMenu && megaToggle) {
    const desktopQuery = window.matchMedia("(min-width: 768px)");

    megaNavItem.addEventListener("mouseenter", () => {
      if (!desktopQuery.matches) return;
      if (megaCloseTimer) window.clearTimeout(megaCloseTimer);
      openMega();
    });

    megaNavItem.addEventListener("mouseleave", () => {
      if (!desktopQuery.matches) return;
      megaCloseTimer = window.setTimeout(closeMega, 120);
    });

    megaMenu.addEventListener("mouseenter", () => {
      if (!desktopQuery.matches) return;
      if (megaCloseTimer) window.clearTimeout(megaCloseTimer);
    });

    megaMenu.addEventListener("mouseleave", () => {
      if (!desktopQuery.matches) return;
      megaCloseTimer = window.setTimeout(closeMega, 120);
    });

    megaToggle.addEventListener("click", () => {
      if (desktopQuery.matches) return;
      if (megaMenu.classList.contains("is-open")) closeMega();
      else openMega();
    });

    document.addEventListener("click", (event) => {
      if (!desktopQuery.matches) return;
      if (!megaNavItem.contains(event.target)) closeMega();
    });
  }

  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("a[data-nav]").forEach((link) => {
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  const beforeAfter = document.querySelector("[data-before-after]");
  if (beforeAfter) {
    const afterImage = beforeAfter.querySelector(".before-after__after");
    const handle = beforeAfter.querySelector(".before-after__handle");
    let isDragging = false;

    const setSplit = (clientX) => {
      const bounds = beforeAfter.getBoundingClientRect();
      const x = Math.min(Math.max(clientX - bounds.left, 0), bounds.width);
      const pct = (x / bounds.width) * 100;
      afterImage.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
      handle.style.left = `${pct}%`;
    };

    const startDrag = () => {
      isDragging = true;
    };

    const endDrag = () => {
      isDragging = false;
    };

    beforeAfter.addEventListener("mousedown", (event) => {
      startDrag();
      setSplit(event.clientX);
    });

    window.addEventListener("mousemove", (event) => {
      if (!isDragging) return;
      setSplit(event.clientX);
    });

    beforeAfter.addEventListener("touchstart", (event) => {
      startDrag();
      setSplit(event.touches[0].clientX);
    });

    window.addEventListener("touchmove", (event) => {
      if (!isDragging) return;
      setSplit(event.touches[0].clientX);
    });

    window.addEventListener("mouseup", endDrag);
    window.addEventListener("touchend", endDrag);
  }

  function initGsap() {
    if (reducedMotion) return;
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    if (document.body.classList.contains("page-home")) {
      gsap.from(".js-hero-label", {
        y: 12,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
      });
      gsap.from(".js-hero-line", {
        y: 40,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.15,
        delay: 0.15,
      });
      gsap.from(".js-hero-sub", {
        y: 20,
        opacity: 0,
        duration: 0.85,
        ease: "power2.out",
        delay: 0.55,
      });
      gsap.from(".js-hero-cta > *", {
        y: 20,
        opacity: 0,
        duration: 0.85,
        ease: "power2.out",
        delay: 0.65,
        stagger: 0.1,
      });
      gsap.from(".js-hero-meta > *", {
        y: 12,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.9,
        stagger: 0.1,
      });
      gsap.from(".js-hero-logo", {
        scale: 0.78,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        delay: 0.6,
      });

      const list = document.querySelector(".intervention-list");
      if (list) {
        gsap.from(".js-inter-row", {
          scrollTrigger: { trigger: list, start: "top 88%" },
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power2.out",
        });
      }

      document.querySelectorAll(".js-reveal-section").forEach((section) => {
        const items = section.querySelectorAll(".js-reveal");
        if (!items.length) return;
        gsap.from(items, {
          scrollTrigger: { trigger: section, start: "top 85%" },
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power2.out",
        });
      });

      gsap.utils.toArray(".js-title-reveal").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 88%" },
          y: 18,
          opacity: 0,
          duration: 1.0,
          ease: "power3.out",
        });
      });
    } else {
      document.querySelectorAll(".js-reveal").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 80%" },
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
        });
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initGsap);
  } else {
    initGsap();
  }

  /* ---- Carousel interventions ---- */
  function initIntervCarousel() {
    const carousel = document.getElementById("intervCarousel");
    if (!carousel) return;

    const pages = Array.from(
      carousel.querySelectorAll(".interv-carousel__page"),
    );
    const dots = Array.from(document.querySelectorAll(".interv-nav__dot"));
    const prev = document.getElementById("intervPrev");
    const next = document.getElementById("intervNext");
    let current = 0;

    function goTo(idx) {
      pages[current].classList.remove("is-active");
      dots[current].classList.remove("is-active");
      dots[current].setAttribute("aria-selected", "false");

      current = idx;

      pages[current].classList.add("is-active");
      dots[current].classList.add("is-active");
      dots[current].setAttribute("aria-selected", "true");

      if (prev) prev.disabled = current === 0;
      if (next) next.disabled = current === pages.length - 1;
    }

    if (prev)
      prev.addEventListener("click", () => {
        if (current > 0) goTo(current - 1);
      });
    if (next)
      next.addEventListener("click", () => {
        if (current < pages.length - 1) goTo(current + 1);
      });
    dots.forEach((dot, i) => dot.addEventListener("click", () => goTo(i)));

    /* swipe tactile */
    let touchStartX = 0;
    carousel.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.touches[0].clientX;
      },
      { passive: true },
    );
    carousel.addEventListener(
      "touchend",
      (e) => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) {
          if (diff > 0 && current < pages.length - 1) goTo(current + 1);
          else if (diff < 0 && current > 0) goTo(current - 1);
        }
      },
      { passive: true },
    );

    goTo(0);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initIntervCarousel);
  } else {
    initIntervCarousel();
  }
})();
