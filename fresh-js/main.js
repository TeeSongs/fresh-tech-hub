// Select all "Add to Cart" buttons
const addToCartButtons = document.querySelectorAll('.product-card .btn');
const cartCountElement = document.getElementById('cartCount');

// Get cart from localStorage or start with an empty array
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to update cart count in the DOM
function updateCartCount() {
  cartCountElement.textContent = cart.length;
}

// Function to add a product to the cart
function addToCart(productName, productPrice) {
  const item = { name: productName, price: productPrice };
  cart.push(item);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  alert(`${productName} has been added to your cart!`);
}

// Attach click event listeners to each button
addToCartButtons.forEach(button => {
  button.addEventListener('click', () => {
    const card = button.closest('.product-card');
    const productName = card.querySelector('h3').textContent;
    const productPrice = card.querySelector('.price').textContent;

    addToCart(productName, productPrice);
  });
});

// On page load, update cart count
updateCartCount();
