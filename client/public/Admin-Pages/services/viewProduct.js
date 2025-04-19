document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    const variantId = params.get('variantId');
  
    if (!productId || !variantId) {
      document.body.innerHTML = '<p class="text-danger">Invalid product or variant ID.</p>';
      return;
    }
  
    try {
      const res = await fetch(`/api/products/${productId}/variants/${variantId}`);
      if (!res.ok) {
        throw new Error('Failed to fetch product variant');
      }
  
      const { product, variant } = await res.json();
  
      // Update product image
      const productImageElement = document.querySelector('.product-image');
      if (productImageElement) {
        productImageElement.src = product.images.find(image =>
          image.toLowerCase().includes(`${product.name.toLowerCase().replace(/\s+/g, '')}-${variant.color.toLowerCase().replace(/\s+/g, '')}`)
        ) || '/assets/images/placeholder.jpg';
        productImageElement.alt = product.name;
      }
  
      // Update product name
      const productNameElement = document.querySelector('.product-info h2');
      if (productNameElement) {
        productNameElement.textContent = product.name;
      }
  
      // Update product price
      const productPriceElement = document.querySelector('.product-info p strong');
      if (productPriceElement) {
        productPriceElement.textContent = `$${product.price.toFixed(2)}`;
      }
  
      // Update available quantity
      const productQuantityElement = document.querySelector('#product-quantity');
      if (productQuantityElement) {
        productQuantityElement.textContent = variant.stock;
      }
  
      // Update size options
      const productSizeElement = document.querySelector('#product-size');
      if (productSizeElement) {
        productSizeElement.innerHTML = `<option value="${variant.size}" selected>${variant.size}</option>`;
      }
  
      // Update color options
      const productColorElement = document.querySelector('#product-color');
      if (productColorElement) {
        productColorElement.innerHTML = `<option value="${variant.color}" selected>${variant.color}</option>`;
      }
    } catch (err) {
      console.error('Error fetching product variant:', err);
      document.body.innerHTML = '<p class="text-danger">Failed to load product details. Please try again later.</p>';
    }
});

function resupplyProduct(){
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    const variantId = params.get('variantId');
    const newQuantity = document.querySelector('#resupply-quantity').value;
  
    if (!newQuantity) {
      alert('Please fill in all fields.');
      return;
    }

    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    if (!token) {
        alert('You must be logged in to perform this action.');
        window.location.href = '/login.html'; // Redirect to login page if not logged in
        return;
    }
    
    fetch(`/api/admin/products/${productId}/variants/${variantId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ stock: newQuantity })
    })
    .then(response => response.json())
    .then(data => {
      alert('Product re-supplied successfully!');
      window.location.reload(); // Reload the page to see updated data
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Failed to re-supply product. Please try again later.');
    });
}