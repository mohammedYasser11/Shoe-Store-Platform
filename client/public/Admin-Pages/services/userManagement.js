// services/userManagement.js

document.addEventListener('DOMContentLoaded', () => {
    const tbody          = document.getElementById('userTableBody');
    const paginationCont = document.getElementById('paginationContainer');
    const searchInput    = document.getElementById('searchInput');
    const filterRole     = document.getElementById('filterRole');
    const filterStatus   = document.getElementById('filterStatus');
    // (Optional) uncomment if you add an Add User button with this ID:
    // const addUserBtn     = document.getElementById('addUserBtn');
    const rowsPerPage    = 12;
  
    let currentPage = 1;
    let users       = [];
  
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.replace('login.html');
      return;
    }
  
    // if you add <button id="addUserBtn">…</button> in your HTML, enable this:
    // addUserBtn.addEventListener('click', () => {
    //   window.location.href = 'add_user.html';
    // });
  
    async function fetchUsers() {
      try {
        const res = await fetch('/api/admin/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error(res.statusText);
        users = await res.json();
        renderTable();
      } catch (err) {
        console.error(err);
        tbody.innerHTML = `
          <tr><td colspan="5" class="text-center text-danger">
            Could not load users.
          </td></tr>`;
      }
    }
  
    function renderPagination(totalItems) {
      const totalPages = Math.ceil(totalItems / rowsPerPage);
      paginationCont.innerHTML = '';
  
      function addPage(label, page, disabled = false, active = false) {
        const li = document.createElement('li');
        li.className = `page-item${disabled?' disabled':''}${active?' active':''}`;
        const a = document.createElement('a');
        a.className = 'page-link';
        a.href = '#';
        a.textContent = label;
        a.addEventListener('click', e => {
          e.preventDefault();
          if (!disabled && page !== currentPage) {
            currentPage = page;
            renderTable();
          }
        });
        li.appendChild(a);
        paginationCont.appendChild(li);
      }
  
      addPage('« Prev', currentPage - 1, currentPage === 1);
  
      const range = 2;
      let start = Math.max(1, currentPage - range);
      let end   = Math.min(totalPages, currentPage + range);
  
      if (start > 1) {
        addPage('1', 1);
        if (start > 2) addPage('...', 0, true);
      }
      for (let i = start; i <= end; i++) {
        addPage(i, i, false, i === currentPage);
      }
      if (end < totalPages) {
        if (end < totalPages - 1) addPage('...', 0, true);
        addPage(totalPages, totalPages);
      }
  
      addPage('Next »', currentPage + 1, currentPage === totalPages);
    }
  
    function renderTable() {
      const q      = searchInput.value.trim().toLowerCase();
      const role   = filterRole.value;
      const status = filterStatus.value;
  
      const filtered = users.filter(u =>
        (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) &&
        (!role   || u.role   === role) &&
        (!status || u.status === status)
      );
  
      const start     = (currentPage - 1) * rowsPerPage;
      const pageUsers = filtered.slice(start, start + rowsPerPage);
  
      tbody.innerHTML = pageUsers.map(u => `
        <tr>
          <td>${u.name}</td>
          <td>${u.email}</td>
          <td>${u.role}</td>
          <td>
            <span class="badge ${u.status === 'Active' ? 'bg-success' : 'bg-secondary'} text-dark">
              ${u.status}
            </span>
          </td>
          <td>
            <button class="action-btn view-btn me-2"  data-id="${u._id}" title="View">
              <i class="bi bi-eye"></i>
            </button>
            <button class="action-btn edit-btn me-2"  data-id="${u._id}" title="Edit">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="action-btn delete-btn"     data-id="${u._id}" title="Delete">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
      `).join('') || `
        <tr><td colspan="5" class="text-center text-muted">No users found.</td></tr>
      `;
  
      // wire up the buttons after injecting rows
      tbody.querySelectorAll('.view-btn').forEach(btn =>
        btn.addEventListener('click', () => {
          window.location.href = `view_user.html?id=${btn.dataset.id}`;
        })
      );
      tbody.querySelectorAll('.edit-btn').forEach(btn =>
        btn.addEventListener('click', () => {
          window.location.href = `edit_user.html?id=${btn.dataset.id}`;
        })
      );
      tbody.querySelectorAll('.delete-btn').forEach(btn =>
        btn.addEventListener('click', async () => {
          if (!confirm('Delete this user?')) return;
          try {
            const res = await fetch(`/api/admin/users/${btn.dataset.id}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error(await res.text());
            users = users.filter(u => u._id !== btn.dataset.id);
            renderTable();
          } catch (err) {
            alert('Failed to delete user.');
            console.error(err);
          }
        })
      );
  
      renderPagination(filtered.length);
    }
  
    // filters
    searchInput.addEventListener('input',  () => { currentPage = 1; renderTable(); });
    filterRole .addEventListener('change', () => { currentPage = 1; renderTable(); });
    filterStatus.addEventListener('change', () => { currentPage = 1; renderTable(); });
  
    // initial load
    fetchUsers();
  });
  