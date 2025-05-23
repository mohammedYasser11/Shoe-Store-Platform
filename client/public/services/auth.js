// Signup handler
document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signup-form');

  if (signupForm && window.location.pathname.includes('sign-up.html')) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const phone = document.getElementById('phone').value;
      const address = {
        country: document.getElementById('country').value.trim(),
        city:    document.getElementById('city').value.trim(),
        zip:     document.getElementById('zip').value.trim(),
        street:  document.getElementById('street').value.trim()
      };

      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, phone, address })
        });



        const data = await res.json();

        if (res.ok) {
          localStorage.setItem('token', data.token);
          window.location.href = 'index.html'; // redirect after sign-up
        } else {
          alert(data.message || 'Registration failed');
        }
      } catch (err) {
        console.error(err);
        alert('Something went wrong.');
      }
    });
  }
});

// Login handler
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');

  if (loginForm && window.location.pathname.includes('login.html')) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
          localStorage.setItem('token', data.token);
          const payload = JSON.parse(atob(data.token.split('.')[1]));
          if(payload.role === 'admin') {
            window.location.href = '../Admin-Pages/dashboard.html'; // redirect to admin dashboard
          } else if(payload.role === 'user') {
            window.location.href = 'profile.html'; // redirect to user dashboard
          }
        } else {
          alert(data.message || 'Login failed');
        }
      } catch (err) {
        console.error(err);
        alert('Something went wrong.');
      }
    });
  }
});