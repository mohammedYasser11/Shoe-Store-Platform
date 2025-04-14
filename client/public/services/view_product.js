// script.js

let productData = {
    id: 1,
    name: "Product Name",
    quantity: 50,
    price: 99.99,
    sizes: [38, 39, 40, 41],
    colors: ['Black', 'White', 'Red']
};

function resupplyProduct() {
    const selectedSize = document.getElementById("product-size").value;
    const selectedColor = document.getElementById("product-color").value;
    const resupplyQuantity = parseInt(document.getElementById("resupply-quantity").value);
    
    if (resupplyQuantity && resupplyQuantity > 0) {
        productData.quantity += resupplyQuantity;
        document.getElementById("product-quantity").innerText = productData.quantity;
    } else {
        alert("Please enter a valid quantity.");
    }
}
