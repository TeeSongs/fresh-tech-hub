document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  toggle.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });

  const orderSummary = document.getElementById("orderSummary");
  const orderTotal = document.getElementById("orderTotal");
  const checkoutForm = document.getElementById("checkoutForm");
  const confirmation = document.getElementById("confirmation");

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    orderSummary.innerHTML = "<p>Your cart is empty.</p>";
    orderTotal.textContent = "0";
    checkoutForm.querySelector("button").disabled = true;
    return;
  }

  let total = 0;
  orderSummary.innerHTML = cart.map(item => {
    const subtotal = item.qty * item.price;
    total += subtotal;
    return `
      <div class="checkout-item">
        <p><strong>${item.name}</strong> × ${item.qty}</p>
        <p>₦${subtotal.toLocaleString()}</p>
      </div>
    `;
  }).join("");

  orderTotal.textContent = total.toLocaleString();

  checkoutForm.addEventListener("submit", e => {
    e.preventDefault();
    confirmation.classList.remove("hidden");
    checkoutForm.classList.add("hidden");
    localStorage.removeItem("cart");
  });
});
