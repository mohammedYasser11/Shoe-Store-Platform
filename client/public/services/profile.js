function setField(id, value) {
  const el = document.getElementById(id);
  if (!value) {
    el.previousElementSibling.style.display = 'none'; // hide label
    el.style.display = 'none';                         // hide value
  } else {
    el.innerText = value;
  }
}

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
      console.log('User data:', userData); // Debugging line
      // Populate the profile page with user data
      document.getElementById('profileName').innerText = userData.name || 'N/A';
      document.getElementById('profileEmail').innerText = userData.email || 'N/A';
      // For phone, check if a valid value exists; if not, hide its container.
      setField('profilePhone', userData.phone);

      // For address, check if a valid value exists; if not, hide its container.
      const address = userData.address || {};
      setField('profileCountry', address.country);
      setField('profileCity',    address.city);
      setField('profileZip',     address.zip);
      setField('profileStreet',  address.street);
    }
  })
  .catch(err => {
    console.error('Error fetching profile:', err);
  });
});