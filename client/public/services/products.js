document.addEventListener('DOMContentLoaded', () => {
  const container   = document.getElementById('shoe-products');
  const errorDiv    = document.getElementById('productsError');
  const searchForm  = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');

  // This variable holds the currently selected category from the sidebar.
  let activeCategory = '';

  // Fetch and render products, optionally filtered by a search term and/or category.
  async function loadProducts(searchTerm = '', category = '') {
    try {
      // Hide previous errors.
      errorDiv.classList.add('d-none');
      errorDiv.innerText = '';

      // Build URL including any query parameters.
      let url = '/api/products';
      const queryParams = [];
      if (searchTerm) queryParams.push(`search=${encodeURIComponent(searchTerm)}`);
      if (category) queryParams.push(`category=${encodeURIComponent(category)}`);
      if (queryParams.length) {
        url += '?' + queryParams.join('&');
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

      // Loop through the products array and render each product.
      products.forEach(p => {
        // Make sure product has variants. If not, skip rendering.
        if (!p.variants || p.variants.length === 0) return;

        // Choose a primary variant (for example, the first one).
        const primaryVariant = p.variants[0];

        // For the image, we display the first image if available.
        const imageUrl = (p.images && p.images[0])
          ? p.images[0]
          : '/assets/images/placeholder.png';

        const col = document.createElement('div');
        col.className = 'col';
        col.innerHTML = `
          <div class="card h-100">
            <img
              src="${imageUrl}"
              class="card-img-top"
              alt="${p.name}">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${p.name}</h5>
              <p class="card-text text-muted mb-4">$${p.price.toFixed(2)}</p>
              <a href="product.html?id=${p._id}&color=${encodeURIComponent(primaryVariant.color)}&size=${encodeURIComponent(primaryVariant.size)}"
                 class="mt-auto btn btn-sm btn-outline-primary">
                View
              </a>
            </div>
          </div>`;
        container.appendChild(col);
      });
    } catch (err) {
      console.error('Failed to load products:', err);
      errorDiv.innerText = 'Could not load products. Please try again later.';
      errorDiv.classList.remove('d-none');
    }
  }

  // Initial load (no filter)
  loadProducts();

  // Wire up the navbar search form if it exists.
  if (searchForm && searchInput) {
    searchForm.addEventListener('submit', e => {
      e.preventDefault();
      loadProducts(searchInput.value.trim(), activeCategory);
    });
  }

  // Category filtering logic.
  // Query all links inside the sidebar category list.
  const categoryLinks = document.querySelectorAll('.list-group a.list-group-item');
  categoryLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      // Remove active class from all category links.
      categoryLinks.forEach(l => l.classList.remove('active'));
      // Add the active class to the clicked link.
      link.classList.add('active');

      // Get the category filter from the clicked link's text.
      // If needed, you can instead use a data-category attribute.
      const categoryText = link.textContent.trim();
      activeCategory = categoryText;

      // Optionally, clear the search input.
      searchInput.value = '';

      // Reload products, filtering by the selected category.
      loadProducts('', activeCategory);
    });
  });
});
