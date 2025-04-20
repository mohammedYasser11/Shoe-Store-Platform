import { renderCart } from './cart.js';

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const tbody = document.getElementById('ordersTableBody');

    async function fetchOrders() {
        try {
            // Fetch orders from the backend
            const res = await fetch('/api/orders', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });
    
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }
    
            const orders = await res.json();
            console.log('Fetched orders:', orders);
    
            // Dynamically render orders in the table
            tbody.innerHTML = orders.map(order => `
                <tr>
                    <td>#${order._id.slice(-8).toUpperCase()}</td>
                    <td>${new Date(order.orderedAt).toLocaleDateString()}</td>
                    <td>
                        ${order.items.map(item => {
                            const variant = item.variant.productId.variants.find(v => v._id === item.variant.variantId);
                            const color = variant ? variant.color : 'Unknown';
                            const size = variant ? variant.size : 'Unknown';
    
                            return `${item.variant.quantity}× ${item.variant.productId.name} (Color: ${color}, Size: ${size})`;
                        }).join('<br>')}
                    </td>
                    <td>$${order.totalPrice.toFixed(2)}</td>
                    <td>
                        <span class="badge status-${order.status}">
                            ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                    </td>
                </tr>
            `).join('');
        } catch (err) {
            console.error('Error loading orders:', err);
    
            // Display an error message in the table
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-danger">
                        Could not load your orders.
                    </td>
                </tr>`;
        }
    }

    // Render the cart sidebar
    renderCart();

    // Fetch and render orders
    fetchOrders();
});