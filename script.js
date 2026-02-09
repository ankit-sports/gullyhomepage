// ==========================================
// GullyBall - Interactive JavaScript
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initMobileMenu();
  initFAQ();
  initScrollAnimations();
  initSmoothScroll();
  initCounterAnimations();
});

// ==========================================
// Navbar Scroll Effect
// ==========================================
function initNavbar() {
  const navbar = document.getElementById("navbar");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
}

// ==========================================
// Mobile Menu Toggle
// ==========================================
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const navLinks = document.getElementById("navLinks");

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenuBtn.classList.toggle("active");
      navLinks.classList.toggle("mobile-open");

      // Animate hamburger to X
      const spans = mobileMenuBtn.querySelectorAll("span");
      if (mobileMenuBtn.classList.contains("active")) {
        spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
        spans[1].style.opacity = "0";
        spans[2].style.transform = "rotate(-45deg) translate(7px, -6px)";
      } else {
        spans[0].style.transform = "none";
        spans[1].style.opacity = "1";
        spans[2].style.transform = "none";
      }
    });

    // Close mobile menu when clicking on a link
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenuBtn.classList.remove("active");
        navLinks.classList.remove("mobile-open");
        const spans = mobileMenuBtn.querySelectorAll("span");
        spans[0].style.transform = "none";
        spans[1].style.opacity = "1";
        spans[2].style.transform = "none";
      });
    });
  }
}

// ==========================================
// FAQ Accordion
// ==========================================
function initFAQ() {
  // FAQ items are handled by the toggleFaq function
}

function toggleFaq(button) {
  const faqItem = button.closest(".faq-item");
  const isActive = faqItem.classList.contains("active");

  // Close all FAQ items
  document.querySelectorAll(".faq-item").forEach((item) => {
    item.classList.remove("active");
  });

  // If the clicked item wasn't active, open it
  if (!isActive) {
    faqItem.classList.add("active");
  }
}

// ==========================================
// Scroll Animations (Intersection Observer)
// ==========================================
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements with animation classes
  const animatedElements = document.querySelectorAll(
    ".feature-card, .community-card, .diff-card, .faq-item, .section-header",
  );

  animatedElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });

  // Add stagger delay to grid items
  document
    .querySelectorAll(
      ".features-grid, .community-features, .diff-grid, .faq-grid",
    )
    .forEach((grid) => {
      const items = grid.children;
      Array.from(items).forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
      });
    });
}

// Add animate-in class styles
const style = document.createElement("style");
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    .nav-links.mobile-open {
        display: flex !important;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        flex-direction: column;
        background: rgba(10, 10, 15, 0.98);
        padding: 1rem;
        gap: 0.5rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .nav-links.mobile-open a {
        padding: 0.75rem 1rem;
        border-radius: 8px;
        transition: background 0.3s ease;
    }
    
    .nav-links.mobile-open a:hover {
        background: rgba(255, 255, 255, 0.05);
    }
`;
document.head.appendChild(style);

// ==========================================
// Smooth Scroll for Navigation Links
// ==========================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const navbarHeight = document.getElementById("navbar").offsetHeight;
        const targetPosition = targetElement.offsetTop - navbarHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

// ==========================================
// Counter Animations for Stats
// ==========================================
function initCounterAnimations() {
  const counters = document.querySelectorAll(".stat-number");

  const observerOptions = {
    threshold: 0.5,
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  counters.forEach((counter) => {
    counterObserver.observe(counter);
  });
}

function animateCounter(element) {
  const text = element.textContent;
  const hasPlus = text.includes("+");
  const hasStar = text.includes("★");

  if (hasStar) {
    // For rating like "4.8★"
    const target = parseFloat(text);
    animateValue(element, 0, target, 1500, (val) => val.toFixed(1) + "★");
  } else if (text.includes("M")) {
    // For numbers like "10M+"
    const target = parseInt(text);
    animateValue(element, 0, target, 1500, (val) => val + "M+");
  } else {
    // For numbers like "150+"
    const target = parseInt(text);
    animateValue(element, 0, target, 1500, (val) => val + "+");
  }
}

function animateValue(element, start, end, duration, formatter) {
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const current = start + (end - start) * easeOutQuart;

    element.textContent = formatter(Math.round(current * 10) / 10);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// ==========================================
// Live Score Animation (for demo)
// ==========================================
function initLiveScoreDemo() {
  const scoreElements = document.querySelectorAll(".team-score");

  if (scoreElements.length > 0) {
    // Simulate live score updates
    setInterval(() => {
      scoreElements.forEach((el) => {
        el.style.transform = "scale(1.1)";
        setTimeout(() => {
          el.style.transform = "scale(1)";
        }, 200);
      });
    }, 5000);
  }
}

// Initialize live score demo
setTimeout(initLiveScoreDemo, 2000);

// ==========================================
// Parallax Effect for Hero Section
// ==========================================
window.addEventListener("scroll", () => {
  const scrolled = window.scrollY;
  const hero = document.querySelector(".hero");
  const floatingBalls = document.querySelectorAll(".floating-ball");

  if (hero && scrolled < window.innerHeight) {
    floatingBalls.forEach((ball, index) => {
      const speed = 0.2 + index * 0.1;
      ball.style.transform = `translateY(${scrolled * speed}px)`;
    });
  }
});

// ==========================================
// Typing Effect for Hero Title (optional enhancement)
// ==========================================
function initTypingEffect() {
  const heroTitle = document.querySelector(".hero-title");
  if (!heroTitle) return;

  // This is optional - can be enabled if needed
  // heroTitle.innerHTML = heroTitle.innerHTML;
}

// ==========================================
// Hover Effects Enhancement
// ==========================================
document
  .querySelectorAll(".feature-card, .community-card, .diff-card")
  .forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });

// Add hover effect styles
const hoverStyles = document.createElement("style");
hoverStyles.textContent = `
    .feature-card::after,
    .community-card::after,
    .diff-card::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(
            600px circle at var(--mouse-x) var(--mouse-y),
            rgba(0, 212, 170, 0.06),
            transparent 40%
        );
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
        border-radius: inherit;
    }
    
    .feature-card:hover::after,
    .community-card:hover::after,
    .diff-card:hover::after {
        opacity: 1;
    }
`;
document.head.appendChild(hoverStyles);

// ==========================================
// Page Load Animation
// ==========================================
window.addEventListener("load", () => {
  document.body.classList.add("loaded");

  // Animate hero content
  const heroContent = document.querySelector(".hero-content");
  if (heroContent) {
    heroContent.style.opacity = "0";
    heroContent.style.transform = "translateY(30px)";

    setTimeout(() => {
      heroContent.style.transition = "opacity 0.8s ease, transform 0.8s ease";
      heroContent.style.opacity = "1";
      heroContent.style.transform = "translateY(0)";
    }, 100);
  }
});
