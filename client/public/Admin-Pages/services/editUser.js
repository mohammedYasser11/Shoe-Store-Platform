// client/public/services/editUser.js

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
  
    const nameInput   = document.getElementById('nameInput');
    const emailInput  = document.getElementById('emailInput');
    const roleInput   = document.getElementById('roleInput');
    const statusInput = document.getElementById('statusInput');
    const formMsg     = document.getElementById('formMsg');
    const form        = document.getElementById('editForm');
  
    // 1) Prefill form
    fetch(`/api/admin/users/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(user => {
      nameInput.value   = user.name;
      emailInput.value  = user.email;
      roleInput.value   = user.role;
      statusInput.value = user.status;
    })
    .catch(err => {
      console.error(err);
      formMsg.innerText = 'Failed to load user data.';
      formMsg.className = 'text-danger';
    });
  
    // 2) Handle form submit
    form.addEventListener('submit', async e => {
      e.preventDefault();
      formMsg.innerText = '';
  
      const payload = {
        name:   nameInput.value.trim(),
        role:   roleInput.value,
        status: statusInput.value
      };
  
      try {
        const res = await fetch(`/api/admin/users/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok) {
          formMsg.innerText = 'User updated successfully!';
          formMsg.className = 'text-success';
        } else {
          formMsg.innerText = data.message || 'Update failed';
          formMsg.className = 'text-danger';
        }
      } catch (err) {
        console.error(err);
        formMsg.innerText = 'An error occurred';
        formMsg.className = 'text-danger';
      }
    });
  });
  