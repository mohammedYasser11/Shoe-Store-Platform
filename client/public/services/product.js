import { renderCart, removeFromCart } from './cart.js';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('productDetails');
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');
  const selectedColorParam = params.get('color');
  const selectedSizeParam = params.get('size'); // optional URL parameter for size

  if (!productId) {
    container.innerHTML = '<p class="text-danger">Product ID missing.</p>';
    return;
  }

  fetch(`/api/products/${productId}`)
    .then(res => res.json())
    .then(async product => {
      
      // Get all variants for the product
      const variants = product.variants || [];

      // Derive available colors across all variants
      const allColors = Array.from(new Set(variants.map(v => v.color))).sort();

      // Choose an initial variant based on URL params; else default to the first variant.
      let currentVariant = variants.find(v =>
        (selectedColorParam ? v.color.toLowerCase() === selectedColorParam.toLowerCase() : true) &&
        (selectedSizeParam ? v.size === selectedSizeParam : true)
      ) || variants[0];

      /**
       * Returns the image URL for the product variant.
       * (This version uses .jpg.)
       */
      function getVariantImageUrl(product, variant) {
        const sanitizedName = product.name.replace(/\s+/g, '');
        const sanitizedColor = variant.color.replace(/\s+/g, '');
        return `/assets/images/${sanitizedName}-${sanitizedColor}.jpg`;
      }

      function render() {
        // Compute the primary image for the current variant.
        const primaryImage = getVariantImageUrl(product, currentVariant);

        // Build color options
        const colorsHTML = allColors.map(color => {
          const isActive = color.toLowerCase() === currentVariant.color.toLowerCase();
          return `
            <div 
              class="color-option ${isActive ? 'active' : ''}" 
              data-color="${color}" 
              title="${color}"
              style="background-color: ${getColorHex(color)};">
            </div>`;
        }).join('');

        // Now, instead of using allSizes, filter variants to get only the sizes available for the selected color.
        const availableSizes = Array.from(
          new Set(
            variants
              .filter(v => v.color.toLowerCase() === currentVariant.color.toLowerCase())
              .map(v => v.size)
          )
        ).sort();

        const sizesHTML = availableSizes.map(size => {
          const isActive = size === currentVariant.size;
          return `
            <div 
              class="size-option ${isActive ? 'active' : ''}" 
              data-size="${size}">
              ${size}
            </div>`;
        }).join('');
// calculate
const orig = product.price;
const hasDisc = product.discount > 0;
const disc  = (orig * (1 - product.discount/100)).toFixed(2);

        container.innerHTML = `
          <div class="col-md-6">
            <img 
              src="${primaryImage}" 
              alt="${product.name}" 
              class="img-fluid rounded shadow-sm w-100" 
              id="mainProductImage">
          </div>
          <div class="col-md-6">
            <h2 class="fw-bold">${product.name}</h2>
            <h6 class="text-muted">${product.brand||''}</h6>
            ${
              (() => {
                const orig = product.price;
                if (product.discount > 0) {
                  const disc = (orig * (1 - product.discount/100)).toFixed(2);
                  return `
                    <p><del class="text-muted">$${orig.toFixed(2)}</del></p>
                    <p class="text-danger h4">$${disc}</p>
                    <span class="badge bg-danger">-${product.discount}%</span>
                  `;
                } else {
                  return `<p class="text-danger h4">$${orig.toFixed(2)}</p>`;
                }
              })()
            }
            <p class="text-muted">${product.description || ''}</p>

            <div class="mb-3">
              <label class="form-label fw-semibold">Size:</label>
              <div class="d-flex gap-2" id="sizeOptions">${sizesHTML}</div>
            </div>

            <div class="mb-3">
              <label class="form-label fw-semibold">Color:</label>
              <div class="d-flex gap-2" id="colorOptions">${colorsHTML}</div>
            </div>

            <form id="addToCartForm" class="d-flex gap-3 align-items-center mt-4">
              <input 
                type="number" 
                id="quantityInput" 
                class="form-control w-auto" 
                value="1" 
                min="1" 
                style="max-width: 80px;">
              <button class="btn btn-dark" type="submit">
                <i class="bi bi-cart-plus me-1"></i> Add to Cart
              </button>
            </form>
          </div>
        `;

        setupInteraction();
        setupAddToCart();
      }

      const setupInteraction = () => {
        // Color selection interaction
        document.querySelectorAll('.color-option').forEach(el => {
          el.addEventListener('click', () => {
            document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('active'));
            el.classList.add('active');
            const selectedColor = el.dataset.color;
            // Try to match a variant with the current size, if possible.
            let match = product.variants.find(v =>
              v.color.toLowerCase() === selectedColor.toLowerCase() &&
              v.size === currentVariant.size
            );
            if (!match) {
              // Fallback to the first variant that matches the selected color.
              match = product.variants.find(v => v.color.toLowerCase() === selectedColor.toLowerCase());
            }
            if (match) {
              currentVariant = match;
              localStorage.setItem('selectedColor', selectedColor);
              render();
            }
          });
        });

        // Size selection interaction
        document.querySelectorAll('.size-option').forEach(el => {
          el.addEventListener('click', () => {
            document.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('active'));
            el.classList.add('active');
            const selectedSize = el.dataset.size;
            // Try to find a variant that matches the current color and the selected size.
            let match = product.variants.find(v =>
              v.size === selectedSize &&
              v.color.toLowerCase() === currentVariant.color.toLowerCase()
            );
            if (!match) {
              // Fallback to a variant with the selected size.
              match = product.variants.find(v => v.size === selectedSize);
            }
            if (match) {
              currentVariant = match;
              localStorage.setItem('selectedSize', selectedSize);
              render();
            }
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
      
          // Find the matching variant
          const variant = product.variants.find(v =>
            v.color.toLowerCase() === selectedColor.toLowerCase() &&
            v.size === selectedSize
          );
      
          if (!variant) {
            alert('Selected variant not found.');
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
                productId: product._id,
                variantId: variant._id,
                quantity
              })
            });
      
            if (res.ok) {
              alert('Item added to cart!');
              renderCart();
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

      // Fetch related products remains unchanged.
      async function fetchRelatedProducts() {
        try {
          // Fetch related products based on category & brand
          let res = await fetch(
            `/api/products/related?category=${encodeURIComponent(product.category)}&brand=${encodeURIComponent(product.brand)}&exclude=${productId}`
          );
          let relatedProducts = await res.json();
      
          // If less than 3 related products, fetch additional fallback products
          if (relatedProducts.length < 3) {
            const resFallback = await fetch(`/api/products?exclude=${productId}`);
            const fallbackProducts = await resFallback.json();
      
            // Filter out duplicates (products already in relatedProducts)
            const additionalProducts = fallbackProducts.filter(p => 
              !relatedProducts.some(r => r._id === p._id)
            );
      
            // Add fallback products until we have at least 3
            while (relatedProducts.length < 3 && additionalProducts.length > 0) {
              relatedProducts.push(additionalProducts.shift());
            }
          }
      
          const suggestedContainer = document.getElementById('suggestedProducts');
          suggestedContainer.innerHTML = relatedProducts.map(related => `
            <div class="col-6 col-md-3">
              <a href="product.html?id=${related._id}" class="text-decoration-none text-dark">
                <div class="card h-100">
                  <img 
                    src="${related.images[0] || '/assets/images/placeholder.jpg'}" 
                    class="card-img-top" 
                    alt="${related.name}">
                  <div class="card-body text-center">
                    <h6 class="card-title mb-1">${related.name}</h6>
                    <p class="card-text text-danger fw-semibold">$${related.price.toFixed(2)}</p>
                  </div>
                </div>
              </a>
            </div>
          `).join('');
        }
          catch (err) {
          console.error('Error fetching related products:', err);
          const suggestedContainer = document.getElementById('suggestedProducts');
          suggestedContainer.innerHTML = '<p class="text-danger">Could not load related products.</p>';
        }
      }
  
      renderCart();
      fetchRelatedProducts();
      render();
    })
    .catch(err => {
      console.error('Error loading product:', err);
      container.innerHTML = '<p class="text-danger">Could not load product details.</p>';
    });
});

/**
 * Helper: Map color names to hex codes for styling consistency.
 */
function getColorHex(color) {
  const map = {
    black: '#000000',
    white: '#FFFFFF',
    pink: '#FFC0CB',
    blue: '#007BFF',
    green: '#28a745',
    brown: '#8B4513',
    grey: '#6c757d',
    gray: '#6c757d'
  };
  return map[color.toLowerCase()] || color;
}
