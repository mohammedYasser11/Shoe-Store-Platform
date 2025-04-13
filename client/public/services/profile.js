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
      if (userData.phone && userData.phone !== "N/A") {
        document.getElementById('profilePhone').innerText = userData.phone;
      } else {
        // Hide the entire phone field container, if you wrapped it.
        const phoneContainer = document.getElementById("profilePhoneContainer");
        if (phoneContainer) phoneContainer.style.display = 'none';
      }

      // For address, do the same:
      if (userData.address && userData.address !== "N/A") {
        document.getElementById('profileAddress').innerText = userData.address;
      } else {
        const addressContainer = document.getElementById("profileAddressContainer");
        if (addressContainer) addressContainer.style.display = 'none';
      }
    }
  })
  .catch(err => {
    console.error('Error fetching profile:', err);
  });
});