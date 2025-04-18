// services/order.js

// 1) Immediately guard the page before anything else runs
const token = localStorage.getItem('token');
if (!token) {
    // Use replace() so the login page replaces this in history
    window.location.replace('login.html');
} else {
    // 2) If authenticated, wire up the rest of your orders logic
    document.addEventListener('DOMContentLoaded', () => {
        // Example: fetch & render orders
        fetchOrders();
    });
}
// 2) Once authenticated, fetch & render:
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const tbody = document.querySelector('table tbody');

    async function fetchOrders() {
        try {
            const res = await fetch('/api/orders', {
            headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const orders = await res.json();
    
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
            console.error('Error loading orders:', err);
            tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-danger">
                Could not load your orders.
                </td>
            </tr>`;
        }
    }
    fetchOrders();
});