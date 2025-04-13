document.addEventListener('DOMContentLoaded', () => {
  // Check if token exists; if not, redirect to login
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  // Make a GET request to your protected endpoint
  fetch('/api/auth/me', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  .then(async res => {
    // If unauthorized, redirect to login page
    if (res.status === 401) {
      window.location.href = 'login.html';
      return;
    }
    return await res.json();
  })
  .then(userData => {
    if (userData) {
      console.log('User Data:', userData.email);
      document.getElementById('profileName').innerText = userData.name || 'N/A';
      document.getElementById('profileEmail').innerText = userData.email || 'N/A';
      document.getElementById('profilePhone').innerText = userData.phone || 'N/A';
      document.getElementById('profileAddress').innerText = userData.address || 'N/A';
    }
  })
  .catch(err => {
    console.error('Error fetching profile:', err);
    // Optionally show an error message
  });
});
