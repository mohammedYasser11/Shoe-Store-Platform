// ✅ services/product.js

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('productDetails');
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');
  const selectedColor = params.get('color');

  if (!productId) {
    container.innerHTML = '<p class="text-danger">Product ID missing.</p>';
    return;
  }

  fetch(`/api/products/${productId}`)
    .then(res => res.json())
    .then(async product => {
      const resAll = await fetch(`/api/products?search=${encodeURIComponent(product.name)}`);
      const allVariants = await resAll.json();

      const allSizes = Array.from(new Set(allVariants.flatMap(p => p.sizes))).sort();
      const allColors = Array.from(new Set(allVariants.flatMap(p => p.colors))).sort();

      let currentVariant = product;

      const render = () => {
        const primaryImage = currentVariant.images[0] || '/assets/images/placeholder.png';

        const colors = allColors.map(color => {
          const isActive = color.toLowerCase() === selectedColor?.toLowerCase() || color === currentVariant.colors[0];
          return `<div class="color-option ${isActive ? 'active' : ''}" data-color="${color}" title="${color}" style="background-color: ${getColorHex(color)};"></div>`;
        }).join('');

        const sizes = allSizes.map(size => {
          const isActive = currentVariant.sizes.includes(size);
          return `<div class="size-option ${isActive ? 'active' : ''}" data-size="${size}">${size}</div>`;
        }).join('');

        container.innerHTML = `
          <div class="col-md-6">
            <img src="${primaryImage}" alt="${currentVariant.name}" class="img-fluid rounded shadow-sm w-100" id="mainProductImage">
          </div>
          <div class="col-md-6">
            <h2 class="fw-bold">${currentVariant.name}</h2>
            <h4 class="text-muted">${currentVariant.brand}</h4>
            <p class="text-danger h4" id="productPrice">$${currentVariant.price.toFixed(2)}</p>
            <p class="text-muted">${currentVariant.description}</p>

            <div class="mb-3">
              <label class="form-label fw-semibold">Size:</label>
              <div class="d-flex gap-2" id="sizeOptions">${sizes}</div>
            </div>

            <div class="mb-3">
              <label class="form-label fw-semibold">Color:</label>
              <div class="d-flex gap-2" id="colorOptions">${colors}</div>
            </div>

            <form id="addToCartForm" class="d-flex gap-3 align-items-center mt-4">
              <input type="number" id="quantityInput" class="form-control w-auto" value="1" min="1" style="max-width: 80px;">
              <button class="btn btn-dark" type="submit">
                <i class="bi bi-cart-plus me-1"></i> Add to Cart
              </button>
            </form>
          </div>`;

        setupInteraction();
        setupAddToCart();
      };

      const setupInteraction = () => {
        document.querySelectorAll('.color-option').forEach(el => {
          el.addEventListener('click', () => {
            document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('active'));
            el.classList.add('active');
            const selected = el.dataset.color;

            const match = allVariants.find(v => v.name === product.name && v.colors.includes(selected));
            if (match) {
              currentVariant = match;
              localStorage.setItem('selectedColor', selected);
              render();
            }
          });
        });

        document.querySelectorAll('.size-option').forEach(el => {
          el.addEventListener('click', () => {
            document.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('active'));
            el.classList.add('active');
            const selectedSize = el.dataset.size;
            localStorage.setItem('selectedSize', selectedSize);
          });
        });
      };

      const setupAddToCart = () => {
        const form = document.getElementById('addToCartForm');
        form.addEventListener('submit', async (e) => {
          e.preventDefault();

          const token = localStorage.getItem('token');
          if (!token) {
            alert('You must be logged in to add items to the cart.');
            window.location.href = 'login.html';
            return;
          }

          const quantity = parseInt(document.getElementById('quantityInput').value, 10);
          const selectedColor = document.querySelector('.color-option.active')?.dataset.color;
          const selectedSize = document.querySelector('.size-option.active')?.dataset.size;

          if (!selectedColor || !selectedSize) {
            alert('Please select a color and size.');
            return;
          }

          try {
            const res = await fetch('/api/cart', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
               productId: currentVariant._id,
                quantity,
                selectedColor,
                selectedSize
              })
            });

            if (res.ok) {
              alert('Item added to cart!');
            } else {
              const data = await res.json();
              alert(data.message || 'Failed to add item to cart.');
            }
          } catch (err) {
              console.error('Failed to add item to cart:', err);
              alert('Could not add item to cart.');
          }
        });
      };
      render();
    })
    .catch(err => {
      console.error('Error loading product:', err);
      container.innerHTML = '<p class="text-danger">Could not load product details.</p>';
    });
});

// Optional: map color names to hex for style consistency
function getColorHex(color) {
  const map = {
    black: '#000000', white: '#FFFFFF', pink: '#FFC0CB', blue: '#007BFF',
    green: '#28a745', brown: '#8B4513', grey: '#6c757d', gray: '#6c757d'
  };
  return map[color.toLowerCase()] || color;
}
