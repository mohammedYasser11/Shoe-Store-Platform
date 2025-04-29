// public/services/search.js
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🟢 search.js loaded');
  
    // 1) Grab the query param
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q') || '';
    document.getElementById('searchQuery').textContent = q;
  
    // 2) Fetch matching products
    let products = [];
    try {
      const res = await fetch(`/api/products?search=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      products = await res.json();
      console.log('📦 products:', products);
    } catch (err) {
      console.error('Failed to load search results', err);
      document.getElementById('results').innerHTML =
        `<div class="alert alert-danger">Error loading results.</div>`;
      return;
    }
  
    // 3) Render or show “no results”
    const container = document.getElementById('results');
    const noResults = document.getElementById('noResults');
    if (!products.length) {
      noResults.style.display = 'block';
      return;
    }
    noResults.style.display = 'none';
    container.innerHTML = '';
  
    products.forEach(p => {
      const col = document.createElement('div');
      col.className = 'col-md-3';
      col.innerHTML = `
        <div class="card h-100">
          <img src="${p.images[0]||'/placeholder.png'}" 
               class="card-img-top" 
               alt="${p.name}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${p.name}</h5>
            <p class="card-text text-truncate">${p.description||''}</p>
            <div class="mt-auto d-flex justify-content-between align-items-center">
              <span class="fw-bold">$${p.price.toFixed(2)}</span>
              <a href="./viewProduct.html?id=${p._id}" 
                 class="btn btn-sm btn-primary">View</a>
            </div>
          </div>
        </div>`;
      container.appendChild(col);
    });
  });
  