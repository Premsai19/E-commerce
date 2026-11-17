/**
 * VoltTech - Central State Management & Storage
 * Handles reactive cart, wishlist, applied coupons, filters, and order history.
 * Automatically synchronizes with browser LocalStorage.
 */

const AppState = (function () {
  // Storage keys
  const STORAGE_KEYS = {
    CART: "volttech_cart_v1",
    WISHLIST: "volttech_wishlist_v1",
    ORDERS: "volttech_orders_v1"
  };

  // Safe localStorage helper
  function loadFromStorage(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.warn("LocalStorage access error:", e);
      return fallback;
    }
  }

  function saveToStorage(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn("LocalStorage write error:", e);
    }
  }

  // Internal State
  const state = {
    cart: loadFromStorage(STORAGE_KEYS.CART, []),
    wishlist: loadFromStorage(STORAGE_KEYS.WISHLIST, []),
    orders: loadFromStorage(STORAGE_KEYS.ORDERS, []),
    activeCoupon: null,
    filters: {
      category: "all",
      searchQuery: "",
      maxPrice: 2500,
      sortBy: "featured",
      inStockOnly: false
    }
  };

  // Event Listeners (Subscriber callbacks)
  const listeners = [];

  function subscribe(fn) {
    listeners.push(fn);
    return () => {
      const idx = listeners.indexOf(fn);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }

  function notify(event, payload) {
    listeners.forEach((fn) => {
      try {
        fn(event, payload, state);
      } catch (err) {
        console.error("Subscriber notification error:", err);
      }
    });
  }

  // -------------------------------------------------------------
  // CART OPERATIONS
  // -------------------------------------------------------------
  function addToCart(productId, quantity = 1) {
    const product = PRODUCTS_DATA.find((p) => p.id === productId);
    if (!product) return false;

    const existingIndex = state.cart.findIndex((item) => item.id === productId);

    if (existingIndex > -1) {
      const newQty = state.cart[existingIndex].quantity + quantity;
      if (newQty > product.stock) {
        notify("cart:max_stock_reached", { product });
        return false;
      }
      state.cart[existingIndex].quantity = newQty;
    } else {
      if (quantity > product.stock) {
        notify("cart:max_stock_reached", { product });
        return false;
      }
      state.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        category: product.category,
        quantity: quantity,
        stock: product.stock
      });
    }

    saveToStorage(STORAGE_KEYS.CART, state.cart);
    notify("cart:updated", { product, quantity });
    return true;
  }

  function updateQuantity(productId, newQty) {
    const item = state.cart.find((i) => i.id === productId);
    if (!item) return;

    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }

    if (newQty > item.stock) {
      notify("cart:max_stock_reached", { product: item });
      return;
    }

    item.quantity = newQty;
    saveToStorage(STORAGE_KEYS.CART, state.cart);
    notify("cart:updated", { item });
  }

  function removeFromCart(productId) {
    state.cart = state.cart.filter((item) => item.id !== productId);
    saveToStorage(STORAGE_KEYS.CART, state.cart);
    notify("cart:updated");
  }

  function clearCart() {
    state.cart = [];
    state.activeCoupon = null;
    saveToStorage(STORAGE_KEYS.CART, state.cart);
    notify("cart:updated");
  }

  function getCartTotals() {
    const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);

    let shippingFee = subtotal === 0 || subtotal >= 99 ? 0 : 15;
    let discount = 0;

    if (state.activeCoupon && PROMO_CODES[state.activeCoupon]) {
      const coupon = PROMO_CODES[state.activeCoupon];
      if (coupon.type === "percent") {
        discount = (subtotal * coupon.value) / 100;
      } else if (coupon.type === "flat") {
        if (!coupon.minSpend || subtotal >= coupon.minSpend) {
          discount = Math.min(coupon.value, subtotal);
        }
      } else if (coupon.type === "shipping") {
        shippingFee = 0;
      }
    }

    const taxableAmount = Math.max(0, subtotal - discount);
    const estimatedTax = taxableAmount > 0 ? taxableAmount * 0.08 : 0; // 8% sales tax
    const grandTotal = Math.max(0, taxableAmount + shippingFee + estimatedTax);

    return {
      subtotal,
      totalItems,
      shippingFee,
      discount,
      estimatedTax,
      grandTotal,
      activeCoupon: state.activeCoupon ? PROMO_CODES[state.activeCoupon] : null,
      couponCode: state.activeCoupon
    };
  }

  // -------------------------------------------------------------
  // PROMO COUPONS
  // -------------------------------------------------------------
  function applyCoupon(code) {
    const cleanCode = (code || "").trim().toUpperCase();
    if (!PROMO_CODES[cleanCode]) {
      return { success: false, message: `Invalid coupon code "${cleanCode}". Try TECH10 or FRESHER25.` };
    }

    const totals = getCartTotals();
    const coupon = PROMO_CODES[cleanCode];

    if (coupon.minSpend && totals.subtotal < coupon.minSpend) {
      return {
        success: false,
        message: `Order must be at least $${coupon.minSpend} to use ${cleanCode}. Current subtotal is $${totals.subtotal.toFixed(2)}.`
      };
    }

    state.activeCoupon = cleanCode;
    notify("cart:updated");
    return { success: true, message: `Coupon applied: ${coupon.description}` };
  }

  function removeCoupon() {
    state.activeCoupon = null;
    notify("cart:updated");
  }

  // -------------------------------------------------------------
  // WISHLIST OPERATIONS
  // -------------------------------------------------------------
  function toggleWishlist(productId) {
    const index = state.wishlist.indexOf(productId);
    let added = false;
    if (index > -1) {
      state.wishlist.splice(index, 1);
    } else {
      state.wishlist.push(productId);
      added = true;
    }
    saveToStorage(STORAGE_KEYS.WISHLIST, state.wishlist);
    notify("wishlist:updated", { productId, added });
    return added;
  }

  function isInWishlist(productId) {
    return state.wishlist.includes(productId);
  }

  function getWishlistProducts() {
    return PRODUCTS_DATA.filter((p) => state.wishlist.includes(p.id));
  }

  // -------------------------------------------------------------
  // FILTER & SEARCH OPERATIONS
  // -------------------------------------------------------------
  function setFilter(key, value) {
    if (key in state.filters) {
      state.filters[key] = value;
      notify("filters:updated", { key, value });
    }
  }

  function resetFilters() {
    state.filters = {
      category: "all",
      searchQuery: "",
      maxPrice: 2500,
      sortBy: "featured",
      inStockOnly: false
    };
    notify("filters:updated");
  }

  function getFilteredProducts() {
    let result = [...PRODUCTS_DATA];

    // Filter by Category
    if (state.filters.category && state.filters.category !== "all") {
      result = result.filter((p) => p.category.toLowerCase() === state.filters.category.toLowerCase());
    }

    // Filter by Search Query
    if (state.filters.searchQuery) {
      const q = state.filters.searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Filter by Max Price
    if (typeof state.filters.maxPrice === "number") {
      result = result.filter((p) => p.price <= state.filters.maxPrice);
    }

    // Filter by In-Stock
    if (state.filters.inStockOnly) {
      result = result.filter((p) => p.stock > 0);
    }

    // Sorting
    switch (state.filters.sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "featured":
      default:
        // Keep original order
        break;
    }

    return result;
  }

  // -------------------------------------------------------------
  // ORDER PLACEMENT
  // -------------------------------------------------------------
  function placeOrder(customerDetails) {
    if (state.cart.length === 0) return null;

    const totals = getCartTotals();
    const orderNumber = "VT-" + Math.floor(100000 + Math.random() * 900000);
    const orderDate = new Date().toISOString();

    const order = {
      orderNumber,
      date: orderDate,
      customer: customerDetails,
      items: [...state.cart],
      totals: { ...totals }
    };

    state.orders.unshift(order);
    saveToStorage(STORAGE_KEYS.ORDERS, state.orders);

    // Empty cart upon successful order
    clearCart();

    notify("order:placed", { order });
    return order;
  }

  function getOrders() {
    return [...state.orders];
  }

  // Public API
  return {
    getState: () => ({ ...state }),
    subscribe,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotals,
    applyCoupon,
    removeCoupon,
    toggleWishlist,
    isInWishlist,
    getWishlistProducts,
    setFilter,
    resetFilters,
    getFilteredProducts,
    placeOrder,
    getOrders
  };
})();
