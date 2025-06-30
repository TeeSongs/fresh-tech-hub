document.getElementById("menuToggle").addEventListener ("click", function(){
  const navLinks = document.getElementById("navLinks")
  navLinks.classList.toggle("show")
})

// Select all "Add to Cart" buttons
const addToCartButtons = document.querySelectorAll('.product-card .btn');

// Function to update cart count in the DOM
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.length;
  const cartCount = document.getElementById("cartCount");
  if (cartCount) cartCount.textContent = totalItems;
}

// Function to add a product to the cart
function addToCart(productName, productPrice, productImage) {
  // Always re-load cart from localStorage
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  const existing = cart.find(item => item.name === productName);

  if(existing){
    existing.qty = Number(existing.qty || 1) + 1;
  } else {
    cart.push({
      name: productName,
      price: productPrice,
      img:productImage,
      qty: 1
    });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  alert(`${productName} has been added to your cart!`);
}

// Add click event to each "Add to Cart" button
addToCartButtons.forEach(button => {
  button.addEventListener('click', () => {
    const card = button.closest('.product-card');
    const productName = card.querySelector('h3').textContent;
    const priceText = card.querySelector('.price').textContent;

    // Clean the price string: remove ₦ and commas
    const cleanedPrice = Number(priceText.replace(/[^\d]/g, ''));
    const productImage = card.querySelector('img').getAttribute('src');

    // ✅ Only call addToCart if price is valid
    if (!isNaN(cleanedPrice)) {
      addToCart(productName, cleanedPrice, productImage);
    } else {
      console.error("Invalid price:", priceText);
      alert("Something went wrong with the product price.");
    }
  });
});

// On page load, update cart count
updateCartCount();


// Add wishlist functionality

