// ===== SECURE SESSION GUARD (very first line) =====
if (!localStorage.getItem("isLoggedIn") || localStorage.getItem("userRole") !== "cashier")
  window.location.href = "index.html";

// ===== LOGOUT FUNCTION =====
function logoutFn() {
  localStorage.clear();
  window.location.href = "index.html";
}

// ===== ALWAYS FRESH ORDERS FETCH =====
function fetchOrders() {
  return JSON.parse(localStorage.getItem("orders")) || [];
}

// ===== RENDER ORDER CARDS =====
function renderPayments(filter="") {
  const orders = fetchOrders();
  const el = document.getElementById("paymentOrders");
  if (!el) return;
  let filtered = orders;
  if (filter) {
    const text = filter.trim().toLowerCase();
    filtered = orders.filter(o =>
      o.id.toLowerCase().includes(text)
      || (o.status||"").toLowerCase().includes(text)
    );
  }
  if(filtered.length === 0) {
    el.innerHTML = `<div class="text-center text-gray-400 py-7 text-lg">No orders found.</div>`;
    return;
  }
  el.innerHTML = filtered.map(o => `
    <div class="p-4 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
      <div>
        <b class="text-blue-600 font-mono text-lg">#${o.id}</b>
        <span class="ml-3 text-gray-500 text-sm">${o.date||''}</span>
        <span class="ml-2 text-orange-600 font-bold">${o.items?.join(', ')}</span>
        <span class="ml-3 text-gray-700">₹${o.total}</span>
      </div>
      <div class="flex items-center gap-3 mt-1">
        <span class="rounded-xl px-3 py-1 font-bold 
          ${o.status==="Paid" ? "bg-green-100 text-green-800" 
          : o.status==="Ready" ? "bg-yellow-50 text-yellow-600" 
          : "bg-orange-100 text-orange-700"}">
          ${o.status||"Preparing"}
        </span>
        ${o.status !== "Paid" && o.status !== "Done"
          ? `<button onclick="markPaid('${o.id}')" class="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold text-sm transition">Mark Paid</button>`
          : `<span class="text-green-700 font-bold text-sm">Paid!</span>`
        }
      </div>
    </div>
  `).join("");
}

// ===== RENDER SALES + LIVE STATS =====
function renderCashierStats() {
  const orders = fetchOrders();
  const paid = orders.filter(o => o.status === "Paid");
  const unpaid = orders.filter(o => o.status !== "Paid" && o.status !== "Done");
  // IDs as per your stats card on cashier.html
  if (document.getElementById("totalPaid")) document.getElementById("totalPaid").textContent = paid.length;
  if (document.getElementById("totalUnpaid")) document.getElementById("totalUnpaid").textContent = unpaid.length;
  let totalAmt = paid.reduce((sum, o) => sum + (parseInt((o.total+"").replace(/[^\d]/g,""))||0), 0);
  if (document.getElementById("todayAmount")) document.getElementById("todayAmount").textContent = "₹" + totalAmt;
}

// ===== MARK AS PAID (INSTANT + SAFE) =====
function markPaid(orderId) {
  const orders = fetchOrders();
  const idx = orders.findIndex(o => o.id === orderId);
  if (idx >= 0 && orders[idx].status !== "Paid") {
    orders[idx].status = "Paid";
    localStorage.setItem("orders", JSON.stringify(orders));
    renderPayments(document.getElementById('orderSearch')?.value || "");
    renderCashierStats();
    showCashierToast(`Order ${orderId} marked Paid!`, "bg-green-600");
  } else {
    showCashierToast("Order already Paid or not found.", "bg-red-600");
  }
}

// ===== SEARCH BAR SUPPORT =====
function setupOrderSearch() {
  const search = document.getElementById("orderSearch");
  if (search) {
    search.addEventListener("input", (e) => {
      renderPayments(e.target.value);
      renderCashierStats();
    });
  }
}

// ===== TOAST NOTIFICATION (UNIVERSAL) =====
function showCashierToast(msg, color="bg-blue-600") {
  let toast = document.getElementById("cashierToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "cashierToast";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.className = `fixed bottom-7 right-7 z-50 ${color} text-white font-bold px-6 py-3 rounded-xl shadow-lg opacity-100 pointer-events-auto transition-opacity duration-300`;
  setTimeout(() => {
    toast.className = `fixed bottom-7 right-7 z-50 ${color} text-white font-bold px-6 py-3 rounded-xl shadow-lg opacity-0 pointer-events-none transition-opacity duration-300`;
  }, 1600);
}

// ===== INIT ON LOAD =====
document.addEventListener("DOMContentLoaded", () => {
  renderPayments();
  renderCashierStats();
  setupOrderSearch();
});

// ===== LIVE REFRESH (SAFE) =====
setInterval(() => {
  renderPayments(document.getElementById('orderSearch')?.value || "");
  renderCashierStats();
}, 4000);
