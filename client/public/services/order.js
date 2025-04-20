// client/public/services/order.js
import { renderCart, removeFromCart } from './cart.js';
// (1) Inline guard is in the HTML <head>. Here we proceed assuming a token is present.
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const tbody = document.getElementById('ordersTableBody');

    async function fetchOrders() {
        try {
            const res = await fetch('/api/order', {
            headers: { 'Authorization': `Bearer ${token}` }
            });
            const orders = await res.json();
            console.log('Fetched orders:', orders);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
    
            tbody.innerHTML = orders.map(o => `
            <tr>
                <td>#${o._id.slice(-8).toUpperCase()}</td>
                <td>${new Date(o.orderedAt).toLocaleDateString()}</td>
                <td>
                ${o.items.map(i =>
                    `${i.quantity}× ${i.productId.name}` +
                    ` (${i.selectedColor}, ${i.selectedSize})`
                ).join('<br>')}
                </td>
                <td>$${o.totalPrice.toFixed(2)}</td>
                <td>
                <span class="badge status-${o.status}">
                    ${o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                </span>
                </td>
            </tr>
            `).join('');
        } catch (err) {
            console.log("I'm here")
            console.error('Error loading orders:', err);
            tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-danger">
                Could not load your orders.
                </td>
            </tr>`;
        }
    }
    renderCart(); // Render the cart sidebar
    fetchOrders();
});
