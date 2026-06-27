// ==========================================================================
// OVATION — Events Browser Logic
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Shared Components
  // Use solid/dark header because this page doesn't have a dark hero
  window.OvationComponents.init({ overlayHeader: false });
  
  // 2. Initialize Events Browser
  initEventsBrowser();

  // 3. Initialize Global Animations
  window.OvationAnimations.init();
});

function initEventsBrowser() {
  if (!window.OvationData) return;

  const filterBar = document.getElementById('events-filter-bar');
  const grid = document.getElementById('events-grid');
  const countEl = document.getElementById('events-count');
  const noEventsMsg = document.getElementById('no-events-msg');
  
  if (!filterBar || !grid || !countEl || !noEventsMsg) return;

  // Get initial category from URL
  const urlParams = new URLSearchParams(window.location.search);
  const urlCategory = urlParams.get('category');
  
  const validCategory = window.OvationData.CATEGORIES.includes(urlCategory);
  let activeCategory = validCategory ? urlCategory : 'All';

  // Setup filters
  const filters = ['All', ...window.OvationData.CATEGORIES];

  function renderFilters() {
    filterBar.innerHTML = filters.map(f => {
      const isActive = f === activeCategory;
      const classes = `filter-btn ${isActive ? 'is-active' : ''}`;
      return `
        <button type="button" class="${classes}" data-category="${f}">
          ${f}
        </button>
      `;
    }).join('');

    // Attach click listeners
    const buttons = filterBar.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        activeCategory = btn.getAttribute('data-category');
        
        // Update URL without reloading (optional polish)
        const url = new URL(window.location);
        if (activeCategory === 'All') {
          url.searchParams.delete('category');
        } else {
          url.searchParams.set('category', activeCategory);
        }
        window.history.pushState({}, '', url);

        // Re-render
        renderFilters();
        renderEvents();
      });
    });
  }

  function renderEvents() {
    const allEvents = window.OvationData.EVENTS;
    const filteredEvents = activeCategory === 'All' 
      ? allEvents 
      : allEvents.filter(e => e.category === activeCategory);

    // Update count
    countEl.textContent = `${filteredEvents.length} ${filteredEvents.length === 1 ? 'event' : 'events'}`;

    if (filteredEvents.length > 0) {
      grid.classList.remove('hidden');
      noEventsMsg.classList.add('hidden');

      // Generate HTML
      grid.innerHTML = filteredEvents.map((event, i) => {
        const delay = Math.min(i * 60, 480);
        return `
          <div class="animate-reveal-up" style="animation-delay: ${delay}ms; opacity: 0; animation-fill-mode: forwards;">
            ${window.OvationComponents.renderEventCard(event)}
          </div>
        `;
      }).join('');

      // Setup lazy loading for newly inserted images
      window.OvationComponents.setupFadeImages();
    } else {
      grid.classList.add('hidden');
      grid.innerHTML = '';
      noEventsMsg.classList.remove('hidden');
    }
  }

  // Initial render
  renderFilters();
  renderEvents();
}
