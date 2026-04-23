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
  /* Mémorise le parent d'origine du nav (dans le header) */
  const navParent = nav ? nav.parentElement : null;
  const megaNavItem = document.querySelector("[data-nav-item-mega]");
  const megaMenu = megaNavItem?.querySelector(".mega-menu");
  const megaToggle = megaNavItem?.querySelector(".mega-toggle");
  let megaCloseTimer = null;

  const closeMenu = () => {
    if (!nav || !toggle) return;
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
    nav.classList.remove("is-open");
    /* Remet le nav dans le header après la fin de l'animation slide-up */
    const onEnd = (e) => {
      if (e.propertyName !== "transform") return;
      nav.removeEventListener("transitionend", onEnd);
      if (navParent && nav.parentElement === document.body) {
        navParent.appendChild(nav);
      }
    };
    nav.addEventListener("transitionend", onEnd);
  };

  const openMenu = () => {
    if (!nav || !toggle) return;
    toggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("nav-open");
    /* Déplace le nav dans <body> pour échapper au containing-block du header
       (backdrop-filter webkit crée un containing-block qui empêche position:fixed
       de couvrir toute la largeur depuis l'intérieur du header) */
    if (window.matchMedia("(max-width: 767px)").matches) {
      document.body.appendChild(nav);
      /* Double requestAnimationFrame : laisse le navigateur peindre
         l'état initial (transform: -110%) avant de démarrer la transition */
      requestAnimationFrame(() =>
        requestAnimationFrame(() => nav.classList.add("is-open"))
      );
    } else {
      nav.classList.add("is-open");
    }
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
    /* Ferme en cliquant en dehors du panneau */
    document.addEventListener("click", (e) => {
      if (
        window.matchMedia("(max-width: 767px)").matches &&
        nav.classList.contains("is-open") &&
        !nav.contains(e.target) &&
        !toggle.contains(e.target)
      ) {
        closeMenu();
      }
    });
  }

  /* ── Injection d'icônes Lucide dans les liens du menu mobile ── */
  (function injectNavIcons() {
    if (!nav) return;
    const icons = {
      chirurgien:
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
      intervention:
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
      faq: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><circle cx="12" cy="17" r="1" fill="currentColor" stroke="none"/></svg>',
      contact:
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
    };
    nav.querySelectorAll("a[data-nav]").forEach((link) => {
      const text = link.textContent.trim().toLowerCase();
      let svg = null;
      if (text.includes("chirurgien")) svg = icons.chirurgien;
      else if (text.includes("intervention")) svg = icons.intervention;
      else if (text === "faq") svg = icons.faq;
      else if (text.includes("contact")) svg = icons.contact;
      if (svg) {
        const span = document.createElement("span");
        span.className = "nav-icon";
        span.setAttribute("aria-hidden", "true");
        span.innerHTML = svg;
        link.prepend(span);
      }
    });
  })();

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
