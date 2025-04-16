function setField(id, value) {
  const el = document.getElementById(id);
  const label = el.previousElementSibling;
  if (!value) {
    if (label) label.style.display = 'none'; // hide label
    el.style.display = 'none';               // hide value
  } else {
    el.innerText = value;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // 1. Redirect if not logged in
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  // 2. Fetch the current user's data
  fetch('/api/auth/me', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  .then(async res => {
    if (res.status === 401) {
      window.location.href = 'login.html';
      return null;
    }
    return res.json();
  })
  .then(userData => {
    if (!userData) return;

    console.log('User data:', userData);

    // 3. Populate text fields
    document.getElementById('profileName').innerText  = userData.name  || 'N/A';
    document.getElementById('profileEmail').innerText = userData.email || 'N/A';
    setField('profilePhone', userData.phone);

    const address = userData.address || {};
    setField('profileCountry', address.country);
    setField('profileCity',    address.city);
    setField('profileZip',     address.zip);
    setField('profileStreet',  address.street);

    // 4. Handle profile image
    const imgEl = document.getElementById('profileImage');
    // If they have a custom profilePicture, use it; otherwise leave the default.
    if (userData.profilePicture) {
      imgEl.src = userData.profilePicture;
    }
  })
  .catch(err => {
    console.error('Error fetching profile:', err);
  });
});
