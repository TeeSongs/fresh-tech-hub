// === Navbar toggle ===
const toggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

toggle.addEventListener('click', () => {
  navLinks.classList.toggle('show');
});

// === Variables ===
let products = [];
let filteredProducts = [];
let visibleCount = 8;

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const loadMoreBtn = document.getElementById("loadMoreBtn");
const clearBtn = document.getElementById("clearFilters");

// === Load products from JSON ===
async function loadProducts() {
  try {
    const response = await fetch("../data/products.json");
    if (!response.ok) throw new Error("Failed to fetch products");
    products = await response.json();
    filteredProducts = products; // Default
    renderProducts();
  } catch (err) {
    console.error(err);
    productGrid.innerHTML = "<p>Failed to load products.</p>";
  }
}

// === Load categories from JSON ===
async function loadCategories() {
  try {
    const response = await fetch("../data/categories.json");
    if (!response.ok) throw new Error("Failed to fetch categories");
    const categories = await response.json();
    categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = capitalize(cat);
      categoryFilter.appendChild(option);
    });
  } catch (err) {
    console.error(err);
  }
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// === Render products ===
function renderProducts() {
  const displayed = filteredProducts.slice(0, visibleCount);
  
  // Only add new cards, don't clear everything
  if (productGrid.children.length === 0) {
    productGrid.innerHTML = ""; // Fresh render
  }

  if (displayed.length === 0) {
    productGrid.innerHTML = `<p class="no-results">No products found.</p>`;
    loadMoreBtn.style.display = "none";
    return;
  }

  const existingCount = productGrid.querySelectorAll('.product-card').length;

  const newItems = displayed.slice(existingCount).map(product => `
    <div class="product-card">
      <img src="${product.img}" alt="${product.name}" loading="lazy">
      <h3>${product.name}</h3>
      <p class="price">₦${Number(product.price).toLocaleString()}</p>
      <button class="btn add-to-cart" data-name="${product.name}">Add to Cart</button>
    </div>
  `).join('');

  productGrid.insertAdjacentHTML('beforeend', newItems);

  // Toggle Load More
  if (displayed.length >= filteredProducts.length) {
    loadMoreBtn.style.display = "none";
  } else {
    loadMoreBtn.style.display = "block";
  }
}

// === Filter products ===
function filterProducts() {
  const search = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;

  filteredProducts = products.filter(p =>
    (category === "all" || p.category === category) &&
    p.name.toLowerCase().includes(search)
  );

  visibleCount = 8;
  productGrid.innerHTML = "";
  renderProducts();
}

// === Load more handler ===
loadMoreBtn.addEventListener("click", () => {
  visibleCount += 4;
  renderProducts();
});

// === Clear filters ===
clearBtn.addEventListener("click", () => {
  searchInput.value = "";
  categoryFilter.value = "all";
  filterProducts();
});

// === Add to cart ===
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart")) {
    const name = e.target.getAttribute("data-name");
    const product = products.find(p => p.name === name);
    if (product) addToCart(product);
  }
});

// === Add to cart logic ===
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find(item => item.name === product.name);
  if (existing) {
    existing.qty = Number(existing.qty) + 1;
  } else {
    cart.push({ name: product.name, price: Number(product.price), img: product.img, qty: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// === Update cart count ===
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const total = cart.reduce((sum, item) => sum + Number(item.qty || 1), 0);
  const cartCount = document.getElementById("cartCount");
  if (cartCount) cartCount.textContent = total;
}

// === Event listeners for filters ===
searchInput.addEventListener("input", filterProducts);
categoryFilter.addEventListener("change", filterProducts);

// === Initial load ===
window.addEventListener("DOMContentLoaded", async () => {
  await loadProducts();
  await loadCategories();
  updateCartCount();
});
