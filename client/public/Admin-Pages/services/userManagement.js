// services/userManagement.js

document.addEventListener('DOMContentLoaded', () => {
    const tableBody       = document.getElementById('userTableBody');
    const paginationCont  = document.getElementById('paginationContainer');
    const searchInput     = document.getElementById('searchInput');
    const filterRole      = document.getElementById('filterRole');
    const filterStatus    = document.getElementById('filterStatus');
    const rowsPerPage     = 12;
    let currentPage       = 1;
    let users             = [];

    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    if (!token) return window.location.href = '../../login.html';

    async function fetchUsers() {
        try {
        const res = await fetch('/api/admin/users', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        users = await res.json();
        renderTable();
        } catch (err) {
        console.error('Error fetching users:', err);
        tableBody.innerHTML = '<tr><td colspan="5" class="text-danger text-center">Could not load users.</td></tr>';
        }
    }

    function renderPagination(totalItems) {
        const totalPages = Math.ceil(totalItems / rowsPerPage);
        paginationCont.innerHTML = '';

        function addPage(label, page, disabled = false, active = false) {
        const li = document.createElement('li');
        li.className = `page-item${disabled? ' disabled':''}${active? ' active':''}`;
        const a = document.createElement('a');
        a.className = 'page-link'; a.href = '#'; a.textContent = label;
        a.onclick = e => { e.preventDefault(); if (!disabled && page !== currentPage) { currentPage = page; renderTable(); }};
        li.appendChild(a);
        paginationCont.appendChild(li);
        }

        addPage('« Previous', currentPage-1, currentPage===1);
        const range = 2;
        let start = Math.max(1, currentPage - range);
        let end   = Math.min(totalPages, currentPage + range);
        if (start > 1) { addPage('1',1); if(start>2) addPage('...',0,true); }
        for (let i=start; i<=end; i++) addPage(i,i,false,i===currentPage);
        if (end < totalPages) { if(end<totalPages-1) addPage('...',0,true); addPage(totalPages,totalPages); }
        addPage('Next »', currentPage+1, currentPage===totalPages);
    }

    function renderTable() {
        const search = searchInput.value.trim().toLowerCase();
        const role   = filterRole.value;
        const status = filterStatus.value;

        const filtered = users.filter(u =>
        (u.name.toLowerCase().includes(search) || u.email.toLowerCase().includes(search)) &&
        (role === '' || u.role === role) &&
        (status === '' || u.status === status)
        );

        const start = (currentPage-1)*rowsPerPage;
        const pageUsers = filtered.slice(start, start + rowsPerPage);

        tableBody.innerHTML = pageUsers.map(u => `
        <tr>
            <td>${u.name}</td>
            <td>${u.email}</td>
            <td>${u.role}</td>
            <td><span class="badge ${u.status==='Active' ? 'bg-success':'bg-secondary'} text-dark">${u.status}</span></td>
            <td>
            <button class="action-btn me-2" title="View"><i class="bi bi-eye"></i></button>
            <button class="action-btn me-2" title="Edit"><i class="bi bi-pencil"></i></button>
            <button class="action-btn" title="Delete"><i class="bi bi-trash"></i></button>
            </td>
        </tr>`).join('') ||
        '<tr><td colspan="5" class="text-center text-muted">No users found.</td></tr>';

        renderPagination(filtered.length);
    }

    // Wire up filters
    [searchInput, filterRole, filterStatus].forEach(el =>
        el.addEventListener('change', () => { currentPage = 1; renderTable(); })
    );
    searchInput.addEventListener('input', ()=>{ currentPage=1; renderTable(); });

    // Initial load
    fetchUsers();
});
