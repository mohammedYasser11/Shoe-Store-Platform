export async function renderCart() {
    const token = localStorage.getItem('token');
    if (!token) {
      document.getElementById('cartSidebar').innerHTML = '<p class="text-danger">Please log in to view your cart.</p>';
      return;
    }
    
    if(window.location.pathname === '/editProfile.html') {
      // hide the cart button
      const cartButton = document.getElementById('cartButtonContainer');
      if (cartButton) {
        cartButton.hidden = true;
      }
    }
  
    try {
      const res = await fetch('/api/cart', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!res.ok) {
        throw new Error('Failed to fetch cart');
      }
  
      const cart = await res.json();
      let cartContainer = document.querySelector('.offcanvas-body');
      const newCartContainer = cartContainer.cloneNode(false);
      cartContainer.parentNode.replaceChild(newCartContainer, cartContainer);
      cartContainer = newCartContainer;
  
      if (cart.items.length === 0) {
        cartContainer.innerHTML = '<p class="text-muted">Your cart is empty.</p>';
        return;
      }
  
      // Render cart items
      const cartItemsHTML = cart.items.map(item => {
        const variant = item.productId.variants.find(v => v._id === item.variantId); // Find the variant using variantId
        if (!variant) {
          console.error('Variant not found for item:', item);
          return '';
        }
  
        // Find the correct image for the variant
        const sanitizedColor = variant.color.toLowerCase().replace(/\s+/g, '');
        const sanitizedProductName = item.productId.name.toLowerCase().replace(/\s+/g, '');
        const variantImage = item.productId.images.find(image =>
          image.toLowerCase().includes(`${sanitizedProductName}-${sanitizedColor}`)
        ) || '/assets/images/placeholder.jpg'; // Fallback to placeholder if no match
  
        return `
          <div class="d-flex align-items-start mb-4 border-bottom pb-3" data-item-id="${item._id}">
            <img src="${variantImage}" 
                 alt="${item.productId.name}" 
                 class="img-thumbnail me-3" 
                 style="width: 80px; height: 80px; object-fit: cover;">
            <div class="flex-grow-1">
              <h6 class="mb-1">${item.productId.name}</h6>
              <p class="text-muted small mb-2">$${item.productId.price.toFixed(2)}</p>
              <p class="text-muted small mb-2">Color: ${variant.color}, Size: ${variant.size}</p>
              <div class="d-flex align-items-center gap-2">
                <input type="number" class="form-control form-control-sm quantity-input" value="${item.quantity}" min="1" style="width: 60px;" data-item-id="${item._id}">
                <button class="btn btn-sm btn-outline-danger delete-button">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');
  
      // Calculate total price
      const totalPrice = cart.items.reduce((total, item) => {
        const variant = item.productId.variants.find(v => v._id === item.variantId);
        return variant ? total + item.productId.price * item.quantity : total;
      }, 0);
  
      // Render cart total and checkout button
      cartContainer.innerHTML = `
        ${cartItemsHTML}
        <div class="d-flex justify-content-between fw-semibold mt-4 mb-3">
          <span>Total:</span>
          <span>$${totalPrice.toFixed(2)}</span>
        </div>
        <button class="btn btn-dark w-100" onclick="window.location.href='./checkout.html'">Checkout</button>
      `;
  
      // Use event delegation for delete buttons
      cartContainer.addEventListener('click', (event) => {
        const deleteButton = event.target.closest('.delete-button');
        if (deleteButton) {
          const itemId = deleteButton.closest('.d-flex.align-items-start').dataset.itemId;
          removeFromCart(itemId);
        }
      });

      // Attach event listener for quantity input changes
      const quantityInputs = cartContainer.querySelectorAll('.quantity-input');
      quantityInputs.forEach(input => {
        input.addEventListener('input', (event) => {
          const itemId = event.target.dataset.itemId;
          const newQuantity = parseInt(event.target.value, 10);
          if (newQuantity >= 1) {
            updateCartItemQuantity(itemId, newQuantity);
          }
        });
      });
    } catch (err) {
      console.error('Error fetching cart:', err);
      document.querySelector('.offcanvas-body').innerHTML = '<p class="text-danger">Failed to load cart.</p>';
    }
}

export function updateCartItemQuantity(itemId, quantity) {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('You must be logged in to update the cart.');
    window.location.href = 'login.html';
    return;
  }

  // First, get the current cart to check stock
  fetch('/api/cart', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(cart => {
      // Find the item in the cart
      const cartItem = cart.items.find(item => item._id === itemId);
      if (!cartItem) {
        throw new Error('Item not found in cart');
      }

      // Find the variant to check stock
      const variant = cartItem.productId.variants.find(v => v._id === cartItem.variantId);
      if (!variant) {
        throw new Error('Variant not found');
      }

      // Check if requested quantity exceeds available stock
      if (quantity > variant.stock) {
        alert(`Sorry, only ${variant.stock} items available in stock.`);
        // Reset the input to the current quantity
        const input = document.querySelector(`.quantity-input[data-item-id="${itemId}"]`);
        if (input) {
          input.value = cartItem.quantity;
        }
        return;
      }

      // If stock is sufficient, proceed with the update
      return fetch(`/api/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity })
      });
    })
    .then(res => {
      if (res) {
        return res.json();
      }
    })
    .then(() => {
      console.log('Cart item quantity updated successfully!');
      renderCart(); // Re-render the cart to reflect the updated quantity
    })
    .catch(err => {
      console.error('Error updating cart item quantity:', err);
      alert('Failed to update cart item quantity.');
    });
}
  
export function removeFromCart(itemId) {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('You must be logged in to remove items from the cart.');
    window.location.href = 'login.html';
    return;
  }

  fetch(`/api/cart/${itemId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(() => {
      alert('Item removed from cart!');
      renderCart(); // Re-render the cart after removing the item
    })
    .catch(err => {
      console.error('Error removing item from cart:', err);
      alert('Failed to remove item from cart.');
    });
}