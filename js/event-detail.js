// ==========================================================================
// OVATION — Event Detail Logic
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Shared Components
  // Use overlay header because event hero is dark
  window.OvationComponents.init({ overlayHeader: true });
  
  // 2. Initialize Event Detail Page
  initEventDetail();

  // 3. Initialize Global Animations
  window.OvationAnimations.init();
});

// State for the ticket selector
let eventData = null;
let quantities = {};
let isAddedToCart = false;

function initEventDetail() {
  const container = document.getElementById('event-content-container');
  if (!container || !window.OvationData) return;

  container.innerHTML = window.OvationComponents.renderEventDetailSkeleton();

  // Get slug from URL
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug');
  
  eventData = window.OvationData.getEvent(slug);

  if (!eventData) {
    container.innerHTML = `
      <div class="container py-32 text-center">
        <h1 class="font-display text-4xl text-foreground">Event not found</h1>
        <p class="mt-4 text-muted">The event you are looking for does not exist.</p>
        <a href="events.html" class="mt-8 btn btn--primary">Browse all events</a>
      </div>
    `;
    document.title = "Event not found | OVATION";
    return;
  }

  window.OvationData.setSelectedCity(eventData.city);

  // Update document title
  document.title = `${eventData.title} | OVATION`;

  // Format date
  const dateStr = window.OvationData.formatEventDate(eventData.date);

  // Get related events (same category, excluding current)
  const allEvents = window.OvationData.getEventsForCity(eventData.city);
  let related = allEvents.filter(e => e.category === eventData.category && e.slug !== eventData.slug).slice(0, 3);
  if (related.length === 0) {
    related = allEvents.filter(e => e.slug !== eventData.slug).slice(0, 3);
  }

  // Initialize quantities object
  eventData.tiers.forEach(t => { quantities[t.id] = 0; });

  requestAnimationFrame(() => {
    // Generate HTML
    container.innerHTML = `
    <!-- Hero banner -->
    <section class="event-hero">
      <img src="${eventData.image}" alt="${eventData.title}" class="event-hero__image" decoding="async" />
      <div class="event-hero__gradient"></div>
      <div class="event-hero__content">
        <span class="event-hero__category">${eventData.category}</span>
        <h1 class="event-hero__title">${eventData.title}</h1>
      </div>
    </section>

    <div class="event-detail">
      <a href="events.html?city=${encodeURIComponent(eventData.city)}" class="back-link">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon--md"><path d="m15 18-6-6 6-6"/></svg>
        All events
      </a>

      <div class="event-detail__grid">
        <!-- Details -->
        <div>
          <div class="event-meta">
            <div class="event-meta__item">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon--base event-meta__icon"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
              <span class="event-meta__text">${dateStr.full}</span>
            </div>
            <div class="event-meta__item">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon--base event-meta__icon"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span class="event-meta__text">Doors ${eventData.doors}</span>
            </div>
            <div class="event-meta__item">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon--base event-meta__icon"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              <span class="event-meta__text">${eventData.venue}, ${eventData.city}</span>
            </div>
          </div>

          <div class="mt-8">
            <h2 class="event-about__title">About this event</h2>
            <div class="event-about__text">
              ${eventData.description.map(p => `<p>${p}</p>`).join('')}
            </div>
          </div>

          ${eventData.lineup && eventData.lineup.length > 0 ? `
            <div class="event-lineup">
              <h2 class="event-lineup__title">Lineup</h2>
              <ul class="event-lineup__list">
                ${eventData.lineup.map(name => `<li class="event-lineup__tag">${name}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>

        <!-- Ticket Selector -->
        <div class="sticky-sidebar">
          <div class="ticket-selector" id="ticket-selector-container">
             <!-- Rendered dynamically -->
          </div>
        </div>
      </div>

      <!-- Related -->
      ${related.length > 0 ? `
        <div class="mt-20 pt-12 border-t border-border">
          <div data-reveal>
            <h2 class="font-display text-3xl text-foreground">You might also like</h2>
          </div>
          <div class="events-grid" data-reveal data-stagger="0.08">
            ${related.map(e => window.OvationComponents.renderEventCard(e)).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;

    // Initial render of ticket selector
    renderTicketSelector();
    
    // Setup fade images for related events
    window.OvationComponents.setupFadeImages();
    window.OvationAnimations?.initReveals?.();
  });
}

function renderTicketSelector() {
  const container = document.getElementById('ticket-selector-container');
  if (!container || !eventData) return;

  if (eventData.category === 'Movies') {
    container.innerHTML = `
      <div class="ticket-selector__header">
        <h2 class="ticket-selector__title">Book Tickets</h2>
      </div>
      <div class="p-5" style="padding: 1.5rem;">
        <button type="button" class="btn btn--primary btn--full" onclick="openTheatreModal()">Book Now</button>
      </div>
    `;
    return;
  }

  const total = eventData.tiers.reduce((sum, t) => sum + (quantities[t.id] || 0) * t.price, 0);
  const count = eventData.tiers.reduce((sum, t) => sum + (quantities[t.id] || 0), 0);
  
  let tiersHtml = '';
  
  eventData.tiers.forEach(tier => {
    const qty = quantities[tier.id] || 0;
    const soldOut = tier.available <= 0;
    
    tiersHtml += `
      <div class="ticket-tier">
        <div class="ticket-tier__info">
          <p class="ticket-tier__name">${tier.name}</p>
          <p class="ticket-tier__desc">${tier.description}</p>
          <p class="ticket-tier__price">${window.OvationData.formatCurrency(tier.price)}</p>
        </div>
        
        ${soldOut ? `
          <span class="ticket-tier__sold-out">Sold out</span>
        ` : `
          <div class="qty-control">
            <button type="button" class="qty-control__btn" onclick="updateQty('${tier.id}', ${qty - 1}, ${tier.available})" ${qty === 0 ? 'disabled' : ''} aria-label="Remove one ${tier.name}">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon--md"><path d="M5 12h14"/></svg>
            </button>
            <span class="qty-control__value">${qty}</span>
            <button type="button" class="qty-control__btn" onclick="updateQty('${tier.id}', ${qty + 1}, ${tier.available})" aria-label="Add one ${tier.name}">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon--md"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            </button>
          </div>
        `}
      </div>
    `;
  });

  const footerHtml = `
    <div class="ticket-selector__footer">
      <div class="ticket-selector__summary">
        <span class="ticket-selector__count">${count} ${count === 1 ? 'ticket' : 'tickets'}</span>
        <span class="ticket-selector__total">${window.OvationData.formatCurrency(total)}</span>
      </div>
      
      <div class="ticket-selector__actions">
        <button type="button" class="btn btn--dark btn--full" onclick="handleAdd(true)" ${count === 0 ? 'disabled' : ''}>
          Checkout
        </button>
        <button type="button" class="btn ${isAddedToCart ? 'btn--added' : 'btn--outline'} btn--full" onclick="handleAdd(false)" ${count === 0 ? 'disabled' : ''}>
          ${isAddedToCart ? `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon--md"><path d="M20 6 9 17l-5-5"/></svg>
            Added to cart
          ` : 'Add to cart'}
        </button>
      </div>
    </div>
  `;

  container.innerHTML = `
    <div class="ticket-selector__header">
      <h2 class="ticket-selector__title">Select tickets</h2>
    </div>
    <div class="ticket-selector__tiers">
      ${tiersHtml}
    </div>
    ${footerHtml}
  `;
}

// These need to be global so inline onclick handlers can access them
window.updateQty = function(tierId, qty, max) {
  isAddedToCart = false;
  // Ensure quantity is between 0 and max (capped at 8 for demo)
  quantities[tierId] = Math.max(0, Math.min(qty, Math.min(max, 8)));
  renderTicketSelector();
};

window.handleAdd = function(goToCheckout) {
  if (!window.OvationCart || !eventData) return;

  eventData.tiers.forEach(t => {
    const qty = quantities[t.id] || 0;
    if (qty > 0) {
      window.OvationCart.addLine({
        eventSlug: eventData.slug,
        eventTitle: eventData.title,
        eventImage: eventData.image,
        eventDate: eventData.date,
        venue: eventData.venue,
        city: eventData.city,
        tierId: t.id,
        tierName: t.name,
        price: t.price,
        quantity: qty
      });
    }
  });

  if (goToCheckout) {
    window.location.href = 'checkout.html';
  } else {
    isAddedToCart = true;
    // Reset quantities
    Object.keys(quantities).forEach(k => { quantities[k] = 0; });
    renderTicketSelector();
  }
};

// --- THEATRE SELECTION LOGIC ---
const THEATRES = [
  {
    name: "PVR Orion Mall",
    timings: ["11:00 AM", "4:00 PM", "9:00 PM"]
  },
  {
    name: "INOX Forum Mall",
    timings: ["9:00 AM", "6:00 PM", "10:00 PM"]
  },
  {
    name: "Cinepolis Nexus Mall",
    timings: ["12:30 PM", "5:30 PM", "8:30 PM"]
  }
];

window.openTheatreModal = function() {
  let modal = document.getElementById('theatre-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'theatre-modal';
    modal.className = 'theatre-modal-overlay';
    
    let theatresHtml = THEATRES.map((t, tIndex) => `
      <div class="theatre-card">
        <h3 class="theatre-card__name">${t.name}</h3>
        <div class="theatre-card__timings">
          ${t.timings.map((time, timeIndex) => `
            <button type="button" class="theatre-card__time-btn btn btn--outline" onclick="selectShowtime(${tIndex}, ${timeIndex})">${time}</button>
          `).join('')}
        </div>
      </div>
    `).join('');

    modal.innerHTML = `
      <div class="theatre-modal-content">
        <div class="theatre-modal-header">
          <h2>Select Theatre & Showtime</h2>
          <button type="button" class="theatre-modal-close" onclick="closeTheatreModal()">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        <div class="theatre-modal-body">
          ${theatresHtml}
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }
  
  // Force reflow for transition
  modal.offsetHeight;
  modal.classList.add('is-open');
};

window.closeTheatreModal = function() {
  const modal = document.getElementById('theatre-modal');
  if (modal) modal.classList.remove('is-open');
};

window.selectShowtime = function(theatreIndex, timeIndex) {
  const theatre = THEATRES[theatreIndex];
  const time = theatre.timings[timeIndex];
  try {
    if (eventData) {
      localStorage.setItem('selected_movie', JSON.stringify({
        slug: eventData.slug,
        title: eventData.title,
        city: eventData.city
      }));
    }
    localStorage.setItem('selected_theatre', theatre.name);
    localStorage.setItem('selected_showtime', time);
  } catch (e) {
    console.error("Could not save to localStorage", e);
  }
  
  closeTheatreModal();
  
  // Transition into seat selection interface
  setTimeout(() => {
    let url = 'seats.html';
    if (eventData) {
      url += `?slug=${encodeURIComponent(eventData.slug)}&theatre=${encodeURIComponent(theatre.name)}&time=${encodeURIComponent(time)}`;
    }
    window.location.href = url;
  }, 300);
};

