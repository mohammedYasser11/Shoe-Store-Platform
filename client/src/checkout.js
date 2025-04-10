document.addEventListener('DOMContentLoaded', () => {
  const cartItems = [
    { name: "Wireless Mouse", price: 25.99 },
    { name: "USB-C Charger", price: 45.50 },
    { name: "Notebook Stand", price: 18.75 }
  ];

  const cartList = document.getElementById('cart-items');
  const totalPriceEl = document.getElementById('total-price');
  let total = 0;

  cartItems.forEach(item => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.textContent = item.name;

    const span = document.createElement('span');
    span.textContent = `$${item.price.toFixed(2)}`;
    li.appendChild(span);

    cartList.appendChild(li);
    total += item.price;
  });

  totalPriceEl.textContent = `$${total.toFixed(2)}`;
});
