let products = [];
const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

fetch("../data/products.json")
.then(response => response.json())
.then(data =>{ products = data;
  displayProducts(products);
})
.catch(err => {
  console.log("Failed to fetch products:", err);
  document.getElementById("productGrid").innerHTML = "<p>Failed to load products</p>";

});

async function loadCategories() {
  try{
    const response = await fetch("../data/categories.json");
    if (!response.ok) throw new Error("Network response was not ok");

    const categories = await response.json();
    const select  = document.getElementById("categoryFilter");

    select.innerHTML = `<option value ="all">All Categories</option>`

    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = capitalize(cat);
      select.appendChild(option);
    })
  } catch (error){
    console.error ("failed to load categories:", error);
  }
}

function capitalize(word){
  return word.charAt(0).toUpperCase() + word.slice(1);
}

window.addEventListener("DOMContentLoaded", async () => {
  await loadCategories();
  
})


const clearBtn = document.getElementById("clearFilters");
clearBtn.addEventListener("click", () => {
  searchInput.value = "";
  categoryFilter.value = "all";
  filterProducts();
});



function displayProducts(list) {

   if (list.length === 0) {
    productGrid.innerHTML = `<p class="no-results">No products found.</p>`;
    return;
  }
  productGrid.innerHTML = list.map(product => `
    <div class="product-card">
      <img src="${product.img}" alt="${product.name}">
      <h3>${product.name}</h3>
    <p class="price">₦${Number(product.price).toLocaleString()}</p>

      <button class="btn add-to-cart" data-name="${product.name}">Add to Cart</button>
    </div>
  `).join('');
}

function filterProducts() {
  if (products.length === 0) return;
  const search = searchInput.value.toLowerCase();
  const category = categoryFilter.value;
  const filtered = products.filter(p =>
    (category === "all" || p.category === category) &&
    p.name.toLowerCase().includes(search)
  );
  displayProducts(filtered);
}


searchInput.addEventListener("input", filterProducts);
categoryFilter.addEventListener("change", filterProducts);

// Initial load
displayProducts(products);

// Add to cart logic
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("add-to-cart")) {
    const productName = e.target.getAttribute("data-name");
    const selectedProduct = products.find(p => p.name === productName);
    addToCart(selectedProduct);
  }
});

function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find(item => item.name === product.name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  const cartCount = document.getElementById("cartCount");
  if (cartCount) {
    cartCount.textContent = totalItems;
  }
}

updateCartCount();
