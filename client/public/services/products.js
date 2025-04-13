const container = document.getElementById("shoe-products");

// Helper function to create a product card with "Add to Cart" button
function createCard({ image, title, price, brand, description }) {
  const col = document.createElement("div");
  col.className = "col";
  col.innerHTML = `
    <div class="card h-100 text-center">
      <img src="${image}" class="card-img-top p-3" style="height: 300px; object-fit: contain;" alt="${title}">
      <div class="card-body">
        <h6 class="card-title">${title}</h6>
        <p class="mb-1 fw-bold text-danger">$${price}</p>
        <button class="btn btn-primary add-to-cart">Add to Cart</button>
      </div>
    </div>
  `;
  container.appendChild(col);

  // Handle "Add to Cart" button click
  const addToCartButton = col.querySelector(".add-to-cart");
  addToCartButton.addEventListener("click", () => {
    alert(`${title} added to cart!`);
  });
}

// Fetch shoes from Shoes Collections API
async function fetchShoes() {
  const url = 'https://shoes-collections.p.rapidapi.com/shoes';
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': 'b587a4f868msh8044de689478b9dp1ae81cjsneb90f45aca80',
      'x-rapidapi-host': 'shoes-collections.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json(); // Assuming the response is in JSON format

    // Check if we received data and loop through it
    if (Array.isArray(result) && result.length > 0) {
      result.forEach(product => {
        createCard({
          image: product.image, 
          title: product.name, 
          price: product.price,
          brand: product.brand,  
          description: product.description 
        });
      });
    } else {
      console.error("No products found in the response.");
    }
  } catch (error) {
    console.error('Error fetching shoes:', error);
  }
}

// Call the function to fetch and display the shoes data
fetchShoes();
