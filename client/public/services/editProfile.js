// services/editProfile.js

import { renderCart } from './cart.js';

// Utility to show messages
function showMessage(msg, type = 'success') {
  const msgDiv = document.getElementById('editMsg');
  msgDiv.innerText = msg;
  msgDiv.className = type === 'success' ? 'text-success' : 'text-danger';
}

document.addEventListener('DOMContentLoaded', () => {
  const form    = document.getElementById('editProfileForm');
  const token   = localStorage.getItem('token');

  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  // 1) Fetch current profile and prefill the form and image preview
  fetch('/api/auth/me', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(async res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  })
  .then(user => {
    document.getElementById('name').value    = user.name || '';
    document.getElementById('email').value   = user.email || '';
    document.getElementById('phone').value   = user.phone || '';
    const addr = user.address || {};
    document.getElementById('country').value = addr.country || '';
    document.getElementById('city').value    = addr.city    || '';
    document.getElementById('zip').value     = addr.zip     || '';
    document.getElementById('street').value  = addr.street  || '';
    
  })
  .catch(err => {
    console.error('Prefill error:', err);
    showMessage('Failed to load profile', 'error');
  });

  // 2) Handle form submit with optional image
  form.addEventListener('submit', async e => {
    e.preventDefault();
    showMessage('', '');

    const formData = new FormData();
    formData.append('name', document.getElementById('name').value.trim());
    formData.append('phone', document.getElementById('phone').value.trim());

    const password = document.getElementById('password').value;
    if (password) formData.append('password', password);

    // Address fields
    formData.append('address[country]', document.getElementById('country').value.trim());
    formData.append('address[city]',    document.getElementById('city').value.trim());
    formData.append('address[zip]',     document.getElementById('zip').value.trim());
    formData.append('address[street]',  document.getElementById('street').value.trim());
    
    try {
      const res = await fetch('/api/users/me', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await res.json();

      if (res.ok) {
        showMessage('Profile updated successfully!', 'success');
      } else {
        showMessage(data.message || 'Update failed', 'error');
      }
    } catch (err) {
      console.error('Update error:', err);
      showMessage('An error occurred', 'error');
    }
  });
  renderCart();
});
