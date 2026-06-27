// ==========================================================================
// OVATION — Shared Components & UI Rendering
// ==========================================================================

const Components = {
  // SVG Icons (replacing Lucide React)
  icons: {
    menu: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon--xl"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>`,
    x: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon--xl"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
    ticket: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon--md"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>`,
    ticketLg: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon--base nav-icon"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>`,
    home: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon--base nav-icon"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    compass: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon--base nav-icon"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
    arrowUp: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon--base nav-icon"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>`,
    arrowUpRight: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon--lg event-card__arrow"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>`,
    arrowRight: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon--md btn-icon"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
  },

  // Render the header
  renderHeader(overlay = false) {
    const isLight = overlay; // If overlay is true, initially light text
    const headerClass = isLight ? "site-header site-header--transparent site-header--light" : "site-header site-header--solid site-header--dark";
    const cartCount = window.OvationCart.itemCount;
    
    return `
      <header class="${headerClass}" id="main-header">
        <div class="site-header__inner">
          <a href="index.html" class="site-header__logo">OVATION</a>
          
          <nav class="site-header__nav">
            <a href="events.html" class="site-header__nav-link">Events</a>
            <a href="events.html?category=Music" class="site-header__nav-link">Music</a>
            <a href="events.html?category=Sports" class="site-header__nav-link">Sports</a>
            <a href="events.html?category=Arts" class="site-header__nav-link">Arts</a>
          </nav>

          <div class="site-header__actions">
            <a href="checkout.html" class="site-header__cart-btn" aria-label="View cart">
              ${this.icons.ticket}
              <span class="site-header__cart-label">Cart</span>
              <span class="cart-badge" id="header-cart-badge" style="display: ${cartCount > 0 ? 'flex' : 'none'}">${cartCount}</span>
            </a>

            <button type="button" class="site-header__menu-btn" id="mobile-menu-btn" aria-label="Toggle menu">
              ${this.icons.menu}
            </button>
          </div>
        </div>

        <div class="site-header__mobile-menu" id="mobile-menu">
          <nav class="site-header__mobile-nav">
            <a href="events.html" class="site-header__mobile-link">Events</a>
            <a href="events.html?category=Music" class="site-header__mobile-link">Music</a>
            <a href="events.html?category=Sports" class="site-header__mobile-link">Sports</a>
            <a href="events.html?category=Arts" class="site-header__mobile-link">Arts</a>
          </nav>
        </div>
      </header>
    `;
  },

  // Render the footer
  renderFooter() {
    const currentYear = new Date().getFullYear();
    const categories = window.OvationData ? window.OvationData.CATEGORIES.slice(0, 5) : ["Music", "Conference", "Comedy", "Arts", "Food"];
    
    const categoryLinks = categories.map(c => `
      <li>
        <a href="events.html?category=${c}" class="site-footer__link">${c}</a>
      </li>
    `).join('');

    return `
      <footer class="site-footer">
        <div class="site-footer__inner">
          <div class="site-footer__grid">
            <div>
              <p class="site-footer__brand-name">OVATION</p>
              <p class="site-footer__brand-desc">
                Tickets to everything. Discover and book the nights you'll remember, all in one place.
              </p>
            </div>

            <div>
              <p class="site-footer__section-title">Browse</p>
              <ul class="site-footer__links">
                ${categoryLinks}
              </ul>
            </div>

            <div>
              <p class="site-footer__section-title">Company</p>
              <ul class="site-footer__links">
                <li><a href="#" class="site-footer__link">About</a></li>
                <li><a href="#" class="site-footer__link">Sell Tickets</a></li>
                <li><a href="#" class="site-footer__link">Help Center</a></li>
                <li><a href="#" class="site-footer__link">Terms</a></li>
              </ul>
            </div>
          </div>

          <div class="site-footer__bottom">
            <p>© ${currentYear} Ovation Tickets. All rights reserved.</p>
            <p>A demo experience built on v0, converted to vanilla.</p>
          </div>
        </div>
      </footer>
    `;
  },

  // Render floating nav
  renderFloatingNav(activePath = '/') {
    const cartCount = window.OvationCart.itemCount;
    
    return `
      <div class="floating-nav-wrapper" id="floating-nav-wrapper">
        <nav class="floating-nav" id="floating-nav">
          <a href="index.html" class="floating-nav__link ${activePath === '/' || activePath === 'index.html' ? 'is-active' : ''}" aria-label="Home">
            ${this.icons.home}
            <span class="floating-nav__link-label">Home</span>
          </a>
          
          <a href="events.html" class="floating-nav__link ${activePath.includes('event') ? 'is-active' : ''}" aria-label="Events">
            ${this.icons.compass}
            <span class="floating-nav__link-label">Events</span>
          </a>
          
          <a href="checkout.html" class="floating-nav__link ${activePath === 'checkout.html' ? 'is-active' : ''}" aria-label="Cart">
            ${this.icons.ticketLg}
            <span class="floating-nav__link-label">Cart</span>
            <span class="cart-badge" id="floating-cart-badge" style="display: ${cartCount > 0 ? 'flex' : 'none'}">${cartCount}</span>
          </a>

          <span class="floating-nav__separator" aria-hidden="true"></span>

          <button type="button" id="scroll-to-top" aria-label="Back to top" class="floating-nav__top-btn">
            ${this.icons.arrowUp}
          </button>
        </nav>
      </div>
    `;
  },

  // Render a single event card
  renderEventCard(event) {
    if (!window.OvationData) return '';
    const date = window.OvationData.formatEventDate(event.date);
    const fromPrice = Math.min(...event.tiers.map((t) => t.price));

    return `
      <a href="event.html?slug=${event.slug}" class="event-card group">
        <div class="event-card__image-wrap">
          <div class="fade-image-wrap" data-fade-image>
            <img 
              src="${event.image}" 
              alt="${event.title}" 
              class="event-card__image fade-image" 
              loading="lazy"
            />
          </div>
          <div class="event-card__date">
            <span class="event-card__date-month">${date.month}</span>
            <span class="event-card__date-day">${date.day}</span>
          </div>
          <span class="event-card__category">${event.category}</span>
        </div>

        <div class="event-card__info">
          <div>
            <h3 class="event-card__title">${event.title}</h3>
            <p class="event-card__venue">${event.venue} · ${event.city}</p>
          </div>
          ${this.icons.arrowUpRight}
        </div>
        
        <p class="event-card__price">
          From <strong>$${fromPrice}</strong>
        </p>
      </a>
    `;
  },

  // Initialize shared UI elements
  init(opts = {}) {
    // 1. Render Header
    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
      headerContainer.innerHTML = this.renderHeader(opts.overlayHeader);
    }

    // 2. Render Footer
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
      footerContainer.innerHTML = this.renderFooter();
    }

    // 3. Render Floating Nav
    const navContainer = document.getElementById('floating-nav-container');
    if (navContainer) {
      const path = window.location.pathname.split('/').pop() || 'index.html';
      navContainer.innerHTML = this.renderFloatingNav(path);
    }

    // 4. Setup Header logic
    this.setupHeader(opts.overlayHeader);
    
    // 5. Setup Floating Nav logic
    this.setupFloatingNav();

    // 6. Setup Cart listeners to update badges
    this.setupCartListeners();

    // 7. Setup Image lazy loading/fading
    this.setupFadeImages();
  },

  setupHeader(isOverlay) {
    const header = document.getElementById('main-header');
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    let isMenuOpen = false;

    if (!header) return;

    // Scroll effect
    if (isOverlay) {
      const handleScroll = () => {
        if (window.scrollY > 30) {
          header.classList.remove('site-header--transparent', 'site-header--light');
          header.classList.add('site-header--solid', 'site-header--dark');
        } else {
          header.classList.add('site-header--transparent', 'site-header--light');
          header.classList.remove('site-header--solid', 'site-header--dark');
        }
      };
      
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); // Init
    }

    // Mobile menu toggle
    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
          mobileMenu.classList.add('is-open');
          menuBtn.innerHTML = this.icons.x;
          // Force solid header when menu is open
          header.classList.remove('site-header--transparent', 'site-header--light');
          header.classList.add('site-header--solid', 'site-header--dark');
        } else {
          mobileMenu.classList.remove('is-open');
          menuBtn.innerHTML = this.icons.menu;
          // Re-evaluate scroll position for header style
          if (isOverlay && window.scrollY <= 30) {
            header.classList.add('site-header--transparent', 'site-header--light');
            header.classList.remove('site-header--solid', 'site-header--dark');
          }
        }
      });
    }
  },

  setupFloatingNav() {
    const wrapper = document.getElementById('floating-nav-wrapper');
    const nav = document.getElementById('floating-nav');
    const topBtn = document.getElementById('scroll-to-top');

    if (!wrapper || !nav) return;

    // Visibility on scroll
    const handleScroll = () => {
      const isVisible = window.scrollY > window.innerHeight * 0.6;
      if (isVisible) {
        wrapper.classList.add('is-visible');
        if (window.gsap) {
          gsap.to(nav, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" });
        } else {
          nav.style.transform = 'translateY(0)';
          nav.style.opacity = '1';
        }
      } else {
        wrapper.classList.remove('is-visible');
        if (window.gsap) {
          gsap.to(nav, { y: 120, opacity: 0, duration: 0.5, ease: "power3.out" });
        } else {
          nav.style.transform = 'translateY(120px)';
          nav.style.opacity = '0';
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Init

    // Scroll to top
    if (topBtn) {
      topBtn.addEventListener('click', () => {
        if (window.lenis) {
          window.lenis.scrollTo(0);
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }
  },

  setupCartListeners() {
    if (!window.OvationCart) return;
    
    window.OvationCart.subscribe((cart) => {
      const count = cart.itemCount;
      const headerBadge = document.getElementById('header-cart-badge');
      const floatBadge = document.getElementById('floating-cart-badge');

      if (headerBadge) {
        headerBadge.style.display = count > 0 ? 'flex' : 'none';
        headerBadge.textContent = count;
      }

      if (floatBadge) {
        floatBadge.style.display = count > 0 ? 'flex' : 'none';
        floatBadge.textContent = count;
        
        // Pop animation if gsap available
        if (count > 0 && window.gsap && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          gsap.fromTo(
            floatBadge,
            { scale: 0.4 },
            { scale: 1, duration: 0.45, ease: "back.out(3)" }
          );
        }
      }
    });
  },

  setupFadeImages() {
    const images = document.querySelectorAll('[data-fade-image] img');
    if (!images.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            
            // Wait for load if not already complete
            if (img.complete) {
              img.classList.add('is-loaded');
            } else {
              img.onload = () => img.classList.add('is-loaded');
            }
            
            observer.unobserve(img);
          }
        });
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    images.forEach(img => observer.observe(img));
  }
};

window.OvationComponents = Components;
