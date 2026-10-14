/**
 * Portfolio JavaScript — Version complète avec Scroll Reveal et Overlay mobile
 */

// ===================================
// MODULE: DOM ELEMENTS
// ===================================
const DOM = {
  hamburger: document.querySelector(".hamburger"),
  navMenu: document.querySelector(".list-darkmode-menu ul"),
  overlay: document.getElementById("overlay"),
  themeToggle: document.getElementById("themeToggle"),
  backToTop: document.getElementById("backToTop"),
  body: document.body,
  projectCards: document.querySelectorAll(".project-card"),
  carouselIndicators: document.querySelector(".carousel-indicators"),
  filterButtons: document.querySelectorAll('.filter-btn'),
  techCards: document.querySelectorAll('.tech-card'),
  progressBars: document.querySelectorAll('.progress-fill')
};

// ===================================
// MODULE: HAMBURGER MENU AVEC OVERLAY
// ===================================
const HamburgerMenu = {
  init() {
    if (!DOM.hamburger || !DOM.navMenu) return;
    
    this.overlay = DOM.overlay;
    this.bindEvents();
  },

  bindEvents() {
    DOM.hamburger.addEventListener("click", () => this.toggleMenu());

    // Fermer le menu quand on clique sur un lien
    document.querySelectorAll(".list-darkmode-menu ul li a").forEach(link => {
      link.addEventListener("click", () => this.closeMenu());
    });

    // Fermer le menu quand on clique sur l'overlay
    if (this.overlay) {
      this.overlay.addEventListener("click", () => this.closeMenu());
    }

    // Fermer le menu avec la touche Echap
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && DOM.navMenu?.classList.contains("active")) {
        this.closeMenu();
      }
    });

    document.addEventListener("click", e => this.handleClickOutside(e));
  },

  toggleMenu() {
    DOM.hamburger.classList.toggle("active");
    DOM.navMenu.classList.toggle("active");
    
    // Gérer l'overlay
    if (this.overlay) {
      if (DOM.navMenu.classList.contains("active")) {
        this.overlay.classList.add("active");
        // Empêcher le défilement du body quand le menu est ouvert
        DOM.body.style.overflow = "hidden";
      } else {
        this.overlay.classList.remove("active");
        DOM.body.style.overflow = "";
      }
    }
  },

  closeMenu() {
    DOM.hamburger.classList.remove("active");
    DOM.navMenu.classList.remove("active");
    
    // Fermer l'overlay
    if (this.overlay) {
      this.overlay.classList.remove("active");
      DOM.body.style.overflow = "";
    }
  },

  handleClickOutside(e) {
    const insideMenu = DOM.navMenu?.contains(e.target);
    const onHamburger = DOM.hamburger?.contains(e.target);
    const onOverlay = this.overlay?.contains(e.target);
    
    if (!insideMenu && !onHamburger && !onOverlay && DOM.navMenu?.classList.contains("active")) {
      this.closeMenu();
    }
  }
};

// ===================================
// MODULE: THEME MANAGER
// ===================================
const ThemeManager = {
  STORAGE_KEY: "theme",
  DARK: "theme-dark",
  LIGHT: "theme-light",

  init() {
    if (!DOM.themeToggle) return;
    this.loadSavedTheme();
    DOM.themeToggle.addEventListener("change", () => this.toggleTheme());
  },

  loadSavedTheme() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    saved === this.DARK ? this.applyDark() : this.applyLight();
  },

  applyDark() {
    DOM.body.classList.replace(this.LIGHT, this.DARK) || DOM.body.classList.add(this.DARK);
    if (DOM.themeToggle) DOM.themeToggle.checked = true;
  },

  applyLight() {
    DOM.body.classList.replace(this.DARK, this.LIGHT) || DOM.body.classList.add(this.LIGHT);
    if (DOM.themeToggle) DOM.themeToggle.checked = false;
  },

  toggleTheme() {
    if (DOM.themeToggle.checked) {
      DOM.body.classList.replace(this.LIGHT, this.DARK);
      localStorage.setItem(this.STORAGE_KEY, this.DARK);
    } else {
      DOM.body.classList.replace(this.DARK, this.LIGHT);
      localStorage.setItem(this.STORAGE_KEY, this.LIGHT);
    }
  }
};

// ===================================
// MODULE: BACK TO TOP
// ===================================
const BackToTop = {
  THRESHOLD: 300,

  init() {
    if (!DOM.backToTop) return;
    window.addEventListener("scroll", () => this.handleScroll());
    DOM.backToTop.addEventListener("click", () => this.scrollToTop());
    DOM.backToTop.addEventListener("keypress", e => {
      if (e.key === "Enter" || e.key === " ") this.scrollToTop();
    });
    this.handleScroll();
  },

  handleScroll() {
    DOM.backToTop.classList.toggle("visible", window.pageYOffset > this.THRESHOLD);
  },

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

// ===================================
// MODULE: PROJECT CAROUSEL (principal)
// ===================================
const ProjectCarousel = {
  currentIndex: 0,
  cardsPerView: 3,

  init() {
    const { projectCards, carouselIndicators } = DOM;
    if (!projectCards.length || !carouselIndicators) return;

    this.totalCards = projectCards.length;
    this.totalPages = Math.ceil(this.totalCards / this.cardsPerView);

    this.createIndicators();
    this.bindEvents();
    this.showCards();
  },

  createIndicators() {
    for (let i = 0; i < this.totalPages; i++) {
      const dot = document.createElement("button");
      dot.className = "carousel-dot" + (i === 0 ? " active" : "");
      dot.setAttribute("aria-label", `Page ${i + 1}`);
      dot.addEventListener("click", () => this.goToPage(i));
      DOM.carouselIndicators.appendChild(dot);
    }
  },

  bindEvents() {
    document.addEventListener("keydown", e => this.handleKeyNavigation(e));
  },

  showCards() {
    const start = this.currentIndex * this.cardsPerView;
    const end   = start + this.cardsPerView;

    DOM.projectCards.forEach((card, i) => {
      // Masque et réinitialise toutes les cartes
      card.style.display   = "none";
      card.style.opacity   = "0";
      card.style.transform = "translateY(25px)";
      card.style.transition = "none";
      card.classList.remove("active");

      if (i >= start && i < end) {
        // Rend la carte visible PUIS anime
        card.style.display = "flex";
        card.classList.add("active");
      }
    });

    this.updateIndicators();
    // Lance l'animation après que display:flex est appliqué
    // Le setTimeout laisse le navigateur calculer le layout
    setTimeout(() => ScrollReveal.animateProjectCards(), 30);
  },

  updateIndicators() {
    document.querySelectorAll(".carousel-dot").forEach((dot, i) => {
      dot.classList.toggle("active", i === this.currentIndex);
    });
  },

  goToPage(i) { this.currentIndex = i; this.showCards(); },
  prevPage()  { if (this.currentIndex > 0) { this.currentIndex--; this.showCards(); } },
  nextPage()  { if (this.currentIndex < this.totalPages - 1) { this.currentIndex++; this.showCards(); } },

  handleKeyNavigation(e) {
    if (e.key === "ArrowLeft")  this.prevPage();
    if (e.key === "ArrowRight") this.nextPage();
  }
};

// ===================================
// MODULE: IMAGE CAROUSELS (par projet)
// ===================================
const ImageCarousel = {
  AUTO_SLIDE_INTERVAL: 3000,

  init() {
    document.querySelectorAll('.project-card').forEach(card => this.setup(card));
  },

  setup(card) {
    const container = card.querySelector('.project-image-container');
    if (!container) return;

    const images = container.querySelectorAll('.carousel-image');
    if (images.length <= 1) return;

    const el = {
      images,
      prevBtn: container.querySelector('.prev-image'),
      nextBtn: container.querySelector('.next-image'),
      dots:    container.querySelectorAll('.image-dot')
    };

    const state = { currentIndex: 0, intervalId: null, isHovering: false };

    const show = (index) => {
      if (index < 0) index = images.length - 1;
      if (index >= images.length) index = 0;
      images.forEach(img => img.classList.remove('active'));
      images[index].classList.add('active');
      el.dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
      state.currentIndex = index;
    };

    el.prevBtn?.addEventListener('click', e => { e.stopPropagation(); show(state.currentIndex - 1); });
    el.nextBtn?.addEventListener('click', e => { e.stopPropagation(); show(state.currentIndex + 1); });
    el.dots.forEach((dot, i) => dot.addEventListener('click', e => { e.stopPropagation(); show(i); }));

    container.addEventListener('mouseenter', () => { state.isHovering = true; clearInterval(state.intervalId); });
    container.addEventListener('mouseleave', () => { state.isHovering = false; this.startAuto(state, show); });

    state.show = show;
    this.startAuto(state, show);

    new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) clearInterval(state.intervalId);
        else this.startAuto(state, show);
      });
    }, { threshold: 0.1 }).observe(card);
  },

  startAuto(state, show) {
    clearInterval(state.intervalId);
    state.intervalId = setInterval(() => {
      if (!state.isHovering) show(state.currentIndex + 1);
    }, this.AUTO_SLIDE_INTERVAL);
  }
};

// ===================================
// MODULE: SKILLS
// ===================================
const SkillsManager = {
  init() {
    this.animateProgressBars();
    this.setupFilters();
  },

  animateProgressBars() {
    DOM.progressBars.forEach(bar => {
      const level = bar.getAttribute('data-level');
      new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            bar.style.width = `${level}%`;
            entry.target.closest('.progress-bar') &&
              entry.target.classList.add('animated');
          }
        });
      }, { threshold: 0.5 }).observe(bar);
    });
  },

  setupFilters() {
    DOM.filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        DOM.filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        DOM.techCards.forEach(card => {
          const match = filter === 'all' || card.getAttribute('data-category') === filter;
          card.style.display = match ? 'flex' : 'none';
        });

        // Ré-anime les cartes visibles après le filtre
        setTimeout(() => {
          const visible = [...DOM.techCards].filter(c => c.style.display !== 'none');
          ScrollReveal.animateTechCards(visible);
        }, 40);
      });
    });
  }
};

// ===================================
// MODULE: SCROLL REVEAL
// Gère l'apparition au scroll de tous
// les blocs avec un effet ralenti
// ===================================
const ScrollReveal = {
  isMobile: window.matchMedia('(max-width: 639px)').matches,

  init() {
    setTimeout(() => {
      this.observeStandardElements();
      this.observeTechCards();
    }, 120);
  },

  // Observer générique — threshold très bas pour déclencher tôt
  // (important car les transitions durent 1.4s–1.6s)
  createObserver(callback, overrides = {}) {
    return new IntersectionObserver(callback, {
      threshold: 0.03,
      rootMargin: this.isMobile ? '0px 0px -10px 0px' : '0px 0px -30px 0px',
      ...overrides
    });
  },

  // ---- Éléments standards + titres h1 ----
  observeStandardElements() {
    const selectors = [
      '#about .container > h1',
      '#projects .container > h1',
      '#skills .container > h1',
      '.contact-header h1',
      '.hero-text',
      '.hero-image',
      '.about-content',
      '.about-infos',
      '.skill-category',
      '.skills-tech',
      '.contact-header',
      '.contact-form-wrapper'
    ];

    const observer = this.createObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    });

    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => observer.observe(el));
    });
  },

  // ---- Project cards ----
  // Gérées via JS inline car le carousel fait display:none → display:flex
  // ce qui reset toute transition CSS. Solution : on force l'état initial
  // en style inline, on attend un frame (reflow), puis on anime.
  animateProjectCards() {
    const activeCards = document.querySelectorAll('.project-card.active');

    activeCards.forEach((card, i) => {
      const delay = this.isMobile ? i * 120 : i * 160;

      // Étape 1 : état initial forcé en inline (écrase tout)
      card.style.transition = 'none';
      card.style.opacity    = '0';
      card.style.transform  = 'translateY(25px)';

      // Étape 2 : après un frame navigateur, active la transition
      setTimeout(() => {
        // getBoundingClientRect() force le reflow — sans ça le navigateur
        // "saute" directement à l'état final sans interpoler
        card.getBoundingClientRect();
        card.style.transition = `opacity 1.4s cubic-bezier(0.6, 0, 0.1, 1) ${delay}ms, transform 1.4s cubic-bezier(0.6, 0, 0.1, 1) ${delay}ms`;
        card.style.opacity    = '1';
        card.style.transform  = 'translateY(0)';
      }, 20);
    });
  },

  // ---- Tech cards (grille compétences) ----
  observeTechCards() {
    const techGrid = document.querySelector('.tech-grid');
    if (!techGrid) return;

    const observer = this.createObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const cards = [...techGrid.querySelectorAll('.tech-card')];
          this.animateTechCards(cards);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.03 });

    observer.observe(techGrid);
  },

  // Anime une liste de tech-cards en cascade
  animateTechCards(cards) {
    cards.forEach((card, i) => {
      const delay = this.isMobile ? i * 60 : i * 80;

      card.style.transition = 'none';
      card.style.opacity    = '0';
      card.style.transform  = 'translateY(10px)';

      setTimeout(() => {
        card.getBoundingClientRect();
        card.style.transition = `opacity ${this.isMobile ? '0.9s' : '1.1s'} cubic-bezier(0.6, 0, 0.1, 1) ${delay}ms, transform ${this.isMobile ? '0.9s' : '1.1s'} cubic-bezier(0.6, 0, 0.1, 1) ${delay}ms, border-color 0.3s ease, box-shadow 0.3s ease`;
        card.style.opacity    = '1';
        card.style.transform  = 'translateY(0)';
      }, 20);
    });
  }
};

// ===================================
// MODULE: ONGLETS COMPÉTENCES / PARCOURS
// ===================================
const SkillsTabs = {
  titles: { skills: "Mes Compétences", journey: "Mon Parcours" },

  init() {
    this.tabs = [...document.querySelectorAll(".skills-tab")];
    this.panels = document.querySelectorAll(".skills-panel");
    this.title = document.getElementById("skillsTitle");
    if (!this.tabs.length) return;

    this.tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => this.activate(tab.dataset.tab));
      // Navigation clavier (← →) — stopPropagation évite de changer aussi le carrousel de projets
      tab.addEventListener("keydown", e => {
        if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
        e.preventDefault();
        e.stopPropagation();
        const step = e.key === "ArrowRight" ? 1 : -1;
        const next = this.tabs[(i + step + this.tabs.length) % this.tabs.length];
        next.focus();
        this.activate(next.dataset.tab);
      });
    });
  },

  activate(name) {
    this.tabs.forEach(t => {
      const on = t.dataset.tab === name;
      t.classList.toggle("active", on);
      t.setAttribute("aria-selected", on);
      t.tabIndex = on ? 0 : -1;
    });
    this.panels.forEach(p => { p.hidden = p.dataset.panel !== name; });
    if (this.title) this.title.textContent = this.titles[name];
    if (name === "journey") JourneyReveal.play();

    // Si les boutons sont sortis de l'écran (ex. retour depuis un long parcours), on remonte
    const top = document.querySelector(".skills-tabs").getBoundingClientRect().top;
    if (top < 100) window.scrollBy({ top: top - 110, behavior: "smooth" });
  }
};

// ===================================
// MODULE: APPARITION DU PARCOURS
// ===================================
const JourneyReveal = {
  init() {
    this.items = document.querySelectorAll(".timeline-item, .cert-card");
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          this.observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
  },

  // Rejoue l'animation à chaque ouverture de l'onglet
  play() {
    this.items.forEach(el => { el.classList.remove("is-visible"); this.observer.unobserve(el); });
    requestAnimationFrame(() => requestAnimationFrame(() => {
      this.items.forEach(el => this.observer.observe(el));
    }));
  }
};

// ===================================
// MODULE: FENÊTRE DES CERTIFICATIONS
// ===================================
const CertModal = {
  init() {
    this.modal = document.getElementById("certModal");
    if (!this.modal) return;
    const $ = id => document.getElementById(id);
    this.el = {
      img: $("certModalImg"), placeholder: $("certModalPlaceholder"), title: $("certModalTitle"),
      issuer: $("certModalIssuer"), date: $("certModalDate"), credRow: $("certModalCredRow"),
      cred: $("certModalCred"), desc: $("certModalDesc"), link: $("certModalLink")
    };

    document.querySelectorAll(".cert-card").forEach(card => {
      card.addEventListener("click", () => this.open(card));
    });
    this.modal.addEventListener("click", e => { if (e.target.closest("[data-close]")) this.close(); });
    document.addEventListener("keydown", e => {
      if (this.modal.hidden) return;
      if (e.key === "Escape") this.close();
      if (e.key === "Tab") this.trapFocus(e);
    });
  },

  open(card) {
    const d = card.dataset, el = this.el;
    clearTimeout(this.timer);
    el.title.textContent = d.title || "";
    el.issuer.textContent = d.issuer || "";
    el.date.textContent = d.date || "";
    el.desc.textContent = d.desc || "";
    el.cred.textContent = d.credential || "";
    el.credRow.hidden = !d.credential;

    const showPlaceholder = () => { el.img.hidden = true; el.placeholder.hidden = false; };
    if (d.image) {
      el.img.onerror = showPlaceholder;
      el.img.alt = `Certificat : ${d.title}`;
      el.img.src = d.image;
      el.img.hidden = false;
      el.placeholder.hidden = true;
    } else {
      showPlaceholder();
    }

    el.link.hidden = !d.link;
    if (d.link) el.link.href = d.link;

    this.lastFocus = card;
    this.modal.hidden = false;
    document.body.classList.add("modal-open");
    requestAnimationFrame(() => this.modal.classList.add("open"));
    this.modal.querySelector(".cert-modal-close").focus();
  },

  close() {
    this.modal.classList.remove("open");
    document.body.classList.remove("modal-open");
    this.timer = setTimeout(() => { this.modal.hidden = true; }, 250);
    if (this.lastFocus) this.lastFocus.focus();
  },

  // Garde le focus clavier à l'intérieur de la fenêtre
  trapFocus(e) {
    const f = [...this.modal.querySelectorAll("a[href], button")].filter(x => x.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
};

// ===================================
// MODULE: KEYBOARD SHORTCUTS
// ===================================
const KeyboardShortcuts = {
  init() {
    document.addEventListener("keydown", e => {
      if (e.key === "Home" || (e.key === "ArrowUp" && e.ctrlKey)) {
        e.preventDefault();
        BackToTop.scrollToTop();
      }
    });
  }
};

// ===================================
// UTILITAIRES
// ===================================
const Utils = {
  debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
};

// ===================================
// INITIALISATION
// ===================================
document.addEventListener('DOMContentLoaded', () => {
  HamburgerMenu.init();
  ThemeManager.init();
  BackToTop.init();
  ProjectCarousel.init();
  ImageCarousel.init();
  SkillsManager.init();
  KeyboardShortcuts.init();
  ScrollReveal.init();
  SkillsTabs.init();
  JourneyReveal.init();
  CertModal.init();

  console.log('Portfolio initialisé avec overlay mobile 🚀');
});