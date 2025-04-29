import { renderCart, removeFromCart } from './cart.js';

document.addEventListener('DOMContentLoaded', () => {
  const homeContainer  = document.getElementById('homeProducts');
  const picksContainer = document.getElementById('topPicks');

  // Utility: map color names to hex codes
  function getColorHex(color) {
    const map = {
      black: '#000000', white: '#FFFFFF', pink: '#FFC0CB', blue: '#007BFF',
      green: '#28a745', brown: '#8B4513', grey: '#6c757d', gray: '#6c757d'
    };
    return map[color.toLowerCase()] || color;
  }

  // Helper to build the price HTML with discount if any
  function buildPriceHtml(price, discount) {
    if (discount > 0) {
      const orig = price.toFixed(2);
      const disc = (price * (1 - discount/100)).toFixed(2);
      return `
        <div>
          <del class="text-muted me-2">$${orig}</del>
          <span class="fw-semibold text-danger">$${disc}</span>
          <span class="badge bg-danger ms-2">-${discount}%</span>
        </div>
      `;
    } else {
      return `<div class="fw-semibold">$${price.toFixed(2)}</div>`;
    }
  }

  // Load middle "featured" products
  async function loadHomeProducts(limit) {
    try {
      const res = await fetch(`/api/products/limited?limit=${limit}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const products = await res.json();
      homeContainer.innerHTML = '';

      products.forEach(p => {
        const img = p.images?.[0] || '/assets/images/placeholder.png';
        const priceHtml = buildPriceHtml(p.price, p.discount || 0);
        const col = document.createElement('div');
        col.className = 'col-md-4';
        col.innerHTML = `
          <div class="text-center">
            <a href="product.html?id=${p._id}" class="text-decoration-none text-dark">
              <img src="${img}" class="img-fluid mb-2" alt="${p.name}">
              <div class="blog-title">${p.name}</div>
            </a>
            <a href="product.html?id=${p._id}" class="btn btn-outline-dark mt-2">
              ${priceHtml}
            </a>
          </div>
        `;
        homeContainer.appendChild(col);
      });
    } catch (err) {
      console.error('Error loading home products:', err);
      homeContainer.innerHTML =
        '<p class="text-center text-danger">Could not load featured products.</p>';
    }
  }

  // Load "Top Picks For You"
  async function loadTopPicks(limit) {
    try {
      const res = await fetch(`/api/products/limited?limit=${limit}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const products = await res.json();
      picksContainer.innerHTML = '';

      products.forEach(p => {
        const img = p.images?.[0] || '/assets/images/placeholder.png';
        const variants = p.variants || [];
        const colors = [...new Set(
          variants.filter(v => v.stock > 0).map(v => v.color)
        )];
        const primary = variants.find(v => colors.includes(v.color)) || {};
        const colorParam = encodeURIComponent(colors[0] || '');
        const sizeParam  = encodeURIComponent(primary.size || '');
        const priceHtml = buildPriceHtml(p.price, p.discount || 0);

        // color badges
        const badgesHTML = colors.map(c =>
          `<span class="d-inline-block rounded-circle mx-1"`
          + ` style="width:14px;height:14px;background-color:${getColorHex(c)};border:1px solid #ccc;"></span>`
        ).join('');

        const col = document.createElement('div');
        col.className = 'col-6 col-md-3';
        col.innerHTML = `
          <a href="product.html?id=${p._id}&color=${colorParam}&size=${sizeParam}"
             class="text-decoration-none text-dark d-block text-center">
            <img src="${img}" alt="${p.name}" class="img-fluid mb-2">
            <div class="mb-2">${badgesHTML}</div>
            <div class="small text-muted mb-1">${p.name}</div>
            ${priceHtml}
          </a>
        `;
        picksContainer.appendChild(col);
      });
    } catch (err) {
      console.error('Error loading top picks:', err);
      picksContainer.innerHTML =
        '<p class="text-center text-danger">Could not load top picks.</p>';
    }
  }

  if (homeContainer)  loadHomeProducts(3);
  else console.error('No #homeProducts container found');

  if (picksContainer) loadTopPicks(8);
  else console.error('No #topPicks container found');

  renderCart(); // initialize cart display
});
