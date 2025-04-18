// client/public/services/viewUser.js

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) return;
  
    const id = new URLSearchParams(window.location.search).get('id');
    if (!id) {
      alert('No user ID provided.');
      window.location.href = 'user_management.html';
      return;
    }
  
    document.getElementById('backBtn')
      .addEventListener('click', () => window.location.href = 'user_management.html');
  
    fetch(`/api/admin/users/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(user => {
      document.getElementById('detailName').innerText   = user.name;
      document.getElementById('detailEmail').innerText  = user.email;
      document.getElementById('detailRole').innerText   = user.role;
      document.getElementById('detailStatus').innerText = user.status;
    })
    .catch(err => {
      console.error(err);
      alert('Failed to load user.');
    });
  });
  