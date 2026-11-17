# VoltTech - Modern E-Commerce Web Application ⚡

> **A portfolio-ready, high-performance E-Commerce frontend engineered with HTML5, CSS3 (Modern Flexbox & CSS Grid), and Modular Vanilla JavaScript (ES6+).** Zero build steps, zero external dependencies, zero framework bloat — runs seamlessly in any modern web browser.

---

## 🌟 Live Features & Capabilities

- **🛍️ Dynamic Product Catalog**:
  - 12 flagship consumer electronics (Laptops, Smartphones, Audio, Wearables, Accessories).
  - High-resolution imagery, technical specifications table, key feature highlights, and customer reviews.
  - Stock indicators (In Stock, Low Stock warnings, Sold Out states).
  - Discount tags and promotional badges (`Bestseller`, `Sale`, `New`, `Hot`).

- **🔍 Search, Filter & Sorting Engine**:
  - **Instant Debounced Search**: Fast search through product titles, categories, and descriptions with 250ms debouncing.
  - **Category Tabs**: Filter instantaneously across *All*, *Laptops*, *Smartphones*, *Audio*, *Wearables*, and *Accessories*.
  - **Interactive Price Range Slider**: Live filtering by maximum budget (up to $2,500).
  - **Stock Status Filter**: Toggle to view only items currently available in inventory.
  - **Multi-criteria Sorting**: Sort by *Featured*, *Price: Low to High*, *Price: High to Low*, *Highest Rating*, or *Alphabetical (A-Z)*.

- **🛒 Reactive Shopping Cart**:
  - Slide-over drawer with smooth transition animations.
  - Increment / decrement quantity with automatic inventory boundary checks.
  - Dynamic **Free Shipping Progress Tracker** (calculates how much more is needed to reach the $99 threshold).
  - Item removal with confirmation.
  - Real-time cart total recalculation (Subtotal, Shipping, Tax, Discounts, Grand Total).

- **🎟️ Promotional Coupon Engine**:
  - Real interactive promo codes with minimum-spend validations:
    - `TECH10`: 10% off entire order.
    - `FRESHER25`: $25 flat discount on orders above $100.
    - `VOLT50`: $50 flat discount on orders above $300.
    - `FREESHIP`: Unlocks free express shipping.

- **💖 Wishlist / Favorites**:
  - Save items with one click directly from cards or product modals.
  - Dedicated Wishlist modal to review saved gadgets and move them directly to the cart.

- **💳 Multi-Method Checkout & Order Generation**:
  - Express checkout modal with shipping address inputs and format validation.
  - Payment method choices: *Credit/Debit Card* (with auto-spacing card number formatter & expiry formatter), *UPI / QR*, and *Cash on Delivery*.
  - Realistic order submission simulation with loading spinner.
  - **Printable Order Receipt / Invoice**: Itemized receipt with unique generated Order ID (`#VT-XXXXXX`), estimated delivery date, and print invoice button.
  - **Order History Viewer**: Stores past orders in the browser for future reference.

- **🌓 Dark & Light Mode Support**:
  - Aesthetic tech-dark theme by default, with seamless one-click switch to light mode.
  - User preference persisted in `localStorage`.

- **💾 Persistent State**:
  - Cart items, wishlist items, past orders, and theme preferences persist across browser reloads using `localStorage`.

---

## 📁 Project Architecture & Directory Structure

```
volt-tech-store/
├── index.html               # Semantic HTML5 layout, accessible ARIA roles, modals & drawer
├── css/
│   └── styles.css           # Modern CSS variables, Glassmorphism, Responsive Grid & Flexbox
├── js/
│   ├── products.js          # Product data schema, specs, and promo codes dictionary
│   ├── state.js             # Centralized State Management, Pub/Sub pattern, LocalStorage synchronization
│   ├── ui.js                # DOM rendering engine, card templates, modals, drawers, and toasts
│   └── app.js               # Application bootstrap, debounced filters, event delegation, and checkout logic
├── README.md                # Project documentation and deployment guide
└── INTERVIEW_GUIDE.md       # Comprehensive fresher interview prep and code walkthrough
```

---

## 🚀 How to Run the Project

### Option 1: Direct File Opening (No Installation Required)
Simply navigate to the project folder on your computer and **double-click `index.html`** to open it in Chrome, Edge, Firefox, or Safari!

### Option 2: Live Server (VS Code)
1. Open the `volt-tech-store` folder in Visual Studio Code.
2. Right-click `index.html` and click **"Open with Live Server"**.

### Option 3: Python Built-in Server
Open your terminal in the `volt-tech-store` folder and run:
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000` in your web browser.

---

## 🌐 Free 1-Click Deployment (For Your Resume / Portfolio)

### Deploying to GitHub Pages (100% Free):
1. Create a new GitHub repository named `volt-tech-store`.
2. Push this project code to the `main` branch:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of VoltTech E-Commerce store"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/volt-tech-store.git
   git push -u origin main
   ```
3. On GitHub, navigate to **Settings** > **Pages**.
4. Under **Branch**, select `main` and `/ (root)`, then click **Save**.
5. Your live website URL will be ready at: `https://YOUR_USERNAME.github.io/volt-tech-store/`! Add this link to your resume and LinkedIn.

---

## 💡 Tech Stack & Design Decisions

| Category | Technology | Rationale |
|---|---|---|
| **Structure** | Semantic HTML5 | Clean SEO-friendly tags (`header`, `nav`, `main`, `article`, `aside`, `footer`) |
| **Styling** | Modern CSS3 | CSS Custom Properties (Variables), Flexbox, CSS Grid, Glassmorphism effects |
| **Icons & Fonts** | Font Awesome 6 & Google Fonts Inter | Professional typography and crisp vector iconography |
| **Scripting** | Vanilla JavaScript (ES6+) | Demonstrates core JavaScript proficiency (DOM manipulation, Closures, Event Delegation) |
| **State Pattern** | Pub/Sub & Module Pattern | Decouples data mutation from view rendering |
| **Persistence** | Web Storage API (`localStorage`) | Keeps cart and order history intact across browser sessions |

---

## 📜 License
MIT License. Feel free to use this project for your portfolio, resume, academic submissions, or personal learning!
