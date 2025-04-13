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
});
