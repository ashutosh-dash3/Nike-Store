// Product Data
const products = [
  {
    id: 1,
    name: "Nike Air Force 1",
    price: 110,
    image: "./img/air.png",
    category: "Air Force",
    description: "The iconic Air Force 1 has been defining street culture since 1982.",
    colors: ["White", "Black"],
    sizes: ["7", "8", "9", "10", "11", "12"]
  },
  {
    id: 2,
    name: "Nike Air Jordan",
    price: 170,
    image: "./img/jordan.png",
    category: "Air Jordan",
    description: "From the court to the streets, Air Jordan represents excellence in every step.",
    colors: ["Red", "Black"],
    sizes: ["7", "8", "9", "10", "11", "12"]
  },
  {
    id: 3,
    name: "Nike Blazer",
    price: 100,
    image: "./img/blazer.png",
    category: "Blazer",
    description: "The Blazer combines basketball heritage with contemporary street style.",
    colors: ["White", "Navy"],
    sizes: ["7", "8", "9", "10", "11", "12"]
  },
  {
    id: 4,
    name: "Nike Crater",
    price: 130,
    image: "./img/crater.png",
    category: "Crater",
    description: "Sustainable style meets performance with recycled materials.",
    colors: ["Green", "Black"],
    sizes: ["7", "8", "9", "10", "11", "12"]
  },
  {
    id: 5,
    name: "Nike Hippie",
    price: 90,
    image: "./img/hippie.png",
    category: "Hippie",
    description: "Comfortable and stylish for everyday wear.",
    colors: ["Brown", "Beige"],
    sizes: ["7", "8", "9", "10", "11", "12"]
  }
];

// Shopping Cart
let cart = [];
let wishlist = [];

// Global variables for DOM elements
let cartBtn, cartSidebar, cartOverlay, closeCart, cartItems, cartCount, totalAmount, checkoutBtn;
let wishlistBtn, wishlistCount;
let darkModeToggle, toggleIcon, body;
let heroSlider, slides, prevBtn, nextBtn, sliderDots, productsGrid;
let backToTopBtn, newsletterForm;

// Initialize the application
function init() {
  // Initialize DOM elements
  initializeDOMElements();
  
  loadFromLocalStorage();
  renderProducts();
  createSliderDots();
  setupEventListeners();
  updateCartCount();
  updateWishlistCount();
  checkDarkMode();
}

// Initialize DOM elements
function initializeDOMElements() {
  cartBtn = document.getElementById('cartBtn');
  cartSidebar = document.getElementById('cartSidebar');
  cartOverlay = document.getElementById('cartOverlay');
  closeCart = document.getElementById('closeCart');
  cartItems = document.getElementById('cartItems');
  cartCount = document.querySelector('.cart-count');
  totalAmount = document.querySelector('.total-amount');
  checkoutBtn = document.querySelector('.checkout-btn');

  wishlistBtn = document.getElementById('wishlistBtn');
  wishlistCount = document.querySelector('.wishlist-count');

  darkModeToggle = document.getElementById('darkModeToggle');
  toggleIcon = document.querySelector('.toggleIcon');
  body = document.body;

  heroSlider = document.getElementById('heroSlider');
  slides = Array.from(document.querySelectorAll('.slide')); // Convert NodeList to Array
  prevBtn = document.getElementById('prevBtn');
  nextBtn = document.getElementById('nextBtn');
  sliderDots = document.getElementById('sliderDots');
  productsGrid = document.getElementById('productsGrid');

  backToTopBtn = document.getElementById('backToTop');
  newsletterForm = document.getElementById('newsletterForm');
}

// Event Listeners
function setupEventListeners() {
  // Cart functionality
  cartBtn.addEventListener('click', openCart);
  closeCart.addEventListener('click', closeCartSidebar);
  cartOverlay.addEventListener('click', closeCartSidebar);
  checkoutBtn.addEventListener('click', handleCheckout);

  // Wishlist functionality
  wishlistBtn.addEventListener('click', toggleWishlist);

  // Dark mode toggle
  darkModeToggle.addEventListener('click', toggleDarkMode);

  // Slider controls
  prevBtn.addEventListener('click', () => changeSlide(-1));
  nextBtn.addEventListener('click', () => changeSlide(1));

  // Back to top
  backToTopBtn.addEventListener('click', scrollToTop);
  window.addEventListener('scroll', handleScroll);

  // Newsletter form
  newsletterForm.addEventListener('submit', handleNewsletterSubmit);

  // Keyboard navigation
  document.addEventListener('keydown', handleKeyboard);
}

// Shopping Cart Functions
function addToCart(product, size = '9', color = product.colors[0]) {
  const existingItem = cart.find(item => 
    item.id === product.id && item.size === size && item.color === color
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...product,
      size,
      color,
      quantity: 1
    });
  }

  updateCart();
  showNotification('Product added to cart!');
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
  showNotification('Product removed from cart!');
}

function updateQuantity(index, change) {
  const item = cart[index];
  item.quantity += change;
  
  if (item.quantity <= 0) {
    removeFromCart(index);
  } else {
    updateCart();
  }
}

function updateCart() {
  renderCartItems();
  updateCartCount();
  updateTotal();
  saveToLocalStorage();
}

function renderCartItems() {
  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    return;
  }

  cartItems.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-image">
      <div class="cart-item-details">
        <h4>${item.name}</h4>
        <p>Size: ${item.size} | Color: ${item.color}</p>
        <p class="cart-item-price">$${item.price}</p>
        <div class="cart-item-quantity">
          <button onclick="updateQuantity(${index}, -1)">-</button>
          <span>${item.quantity}</span>
          <button onclick="updateQuantity(${index}, 1)">+</button>
        </div>
      </div>
      <button class="remove-item" onclick="removeFromCart(${index})">×</button>
    </div>
  `).join('');
}

function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
  cartCount.style.display = totalItems > 0 ? 'block' : 'none';
}

function updateTotal() {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  totalAmount.textContent = `$${total.toFixed(2)}`;
}

function openCart() {
  cartSidebar.classList.add('open');
  cartOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCartSidebar() {
  cartSidebar.classList.remove('open');
  cartOverlay.classList.remove('open');
  document.body.style.overflow = 'auto';
}

function handleCheckout() {
  if (cart.length === 0) {
    showNotification('Your cart is empty!', 'error');
    return;
  }
  showNotification('Proceeding to checkout...', 'success');
  // Here you would typically redirect to a checkout page
}

// Wishlist Functions
function addToWishlist(product) {
  if (!wishlist.find(item => item.id === product.id)) {
    wishlist.push(product);
    updateWishlistCount();
    saveToLocalStorage();
    showNotification('Added to wishlist!');
  } else {
    removeFromWishlist(product.id);
  }
}

function removeFromWishlist(productId) {
  wishlist = wishlist.filter(item => item.id !== productId);
  updateWishlistCount();
  saveToLocalStorage();
  showNotification('Removed from wishlist!');
}

function updateWishlistCount() {
  wishlistCount.textContent = wishlist.length;
  wishlistCount.style.display = wishlist.length > 0 ? 'block' : 'none';
}

function toggleWishlist() {
  showNotification('Wishlist feature coming soon!');
}

// Product Rendering
function renderProducts() {
  productsGrid.innerHTML = products.map(product => `
    <div class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
        <div class="product-overlay">
          <button class="quick-view-btn" onclick="quickView(${product.id})">Quick View</button>
        </div>
      </div>
      <div class="product-info">
        <h3 class="product-title">${product.name}</h3>
        <p class="product-price">$${product.price}</p>
        <div class="product-actions">
          <button class="add-to-cart" onclick="addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})">
            Add to Cart
          </button>
          <button class="add-to-wishlist" onclick="addToWishlist(${JSON.stringify(product).replace(/"/g, '&quot;')})">
            ♥
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function quickView(productId) {
  const product = products.find(p => p.id === productId);
  if (product) {
    showNotification(`Quick view: ${product.name}`);
    // Here you would typically open a modal with product details
  }
}

// Hero Slider Functions
let currentSlide = 0;

function changeSlide(direction) {
  slides[currentSlide].classList.remove('active');
  
  currentSlide += direction;
  
  if (currentSlide >= slides.length) {
    currentSlide = 0;
  } else if (currentSlide < 0) {
    currentSlide = slides.length - 1;
  }
  
  slides[currentSlide].classList.add('active');
  updateSliderDots();
}

function createSliderDots() {
  if (!slides || slides.length === 0) {
    console.warn('No slides found for slider dots');
    return;
  }
  
  sliderDots.innerHTML = slides.map((_, index) => 
    `<div class="dot ${index === 0 ? 'active' : ''}" onclick="goToSlide(${index})"></div>`
  ).join('');
}

function updateSliderDots() {
  const dots = document.querySelectorAll('.dot');
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentSlide);
  });
}

function goToSlide(index) {
  slides[currentSlide].classList.remove('active');
  currentSlide = index;
  slides[currentSlide].classList.add('active');
  updateSliderDots();
}

// Auto-slide functionality
setInterval(() => {
  changeSlide(1);
}, 5000);

// Dark Mode Functions
function toggleDarkMode() {
  body.classList.toggle('dark-mode');
  
  if (body.classList.contains('dark-mode')) {
    toggleIcon.textContent = '☀️';
    localStorage.setItem('darkMode', 'true');
  } else {
    toggleIcon.textContent = '🌙';
    localStorage.setItem('darkMode', 'false');
  }
}

function checkDarkMode() {
  const savedDarkMode = localStorage.getItem('darkMode');
  if (savedDarkMode === 'true') {
    body.classList.add('dark-mode');
    toggleIcon.textContent = '☀️';
  }
}

// Utility Functions
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  // Style the notification
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'error' ? '#e74c3c' : type === 'success' ? '#27ae60' : '#3498db'};
    color: white;
    padding: 15px 20px;
    border-radius: 5px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 300px;
  `;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

function handleScroll() {
  if (window.pageYOffset > 300) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

function handleNewsletterSubmit(e) {
  e.preventDefault();
  const email = e.target.querySelector('input[type="email"]').value;
  
  if (email) {
    showNotification('Thank you for subscribing!', 'success');
    e.target.reset();
  }
}

function handleKeyboard(e) {
  // Close cart with Escape key
  if (e.key === 'Escape' && cartSidebar.classList.contains('open')) {
    closeCartSidebar();
  }
  
  // Navigate slider with arrow keys
  if (e.key === 'ArrowLeft') {
    changeSlide(-1);
  } else if (e.key === 'ArrowRight') {
    changeSlide(1);
  }
}

// Local Storage Functions
function saveToLocalStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

function loadFromLocalStorage() {
  const savedCart = localStorage.getItem('cart');
  const savedWishlist = localStorage.getItem('wishlist');
  
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
  
  if (savedWishlist) {
    wishlist = JSON.parse(savedWishlist);
  }
}

// Search functionality
const searchInput = document.querySelector('.search-input');
searchInput.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const productCards = document.querySelectorAll('.product-card');
  
  productCards.forEach(card => {
    const productName = card.querySelector('.product-title').textContent.toLowerCase();
    if (productName.includes(searchTerm)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Add loading animation
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});

// Initialize the application (robust against late script execution)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Add some CSS for the new elements
const style = document.createElement('style');
style.textContent = `
  .cart-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px 0;
    border-bottom: 1px solid #eee;
  }
  
  .cart-item-image {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 5px;
  }
  
  .cart-item-details h4 {
    margin: 0 0 5px 0;
    font-size: 1rem;
  }
  
  .cart-item-details p {
    margin: 0 0 5px 0;
    font-size: 0.9rem;
    color: #666;
  }
  
  .cart-item-price {
    font-weight: 600;
    color: #333 !important;
  }
  
  .cart-item-quantity {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .cart-item-quantity button {
    width: 25px;
    height: 25px;
    border: 1px solid #ddd;
    background: white;
    border-radius: 3px;
    cursor: pointer;
  }
  
  .remove-item {
    background: none;
    border: none;
    font-size: 1.2rem;
    color: #999;
    cursor: pointer;
    padding: 5px;
  }
  
  .remove-item:hover {
    color: #e74c3c;
  }
  
  .empty-cart {
    text-align: center;
    color: #666;
    font-style: italic;
  }
  
  .product-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .product-card:hover .product-overlay {
    opacity: 1;
  }
  
  .quick-view-btn {
    background: white;
    color: #333;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-weight: 600;
  }
  
  .quick-view-btn:hover {
    background: #f8f9fa;
  }
  
  body.loaded {
    opacity: 1;
  }
  
  body {
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .notification {
    font-family: 'Nunito', sans-serif;
  }
`;
document.head.appendChild(style);
