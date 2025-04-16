document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('productContainerHomePage');
  
    const fetchSomeProducts = async () => {
      try {
        const res = await fetch('/api/products/limited?limit=8');
        console.log('Response:', res);
        if (!res.ok) throw new Error('Failed to fetch products');
        const products = await res.json();
  
        // Render products
        container.innerHTML = products.map(product => `
          <div class="col-6 col-md-3">
            <a href="./product.html?id=${product._id}" class="text-decoration-none text-dark text-center d-block">
              <img src="${product.images[0] || './assets/images/placeholder.png'}" alt="${product.name}" class="img-fluid mb-2">
              <div class="small text-muted">${product.name}</div>
              <div class="fw-semibold">$${product.price.toFixed(2)}</div>
            </a>
          </div>
        `).join('');
      } catch (err) {
        console.error('Error fetching products:', err);
        container.innerHTML = '<p class="text-danger">Could not load products.</p>';
      }
    };
  
    fetchSomeProducts();
  });