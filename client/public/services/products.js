document.addEventListener('DOMContentLoaded', () => {
  const container   = document.getElementById('shoe-products');
  const errorDiv    = document.getElementById('productsError');
  const searchForm  = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');

  // Fetch and render products, optionally filtered by `searchTerm`
  async function loadProducts(searchTerm = '') {
    try {
      // hide previous errors
      errorDiv.classList.add('d-none');
      errorDiv.innerText = '';

      // build URL
      let url = '/api/products';
      if (searchTerm) {
        url += `?search=${encodeURIComponent(searchTerm)}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const products = await res.json();
      container.innerHTML = '';

      if (products.length === 0) {
        container.innerHTML = `
          <div class="col-12">
            <p class="text-center">No products found.</p>
          </div>`;
        return;
      }

      // 1. Track displayed name + color combos to avoid duplicates
const shown = new Set();

products.forEach(p => {
  p.colors.forEach((color, i) => {
    const key = `${p.name}`;
    if (shown.has(key)) return; // skip duplicates
    shown.add(key);

    const col = document.createElement('div');
    col.className = 'col';
    col.innerHTML = `
      <div class="card h-100">
        <img
          src="${(p.images && p.images[i]) ? p.images[i] : '/assets/images/placeholder.png'}"
          class="card-img-top"
          alt="${p.name}"
        >
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${p.name}</h5>
          <p class="card-text text-muted mb-4">$${p.price.toFixed(2)}</p>
          <a href="product.html?id=${p._id}&color=${encodeURIComponent(color)}"
            class="mt-auto btn btn-sm btn-outline-primary">
            View
          </a>
        </div>
      </div>
    `;
    container.appendChild(col);
  });
});


    } catch (err) {
      console.error('Failed to load products:', err);
      errorDiv.innerText = 'Could not load products. Please try again later.';
      errorDiv.classList.remove('d-none');
    }
  }

  // initial load (no filter)
  loadProducts();

  // wire up your navbar search if you have one

  if (searchForm && searchInput) {
    searchForm.addEventListener('submit', e => {
      e.preventDefault();
      loadProducts(searchInput.value.trim());
    });
  }
});
