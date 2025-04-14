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

      products.forEach(p => {
        const col = document.createElement('div');
        col.className = 'col';
        col.innerHTML = `
          <div class="card h-100">
            <img
              src="${(p.images && p.images.length) ? p.images[0] : '/assets/images/placeholder.png'}"
              class="card-img-top"
              alt="${p.name}"
            >
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${p.name}</h5>
              <p class="card-text text-muted mb-4">$${p.price.toFixed(2)}</p>
              <a href="product.html?id=${p._id}"
                class="mt-auto btn btn-sm btn-outline-primary">
                View
              </a>
            </div>
          </div>
        `;
        container.appendChild(col);
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


async function fetchShoes() {
  const container = document.getElementById('shoe-products');

  const url = 'https://shoes-collections.p.rapidapi.com/shoes';
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': '6597f2d7bamshd3f3f067586b5b5p145779jsn8ab5ac530a58',
      'x-rapidapi-host': 'shoes-collections.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    container.innerHTML = ''; // clear previous content

    if (Array.isArray(result) && result.length > 0) {
      result.forEach(p => {
        const col = document.createElement('div');
        col.className = 'col';
        console.log(p)
        col.innerHTML = `
          <div class="card h-100">
            <img
              src="${p.images[0] || '/assets/images/placeholder.png'}"
              class="card-img-top"
              alt="${p.name}"
            >
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${p.name}</h5>
              <p class="card-text text-muted mb-4">${p.brand || ''}</p>
              <p class="card-text text-muted mb-2">${p.price || ''}</p>
              <a href="#" class="mt-auto btn btn-sm btn-outline-primary">View</a>
            </div>
          </div>
        `;
        container.appendChild(col);
      });
    } else {
      container.innerHTML = '<div class="col-12 text-center">No products found.</div>';
    }
  } catch (error) {
    console.error('Error fetching shoes:', error);
    container.innerHTML = '<div class="col-12 text-danger text-center">Failed to load shoes.</div>';
  }
}

// fetchShoes();
