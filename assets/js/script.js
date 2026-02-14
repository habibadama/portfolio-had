const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".list-darkmode-menu ul");
const themeToggle = document.getElementById("themeToggle");
const body = document.body;

// --- TOGGLE HAMBURGER ---
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
});

// --- FERMER LE MENU QUAND ON CLIQUE SUR UN LIEN ---
document.querySelectorAll(".list-darkmode-menu ul li a").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
  });
});

// --- GESTION DES THÈMES ---
const currentTheme = localStorage.getItem("theme");

if (currentTheme === "theme-dark") {
  body.classList.remove("theme-light");
  body.classList.add("theme-dark");
  themeToggle.checked = true;
} else {
  body.classList.add("theme-light");
  body.classList.remove("theme-dark");
}

themeToggle.addEventListener("change", () => {
  if (themeToggle.checked) {
    body.classList.replace("theme-light", "theme-dark");
    localStorage.setItem("theme", "theme-dark");
  } else {
    body.classList.replace("theme-dark", "theme-light");
    localStorage.setItem("theme", "theme-light");
  }
});

// --- FERMER LE MENU QUAND ON CLIQUE EN DEHORS ---
document.addEventListener("click", (event) => {
  const isClickInsideMenu = navMenu.contains(event.target);
  const isClickOnHamburger = hamburger.contains(event.target);

  if (
    !isClickInsideMenu &&
    !isClickOnHamburger &&
    navMenu.classList.contains("active")
  ) {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
  }
});

// --- BOUTON RETOUR EN HAUT ---
const backToTopButton = document.getElementById("backToTop");

window.addEventListener("scroll", function () {
  if (backToTopButton) {
    if (window.pageYOffset > 300) {
      backToTopButton.classList.add("visible");
    } else {
      backToTopButton.classList.remove("visible");
    }
  }
});

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

if (backToTopButton) {
  backToTopButton.addEventListener("click", scrollToTop);
}

if (backToTopButton) {
  backToTopButton.addEventListener("keypress", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      scrollToTop();
    }
  });
}

document.addEventListener("keydown", function (e) {
  if (e.key === "Home" || (e.key === "ArrowUp" && e.ctrlKey)) {
    e.preventDefault();
    scrollToTop();
  }
});

// --- CAROUSEL POUR LES PROJETS ---
document.addEventListener("DOMContentLoaded", function () {
  const projectContainer = document.querySelector(".project-container");
  const projectCards = document.querySelectorAll(".project-card");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");
  const indicatorsContainer = document.querySelector(".carousel-indicators");
  
  if (projectCards.length > 0 && prevBtn && nextBtn && indicatorsContainer) {
    let currentIndex = 0;
    const cardsPerView = 3;
    const totalCards = projectCards.length;
    const totalPages = Math.ceil(totalCards / cardsPerView);

    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement("button");
      dot.className = "carousel-dot";
      dot.setAttribute("aria-label", `Aller à la page ${i + 1}`);
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => goToPage(i));
      indicatorsContainer.appendChild(dot);
    }

    function showCards() {
      const startIndex = currentIndex * cardsPerView;
      const endIndex = startIndex + cardsPerView;

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

      const dots = document.querySelectorAll(".carousel-dot");
      dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentIndex);
      });

      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex === totalPages - 1;
    }

    function goToPage(pageIndex) {
      currentIndex = pageIndex;
      showCards();
    }

    prevBtn.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        showCards();
      }
    });

    nextBtn.addEventListener("click", () => {
      if (currentIndex < totalPages - 1) {
        currentIndex++;
        showCards();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft" && currentIndex > 0) {
        currentIndex--;
        showCards();
      } else if (e.key === "ArrowRight" && currentIndex < totalPages - 1) {
        currentIndex++;
        showCards();
      }
    });

    showCards();
  }

  if (backToTopButton && window.pageYOffset > 300) {
    backToTopButton.classList.add("visible");
  }
});

// --- ANIMATION DES BARRES DE PROGRESSION AU SCROLL ---
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    progressBars.forEach(bar => {
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
}

// --- FILTRAGE DES TECHNOLOGIES ---
function setupTechFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const techCards = document.querySelectorAll('.tech-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            techCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'flex';
                    card.style.animation = 'fadeInUp 0.4s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// // --- INTERACTION ENTRE LES BARRES ET LES CARTES ---
// function setupSkillsInteraction() {
//     const techCards = document.querySelectorAll('.tech-card');
//     const skillItems = document.querySelectorAll('.skill-item');
    
//     techCards.forEach(card => {
//         card.addEventListener('mouseenter', function() {
//             const skillName = this.getAttribute('data-skill');
            
//             techCards.forEach(c => c.classList.remove('highlighted'));
//             skillItems.forEach(s => s.classList.remove('highlighted'));
            
//             this.classList.add('highlighted');
            
//             if (skillName) {
//                 skillItems.forEach(item => {
//                     const skillText = item.querySelector('.skill-name span:first-child').textContent.toLowerCase();
//                     if (skillText.includes(skillName) || skillName.includes(skillText)) {
//                         item.classList.add('highlighted');
//                     }
//                 });
//             }
//         });
        
//         card.addEventListener('mouseleave', function() {
//             techCards.forEach(c => c.classList.remove('highlighted'));
//             skillItems.forEach(s => s.classList.remove('highlighted'));
//         });
//     });
    
//     skillItems.forEach(item => {
//         item.addEventListener('mouseenter', function() {
//             const skillName = this.querySelector('.skill-name span:first-child').textContent.toLowerCase();
            
//             techCards.forEach(c => c.classList.remove('highlighted'));
//             skillItems.forEach(s => s.classList.remove('highlighted'));
            
//             this.classList.add('highlighted');
            
//             techCards.forEach(card => {
//                 const cardSkill = card.getAttribute('data-skill');
//                 if (cardSkill && (skillName.includes(cardSkill) || cardSkill.includes(skillName))) {
//                     card.classList.add('highlighted');
//                 }
//             });
//         });
        
//         item.addEventListener('mouseleave', function() {
//             techCards.forEach(c => c.classList.remove('highlighted'));
//             skillItems.forEach(s => s.classList.remove('highlighted'));
//         });
//     });
// }

// --- INITIALISATION DES FONCTIONNALITÉS ---
document.addEventListener('DOMContentLoaded', function() {
    animateProgressBars();
    setupTechFilters();
    // setupSkillsInteraction();
    
    const techCards = document.querySelectorAll('.tech-card');
    techCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.05}s`;
    });
});