// services/addUser.js

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) return;
  
    document.getElementById('backBtn')
      .addEventListener('click', () => {
        window.location.href = 'user_management.html';
      });
  
    const form   = document.getElementById('addUserForm');
    const msgDiv = document.getElementById('formMsg');
  
    form.addEventListener('submit', async e => {
      e.preventDefault();
      msgDiv.innerText = '';
      msgDiv.className = '';
  
      // Gather form data
      const payload = {
        name:     document.getElementById('nameInput').value.trim(),
        email:    document.getElementById('emailInput').value.trim(),
        password: document.getElementById('passwordInput').value,
        // convert to lowercase to match your enum
        role:     document.getElementById('roleInput').value.toLowerCase(),
        status:   document.getElementById('statusInput').value.toLowerCase()
    };
  
      try {
        const res = await fetch('/api/admin/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
  
        if (res.ok) {
          msgDiv.innerText = 'User created successfully!';
          msgDiv.className = 'text-success';
          form.reset();
        } else {
          msgDiv.innerText = data.message || 'Creation failed';
          msgDiv.className = 'text-danger';
        }
      } catch (err) {
        console.error('Error creating user:', err);
        msgDiv.innerText = 'An error occurred';
        msgDiv.className = 'text-danger';
      }
    });
  });
  