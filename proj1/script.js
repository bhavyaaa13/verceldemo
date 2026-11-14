// Product Catalog Data
const products = [
  { id: 1, name: "Wireless Headphones", category: "Electronics", price: 2499, icon: "🎧" },
  { id: 2, name: "Smart Watch", category: "Electronics", price: 3999, icon: "⌚" },
  { id: 3, name: "Cotton Hoodie", category: "Fashion", price: 1299, icon: "🧥" },
  { id: 4, name: "Running Sneakers", category: "Fashion", price: 2999, icon: "👟" },
  { id: 5, name: "Laptop Backpack", category: "Accessories", price: 1499, icon: "🎒" },
  { id: 6, name: "Aviator Sunglasses", category: "Accessories", price: 899, icon: "🕶️" },
  { id: 7, name: "Mechanical Keyboard", category: "Electronics", price: 3499, icon: "⌨️" },
  { id: 8, name: "Denim Jacket", category: "Fashion", price: 1999, icon: "👕" }
];

// State Variables
let cart = JSON.parse(localStorage.getItem("techKartCart")) || [];
let currentCategory = "All";
let searchQuery = "";

// DOM Elements
const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const filterBtns = document.querySelectorAll(".filter-btn");
const cartDrawer = document.getElementById("cartDrawer");
const cartToggleBtn = document.getElementById("cartToggleBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartItemsContainer = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutModal = document.getElementById("checkoutModal");
const cancelOrderBtn = document.getElementById("cancelOrderBtn");
const confirmOrderBtn = document.getElementById("confirmOrderBtn");

// Render Products based on filter & search
function renderProducts() {
  productGrid.innerHTML = "";

  const filtered = products.filter(item => {
    const matchesCategory = currentCategory === "All" || item.category === currentCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    productGrid.innerHTML = "<p>No products found.</p>";
    return;
  }

  filtered.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <div>
        <div class="product-icon">${product.icon}</div>
        <div class="product-category">${product.category}</div>
        <h4 class="product-title">${product.name}</h4>
        <div class="product-price">₹${product.price}</div>
      </div>
      <button class="add-btn" onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    productGrid.appendChild(card);
  });
}

// Add item to Cart
function addToCart(productId) {
  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    const product = products.find(p => p.id === productId);
    cart.push({ ...product, qty: 1 });
  }
  saveAndRenderCart();
}

// Update Quantity (+1 or -1)
function updateQty(productId, change) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.qty += change;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== productId);
  }
  saveAndRenderCart();
}

// Save to LocalStorage and Update Cart UI
function saveAndRenderCart() {
  localStorage.setItem("techKartCart", JSON.stringify(cart));
  cartItemsContainer.innerHTML = "";

  let totalItems = 0;
  let totalPrice = 0;

  cart.forEach(item => {
    totalItems += item.qty;
    totalPrice += item.price * item.qty;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <div>
        <strong>${item.name}</strong><br>
        <small>₹${item.price} x ${item.qty}</small>
      </div>
      <div class="qty-controls">
        <button onclick="updateQty(${item.id}, -1)">-</button>
        <span>${item.qty}</span>
        <button onclick="updateQty(${item.id}, 1)">+</button>
      </div>
    `;
    cartItemsContainer.appendChild(div);
  });

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
  }

  cartCount.textContent = totalItems;
  cartTotal.textContent = totalPrice;
}

// Event Listeners
searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value;
  renderProducts();
});

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentCategory = btn.dataset.category;
    renderProducts();
  });
});

cartToggleBtn.addEventListener("click", () => cartDrawer.classList.add("open"));
closeCartBtn.addEventListener("click", () => cartDrawer.classList.remove("open"));

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  document.getElementById("orderSummaryText").textContent = `Total Payable: ₹${cartTotal.textContent}`;
  checkoutModal.classList.remove("hidden");
});

cancelOrderBtn.addEventListener("click", () => checkoutModal.classList.add("hidden"));

confirmOrderBtn.addEventListener("click", () => {
  const name = document.getElementById("customerName").value.trim();
  const address = document.getElementById("customerAddress").value.trim();

  if (!name || !address) {
    alert("Please enter your name and address.");
    return;
  }

  alert(`Thank you, ${name}! Your order of ₹${cartTotal.textContent} has been placed.`);
  cart = [];
  saveAndRenderCart();
  checkoutModal.classList.add("hidden");
  cartDrawer.classList.remove("open");
});

// Initialize App
renderProducts();
saveAndRenderCart();