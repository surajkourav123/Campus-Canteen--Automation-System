// ==== SESSION GUARD AT TOP ====
const allowedRole = "student";
if (!localStorage.getItem("isLoggedIn") || localStorage.getItem("userRole") !== allowedRole)
  window.location.href = "index.html";

let cart = [];
let currentCategory = "all";

// ===== ALWAYS LIVE MENU (admin+seed merge) =====
function getMenuItems() {
  // Seed demo items
  let seed = [
    {id: 1, name: "Idli Sambar", category: "breakfast", price: 40, img: "idli.jpg", description: "South Indian favorite, soft idlis with spicy sambar", available: true, rating: 4.7},
    {id: 2, name: "Masala Dosa", category: "breakfast", price: 60, img: "dosa.jpg", description: "Crispy dosa stuffed with potato masala", available: true, rating: 4.8},
    {id: 3, name: "Paneer Tikka", category: "snacks", price: 90, img: "paneer.jpg", description: "Grilled paneer with spicy flavors", available: true, rating: 4.6},
    {id: 4, name: "Chole Bhature", category: "lunch", price: 80, img: "chole.jpg", description: "Classic North Indian dish", available: true, rating: 4.5},
    {id: 5, name: "Cold Coffee", category: "beverages", price: 45, img: "coffee.jpg", description: "Chilled coffee with cream", available: true, rating: 4.4},
    {id: 6, name: "Regular Thaali", category: "lunch", price: 150, img: "thaali.jpg", description: "Fresh Food, Happy Mood!", available: true, rating: 4.9}
  ];
  let adminMenu = JSON.parse(localStorage.getItem("menu") || "[]");
  let items = [...seed];
  adminMenu.forEach(item => {
    let idx = items.findIndex(s => s.name === item.name && s.category === item.category);
    if(idx >= 0) items[idx] = {...items[idx], ...item};
    else items.push(item);
  });
  items.forEach((item, i) => { item.id = i + 1; });
  return items;
}

// ===== MENU CATEGORY TABS =====
function renderCategoryTabs() {
  let cats = ["all", "breakfast", "lunch", "snacks", "beverages", "desserts"];
  let icons = ["All Items","🍳 Breakfast","🍛 Lunch","🍕 Snacks","☕ Beverages","🍰 Desserts"];
  document.getElementById("categoryTabs").innerHTML = cats.map((cat,i) =>
      `<button onclick="filterCategory('${cat}')" class="category-tab px-6 py-3 rounded-lg font-semibold bg-orange-100${cat===currentCategory?' active':''}">${icons[i]}</button>`
  ).join("");
}

// ===== MENU GRID =====
function renderMenu(category="all") {
  const grid = document.getElementById("menuGrid");
  let menuItems = getMenuItems();
  let filtered = category === "all" ? menuItems : menuItems.filter(item => item.category === category);
  grid.innerHTML = filtered.length === 0 ?
      `<div class="col-span-3 text-center text-gray-400 py-12">No items found for this category!</div>`
  : filtered.map(item => `
      <div class="menu-card bg-white rounded-xl shadow-lg p-4 mb-4">
        <img src="${item.img}" alt="${item.name}" style="width:80px;border-radius:12px;margin-bottom:8px;" onerror="this.src='https://via.placeholder.com/80?text=No+Image';">
        <h3 class="font-bold text-xl mb-1">${item.name} <span class="text-orange-500">₹${item.price}</span></h3>
        <div class="text-yellow-400 text-sm mb-1">⭐${item.rating}</div>
        <p class="text-gray-700 mb-2">${item.description}</p>
        <button onclick="addToCart(${item.id})" ${item.available===false ? "disabled" : ""} class="px-4 py-2 bg-gradient-to-r from-orange-400 to-red-400 text-white rounded-lg font-bold shadow hover:scale-105">${item.available!==false ? "Add to Cart" : "Out of Stock"}</button>
      </div>
  `).join('');
}

// ===== CART & CART UI =====
function addToCart(itemId) {
  const menuItems = getMenuItems();
  const item = menuItems.find(i => i.id === itemId);
  if (!item || item.available === false) return;
  const existing = cart.find(i => i.id === itemId);
  if (existing) { existing.quantity += 1; }
  else { cart.push({ ...item, quantity: 1 }); }
  updateCart();
  renderCart();
}
function updateCart() {
  document.getElementById("cartCount").textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}
function renderCart() {
  const cartDiv = document.getElementById("cartItems");
  if(cart.length === 0) {
    cartDiv.innerHTML = "<div class='text-center text-gray-400 mt-20'>Your cart is empty</div>";
    document.getElementById("cartSubtotal").textContent = "₹0";
    document.getElementById("cartTax").textContent = "₹0";
    document.getElementById("cartTotal").textContent = "₹0";
    return;
  }
  let subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  let tax = Math.round(subtotal * 0.05);
  let total = subtotal + tax;
  cartDiv.innerHTML = cart.map(item => `
      <div class='flex mb-4 items-center'>
        <img src="${item.img}" style="width:40px;border-radius:6px;margin-right:10px;" onerror="this.src='https://via.placeholder.com/80?text=No+Image';">
        <span class="font-bold mr-2">${item.name} (${item.quantity})</span>
        <span class="ml-auto">₹${item.price * item.quantity}</span>
        <button onclick="removeFromCart(${item.id})" class="ml-3 text-red-600">✖</button>
      </div>
  `).join('');
  document.getElementById("cartSubtotal").textContent = "₹" + subtotal;
  document.getElementById("cartTax").textContent = "₹" + tax;
  document.getElementById("cartTotal").textContent = "₹" + total;
}
function removeFromCart(itemId) {
  cart = cart.filter(i => i.id !== itemId);
  updateCart();
  renderCart();
}

// ===== CATEGORY FILTER =====
function filterCategory(category) {
  currentCategory = category;
  renderMenu(category);
  renderCategoryTabs();
}

// ===== ORDER PLACEMENT/PROCESSING =====
function proceedToCheckout() {
  if(cart.length === 0) return;
  document.getElementById("paymentModal").classList.remove("hidden");
  document.getElementById("orderSummary").innerHTML = cart.map(item => `<div>${item.name} x${item.quantity}: ₹${item.price * item.quantity}</div>`).join('') + 
    `<div><strong>Total: ${document.getElementById("cartTotal").textContent}</strong></div>`;
}
function processPayment(method) {
  document.getElementById("paymentModal").classList.add("hidden");
  document.getElementById("confirmationModal").classList.remove("hidden");
  let orderId = "ORD" + Math.floor(Math.random() * 100000);
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.push({
    id: orderId,
    items: cart.map(i => `${i.name} x${i.quantity}`),
    total: document.getElementById("cartTotal").textContent,
    status: "Preparing",
    date: new Date().toLocaleString()
  });
  localStorage.setItem("orders", JSON.stringify(orders));
  let details = `Order <b>${orderId}</b> placed! Payment: ${method}.<br>Track Status below.`;
  document.getElementById("confirmationDetails").innerHTML = details;
  cart = [];
  updateCart();
  renderCart();
  renderOrderHistory();
}

// ===== ORDER HISTORY =====
function renderOrderHistory() {
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  const list = document.getElementById("orderHistoryList");
  if(!list) return;
  if(orders.length === 0) {
    list.innerHTML = "<div class='text-center text-gray-400 mt-20'>No orders yet</div>";
    return;
  }
  list.innerHTML = orders.map(order => `
    <div class="border-b pb-4 mb-4">
      <div class="font-bold">Order: ${order.id}</div>
      <div>Items: ${order.items.join(", ")}</div>
      <div>Total: ${order.total}</div>
      <div>Date: <span class="text-gray-500">${order.date||""}</span></div>
      <div class="mt-1 text-orange-600 font-bold">Status: ${order.status}</div>
    </div>
  `).join('');
}

// ==== CART & ORDER UI TOGGLES ====
function toggleCart() {
  let sidebar = document.getElementById("cartSidebar");
  sidebar.style.transform = sidebar.style.transform === "translateX(0%)" ? "translateX(100%)" : "translateX(0%)";
}
function toggleOrderHistory(forceOpen=false) {
  let sidebar = document.getElementById("orderHistory");
  if(forceOpen) sidebar.style.transform = "translateX(0%)";
  else sidebar.style.transform = sidebar.style.transform === "translateX(0%)" ? "translateX(100%)" : "translateX(0%)";
  renderOrderHistory();
}
function closePaymentModal() {
  document.getElementById("paymentModal").classList.add("hidden");
}
function closeConfirmationModal() {
  document.getElementById("confirmationModal").classList.add("hidden");
  toggleOrderHistory(true);
}

// ==== LOGOUT ====
function logoutFn() { localStorage.clear(); window.location.href = "index.html"; }

// ==== AUTO REFRESH FOR LIVE MENU/ADMIN CHANGES ====
function liveMenuSync(){
  renderMenu(currentCategory);
  renderCategoryTabs();
}

document.addEventListener("DOMContentLoaded", () => {
  renderMenu();
  renderCategoryTabs();
  renderCart();
  renderOrderHistory();
  setInterval(liveMenuSync, 2000);
});
