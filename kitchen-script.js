// ==== KITCHEN SESSION GUARD, ALWAYS AT TOP ====
if(!localStorage.getItem("isLoggedIn") || localStorage.getItem("userRole") !== "kitchen")
  window.location.href = "index.html";

// ==== LOGOUT (button call) ====
function logoutFn() {
  localStorage.clear();
  window.location.href = "index.html";
}

// ==== Live Orders Fetch + Render ====
function fetchOrderQueue() {
  return JSON.parse(localStorage.getItem("orders")) || [];
}

function renderOrders(filter="") {
  const fullQueue = fetchOrderQueue();
  let queue = fullQueue.filter(o => !["Done", "Paid"].includes(o.status));
  if(filter) {
    queue = queue.filter(o => o.id.toLowerCase().includes(filter) || (o.status||"").toLowerCase().includes(filter));
  }
  const el = document.getElementById("orderQueue");
  if(!el) return;
  if(queue.length === 0) {
    el.innerHTML = `<div class="text-center text-gray-400 py-8 text-lg">No pending orders.</div>`;
    return;
  }
  el.innerHTML = queue.map(o => `
    <div class="p-4 flex flex-col md:flex-row justify-between items-start md:items-center border-b gap-2">
      <div>
        <b class="text-green-800 font-mono text-lg">#${o.id}</b>
        <span class="ml-3 font-semibold text-orange-700">${o.items?.join(", ")}</span>
        <span class="ml-3 text-gray-700">₹${o.total || ''}</span>
      </div>
      <div class="flex items-center gap-2 mt-2">
        <span class="rounded-xl px-3 py-1 font-bold ${o.status === "Ready" ? "bg-yellow-200 text-yellow-700" : "bg-orange-100 text-orange-700"}">${o.status||"Preparing"}</span>
        ${o.status === "Ready"
            ? `<button onclick="markDone('${o.id}')" class="bg-emerald-600 text-white px-4 py-1 rounded-xl font-bold text-sm hover:bg-emerald-700">Done</button>`
            : `<button onclick="markReady('${o.id}')" class="bg-green-500 hover:bg-green-700 text-white px-4 py-1 rounded-xl font-bold text-sm">Mark Ready</button>`
        }
      </div>
    </div>
  `).join("");
}

// ==== Mark Ready ====
function markReady(orderId) {
  let orders = fetchOrderQueue();
  const idx = orders.findIndex(o => o.id === orderId);
  if(idx >= 0 && orders[idx].status !== "Ready" && orders[idx].status !== "Done") {
    orders[idx].status = "Ready";
    localStorage.setItem("orders", JSON.stringify(orders));
    renderOrders(document.getElementById("kitchenSearch")?.value || "");
    showKitchenToast(`Order ${orderId} marked Ready!`,"bg-green-600");
  } else {
    showKitchenToast("Order already Ready/Done or not found.","bg-yellow-500");
  }
}

// ==== Mark Done ====
function markDone(orderId) {
  let orders = fetchOrderQueue();
  const idx = orders.findIndex(o => o.id === orderId);
  if(idx >= 0 && orders[idx].status === "Ready") {
    orders[idx].status = "Done";
    localStorage.setItem("orders", JSON.stringify(orders));
    renderOrders(document.getElementById("kitchenSearch")?.value || "");
    showKitchenToast(`Order ${orderId} marked Done!`,"bg-emerald-600");
  } else {
    showKitchenToast("Only Ready orders can be marked Done.","bg-yellow-500");
  }
}

// ==== Search/Filter Support ====
function setupKitchenSearch() {
  const search = document.getElementById("kitchenSearch");
  if(search) {
    search.addEventListener("input", e => renderOrders(e.target.value));
  }
}

// ==== Toast Notification ====
function showKitchenToast(msg, color="bg-orange-600") {
  let toast = document.getElementById("kitchenToast");
  if(!toast) {
    toast = document.createElement("div");
    toast.id = "kitchenToast";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.className = `fixed bottom-7 right-7 z-50 ${color} text-white font-bold px-6 py-3 rounded-xl shadow-lg opacity-100 pointer-events-auto transition-opacity duration-300`;
  setTimeout(() => {
    toast.className = `fixed bottom-7 right-7 z-50 ${color} text-white font-bold px-6 py-3 rounded-xl shadow-lg opacity-0 pointer-events-none transition-opacity duration-300`;
  }, 1600);
}

// ==== INIT PAGE LOAD ====
document.addEventListener("DOMContentLoaded", () => {
  renderOrders();
  setupKitchenSearch();
});
setInterval(() => { renderOrders(document.getElementById('kitchenSearch')?.value || ""); }, 5000);
