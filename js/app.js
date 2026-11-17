/**
 * VoltTech - Main Application Logic & Event Orchestration
 * Handles user interactions, event delegation, debounced search,
 * checkout flow, and theme switching.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Application
  initApp();
});

function initApp() {
  setupTheme();
  setupFilterControls();
  setupEventDelegation();
  setupModalsAndDrawers();
  setupCheckoutForm();
  setupCouponForm();

  // Initial Renders
  UI.renderProductsGrid(AppState.getFilteredProducts());
  UI.updateCartBadge();
  UI.updateWishlistBadge();
  UI.renderCartDrawer();

  // Subscribe UI to AppState changes
  AppState.subscribe((event, payload) => {
    switch (event) {
      case "cart:updated":
        UI.renderCartDrawer();
        UI.updateCartBadge();
        break;

      case "wishlist:updated":
        UI.updateWishlistBadge();
        UI.renderWishlistModal();
        UI.renderProductsGrid(AppState.getFilteredProducts());
        break;

      case "filters:updated":
        UI.renderProductsGrid(AppState.getFilteredProducts());
        break;

      case "cart:max_stock_reached":
        UI.showToast(`Sorry, maximum available stock reached for this item!`, "error");
        break;

      case "order:placed":
        UI.renderCartDrawer();
        UI.updateCartBadge();
        break;

      default:
        break;
    }
  });
}

// -----------------------------------------------------------------
// THEME MANAGEMENT (Dark / Light)
// -----------------------------------------------------------------
function setupTheme() {
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const savedTheme = localStorage.getItem("volttech_theme") || "dark";

  if (savedTheme === "light") {
    document.body.classList.add("light-theme");
    updateThemeIcon(true);
  } else {
    document.body.classList.remove("light-theme");
    updateThemeIcon(false);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const isLight = document.body.classList.toggle("light-theme");
      localStorage.setItem("volttech_theme", isLight ? "light" : "dark");
      updateThemeIcon(isLight);
      UI.showToast(`Switched to ${isLight ? "Light" : "Dark"} mode`, "info");
    });
  }
}

function updateThemeIcon(isLight) {
  const icon = document.querySelector("#theme-toggle-btn i");
  if (icon) {
    icon.className = isLight ? "fas fa-moon" : "fas fa-sun";
  }
}

// -----------------------------------------------------------------
// FILTER & SEARCH CONTROLS
// -----------------------------------------------------------------
function setupFilterControls() {
  // Category tabs
  const categoryTabs = document.querySelectorAll(".category-pill");
  categoryTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      categoryTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const category = tab.getAttribute("data-category");
      AppState.setFilter("category", category);
    });
  });

  // Debounced Search input
  const searchInput = document.getElementById("search-input");
  let searchTimeout = null;
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        AppState.setFilter("searchQuery", e.target.value);
      }, 250);
    });

    // Clear search button if exists
    const searchClear = document.getElementById("search-clear-btn");
    if (searchClear) {
      searchClear.addEventListener("click", () => {
        searchInput.value = "";
        AppState.setFilter("searchQuery", "");
      });
    }
  }

  // Price range slider
  const priceSlider = document.getElementById("price-range");
  const priceDisplay = document.getElementById("price-display");
  if (priceSlider && priceDisplay) {
    priceSlider.addEventListener("input", (e) => {
      const val = Number(e.target.value);
      priceDisplay.textContent = `$${val}`;
      AppState.setFilter("maxPrice", val);
    });
  }

  // Sort dropdown
  const sortSelect = document.getElementById("sort-by");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      AppState.setFilter("sortBy", e.target.value);
    });
  }

  // In-stock checkbox
  const inStockCheckbox = document.getElementById("in-stock-filter");
  if (inStockCheckbox) {
    inStockCheckbox.addEventListener("change", (e) => {
      AppState.setFilter("inStockOnly", e.target.checked);
    });
  }

  // Reset Filters Button
  const resetFiltersBtn = document.getElementById("btn-reset-filters");
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      if (priceSlider) priceSlider.value = 2500;
      if (priceDisplay) priceDisplay.textContent = "$2500";
      if (sortSelect) sortSelect.value = "featured";
      if (inStockCheckbox) inStockCheckbox.checked = false;

      categoryTabs.forEach((t) => {
        t.classList.toggle("active", t.getAttribute("data-category") === "all");
      });

      AppState.resetFilters();
      UI.showToast("Filters reset to default", "info");
    });
  }
}

// -----------------------------------------------------------------
// EVENT DELEGATION
// -----------------------------------------------------------------
function setupEventDelegation() {
  // 1. Product Grid clicks
  const productsGrid = document.getElementById("products-grid");
  if (productsGrid) {
    productsGrid.addEventListener("click", (e) => {
      // Add to Cart
      const addBtn = e.target.closest(".btn-add-cart");
      if (addBtn) {
        e.stopPropagation();
        const id = addBtn.getAttribute("data-add-id");
        const success = AppState.addToCart(id, 1);
        if (success) {
          const product = PRODUCTS_DATA.find((p) => p.id === id);
          UI.showToast(`Added "${product.name}" to cart!`);
          addBtn.classList.add("btn-bounce");
          setTimeout(() => addBtn.classList.remove("btn-bounce"), 400);
        }
        return;
      }

      // Wishlist toggle
      const wishlistBtn = e.target.closest(".btn-wishlist");
      if (wishlistBtn) {
        e.stopPropagation();
        const id = wishlistBtn.getAttribute("data-wishlist-id");
        const added = AppState.toggleWishlist(id);
        const product = PRODUCTS_DATA.find((p) => p.id === id);
        UI.showToast(added ? `Saved "${product.name}" to wishlist` : `Removed from wishlist`, "info");
        return;
      }

      // Quick View Modal
      const quickViewBtn = e.target.closest(".btn-quick-view");
      if (quickViewBtn) {
        e.stopPropagation();
        const id = quickViewBtn.getAttribute("data-quickview-id");
        UI.openProductModal(id);
        return;
      }

      // Clicking on card image or title opens details
      const card = e.target.closest(".product-card");
      if (card && (e.target.closest(".product-image-wrap") || e.target.closest(".product-title"))) {
        const id = card.getAttribute("data-id");
        UI.openProductModal(id);
      }
    });
  }

  // 2. Cart Drawer item actions
  const cartContainer = document.getElementById("cart-items-container");
  if (cartContainer) {
    cartContainer.addEventListener("click", (e) => {
      // Minus quantity
      const minusBtn = e.target.closest(".btn-qty-minus");
      if (minusBtn) {
        const id = minusBtn.getAttribute("data-id");
        const item = AppState.getState().cart.find((i) => i.id === id);
        if (item) AppState.updateQuantity(id, item.quantity - 1);
        return;
      }

      // Plus quantity
      const plusBtn = e.target.closest(".btn-qty-plus");
      if (plusBtn) {
        const id = plusBtn.getAttribute("data-id");
        const item = AppState.getState().cart.find((i) => i.id === id);
        if (item) AppState.updateQuantity(id, item.quantity + 1);
        return;
      }

      // Remove item
      const removeBtn = e.target.closest(".btn-remove-item");
      if (removeBtn) {
        const id = removeBtn.getAttribute("data-id");
        AppState.removeFromCart(id);
        UI.showToast("Item removed from cart", "info");
      }
    });
  }

  // 3. Wishlist Modal item actions
  const wishlistContainer = document.getElementById("wishlist-items-container");
  if (wishlistContainer) {
    wishlistContainer.addEventListener("click", (e) => {
      // Move to Cart
      const moveBtn = e.target.closest(".btn-move-to-cart");
      if (moveBtn) {
        const id = moveBtn.getAttribute("data-id");
        AppState.addToCart(id, 1);
        AppState.toggleWishlist(id);
        const product = PRODUCTS_DATA.find((p) => p.id === id);
        UI.showToast(`Moved "${product.name}" to cart!`);
        return;
      }

      // Remove from wishlist
      const removeBtn = e.target.closest(".btn-remove-wishlist");
      if (removeBtn) {
        const id = removeBtn.getAttribute("data-id");
        AppState.toggleWishlist(id);
        UI.showToast("Item removed from wishlist", "info");
      }
    });
  }
}

// -----------------------------------------------------------------
// MODALS, DRAWERS & OVERLAYS
// -----------------------------------------------------------------
function setupModalsAndDrawers() {
  // Open Cart Drawer
  const openCartBtns = document.querySelectorAll(".btn-open-cart");
  openCartBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      UI.renderCartDrawer();
      UI.openDrawer("cart-drawer");
    });
  });

  // Close Cart Drawer
  const closeCartBtn = document.getElementById("btn-close-cart");
  if (closeCartBtn) {
    closeCartBtn.addEventListener("click", () => UI.closeDrawer("cart-drawer"));
  }

  // Open Wishlist Modal
  const openWishlistBtns = document.querySelectorAll(".btn-open-wishlist");
  openWishlistBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      UI.renderWishlistModal();
      UI.openModal("wishlist-modal");
    });
  });

  // Open Orders Modal
  const openOrdersBtns = document.querySelectorAll(".btn-open-orders");
  openOrdersBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      UI.renderOrderHistoryModal();
      UI.openModal("order-history-modal");
    });
  });

  // Overlay click to close
  const overlay = document.getElementById("drawer-overlay");
  if (overlay) {
    overlay.addEventListener("click", () => {
      UI.closeAllDrawersAndModals();
    });
  }

  // Generic modal close buttons
  document.querySelectorAll(".modal-close, .btn-modal-close").forEach((btn) => {
    btn.addEventListener("click", () => {
      const modal = btn.closest(".modal");
      if (modal) UI.closeModal(modal.id);
    });
  });

  // Close with ESC key
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      UI.closeAllDrawersAndModals();
    }
  });

  // Mobile navigation hamburger toggle
  const mobileToggleBtn = document.getElementById("mobile-menu-toggle");
  const mobileNavMenu = document.getElementById("mobile-nav-menu");
  if (mobileToggleBtn && mobileNavMenu) {
    mobileToggleBtn.addEventListener("click", () => {
      mobileNavMenu.classList.toggle("open");
    });
  }
}

// -----------------------------------------------------------------
// COUPON ENGINE
// -----------------------------------------------------------------
function setupCouponForm() {
  const couponForm = document.getElementById("coupon-form");
  const couponInput = document.getElementById("coupon-input");

  if (couponForm && couponInput) {
    couponForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const code = couponInput.value.trim();
      if (!code) return;

      const result = AppState.applyCoupon(code);
      if (result.success) {
        UI.showToast(result.message, "success");
        couponInput.value = "";
      } else {
        UI.showToast(result.message, "error");
      }
    });
  }
}

// -----------------------------------------------------------------
// CHECKOUT ORCHESTRATION
// -----------------------------------------------------------------
function setupCheckoutForm() {
  // Checkout trigger from Cart drawer
  const checkoutBtn = document.getElementById("btn-proceed-checkout");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      const cart = AppState.getState().cart;
      if (cart.length === 0) {
        UI.showToast("Your cart is empty. Add items to checkout!", "error");
        return;
      }
      UI.closeDrawer("cart-drawer");
      UI.renderCheckoutSummary();
      UI.openModal("checkout-modal");
    });
  }

  // Payment tab switches
  const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
  const cardFields = document.getElementById("card-details-fields");

  paymentMethods.forEach((input) => {
    input.addEventListener("change", (e) => {
      if (cardFields) {
        cardFields.style.display = e.target.value === "credit_card" ? "grid" : "none";
      }
    });
  });

  // Card input auto-formatting
  const cardNumberInput = document.getElementById("card-number");
  if (cardNumberInput) {
    cardNumberInput.addEventListener("input", (e) => {
      let val = e.target.value.replace(/\D/g, "").slice(0, 16);
      val = val.replace(/(\d{4})/g, "$1 ").trim();
      e.target.value = val;
    });
  }

  const cardExpiryInput = document.getElementById("card-expiry");
  if (cardExpiryInput) {
    cardExpiryInput.addEventListener("input", (e) => {
      let val = e.target.value.replace(/\D/g, "").slice(0, 4);
      if (val.length >= 2) {
        val = val.slice(0, 2) + "/" + val.slice(2);
      }
      e.target.value = val;
    });
  }

  // Checkout Form Submission
  const checkoutForm = document.getElementById("checkout-form");
  const submitBtn = document.getElementById("btn-submit-order");

  if (checkoutForm && submitBtn) {
    checkoutForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Collect customer details
      const customer = {
        fullName: document.getElementById("cust-name")?.value.trim() || "Customer",
        email: document.getElementById("cust-email")?.value.trim() || "",
        phone: document.getElementById("cust-phone")?.value.trim() || "",
        street: document.getElementById("cust-address")?.value.trim() || "",
        city: document.getElementById("cust-city")?.value.trim() || "",
        postalCode: document.getElementById("cust-zip")?.value.trim() || "",
        paymentMethod: document.querySelector('input[name="paymentMethod"]:checked')?.value || "credit_card"
      };

      // Basic validation
      if (!customer.fullName || !customer.email || !customer.street || !customer.city || !customer.postalCode) {
        UI.showToast("Please fill in all required shipping address fields!", "error");
        return;
      }

      // Simulate payment processing
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Payment...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-lock"></i> Place Secure Order';

        const order = AppState.placeOrder(customer);
        if (order) {
          UI.showOrderConfirmation(order);
          UI.showToast(`Order ${order.orderNumber} successfully placed!`, "success");
        }
      }, 1200);
    });
  }

  // Print Receipt Button
  const printReceiptBtn = document.getElementById("btn-print-receipt");
  if (printReceiptBtn) {
    printReceiptBtn.addEventListener("click", () => {
      window.print();
    });
  }
}
