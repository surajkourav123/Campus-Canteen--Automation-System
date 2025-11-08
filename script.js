function showLogin() {
    document.getElementById("loginModal").classList.remove("hidden");
}
function hideLogin() {
    document.getElementById("loginModal").classList.add("hidden");
}
// Demo full redirect to menu
function handleLogin() {
    const role = document.getElementById("roleSelect").value;
    hideLogin();
    if (role === "student") {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userRole", "student");
        window.location.href = "menu.html";
    } else if (role === "admin") {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userRole", "admin");
        window.location.href = "admin.html";
    } else if (role === "kitchen") {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userRole", "kitchen");
        window.location.href = "kitchen.html";
    } else if (role === "cashier") {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userRole", "cashier");
        window.location.href = "cashier.html";
    } else {
        alert("Role select karo!");
        return;
    }
}
// Modal close on background click
document.getElementById("loginModal").addEventListener("click", function(e) {
    if (e.target === this) hideLogin();
});
