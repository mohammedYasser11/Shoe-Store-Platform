document.addEventListener('DOMContentLoaded', async () => {
  const cartList = document.getElementById('cart-items');
  const totalPriceEl = document.getElementById('total-price');
  const checkoutButton = document.querySelector('.btn-checkout');
  let total = 0;

  const token = localStorage.getItem('token');
  if (!token) {
    alert('You must be logged in to view your cart.');
    window.location.href = './login.html';
    return;
  }

  let cart;

  try {
    // Fetch cart items from the database
    const res = await fetch('/api/cart', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error('Failed to fetch cart items');
    }

    cart = await res.json();

    // Render cart items
    cart.items.forEach(item => {
      const variant = item.productId.variants.find(v => v._id === item.variantId); // Find the variant using variantId
      if (!variant) {
        console.error('Variant not found for item:', item);
        return;
      }

      // Create list item for each cart item
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';

      // Add product name, color, size, and quantity
      li.textContent = `${item.productId.name} (Color: ${variant.color}, Size: ${variant.size}, Quantity: ${item.quantity})`;

      const span = document.createElement('span');
      span.textContent = `$${(item.productId.price * item.quantity).toFixed(2)}`;
      li.appendChild(span);

      cartList.appendChild(li);
      total += item.productId.price * item.quantity;
    });

    // Render total price
    totalPriceEl.textContent = `$${total.toFixed(2)}`;
  } catch (err) {
    console.error('Error fetching cart items:', err);
    cartList.innerHTML = '<li class="list-group-item text-danger">Failed to load cart items. Please try again later.</li>';
    return;
  }

  // Handle checkout button click
  checkoutButton.addEventListener('click', async () => {
    const shippingInfo = {
      address: document.querySelector('input[placeholder="Street Address"]').value,
      city: document.querySelector('input[placeholder="City"]').value,
      zip: document.querySelector('input[placeholder="Zip Code"]').value,
      country: document.getElementById('country').value
    };

    if (!shippingInfo.address || !shippingInfo.city || !shippingInfo.zip || !shippingInfo.country) {
      alert('Please fill in all shipping information.');
      return;
    }

    try {
      const res = await fetch('/api/orders/myorders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cart.items,
          shippingInfo,
          totalPrice: total
        })
      });

      if (!res.ok) {
        throw new Error('Failed to place order');
      }

      alert('Order placed successfully!');
      window.location.href = './orders.html'; // Redirect to orders page
    } catch (err) {
      console.error('Error placing order:', err);
      alert('Failed to place order. Please try again.');
    }
  });
});