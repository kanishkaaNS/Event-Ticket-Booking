// ==========================================================================
// OVATION — Seat Selection Logic
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  window.OvationComponents.init();

  const maxSeats = 6;
  let selectedSeats = [];
  
  // Sections configuration
  // Premium: Rows A, B (Front rows, higher-priced)
  // Standard: Rows C, D (Middle rows)
  // Economy: Rows E, F (Back rows, lower-priced)
  // Each row has 12 seats (6 left, aisle, 6 right)
  
  const sections = [
    {
      id: 'premium',
      name: 'Premium',
      price: 500,
      rows: ['A', 'B'] // Front
    },
    {
      id: 'standard',
      name: 'Standard',
      price: 350,
      rows: ['C', 'D'] // Middle
    },
    {
      id: 'economy',
      name: 'Economy',
      price: 200,
      rows: ['E', 'F'] // Back
    }
  ];

  const seatsPerRow = 12; // 1 to 12
  const aisleAfter = 6; // Aisle after seat 6

  // Hardcoded predefined recommended seats (near middle: Row C and D, seats 5-8)
  const recommendedSeatIds = ['C5', 'C6', 'C7', 'C8', 'D5', 'D6', 'D7', 'D8'];
  
  // Hardcoded booked seats
  const bookedSeatIds = ['F1', 'F2', 'E5', 'E6', 'D7', 'D8', 'A1', 'A2', 'A3', 'C7']; 

  const seatMap = document.getElementById('seat-map');
  
  // Load data from localStorage or URL params
  const urlParams = new URLSearchParams(window.location.search);
  const urlSlug = urlParams.get('slug');
  const urlTheatre = urlParams.get('theatre');
  const urlTime = urlParams.get('time');

  let movieData, theatreName, showtime;
  try {
    movieData = JSON.parse(localStorage.getItem('selected_movie'));
    theatreName = localStorage.getItem('selected_theatre');
    showtime = localStorage.getItem('selected_showtime');
  } catch (e) {}

  if (!movieData && urlSlug && window.OvationData) {
    movieData = window.OvationData.getEvent(urlSlug);
  }
  theatreName = theatreName || urlTheatre || 'Unknown Theatre';
  showtime = showtime || urlTime || 'Unknown Time';

  if (movieData) {
    document.getElementById('movie-title').textContent = movieData.title;
    document.getElementById('theatre-info').textContent = `${theatreName} | ${showtime} | ${movieData.city}`;
    document.getElementById('back-btn').href = `event.html?slug=${movieData.slug}`;
    document.title = `Select Seats - ${movieData.title} | OVATION`;
  } else {
    // Fallback if accessed directly
    document.getElementById('movie-title').textContent = 'Select Seats';
    document.getElementById('theatre-info').textContent = `${theatreName} | ${showtime}`;
  }

  // Render seats
  function renderSeats() {
    seatMap.innerHTML = '';
    
    sections.forEach(section => {
      const sectionDiv = document.createElement('div');
      sectionDiv.className = 'seat-section';
      
      const sectionTitle = document.createElement('div');
      sectionTitle.className = 'seat-section__title';
      sectionTitle.textContent = `${section.name} - ${window.OvationData ? window.OvationData.formatCurrency(section.price) : 'INR ' + section.price}`;
      sectionDiv.appendChild(sectionTitle);
      
      section.rows.forEach(rowId => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'seat-row';
        
        // Row Label Left
        const labelLeft = document.createElement('div');
        labelLeft.className = 'seat-row__label';
        labelLeft.textContent = rowId;
        rowDiv.appendChild(labelLeft);
        
        // Left Group (Seats 1 to aisleAfter)
        const leftGroup = document.createElement('div');
        leftGroup.className = 'seat-group';
        
        for (let i = 1; i <= aisleAfter; i++) {
          leftGroup.appendChild(createSeat(rowId, i, section.price));
        }
        rowDiv.appendChild(leftGroup);
        
        // Right Group (Seats aisleAfter+1 to seatsPerRow)
        const rightGroup = document.createElement('div');
        rightGroup.className = 'seat-group';
        
        for (let i = aisleAfter + 1; i <= seatsPerRow; i++) {
          rightGroup.appendChild(createSeat(rowId, i, section.price));
        }
        rowDiv.appendChild(rightGroup);
        
        // Row Label Right
        const labelRight = document.createElement('div');
        labelRight.className = 'seat-row__label';
        labelRight.textContent = rowId;
        rowDiv.appendChild(labelRight);
        
        sectionDiv.appendChild(rowDiv);
      });
      
      seatMap.appendChild(sectionDiv);
    });
  }

  function createSeat(row, num, price) {
    const seatId = `${row}${num}`;
    const isBooked = bookedSeatIds.includes(seatId);
    
    // If a recommended seat becomes booked, it automatically loses its recommended status
    const isRecommended = !isBooked && recommendedSeatIds.includes(seatId);
    const isSelected = selectedSeats.some(s => s.id === seatId);
    
    const seatBtn = document.createElement('div');
    seatBtn.className = 'seat';
    seatBtn.textContent = num;
    seatBtn.dataset.id = seatId;
    seatBtn.dataset.price = price;
    
    if (isBooked) {
      seatBtn.classList.add('seat--booked');
    } else if (isSelected) {
      seatBtn.classList.add('seat--selected');
    } else {
      seatBtn.classList.add('seat--available');
      if (isRecommended) {
        seatBtn.classList.add('seat--recommended');
      }
    }
    
    seatBtn.addEventListener('click', () => handleSeatClick(seatId, price, isBooked));
    
    return seatBtn;
  }

  function handleSeatClick(id, price, isBooked) {
    if (isBooked) return;
    
    const index = selectedSeats.findIndex(s => s.id === id);
    if (index > -1) {
      // Deselect
      selectedSeats.splice(index, 1);
    } else {
      // Select
      if (selectedSeats.length >= maxSeats) {
        alert(`You can select a maximum of ${maxSeats} seats.`);
        return;
      }
      selectedSeats.push({ id, price });
    }
    
    updateUI();
  }

  function updateUI() {
    // Update seats visually without re-rendering everything
    document.querySelectorAll('.seat[data-id]').forEach(seat => {
      const id = seat.dataset.id;
      const isBooked = bookedSeatIds.includes(id);
      
      if (!isBooked) {
        if (selectedSeats.some(s => s.id === id)) {
          seat.classList.add('seat--selected');
          seat.classList.remove('seat--available', 'seat--recommended');
        } else {
          seat.classList.remove('seat--selected');
          seat.classList.add('seat--available');
          if (recommendedSeatIds.includes(id)) {
            seat.classList.add('seat--recommended');
          }
        }
      }
    });
    
    // Update Summary
    const count = selectedSeats.length;
    const total = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
    
    document.getElementById('ticket-count').textContent = count;
    document.getElementById('selected-seats-list').textContent = count > 0 ? selectedSeats.map(s => s.id).join(', ') : 'None';
    
    const formatCurr = window.OvationData ? window.OvationData.formatCurrency : (val) => 'INR ' + val;
    document.getElementById('total-price').textContent = formatCurr(total);
    
    // Update Breakdown
    const breakdownContainer = document.getElementById('price-breakdown');
    breakdownContainer.innerHTML = '';
    
    // Group selected seats by price to show breakdown
    const priceGroups = {};
    selectedSeats.forEach(s => {
      priceGroups[s.price] = (priceGroups[s.price] || 0) + 1;
    });
    
    Object.keys(priceGroups).forEach(priceStr => {
      const price = parseInt(priceStr);
      const qty = priceGroups[priceStr];
      const row = document.createElement('div');
      row.className = 'summary-row text-muted';
      row.innerHTML = `<span>${formatCurr(price)} × ${qty}</span> <span>${formatCurr(price * qty)}</span>`;
      breakdownContainer.appendChild(row);
    });
    
    const proceedBtn = document.getElementById('proceed-btn');
    if (count > 0) {
      proceedBtn.removeAttribute('disabled');
    } else {
      proceedBtn.setAttribute('disabled', 'true');
    }
  }

  document.getElementById('proceed-btn')?.addEventListener('click', () => {
    if (!window.OvationCart || selectedSeats.length === 0) return;
    
    // Group selected seats by section/price
    const grouped = {};
    selectedSeats.forEach(s => {
      // Find section name based on row
      const rowId = s.id.charAt(0);
      const section = sections.find(sec => sec.rows.includes(rowId));
      const sectionName = section ? section.name : 'Standard';
      
      if (!grouped[sectionName]) {
        grouped[sectionName] = { price: s.price, seats: [] };
      }
      grouped[sectionName].seats.push(s.id);
    });
    
    // Add each group as a line item
    Object.keys(grouped).forEach(sectionName => {
      const group = grouped[sectionName];
      const tierId = `seat-${sectionName.toLowerCase()}-${Math.random().toString(36).substr(2, 9)}`;
      
      window.OvationCart.addLine({
        eventSlug: movieData ? movieData.slug : 'unknown-movie',
        tierId: tierId,
        tierName: `${sectionName} Seats: ${group.seats.join(', ')}`,
        price: group.price,
        quantity: group.seats.length,
        venue: `${theatreName} (${showtime})`,
        city: movieData ? movieData.city : 'Unknown City',
        isSeatBooking: true
      });
    });
    
    // Redirect to checkout
    window.location.href = 'checkout.html';
  });

  // Init
  renderSeats();
});
