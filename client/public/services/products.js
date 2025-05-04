// services/products.js

import { renderCart } from "./cart.js";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("shoe-products");
  const errorDiv = document.getElementById("productsError");
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");

  let activeCategory = "";

  async function loadProducts(searchTerm = "", category = "") {
    try {
      errorDiv.classList.add("d-none");
      errorDiv.innerText = "";

      let url = "/api/products";
      const params = [];
      if (searchTerm) params.push(`search=${encodeURIComponent(searchTerm)}`);
      if (category) params.push(`category=${encodeURIComponent(category)}`);
      if (params.length) url += "?" + params.join("&");

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const products = await res.json();

      container.innerHTML = "";

      if (products.length === 0) {
        container.innerHTML = `
          <div class="col-12">
            <p class="text-center">No products found.</p>
          </div>`;
        return;
      }

      products.forEach((p) => {
        if (!p.variants?.length) return;
        const v = p.variants[0]; // primary variant

        // image
        const imageUrl = p.images?.[0] || "/assets/images/placeholder.png";

        // discount logic now from primary variant
        const discount = v.discount || 0;
        const hasDiscount = discount > 0;
        const originalPrice = p.price.toFixed(2);
        const discountedPrice = hasDiscount
          ? (p.price * (1 - discount / 100)).toFixed(2)
          : null;

        // build card
        const col = document.createElement("div");
        col.className = "col";
        col.innerHTML = `
          <div class="card h-100 position-relative">
            ${
              hasDiscount
                ? `<span class="badge bg-danger position-absolute top-0 end-0 m-2">
                   -${discount}% 
                 </span>`
                : ""
            }
            <img src="${imageUrl}" class="card-img-top" alt="${p.name}">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${p.name}</h5>
              <p class="card-text mb-4">
                ${
                  hasDiscount
                    ? `<del class="text-muted me-2">$${originalPrice}</del>
                     <span class="fw-bold text-danger">$${discountedPrice}</span>`
                    : `<span class="fw-bold">$${originalPrice}</span>`
                }
              </p>
              <a href="product.html?id=${p._id}
                         &color=${encodeURIComponent(v.color)}
                         &size=${encodeURIComponent(v.size)}"
                 class="mt-auto btn btn-sm btn-outline-primary">
                View
              </a>
            </div>
          </div>`.replace(/\s+/g, " ");

        container.appendChild(col);
      });

      // renderCart only once
      renderCart();
    } catch (err) {
      console.error("Failed to load products:", err);
      errorDiv.innerText = "Could not load products. Please try again later.";
      errorDiv.classList.remove("d-none");
    }
  }

  // initial load
  loadProducts();

  // search form
  if (searchForm && searchInput) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      loadProducts(searchInput.value.trim(), activeCategory);
    });
  }

  // category sidebar
  const categoryLinks = document.querySelectorAll(
    ".list-group a.list-group-item"
  );
  categoryLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      // 1) Toggle active class
      categoryLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");

      // 2) Pick up category from data-category or fallback to text
      activeCategory = link.dataset.category || link.textContent.trim();

      // 3) Clear the search box only if it exists on this page
      if (searchInput) searchInput.value = "";

      // 4) Reload with the new category filter
      loadProducts("", activeCategory);
    });
  });
});
