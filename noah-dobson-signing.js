// Cart functionality
let cart = [];
let isCartOpen = false;

function addToCart(name, price, image) {
  const existingItem = cart.find(item => item.name === name);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name: name,
      price: price,
      image: image,
      quantity: 1
    });
  }
  
  updateCart();
  showNotification('Item added to cart!');
  
  // Open cart drawer
  if (!isCartOpen) {
    toggleCart();
  }
}

function updateCart() {
  const cartCount = document.getElementById('cartCount');
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  
  // Update cart count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
  
  // Update cart items display
  if (cart.length === 0) {
    cartItems.innerHTML = '<p style="text-align: center; color: #999;">Your cart is empty</p>';
  } else {
    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-info">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-price">$${item.price}</div>
          <div class="cart-item-quantity">
            <button class="quantity-btn" onclick="updateQuantity('${item.name}', -1)">-</button>
            <span>${item.quantity}</span>
            <button class="quantity-btn" onclick="updateQuantity('${item.name}', 1)">+</button>
          </div>
        </div>
        <span style="cursor: pointer;" onclick="removeFromCart('${item.name}')">&times;</span>
      </div>
    `).join('');
  }
  
  // Update total
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  cartTotal.textContent = `$${total.toFixed(2)}`;
}

function updateQuantity(name, change) {
  const item = cart.find(item => item.name === name);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(name);
    } else {
      updateCart();
    }
  }
}

function removeFromCart(name) {
  cart = cart.filter(item => item.name !== name);
  updateCart();
}

function toggleCart() {
  const cartDrawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('overlay');
  
  isCartOpen = !isCartOpen;
  
  if (isCartOpen) {
    cartDrawer.classList.add('open');
    overlay.classList.add('show');
  } else {
    cartDrawer.classList.remove('open');
    overlay.classList.remove('show');
  }
}

function checkout() {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  
  // In a real implementation, this would integrate with Shopify's checkout
  alert('Redirecting to Shopify checkout...');
  
  // For Shopify integration:
  // window.location.href = '/cart';
}

// Filter functionality
function filterProducts(category) {
  const products = document.querySelectorAll('.product-card');
  const tabs = document.querySelectorAll('.filter-tab');
  
  // Update active tab
  tabs.forEach(tab => {
    tab.classList.remove('active');
    if (tab.textContent.toLowerCase().includes(category) || 
        (category === 'all' && tab.textContent === 'All Products')) {
      tab.classList.add('active');
    }
  });
  
  // Filter products
  products.forEach(product => {
    if (category === 'all') {
      product.style.display = 'block';
    } else {
      const productCategory = product.getAttribute('data-category');
      product.style.display = productCategory === category ? 'block' : 'none';
    }
  });
}

// Sort functionality
function sortProducts(sortBy) {
  const grid = document.getElementById('productsGrid');
  const products = Array.from(grid.children);
  
  products.sort((a, b) => {
    const priceA = parseInt(a.getAttribute('data-price'));
    const priceB = parseInt(b.getAttribute('data-price'));
    
    switch(sortBy) {
      case 'price-low':
        return priceA - priceB;
      case 'price-high':
        return priceB - priceA;
      default:
        return 0;
    }
  });
  
  // Re-append sorted products
  products.forEach(product => grid.appendChild(product));
}

// Quick view functionality
function quickView(productName) {
  alert(`Quick view for: ${productName}\n\nThis would open a modal with more product details.`);
}

// Mobile menu toggle
function toggleMobileMenu() {
  const navMenu = document.querySelector('.nav-menu');
  navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
}

// Notification system
function showNotification(message) {
  // Create notification element
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #000;
    color: white;
    padding: 15px 20px;
    border-radius: 5px;
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);