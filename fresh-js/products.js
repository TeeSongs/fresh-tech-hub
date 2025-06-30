
  const toggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('show');
  });


let products = [];

let visibleCount = 8;
let filteredProducts =[];

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const loadMoreBtn = document.getElementById("loadMoreBtn");
const clearBtn = document.getElementById("clearFilters");

// Load products
fetch("../data/products.json")
  .then(response => response.json())
  .then(data => {
    products = data;
    displayProducts(products);
  })
  .catch(err => {
    console.log("Failed to fetch products:", err);
    productGrid.innerHTML = "<p>Failed to load products</p>";
  });

// Load categories
async function loadCategories() {
  try {
    const response = await fetch("../data/categories.json");
    if (!response.ok) throw new Error("Network response was not ok");

    const categories = await response.json();
    categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = capitalize(cat);
      categoryFilter.appendChild(option);
    });
  } catch (error) {
    console.error("Failed to load categories:", error);
  }
}

// Capitalize function
function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// Display products in the grid
function displayProducts(list) {
  filteredProducts = list; //Store the latest filtered list
  const toDisplay= list.slice(0, visibleCount);

  if (toDisplay.length === 0) {
    productGrid.innerHTML = `<p class="no-results">No products found.</p>`;
    loadMoreBtn.style.display = "none";
    return;
  }

  productGrid.innerHTML =toDisplay.map(product => `
    <div class="product-card">
      <img src="${product.img}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p class="price">₦${Number(product.price).toLocaleString()}</p>
      <button class="btn add-to-cart" data-name="${product.name}">Add to Cart</button>
    </div>
  `).join('');
}


// Filter products
function filterProducts() {
  if (products.length === 0) return;

  const search = searchInput.value.toLowerCase();
  const category = categoryFilter.value;

  const filtered = products.filter(p =>
    (category === "all" || p.category === category) &&
    p.name.toLowerCase().includes(search)
  );
  
  visibleCount = 8;
  displayProducts(filtered);


  
// Toggle Load More Button
if(visibleCount >= list.length){
  loadMoreBtn.style.display = "none";
}else{
  loadMoreBtn.style.display = "block"
}
}

// Add to cart
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existing = cart.find(item => item.name === product.name);

  if (existing) {
    existing.qty = Number(existing.qty) + 1;
  } else {
    cart.push({
      name: product.name,
      price: Number(product.price),
      img: product.img,
      qty: 1
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// Update cart count display
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  let totalItems = 0;

  for (let item of cart) {
    totalItems += Number(item.qty) || 1; // fallback to 1 if qty is missing
  }

  const cartCount = document.getElementById("cartCount");
  if (cartCount) {
    cartCount.textContent = totalItems;
  }
}



// Event: Clear filters
clearBtn.addEventListener("click", () => {
  searchInput.value = "";
  categoryFilter.value = "all";
  filterProducts();
});

// Event: Input filters
searchInput.addEventListener("input", filterProducts);
categoryFilter.addEventListener("change", filterProducts);

// Event: Add to cart buttons
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("add-to-cart")) {
    const productName = e.target.getAttribute("data-name");
    const selectedProduct = products.find(p => p.name === productName);
    if (selectedProduct) {
      addToCart(selectedProduct);
    }
  }
});

loadMoreBtn.addEventListener("click", () => {
  visibleCount += 4; // or any number you want to load at a time
  displayProducts(filteredProducts);
});


// Initial load
window.addEventListener("DOMContentLoaded", async () => {
  await loadCategories();
  updateCartCount();
  displayProducts(products); // just in case fetch fails
});


