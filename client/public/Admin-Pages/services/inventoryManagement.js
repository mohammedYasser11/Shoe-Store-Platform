document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) return window.location.href = '../../login.html';

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.replace('../../login.html');
      return;
  }


    const productContainer = document.querySelector('.product-container');
  
    // Fetch products from the server
    try {
      const res = await fetch('/api/products'); 
      if (!res.ok) {
        throw new Error('Failed to fetch products');
      }
  
      const products = await res.json();
  
      // Generate product cards dynamically
      const productCardsHTML = products.map(product => {
        return product.variants.map(variant => {
          // Determine card background color based on stock quantity
          let backgroundColor;
          if (variant.stock > 5) {
            backgroundColor = '#50C878'; // Green for high stock
          } else if (variant.stock > 4) {
            backgroundColor = '#ffe135'; // Yellow for medium stock
          } else {
            backgroundColor = '#ED2939'; // Red for low stock
          }
  
          // Find the correct image for the variant
          const sanitizedColor = variant.color.toLowerCase().replace(/\s+/g, '');
          const sanitizedProductName = product.name.toLowerCase().replace(/\s+/g, '');
          const variantImage = product.images.find(image =>
            image.toLowerCase().includes(`${sanitizedProductName}-${sanitizedColor}`)
          ) || '/client/public/assets/images/placeholder.jpg'; // Fallback to placeholder if no match
  
          return `
            <div class="product-card" style="background-color: ${backgroundColor}">
              <img src="${variantImage}" alt="${product.name}">
              <div class="product-info">
                <h5>${product.name}</h5>
                <p>Color: ${variant.color}</p>
                <p>Size: ${variant.size}</p>
                <p>Price: $${product.price.toFixed(2)}</p>
                <p>Available: ${variant.stock}</p>
                <a href="./view_product.html?id=${product._id}&variantId=${variant._id}" class="btn btn-primary">View</a>
              </div>
            </div>
          `;
        }).join('');
      }).join('');
  
      // Render the product cards
      productContainer.innerHTML = productCardsHTML;
    } catch (err) {
      console.error('Error fetching products:', err);
      productContainer.innerHTML = '<p class="text-danger">Failed to load products. Please try again later.</p>';
    }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', e => {
      e.preventDefault();
      localStorage.removeItem('token');
      window.location.href = '../../login.html';
    });
  }
  // finally reveal the page
  document.body.classList.remove('hidden');
}

catch (err) {
    console.error('Dashboard load error', err);
    window.location.href = '../../login.html';
  }
});