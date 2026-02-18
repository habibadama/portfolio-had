/**
 * Portfolio JavaScript
 * Organisation modulaire avec séparation des responsabilités
 */

// ===================================
// MODULE: DOM ELEMENTS
// ===================================
const DOM = {
  hamburger: document.querySelector(".hamburger"),
  navMenu: document.querySelector(".list-darkmode-menu ul"),
  themeToggle: document.getElementById("themeToggle"),
  backToTop: document.getElementById("backToTop"),
  body: document.body,
  projectContainer: document.querySelector(".project-container"),
  projectCards: document.querySelectorAll(".project-card"),
  carouselPrevBtn: document.querySelector(".prev-btn"),
  carouselNextBtn: document.querySelector(".next-btn"),
  carouselIndicators: document.querySelector(".carousel-indicators"),
  filterButtons: document.querySelectorAll('.filter-btn'),
  techCards: document.querySelectorAll('.tech-card'),
  progressBars: document.querySelectorAll('.progress-fill')
};

// ===================================
// MODULE: HAMBURGER MENU
// ===================================
const HamburgerMenu = {
  init() {
    if (!DOM.hamburger || !DOM.navMenu) return;
    
    this.bindEvents();
  },

  bindEvents() {
    DOM.hamburger.addEventListener("click", () => this.toggleMenu());
    
    // Fermer le menu quand on clique sur un lien
    document.querySelectorAll(".list-darkmode-menu ul li a").forEach((link) => {
      link.addEventListener("click", () => this.closeMenu());
    });

    // Fermer le menu quand on clique en dehors
    document.addEventListener("click", (event) => this.handleClickOutside(event));
  },

  toggleMenu() {
    DOM.hamburger.classList.toggle("active");
    DOM.navMenu.classList.toggle("active");
  },

  closeMenu() {
    DOM.hamburger.classList.remove("active");
    DOM.navMenu.classList.remove("active");
  },

  handleClickOutside(event) {
    const isClickInsideMenu = DOM.navMenu?.contains(event.target);
    const isClickOnHamburger = DOM.hamburger?.contains(event.target);

    if (!isClickInsideMenu && !isClickOnHamburger && DOM.navMenu?.classList.contains("active")) {
      this.closeMenu();
    }
  }
};

// ===================================
// MODULE: THEME MANAGER
// ===================================
const ThemeManager = {
  STORAGE_KEY: "theme",
  DARK_THEME: "theme-dark",
  LIGHT_THEME: "theme-light",

  init() {
    if (!DOM.themeToggle) return;
    
    this.loadSavedTheme();
    this.bindEvents();
  },

  bindEvents() {
    DOM.themeToggle.addEventListener("change", () => this.toggleTheme());
  },

  loadSavedTheme() {
    const savedTheme = localStorage.getItem(this.STORAGE_KEY);
    
    if (savedTheme === this.DARK_THEME) {
      this.applyDarkTheme();
    } else {
      this.applyLightTheme();
    }
  },

  applyDarkTheme() {
    DOM.body.classList.remove(this.LIGHT_THEME);
    DOM.body.classList.add(this.DARK_THEME);
    if (DOM.themeToggle) DOM.themeToggle.checked = true;
  },

  applyLightTheme() {
    DOM.body.classList.add(this.LIGHT_THEME);
    DOM.body.classList.remove(this.DARK_THEME);
    if (DOM.themeToggle) DOM.themeToggle.checked = false;
  },

  toggleTheme() {
    if (DOM.themeToggle.checked) {
      DOM.body.classList.replace(this.LIGHT_THEME, this.DARK_THEME);
      localStorage.setItem(this.STORAGE_KEY, this.DARK_THEME);
    } else {
      DOM.body.classList.replace(this.DARK_THEME, this.LIGHT_THEME);
      localStorage.setItem(this.STORAGE_KEY, this.LIGHT_THEME);
    }
  }
};

// ===================================
// MODULE: BACK TO TOP
// ===================================
const BackToTop = {
  SCROLL_THRESHOLD: 300,

  init() {
    if (!DOM.backToTop) return;
    
    this.bindEvents();
    this.checkInitialScroll();
  },

  bindEvents() {
    window.addEventListener("scroll", () => this.handleScroll());
    DOM.backToTop.addEventListener("click", () => this.scrollToTop());
    
    // Accessibilité clavier
    DOM.backToTop.addEventListener("keypress", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        this.scrollToTop();
      }
    });
  },

  handleScroll() {
    if (window.pageYOffset > this.SCROLL_THRESHOLD) {
      DOM.backToTop.classList.add("visible");
    } else {
      DOM.backToTop.classList.remove("visible");
    }
  },

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  },

  checkInitialScroll() {
    if (window.pageYOffset > this.SCROLL_THRESHOLD) {
      DOM.backToTop.classList.add("visible");
    }
  }
};

// ===================================
// MODULE: PROJECT CAROUSEL (Principal)
// ===================================
const ProjectCarousel = {
  currentIndex: 0,
  cardsPerView: 3,
  
  init() {
    const { projectCards, carouselPrevBtn, carouselNextBtn, carouselIndicators } = DOM;
    
    if (!projectCards.length || !carouselPrevBtn || !carouselNextBtn || !carouselIndicators) return;
    
    this.totalCards = projectCards.length;
    this.totalPages = Math.ceil(this.totalCards / this.cardsPerView);
    
    this.createIndicators();
    this.bindEvents();
    this.showCards();
  },

  createIndicators() {
    const { carouselIndicators } = DOM;
    
    for (let i = 0; i < this.totalPages; i++) {
      const dot = document.createElement("button");
      dot.className = "carousel-dot";
      dot.setAttribute("aria-label", `Aller à la page ${i + 1}`);
      if (i === 0) dot.classList.add("active");
      
      dot.addEventListener("click", () => this.goToPage(i));
      carouselIndicators.appendChild(dot);
    }
  },

  bindEvents() {
    const { carouselPrevBtn, carouselNextBtn } = DOM;
    
    carouselPrevBtn.addEventListener("click", () => this.prevPage());
    carouselNextBtn.addEventListener("click", () => this.nextPage());
    
    // Navigation clavier
    document.addEventListener("keydown", (e) => this.handleKeyNavigation(e));
  },

  showCards() {
    const { projectCards } = DOM;
    const startIndex = this.currentIndex * this.cardsPerView;
    const endIndex = startIndex + this.cardsPerView;

    projectCards.forEach((card, index) => {
      card.style.display = "none";
      card.classList.remove("active");
      
      if (index >= startIndex && index < endIndex) {
        card.style.display = "flex";
        setTimeout(() => {
          card.classList.add("active");
        }, (index - startIndex) * 100);
      }
    });

    this.updateIndicators();
    this.updateButtons();
  },

  updateIndicators() {
    const dots = document.querySelectorAll(".carousel-dot");
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === this.currentIndex);
    });
  },

  updateButtons() {
    const { carouselPrevBtn, carouselNextBtn } = DOM;
    carouselPrevBtn.disabled = this.currentIndex === 0;
    carouselNextBtn.disabled = this.currentIndex === this.totalPages - 1;
  },

  goToPage(pageIndex) {
    this.currentIndex = pageIndex;
    this.showCards();
  },

  prevPage() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.showCards();
    }
  },

  nextPage() {
    if (this.currentIndex < this.totalPages - 1) {
      this.currentIndex++;
      this.showCards();
    }
  },

  handleKeyNavigation(e) {
    if (e.key === "ArrowLeft" && this.currentIndex > 0) {
      this.currentIndex--;
      this.showCards();
    } else if (e.key === "ArrowRight" && this.currentIndex < this.totalPages - 1) {
      this.currentIndex++;
      this.showCards();
    }
  }
};

// ===================================
// MODULE: IMAGE CAROUSELS (Par projet)
// ===================================
const ImageCarousel = {
  AUTO_SLIDE_INTERVAL: 3000,
  
  init() {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => this.setupImageCarousel(card));
  },

  setupImageCarousel(card) {
    const container = card.querySelector('.project-image-container');
    if (!container) return;
    
    const images = container.querySelectorAll('.carousel-image');
    if (images.length <= 1) return;
    
    const elements = {
      container,
      images,
      prevBtn: container.querySelector('.prev-image'),
      nextBtn: container.querySelector('.next-image'),
      dots: container.querySelectorAll('.image-dot')
    };
    
    const state = {
      currentIndex: 0,
      intervalId: null,
      isHovering: false
    };
    
    this.bindImageCarouselEvents(elements, state);
    this.startAutoSlide(state);
    this.setupVisibilityObserver(card, state);
  },

  bindImageCarouselEvents(elements, state) {
    const { container, images, prevBtn, nextBtn, dots } = elements;
    
    // Fonction d'affichage
    const showImage = (index) => {
      // Gestion circulaire
      if (index < 0) index = images.length - 1;
      if (index >= images.length) index = 0;
      
      // Mise à jour des images
      images.forEach(img => img.classList.remove('active'));
      images[index].classList.add('active');
      
      // Mise à jour des indicateurs
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
      
      state.currentIndex = index;
    };

    // Navigation boutons
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showImage(state.currentIndex - 1);
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showImage(state.currentIndex + 1);
      });
    }
    
    // Navigation indicateurs
    dots.forEach((dot, index) => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        showImage(index);
      });
    });
    
    // Gestion survol
    container.addEventListener('mouseenter', () => {
      state.isHovering = true;
      this.stopAutoSlide(state);
    });
    
    container.addEventListener('mouseleave', () => {
      state.isHovering = false;
      this.startAutoSlide(state);
    });
    
    // Sauvegarde de showImage pour utilisation ultérieure
    state.showImage = showImage;
  },

  startAutoSlide(state) {
    if (state.intervalId) clearInterval(state.intervalId);
    state.intervalId = setInterval(() => {
      if (!state.isHovering && state.showImage) {
        state.showImage(state.currentIndex + 1);
      }
    }, this.AUTO_SLIDE_INTERVAL);
  },

  stopAutoSlide(state) {
    if (state.intervalId) {
      clearInterval(state.intervalId);
      state.intervalId = null;
    }
  },

  setupVisibilityObserver(card, state) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          this.stopAutoSlide(state);
        } else {
          this.startAutoSlide(state);
        }
      });
    }, { threshold: 0.1 });
    
    observer.observe(card);
  }
};

// ===================================
// MODULE: SKILLS
// ===================================
const SkillsManager = {
  init() {
    this.animateProgressBars();
    this.setupTechFilters();
    this.animateTechCards();
  },

  // Animation des barres de progression
  animateProgressBars() {
    DOM.progressBars.forEach(bar => {
      const level = bar.getAttribute('data-level');
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            bar.style.width = `${level}%`;
            bar.classList.add('animated');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      
      observer.observe(bar);
    });
  },

  // Filtrage des technologies
  setupTechFilters() {
    DOM.filterButtons.forEach(button => {
      button.addEventListener('click', () => this.filterTechCards(button));
    });
  },

  filterTechCards(activeButton) {
    // Mise à jour des boutons actifs
    DOM.filterButtons.forEach(btn => btn.classList.remove('active'));
    activeButton.classList.add('active');
    
    const filter = activeButton.getAttribute('data-filter');
    
    // Filtrage des cartes
    DOM.techCards.forEach(card => {
      const category = card.getAttribute('data-category');
      
      if (filter === 'all' || category === filter) {
        card.style.display = 'flex';
        card.style.animation = 'fadeInUp 0.4s ease forwards';
      } else {
        card.style.display = 'none';
      }
    });
  },

  // Animation des cartes technologiques
  animateTechCards() {
    DOM.techCards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.05}s`;
    });
  }
};

// ===================================
// MODULE: GLOBAL KEYBOARD SHORTCUTS
// ===================================
const KeyboardShortcuts = {
  init() {
    document.addEventListener("keydown", (e) => this.handleGlobalShortcuts(e));
  },

  handleGlobalShortcuts(e) {
    // Home ou Ctrl+Flèche haut pour retourner en haut
    if (e.key === "Home" || (e.key === "ArrowUp" && e.ctrlKey)) {
      e.preventDefault();
      BackToTop.scrollToTop();
    }
  }
};

// ===================================
// INITIALISATION GLOBALE
// ===================================
document.addEventListener('DOMContentLoaded', () => {
  // Initialisation de tous les modules
  HamburgerMenu.init();
  ThemeManager.init();
  BackToTop.init();
  ProjectCarousel.init();
  ImageCarousel.init();
  SkillsManager.init();
  KeyboardShortcuts.init();
  
  console.log('Portfolio JavaScript initialisé avec succès 🚀');
});

// ===================================
// UTILITAIRES (si nécessaire)
// ===================================
const Utils = {
  // Fonctions utilitaires génériques à ajouter si besoin
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};