document.addEventListener('DOMContentLoaded', () => {
  const profileLink    = document.getElementById('navProfile');
  const authActionBtn  = document.getElementById('navAuthAction');
  const token          = localStorage.getItem('token');

  if (token) {
    profileLink.href = 'profile.html';
    profileLink.innerText = 'Profile';

    authActionBtn.innerText = 'Logout';
    authActionBtn.addEventListener('click', () => {
      localStorage.removeItem('token');
      window.location.href = 'login.html';
    });
  } else {
    profileLink.href = 'login.html';
    profileLink.innerText = 'Profile';

    authActionBtn.innerText = 'Login';
    authActionBtn.href = 'login.html';
  }
  // services/nav.js
});
// public/services/nav.js
document.addEventListener('DOMContentLoaded', () => {
  // —— Search form (Option A uses native GET, so only intercept if no action)
  const form = document.querySelector('form[role="search"]');
  if (form && !form.hasAttribute('action')) {
    const input = form.querySelector('input[type="search"]');
    form.addEventListener('submit', e => {
      e.preventDefault();
      const q = input.value.trim();
      if (!q) return;
      window.location.href = `/search.html?q=${encodeURIComponent(q)}`;
    });
  }

  // —— Auth/Profile links (only if they exist)
  const navProfile    = document.getElementById('navProfile');
  const navAuthAction = document.getElementById('navAuthAction');
  const token         = localStorage.getItem('token');

  if (token) {
    // logged in
    if (navProfile) {
      navProfile.href = '/editProfile.html';
      navProfile.textContent = 'Profile';
    }
    if (navAuthAction) {
      navAuthAction.textContent = 'Logout';
      navAuthAction.href = '/login.html';
      navAuthAction.addEventListener('click', e => {
        e.preventDefault();
        localStorage.removeItem('token');
        window.location.href = '/login.html';
      });
    }
  } else {
    // not logged in
    if (navProfile) {
      navProfile.href = '/login.html';
      navProfile.textContent = 'Profile';
    }
    if (navAuthAction) {
      navAuthAction.href = '/login.html';
      navAuthAction.textContent = 'Login';
    }
  }
});
