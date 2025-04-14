document.addEventListener('DOMContentLoaded', () => {
  const form    = document.getElementById('editProfileForm');
  const msgDiv  = document.getElementById('editMsg');
  const token   = localStorage.getItem('token');

  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  // 1) Fetch current profile and prefill the form
  fetch('/api/auth/me', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(res => res.json())
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
    msgDiv.innerText = 'Failed to load profile';
    msgDiv.className = 'text-danger';
  });

  // 2) Handle form submit
  form.addEventListener('submit', async e => {
    e.preventDefault();
    msgDiv.innerText = '';

    const payload = {
      name:  document.getElementById('name').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      address: {
        country: document.getElementById('country').value.trim(),
        city:    document.getElementById('city').value.trim(),
        zip:     document.getElementById('zip').value.trim(),
        street:  document.getElementById('street').value.trim()
      }
    };

    try {
      const res = await fetch('/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok) {
        msgDiv.innerText = 'Profile updated successfully!';
        msgDiv.className = 'text-success';
      } else {
        msgDiv.innerText = data.message || 'Update failed';
        msgDiv.className = 'text-danger';
      }
    } catch (err) {
      console.error('Update error:', err);
      msgDiv.innerText = 'An error occurred';
      msgDiv.className = 'text-danger';
    }
  });
});
