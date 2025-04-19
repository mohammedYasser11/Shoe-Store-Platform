// services/dashboard.js
document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) return window.location.href = '../../login.html';

  try {
    const res = await fetch('/api/admin/dashboard', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.status === 401 || res.status === 403) {
      return window.location.href = '../../login.html';
    }
    const data = await res.json();

    // 1) fill the stat cards
    document.getElementById('userCount').textContent  = data.userCount.toLocaleString();
    document.getElementById('orderCount').textContent = data.orderCount.toLocaleString();
    document.getElementById('productCount').textContent = data.productCount.toLocaleString();
    document.getElementById('revenueCount').textContent = `$${data.totalSales.toFixed(2)}`;

    // 2) update the chart (salesChart is global from your inline <script>)
    if (Array.isArray(data.sales) && window.salesChart) {
      salesChart.data.labels  = data.sales.map(pt => pt.day);
      salesChart.data.datasets[0].data = data.sales.map(pt => pt.amount);
      salesChart.update();
    }

    
    // finally reveal the page
    document.body.classList.remove('hidden');
  } catch (err) {
    console.error('Dashboard load error', err);
    window.location.href = '../../login.html';
  }
});
