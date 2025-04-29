// services/inventoryManagement.js

document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '../../login.html';
    return;
  }

  const productContainer = document.querySelector('.product-container');

  try {
    // 1) Fetch products
    const res = await fetch('/api/products');
    if (!res.ok) throw new Error('Failed to fetch products');
    const products = await res.json();

    // 2) Flatten variants + include discount
    const allVariants = products.flatMap(product =>
      product.variants.map(variant => ({
        ...variant,
        productName:   product.name,
        productPrice:  product.price,
        productImages: product.images,
        productId:     product._id,
        discount:      product.discount || 0
      }))
    );

    // 3) Sort by stock
    allVariants.sort((a, b) => a.stock - b.stock);

    // 4) Render cards
    productContainer.innerHTML = allVariants.map(variant => {
      const bg = variant.stock > 5 ? '#50C878'
               : variant.stock > 4 ? '#ffe135'
               : '#ED2939';

      const nameSlug  = variant.productName.toLowerCase().replace(/\s+/g, '');
      const colorSlug = variant.color.toLowerCase().replace(/\s+/g, '');
      const img = variant.productImages.find(src =>
        src.toLowerCase().includes(`${nameSlug}-${colorSlug}`)
      ) || '/client/public/assets/images/placeholder.jpg';

      const origPrice       = variant.productPrice;
      const discountedPrice = (origPrice * (1 - variant.discount/100)).toFixed(2);

      return `
        <div class="product-card" style="background-color: ${bg}">
          <img src="${img}" alt="${variant.productName}">
          <div class="product-info">
            <h5>${variant.productName}</h5>
            <p>Color: ${variant.color}</p>
            <p>Size: ${variant.size}</p>
            <p>
              Price: 
              <del class="original-price">$${origPrice.toFixed(2)}</del>
              <ins class="discounted-price">$${discountedPrice}</ins>
            </p>
            <p>Discount: <span class="current-discount">${variant.discount}%</span></p>
            <p>Available: ${variant.stock}</p>
            <div class="d-flex gap-2">
              <a href="./view_product.html?id=${variant.productId}&variantId=${variant._id}"
                 class="btn btn-primary">View</a>
              <button data-id="${variant.productId}"
                      class="btn btn-secondary btn-sm set-discount">
                Set Discount
              </button>
            </div>
          </div>
        </div>`;
    }).join('');

    // 5) Bind “Set Discount” buttons
    productContainer.querySelectorAll('.set-discount').forEach(btn => {
      btn.addEventListener('click', async () => {
        const productId    = btn.dataset.id;
        const info         = btn.closest('.product-info');
        const discountEl   = info.querySelector('.current-discount');
        const origPriceEl  = info.querySelector('.original-price');
        const discPriceEl  = info.querySelector('.discounted-price');

        const current = parseFloat(discountEl.textContent) || 0;
        const inp     = prompt('Enter discount % (0–100):', current);
        if (inp == null) return;
        const pct = Math.min(100, Math.max(0, Number(inp)));

        try {
          const r = await fetch(`/api/admin/products/${productId}/discount`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ discount: pct })
          });
          if (!r.ok) throw new Error(await r.text());
  const data = await r.json();

  // UI update without relying on missing fields
  discountEl.textContent = `${data.discount}%`;
  const orig = parseFloat(origPriceEl.textContent.replace(/[^0-9.]/g, ''));
  const newDiscPrice = (orig * (1 - data.discount/100)).toFixed(2);
  discPriceEl.textContent = `$${newDiscPrice}`;

  alert(`✅ Discount set to ${data.discount}%`);}
  catch (err) {
          console.error('Failed to set discount:', err);
          alert(`❌ Could not update discount: ${err.message}`);
        }
      });
    });

  } catch (err) {
    console.error('Error loading inventory:', err);
    productContainer.innerHTML =
      '<p class="text-danger">Failed to load products. Please try again later.</p>';
  }

  // 6) Logout handler
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', e => {
      e.preventDefault();
      localStorage.removeItem('token');
      window.location.href = '../../login.html';
    });
  }
});
