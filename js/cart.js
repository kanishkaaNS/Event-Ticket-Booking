// ==========================================================================
// OVATION — Cart State Management (backed by localStorage)
// ==========================================================================

const CART_STORAGE_KEY = 'ovation_cart_lines';
const ORDER_STORAGE_KEY = 'ovation_last_order';
const SERVICE_FEE_RATE = 0.12;

class CartManager {
  constructor() {
    this.lines = this.loadCart();
    this.lastOrder = this.loadOrder();
    this.listeners = [];
  }

  // Persist to localStorage
  saveCart() {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.lines));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
    this.notifyListeners();
  }

  loadCart() {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      const lines = stored ? JSON.parse(stored) : [];
      return this.sanitizeLines(lines);
    } catch (e) {
      console.error('Failed to load cart', e);
      return [];
    }
  }

  saveOrder(order) {
    this.lastOrder = order;
    try {
      localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(order));
    } catch (e) {
      console.error('Failed to save order', e);
    }
  }

  loadOrder() {
    try {
      const stored = localStorage.getItem(ORDER_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.error('Failed to load order', e);
      return null;
    }
  }

  // Subscribe to changes (useful for updating UI)
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  notifyListeners() {
    this.listeners.forEach(callback => callback(this));
  }

  sanitizeLines(lines) {
    if (!Array.isArray(lines)) return [];
    if (!window.OvationData) return lines;

    return lines
      .map(line => {
        const event = window.OvationData.getEvent(line.eventSlug);
        if (!event) return null;

        if (line.isSeatBooking) {
          return {
            ...line,
            eventTitle: event.title,
            eventImage: event.image,
            eventDate: event.date,
            quantity: Math.max(1, Math.min(Number(line.quantity) || 1, 8)),
          };
        }

        const tier = event.tiers.find(t => t.id === line.tierId);
        if (!tier) return null;

        return {
          ...line,
          eventTitle: event.title,
          eventImage: event.image,
          eventDate: event.date,
          venue: event.venue,
          city: event.city,
          tierName: tier.name,
          price: tier.price,
          quantity: Math.max(1, Math.min(Number(line.quantity) || 1, 8)),
        };
      })
      .filter(Boolean);
  }

  // Cart actions
  addLine(newLine) {
    const quantity = Math.max(1, Math.min(Number(newLine.quantity) || 1, 8));
    const existingIndex = this.lines.findIndex(
      l => l.eventSlug === newLine.eventSlug && l.tierId === newLine.tierId
    );

    if (existingIndex >= 0) {
      this.lines[existingIndex].quantity = Math.min(this.lines[existingIndex].quantity + quantity, 8);
    } else {
      this.lines.push({ ...newLine, quantity });
    }
    this.saveCart();
  }

  updateQuantity(eventSlug, tierId, quantity) {
    if (quantity <= 0) {
      this.removeLine(eventSlug, tierId);
      return;
    }

    const line = this.lines.find(l => l.eventSlug === eventSlug && l.tierId === tierId);
    if (line) {
      line.quantity = quantity;
      this.saveCart();
    }
  }

  removeLine(eventSlug, tierId) {
    this.lines = this.lines.filter(l => !(l.eventSlug === eventSlug && l.tierId === tierId));
    this.saveCart();
  }

  clear() {
    this.lines = [];
    this.saveCart();
  }

  // Getters
  get itemCount() {
    return this.lines.reduce((sum, l) => sum + l.quantity, 0);
  }

  get subtotal() {
    return this.lines.reduce((sum, l) => sum + (l.price * l.quantity), 0);
  }

  get fees() {
    return Math.round(this.subtotal * SERVICE_FEE_RATE);
  }

  get total() {
    return this.subtotal + this.fees;
  }

  // Checkout
  placeOrder(details) {
    if (this.lines.length === 0) return null;

    const order = {
      id: `OV-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      name: details.name,
      email: details.email,
      lines: [...this.lines], // Clone lines
      subtotal: this.subtotal,
      fees: this.fees,
      total: this.total,
    };

    this.saveOrder(order);
    this.clear();
    return order;
  }
}

// Global instance
window.OvationCart = new CartManager();
