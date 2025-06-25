document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderCart();
});

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  const cartCount = document.getElementById("cartCount");
  if (cartCount) cartCount.textContent = totalItems;
}

function renderCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");

  if (!cartItems || !cartTotal) return; // Safety check

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Your cart is empty.</p>";
    cartTotal.textContent = "0";
    return;
  }

  let total = 0;
  cartItems.innerHTML = cart.map((item, index) => {
    const itemTotal = item.qty * parseInt(item.price);
    total += itemTotal;
    return `
      <div class="cart-item">
        <img src="${item.img}" alt="${item.name}">
        <div class="item-info">
          <h4>${item.name}</h4>
          <p>Price: ₦${Number(item.price).toLocaleString()}</p>
          <div class="quantity-controls">
            <button class="decrease-btn" data-index="${index}">➖</button>
            <span>${item.qty}</span>
            <button class="increase-btn" data-index="${index}">➕</button>
          </div>
          <p>Total: ₦${itemTotal.toLocaleString()}</p>
        </div>
        <button class="delete-btn" data-index="${index}">🗑️</button>
      </div>
    `;
  }).join("");

  cartTotal.textContent = total.toLocaleString();
}

// ✅ All button actions handled in one event listener
document.addEventListener("click", function (e) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const index = Number(e.target.getAttribute("data-index"));

  if (Number.isNaN(index)) return; // Safety check

  // Delete
  if (e.target.classList.contains("delete-btn")) {
    cart.splice(index, 1);
  }

  // Increase
  if (e.target.classList.contains("increase-btn")) {
    if (cart[index]) cart[index].qty += 1;
  }

  // Decrease
  if (e.target.classList.contains("decrease-btn")) {
    if (cart[index]) {
      if (cart[index].qty > 1) {
        cart[index].qty -= 1;
      } else {
        if (confirm("Remove this item from the cart?")) {
          cart.splice(index, 1);
        }
      }
    }
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  updateCartCount();
});

// Clear cart
document.getElementById("clearCart")?.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear the entire cart?")) {
    localStorage.removeItem("cart");
    renderCart();
    updateCartCount();
  }
});
