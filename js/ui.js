/**
 * VoltTech - UI Rendering & Component Helpers
 * Responsible for rendering product cards, modals, cart drawer,
 * toast alerts, and checkout flows.
 */

const UI = (function () {
  // Helpers
  function formatCurrency(amount) {
    return "$" + (Number(amount) || 0).toFixed(2);
  }

  function getRatingStars(rating) {
    const full = Math.floor(rating);
    const hasHalf = rating - full >= 0.5;
    let stars = "";
    for (let i = 0; i < full; i++) stars += '<i class="fas fa-star text-amber-400"></i>';
    if (hasHalf) stars += '<i class="fas fa-star-half-alt text-amber-400"></i>';
    const remaining = 5 - full - (hasHalf ? 1 : 0);
    for (let i = 0; i < remaining; i++) stars += '<i class="far fa-star text-slate-500"></i>';
    return stars;
  }

  // -------------------------------------------------------------
  // TOAST NOTIFICATIONS
  // -------------------------------------------------------------
  function showToast(message, type = "success") {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type} animate-slide-in`;

    let icon = "fa-check-circle";
    if (type === "error") icon = "fa-exclamation-circle";
    if (type === "info") icon = "fa-info-circle";

    toast.innerHTML = `
      <i class="fas ${icon} toast-icon"></i>
      <span class="toast-message">${message}</span>
      <button class="toast-close" aria-label="Close notification">&times;</button>
    `;

    container.appendChild(toast);

    const closeBtn = toast.querySelector(".toast-close");
    const removeToast = () => {
      toast.classList.add("toast-fade-out");
      setTimeout(() => toast.remove(), 300);
    };

    closeBtn.addEventListener("click", removeToast);
    setTimeout(removeToast, 3500);
  }

  // -------------------------------------------------------------
  // PRODUCT CATALOG RENDERING
  // -------------------------------------------------------------
  function renderProductsGrid(products, containerId = "products-grid") {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!products || products.length === 0) {
      container.innerHTML = `
        <div class="empty-catalog-state">
          <i class="fas fa-search-minus empty-icon"></i>
          <h3>No gadgets found</h3>
          <p>We couldn't find any products matching your current filters or search terms.</p>
          <button class="btn btn-secondary mt-3" id="btn-reset-filters-inline">
            <i class="fas fa-redo"></i> Reset All Filters
          </button>
        </div>
      `;
      const resetBtn = document.getElementById("btn-reset-filters-inline");
      if (resetBtn) {
        resetBtn.addEventListener("click", () => AppState.resetFilters());
      }
      return;
    }

    container.innerHTML = products
      .map((product) => {
        const isWishlisted = AppState.isInWishlist(product.id);
        const discountPct = product.originalPrice
          ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
          : 0;

        return `
        <article class="product-card" data-id="${product.id}">
          <div class="product-image-wrap">
            <img 
              src="${product.image}" 
              alt="${product.name}" 
              class="product-image"
              loading="lazy"
              onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80';"
            />
            
            <div class="product-badges">
              ${product.badge ? `<span class="badge badge-${product.badge.toLowerCase()}">${product.badge}</span>` : ""}
              ${discountPct > 0 ? `<span class="badge badge-discount">-${discountPct}%</span>` : ""}
            </div>

            <button 
              class="btn-wishlist ${isWishlisted ? "active" : ""}" 
              data-wishlist-id="${product.id}" 
              aria-label="Add to wishlist"
              title="${isWishlisted ? "Remove from wishlist" : "Add to wishlist"}"
            >
              <i class="${isWishlisted ? "fas fa-heart text-rose-500" : "far fa-heart"}"></i>
            </button>

            <button class="btn-quick-view" data-quickview-id="${product.id}">
              <i class="fas fa-eye"></i> Quick View
            </button>
          </div>

          <div class="product-info">
            <div class="product-category">${product.category.toUpperCase()}</div>
            <h3 class="product-title" title="${product.name}">${product.name}</h3>

            <div class="product-rating">
              <span class="stars">${getRatingStars(product.rating)}</span>
              <span class="rating-num">${product.rating}</span>
              <span class="reviews-count">(${product.reviewsCount})</span>
            </div>

            <p class="product-snippet">${product.description.slice(0, 75)}...</p>

            <div class="product-footer">
              <div class="product-price-block">
                <span class="product-price">${formatCurrency(product.price)}</span>
                ${
                  product.originalPrice
                    ? `<span class="product-orig-price">${formatCurrency(product.originalPrice)}</span>`
                    : ""
                }
              </div>

              <button 
                class="btn btn-primary btn-add-cart" 
                data-add-id="${product.id}"
                ${product.stock === 0 ? "disabled" : ""}
              >
                <i class="fas fa-cart-plus"></i> ${product.stock === 0 ? "Out of Stock" : "Add"}
              </button>
            </div>

            <div class="stock-status ${product.stock <= 5 ? "low-stock" : "in-stock"}">
              ${
                product.stock === 0
                  ? '<i class="fas fa-times-circle"></i> Sold Out'
                  : product.stock <= 5
                  ? `<i class="fas fa-exclamation-triangle"></i> Only ${product.stock} left in stock!`
                  : '<i class="fas fa-check-circle"></i> In Stock & Ready to Ship'
              }
            </div>
          </div>
        </article>
      `;
      })
      .join("");
  }

  // -------------------------------------------------------------
  // CART DRAWER & BADGE
  // -------------------------------------------------------------
  function updateCartBadge() {
    const totals = AppState.getCartTotals();
    const badges = document.querySelectorAll(".cart-count-badge");
    badges.forEach((b) => {
      b.textContent = totals.totalItems;
      b.style.display = totals.totalItems > 0 ? "inline-flex" : "none";
    });
  }

  function updateWishlistBadge() {
    const items = AppState.getWishlistProducts();
    const badges = document.querySelectorAll(".wishlist-count-badge");
    badges.forEach((b) => {
      b.textContent = items.length;
      b.style.display = items.length > 0 ? "inline-flex" : "none";
    });
  }

  function renderCartDrawer() {
    const drawerItemsContainer = document.getElementById("cart-items-container");
    const drawerFooter = document.getElementById("cart-drawer-footer");
    const emptyState = document.getElementById("cart-empty-state");
    const subtotalEl = document.getElementById("cart-subtotal");
    const shippingEl = document.getElementById("cart-shipping");
    const discountRow = document.getElementById("cart-discount-row");
    const discountEl = document.getElementById("cart-discount");
    const taxEl = document.getElementById("cart-tax");
    const grandTotalEl = document.getElementById("cart-total");
    const freeShippingProgress = document.getElementById("free-shipping-progress");
    const freeShippingText = document.getElementById("free-shipping-text");
    const activeCouponBadge = document.getElementById("active-coupon-badge");

    const totals = AppState.getCartTotals();
    const state = AppState.getState();

    updateCartBadge();

    if (!drawerItemsContainer) return;

    if (state.cart.length === 0) {
      drawerItemsContainer.innerHTML = "";
      if (emptyState) emptyState.style.display = "flex";
      if (drawerFooter) drawerFooter.style.display = "none";
      return;
    }

    if (emptyState) emptyState.style.display = "none";
    if (drawerFooter) drawerFooter.style.display = "block";

    // Free shipping threshold ($99)
    const neededForFreeShipping = Math.max(0, 99 - totals.subtotal);
    const progressPercent = Math.min(100, Math.round((totals.subtotal / 99) * 100));

    if (freeShippingProgress) {
      freeShippingProgress.style.width = `${progressPercent}%`;
    }
    if (freeShippingText) {
      if (neededForFreeShipping === 0 || totals.shippingFee === 0) {
        freeShippingText.innerHTML = '<span class="text-emerald-400 font-semibold"><i class="fas fa-check"></i> You qualify for FREE Express Shipping!</span>';
      } else {
        freeShippingText.innerHTML = `Add <strong>${formatCurrency(neededForFreeShipping)}</strong> more to unlock <strong>FREE Shipping</strong>!`;
      }
    }

    // Render Items
    drawerItemsContainer.innerHTML = state.cart
      .map(
        (item) => `
        <div class="cart-item" data-id="${item.id}">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
          <div class="cart-item-details">
            <h4 class="cart-item-title">${item.name}</h4>
            <div class="cart-item-price">${formatCurrency(item.price)}</div>
            
            <div class="cart-item-actions">
              <div class="qty-stepper">
                <button class="qty-btn btn-qty-minus" data-id="${item.id}" aria-label="Decrease quantity">
                  <i class="fas fa-minus"></i>
                </button>
                <span class="qty-value">${item.quantity}</span>
                <button class="qty-btn btn-qty-plus" data-id="${item.id}" aria-label="Increase quantity">
                  <i class="fas fa-plus"></i>
                </button>
              </div>

              <button class="btn-remove-item" data-id="${item.id}" title="Remove item">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
          <div class="cart-item-subtotal">
            ${formatCurrency(item.price * item.quantity)}
          </div>
        </div>
      `
      )
      .join("");

    // Update Totals
    if (subtotalEl) subtotalEl.textContent = formatCurrency(totals.subtotal);
    if (shippingEl) {
      shippingEl.innerHTML = totals.shippingFee === 0 ? '<span class="free-tag">FREE</span>' : formatCurrency(totals.shippingFee);
    }

    if (discountRow && discountEl) {
      if (totals.discount > 0) {
        discountRow.style.display = "flex";
        discountEl.textContent = `-${formatCurrency(totals.discount)}`;
      } else {
        discountRow.style.display = "none";
      }
    }

    if (taxEl) taxEl.textContent = formatCurrency(totals.estimatedTax);
    if (grandTotalEl) grandTotalEl.textContent = formatCurrency(totals.grandTotal);

    // Active coupon display
    if (activeCouponBadge) {
      if (totals.couponCode) {
        activeCouponBadge.innerHTML = `
          <span class="coupon-chip">
            <i class="fas fa-tag"></i> <strong>${totals.couponCode}</strong> applied
            <button id="btn-remove-coupon" title="Remove coupon">&times;</button>
          </span>
        `;
        activeCouponBadge.style.display = "block";
        const removeCouponBtn = document.getElementById("btn-remove-coupon");
        if (removeCouponBtn) {
          removeCouponBtn.addEventListener("click", () => {
            AppState.removeCoupon();
            showToast("Coupon removed", "info");
          });
        }
      } else {
        activeCouponBadge.style.display = "none";
      }
    }
  }

  // -------------------------------------------------------------
  // PRODUCT QUICK VIEW MODAL
  // -------------------------------------------------------------
  function openProductModal(productId) {
    const product = PRODUCTS_DATA.find((p) => p.id === productId);
    if (!product) return;

    let modal = document.getElementById("product-detail-modal");
    if (!modal) return;

    const modalBody = modal.querySelector(".modal-body");
    const isWishlisted = AppState.isInWishlist(product.id);

    // Format specs
    const specsHtml = Object.entries(product.specs || {})
      .map(
        ([key, val]) => `
        <div class="spec-row">
          <span class="spec-name">${key}</span>
          <span class="spec-val">${val}</span>
        </div>
      `
      )
      .join("");

    const featuresHtml = (product.features || [])
      .map((f) => `<li><i class="fas fa-check text-emerald-400"></i> ${f}</li>`)
      .join("");

    modalBody.innerHTML = `
      <div class="product-modal-grid">
        <div class="modal-gallery">
          <img src="${product.image}" alt="${product.name}" class="modal-main-img" />
          <div class="modal-badges-overlay">
            ${product.badge ? `<span class="badge badge-${product.badge.toLowerCase()}">${product.badge}</span>` : ""}
          </div>
        </div>

        <div class="modal-info-pane">
          <div class="modal-category">${product.category.toUpperCase()}</div>
          <h2 class="modal-title">${product.name}</h2>

          <div class="modal-rating-row">
            <span class="stars">${getRatingStars(product.rating)}</span>
            <span class="rating-num font-bold">${product.rating}</span>
            <span class="reviews-count">(${product.reviewsCount} customer reviews)</span>
          </div>

          <div class="modal-price-row">
            <span class="modal-price">${formatCurrency(product.price)}</span>
            ${
              product.originalPrice
                ? `<span class="modal-orig-price">${formatCurrency(product.originalPrice)}</span>`
                : ""
            }
            ${
              product.originalPrice
                ? `<span class="badge badge-discount">Save ${formatCurrency(product.originalPrice - product.price)}</span>`
                : ""
            }
          </div>

          <p class="modal-desc">${product.description}</p>

          <div class="modal-features">
            <h4>Key Highlights</h4>
            <ul>${featuresHtml}</ul>
          </div>

          <div class="modal-specs">
            <h4>Technical Specifications</h4>
            <div class="specs-table">${specsHtml}</div>
          </div>

          <div class="modal-cta-row">
            <div class="modal-qty-selector">
              <label for="modal-quantity">Quantity:</label>
              <div class="qty-stepper">
                <button type="button" class="qty-btn" id="modal-qty-minus"><i class="fas fa-minus"></i></button>
                <input type="number" id="modal-quantity" value="1" min="1" max="${product.stock}" readonly />
                <button type="button" class="qty-btn" id="modal-qty-plus"><i class="fas fa-plus"></i></button>
              </div>
            </div>

            <button class="btn btn-primary btn-modal-add" id="btn-modal-add-to-cart" data-id="${product.id}">
              <i class="fas fa-cart-plus"></i> Add to Cart
            </button>

            <button class="btn btn-outline ${isWishlisted ? "active text-rose-500" : ""}" id="btn-modal-wishlist" data-id="${product.id}">
              <i class="${isWishlisted ? "fas fa-heart text-rose-500" : "far fa-heart"}"></i>
            </button>
          </div>

          <div class="modal-trust-badges">
            <div><i class="fas fa-shield-alt"></i> 2-Year Official Warranty</div>
            <div><i class="fas fa-truck-fast"></i> Express 2-Day Delivery</div>
            <div><i class="fas fa-undo"></i> 30-Day Hassle-Free Returns</div>
          </div>
        </div>
      </div>
    `;

    // Hook up modal quantity selector
    const qtyInput = document.getElementById("modal-quantity");
    const minusBtn = document.getElementById("modal-qty-minus");
    const plusBtn = document.getElementById("modal-qty-plus");

    if (minusBtn && plusBtn && qtyInput) {
      minusBtn.addEventListener("click", () => {
        let v = parseInt(qtyInput.value) || 1;
        if (v > 1) qtyInput.value = v - 1;
      });
      plusBtn.addEventListener("click", () => {
        let v = parseInt(qtyInput.value) || 1;
        if (v < product.stock) qtyInput.value = v + 1;
      });
    }

    const addBtn = document.getElementById("btn-modal-add-to-cart");
    if (addBtn) {
      addBtn.addEventListener("click", () => {
        const qty = parseInt(qtyInput.value) || 1;
        AppState.addToCart(product.id, qty);
        showToast(`Added ${qty}x "${product.name}" to cart!`);
        closeModal("product-detail-modal");
        openDrawer("cart-drawer");
      });
    }

    const wishlistBtn = document.getElementById("btn-modal-wishlist");
    if (wishlistBtn) {
      wishlistBtn.addEventListener("click", () => {
        const added = AppState.toggleWishlist(product.id);
        wishlistBtn.classList.toggle("active", added);
        wishlistBtn.innerHTML = `<i class="${added ? "fas fa-heart text-rose-500" : "far fa-heart"}"></i>`;
        showToast(added ? `Added "${product.name}" to wishlist` : `Removed from wishlist`, "info");
      });
    }

    openModal("product-detail-modal");
  }

  // -------------------------------------------------------------
  // WISHLIST MODAL
  // -------------------------------------------------------------
  function renderWishlistModal() {
    const listContainer = document.getElementById("wishlist-items-container");
    const emptyState = document.getElementById("wishlist-empty-state");
    const items = AppState.getWishlistProducts();

    updateWishlistBadge();

    if (!listContainer) return;

    if (items.length === 0) {
      listContainer.innerHTML = "";
      if (emptyState) emptyState.style.display = "block";
      return;
    }

    if (emptyState) emptyState.style.display = "none";

    listContainer.innerHTML = items
      .map(
        (product) => `
        <div class="wishlist-row" data-id="${product.id}">
          <img src="${product.image}" alt="${product.name}" class="wishlist-img" />
          <div class="wishlist-details">
            <h4>${product.name}</h4>
            <div class="wishlist-price">${formatCurrency(product.price)}</div>
            <div class="stock-status ${product.stock <= 5 ? "low-stock" : "in-stock"}">
              ${product.stock > 0 ? "In Stock" : "Out of Stock"}
            </div>
          </div>
          <div class="wishlist-actions">
            <button class="btn btn-sm btn-primary btn-move-to-cart" data-id="${product.id}" ${product.stock === 0 ? "disabled" : ""}>
              <i class="fas fa-cart-plus"></i> Move to Cart
            </button>
            <button class="btn-remove-wishlist" data-id="${product.id}" title="Remove from wishlist">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
      `
      )
      .join("");
  }

  // -------------------------------------------------------------
  // CHECKOUT MODAL
  // -------------------------------------------------------------
  function renderCheckoutSummary() {
    const summaryItemsEl = document.getElementById("checkout-summary-items");
    const summarySubtotal = document.getElementById("checkout-subtotal");
    const summaryShipping = document.getElementById("checkout-shipping");
    const summaryDiscountRow = document.getElementById("checkout-discount-row");
    const summaryDiscount = document.getElementById("checkout-discount");
    const summaryTax = document.getElementById("checkout-tax");
    const summaryTotal = document.getElementById("checkout-total");

    const totals = AppState.getCartTotals();
    const state = AppState.getState();

    if (!summaryItemsEl) return;

    summaryItemsEl.innerHTML = state.cart
      .map(
        (item) => `
        <div class="checkout-item-preview">
          <img src="${item.image}" alt="${item.name}" />
          <div class="item-name">${item.name} <span class="qty-badge">&times;${item.quantity}</span></div>
          <div class="item-cost">${formatCurrency(item.price * item.quantity)}</div>
        </div>
      `
      )
      .join("");

    if (summarySubtotal) summarySubtotal.textContent = formatCurrency(totals.subtotal);
    if (summaryShipping) summaryShipping.textContent = totals.shippingFee === 0 ? "FREE" : formatCurrency(totals.shippingFee);

    if (summaryDiscountRow && summaryDiscount) {
      if (totals.discount > 0) {
        summaryDiscountRow.style.display = "flex";
        summaryDiscount.textContent = `-${formatCurrency(totals.discount)}`;
      } else {
        summaryDiscountRow.style.display = "none";
      }
    }

    if (summaryTax) summaryTax.textContent = formatCurrency(totals.estimatedTax);
    if (summaryTotal) summaryTotal.textContent = formatCurrency(totals.grandTotal);
  }

  // -------------------------------------------------------------
  // ORDER CONFIRMATION MODAL
  // -------------------------------------------------------------
  function showOrderConfirmation(order) {
    const modal = document.getElementById("order-confirmation-modal");
    if (!modal) return;

    const receiptEl = document.getElementById("order-receipt-content");
    if (!receiptEl) return;

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);

    receiptEl.innerHTML = `
      <div class="receipt-card">
        <div class="receipt-header">
          <div class="receipt-brand">
            <i class="fas fa-bolt text-cyan-400"></i> VOLT<span class="text-cyan-400">TECH</span>
          </div>
          <div class="receipt-order-no">Order ${order.orderNumber}</div>
        </div>

        <div class="receipt-meta-grid">
          <div>
            <span class="meta-label">Date Placed:</span>
            <span class="meta-val">${new Date(order.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
          </div>
          <div>
            <span class="meta-label">Est. Delivery:</span>
            <span class="meta-val text-emerald-400">${deliveryDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
          </div>
          <div>
            <span class="meta-label">Customer:</span>
            <span class="meta-val">${order.customer.fullName}</span>
          </div>
          <div>
            <span class="meta-label">Ship To:</span>
            <span class="meta-val">${order.customer.city}, ${order.customer.postalCode}</span>
          </div>
        </div>

        <div class="receipt-items-table">
          <div class="table-header">
            <span>Item</span>
            <span class="text-center">Qty</span>
            <span class="text-right">Price</span>
          </div>
          ${order.items
            .map(
              (item) => `
            <div class="table-row">
              <span class="item-title">${item.name}</span>
              <span class="text-center">${item.quantity}</span>
              <span class="text-right">${formatCurrency(item.price * item.quantity)}</span>
            </div>
          `
            )
            .join("")}
        </div>

        <div class="receipt-breakdown">
          <div class="row"><span>Subtotal:</span><span>${formatCurrency(order.totals.subtotal)}</span></div>
          <div class="row"><span>Shipping:</span><span>${order.totals.shippingFee === 0 ? "FREE" : formatCurrency(order.totals.shippingFee)}</span></div>
          ${order.totals.discount > 0 ? `<div class="row text-emerald-400"><span>Discount (${order.totals.couponCode}):</span><span>-${formatCurrency(order.totals.discount)}</span></div>` : ""}
          <div class="row"><span>Estimated Tax:</span><span>${formatCurrency(order.totals.estimatedTax)}</span></div>
          <div class="row total-row"><span>Total Paid:</span><span>${formatCurrency(order.totals.grandTotal)}</span></div>
        </div>
      </div>
    `;

    closeModal("checkout-modal");
    closeDrawer("cart-drawer");
    openModal("order-confirmation-modal");
  }

  // -------------------------------------------------------------
  // ORDER HISTORY MODAL
  // -------------------------------------------------------------
  function renderOrderHistoryModal() {
    const listEl = document.getElementById("order-history-list");
    const emptyEl = document.getElementById("orders-empty-state");
    const orders = AppState.getOrders();

    if (!listEl) return;

    if (orders.length === 0) {
      listEl.innerHTML = "";
      if (emptyEl) emptyEl.style.display = "block";
      return;
    }

    if (emptyEl) emptyEl.style.display = "none";

    listEl.innerHTML = orders
      .map(
        (order) => `
        <div class="order-history-card">
          <div class="order-header-line">
            <div>
              <span class="order-number">${order.orderNumber}</span>
              <span class="order-date">${new Date(order.date).toLocaleDateString()}</span>
            </div>
            <span class="order-status-badge status-confirmed">Confirmed</span>
          </div>

          <div class="order-summary-row">
            <span class="order-items-count">${order.items.length} items (${order.items.reduce((s, i) => s + i.quantity, 0)} units)</span>
            <span class="order-total-amount">${formatCurrency(order.totals.grandTotal)}</span>
          </div>

          <div class="order-item-thumbnails">
            ${order.items.map((i) => `<img src="${i.image}" alt="${i.name}" title="${i.name} (x${i.quantity})" />`).join("")}
          </div>
        </div>
      `
      )
      .join("");
  }

  // -------------------------------------------------------------
  // MODAL & DRAWER SYSTEM
  // -------------------------------------------------------------
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add("active");
      document.body.classList.add("modal-open");
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove("active");
      document.body.classList.remove("modal-open");
    }
  }

  function openDrawer(drawerId) {
    const drawer = document.getElementById(drawerId);
    const overlay = document.getElementById("drawer-overlay");
    if (drawer) {
      drawer.classList.add("active");
      if (overlay) overlay.classList.add("active");
      document.body.classList.add("modal-open");
    }
  }

  function closeDrawer(drawerId) {
    const drawer = document.getElementById(drawerId);
    const overlay = document.getElementById("drawer-overlay");
    if (drawer) {
      drawer.classList.remove("active");
      if (overlay) overlay.classList.remove("active");
      document.body.classList.remove("modal-open");
    }
  }

  function closeAllDrawersAndModals() {
    document.querySelectorAll(".modal.active").forEach((m) => m.classList.remove("active"));
    document.querySelectorAll(".drawer.active").forEach((d) => d.classList.remove("active"));
    const overlay = document.getElementById("drawer-overlay");
    if (overlay) overlay.classList.remove("active");
    document.body.classList.remove("modal-open");
  }

  return {
    showToast,
    formatCurrency,
    renderProductsGrid,
    updateCartBadge,
    updateWishlistBadge,
    renderCartDrawer,
    openProductModal,
    renderWishlistModal,
    renderCheckoutSummary,
    showOrderConfirmation,
    renderOrderHistoryModal,
    openModal,
    closeModal,
    openDrawer,
    closeDrawer,
    closeAllDrawersAndModals
  };
})();
