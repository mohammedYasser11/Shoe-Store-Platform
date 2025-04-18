// services/orderManagement.js

document.addEventListener('DOMContentLoaded', () => {
    const token        = localStorage.getItem('token');
    if (!token) return window.location.replace('login.html');
  
    // UI elements
    const tbody        = document.getElementById('orderTableBody');
    const noResults    = document.getElementById('noResults');
    const searchInput  = document.getElementById('orderSearch');
    const statusFilter = document.getElementById('statusFilter');
    const pagContainer = document.getElementById('orderPagination');
    const sortCust     = document.getElementById('sortCustomer');
    const sortDate     = document.getElementById('sortDate');
    const sortTotal    = document.getElementById('sortTotal');
  
    // State
    let orders       = [];
    let currentPage  = 1;
    const rowsPerPage= 10;
    let sortConfig   = { column: null, direction: 'asc' };
  
    // 1) Fetch all orders
    async function fetchOrders() {
      try {
        const res = await fetch('/api/admin/orders', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error(res.statusText);
        orders = await res.json();
        renderTable();
      } catch (err) {
        console.error('Error loading orders:', err);
        tbody.innerHTML = `
          <tr><td colspan="6" class="text-center text-danger">
            Could not load orders.
          </td></tr>`;
      }
    }
  
    // 2) Filter & sort helpers
    function getFiltered() {
      const q   = searchInput.value.trim().toLowerCase();
      const st  = statusFilter.value;
      return orders.filter(o => {
        const id       = o._id.toLowerCase();
        const cust     = (o.user?.name || '').toLowerCase();
        const date     = new Date(o.orderedAt).toISOString().slice(0,10);
        const totalStr = `$${o.totalPrice.toFixed(2)}`;
        const stat     = o.status;
  
        const matchesSearch = [id, cust, date, totalStr]
          .some(f => f.includes(q));
        const matchesStatus = st==='all' || stat === st;
        return matchesSearch && matchesStatus;
      });
    }
  
    function getSorted(arr) {
      if (!sortConfig.column) return arr;
      return [...arr].sort((a,b) => {
        let av, bv;
        switch(sortConfig.column) {
          case 'customer':
            av = (a.user?.name||'').toLowerCase();
            bv = (b.user?.name||'').toLowerCase();
            break;
          case 'date':
            av = new Date(a.orderedAt);
            bv = new Date(b.orderedAt);
            break;
          case 'total':
            av = a.totalPrice;
            bv = b.totalPrice;
            break;
        }
        if (av > bv) return sortConfig.direction==='asc' ? 1 : -1;
        if (av < bv) return sortConfig.direction==='asc' ? -1 : 1;
        return 0;
      });
    }
  
    // 3) Render
    function renderTable() {
      const filtered = getSorted(getFiltered());
      const total    = filtered.length;
      const start    = (currentPage-1)*rowsPerPage;
      const pageData = filtered.slice(start, start+rowsPerPage);
  
      tbody.innerHTML = pageData.map(o => {
        const dateStr = new Date(o.orderedAt).toISOString().slice(0,10);
        return `
          <tr>
            <td>#${o._id}</td>
            <td>${o.userId.name||'—'}</td>
            <td>${dateStr}</td>
            <td>$${o.totalPrice.toFixed(2)}</td>
            <td>
              <select class="form-select form-select-sm status-select" data-id="${o._id}">
                ${['pending','processing','shipped','delivered','cancelled']
                  .map(s => `<option value="${s}"${o.status===s?' selected':''}>${s[0].toUpperCase()+s.slice(1)}</option>`)
                  .join('')}
              </select>
            </td>
            <td>
              <button class="btn btn-outline-success btn-sm send-confirmation" data-id="${o._id}">
                <i class="bi bi-envelope-fill"></i> Confirm
              </button>
              <button class="btn btn-outline-danger btn-sm issue-refund" data-id="${o._id}">
                <i class="bi bi-arrow-counterclockwise"></i> Refund
              </button>
            </td>
          </tr>
        `;
      }).join('');
  
      noResults.style.display = total===0 ? 'block' : 'none';
      renderPagination(total);
      bindActions();
      bindStatusChanges();
    }
  
    // 4) Pagination
    function renderPagination(totalItems) {
      const totalPages = Math.ceil(totalItems/rowsPerPage);
      pagContainer.innerHTML = '';
      if (totalPages<=1) return;
  
      function makePage(label, page, disabled=false, active=false) {
        const li = document.createElement('li');
        li.className = `page-item${disabled?' disabled':''}${active?' active':''}`;
        const a = document.createElement('a');
        a.className = 'page-link';
        a.href = '#';
        a.textContent = label;
        a.addEventListener('click', e => {
          e.preventDefault();
          if (!disabled && page!==currentPage) {
            currentPage = page;
            renderTable();
          }
        });
        li.appendChild(a);
        pagContainer.appendChild(li);
      }
  
      makePage('«', currentPage-1, currentPage===1);
      for (let i=1; i<=totalPages; i++) {
        makePage(i, i, false, currentPage===i);
      }
      makePage('»', currentPage+1, currentPage===totalPages);
    }
  
    // 5) Bind actions
    function bindActions() {
      // Confirm button
      tbody.querySelectorAll('.send-confirmation').forEach(btn => {
        btn.addEventListener('click', () => {
          alert(`📨 Confirmation sent for Order #${btn.dataset.id}`);
        });
      });
      // Refund button
      tbody.querySelectorAll('.issue-refund').forEach(btn => {
        btn.addEventListener('click', () => {
          if (confirm(`⚠️ Refund Order #${btn.dataset.id}?`)) {
            alert(`💸 Order #${btn.dataset.id} refunded.`);
          }
        });
      });
    }
  
    // 6) Handle status-change PUT
    function bindStatusChanges() {
      tbody.querySelectorAll('.status-select').forEach(sel => {
        sel.addEventListener('change', async () => {
          const id = sel.dataset.id;
          const newStatus = sel.value;
          try {
            const res = await fetch(`/api/admin/orders/${id}`, {
              method: 'PUT',
              headers: {
                'Content-Type':'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ status: newStatus })
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
          } catch (err) {
            alert('Failed to update status');
            sel.value = sel.getAttribute('data-original');
            console.error(err);
          }
        });
      });
    }
  
    // 7) Sorting handlers
    function setupSort(element, col) {
      element.addEventListener('click', () => {
        if (sortConfig.column===col) {
          sortConfig.direction = sortConfig.direction==='asc' ? 'desc' : 'asc';
        } else {
          sortConfig.column = col;
          sortConfig.direction = 'asc';
        }
        document.querySelectorAll('th i.bi-chevron-*')
          .forEach(i => i.className='bi bi-chevron-expand');
        const icon = element.querySelector('i');
        icon.className = sortConfig.direction==='asc'
          ? 'bi bi-chevron-up'
          : 'bi bi-chevron-down';
        currentPage = 1;
        renderTable();
      });
    }
    setupSort(sortCust, 'customer');
    setupSort(sortDate, 'date');
    setupSort(sortTotal,'total');
  
    // 8) Filters & search
    searchInput.addEventListener('input',   ()=>{ currentPage=1; renderTable(); });
    statusFilter.addEventListener('change', ()=>{ currentPage=1; renderTable(); });
  
    // Kick it off
    fetchOrders();
  });
  