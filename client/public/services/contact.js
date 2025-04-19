import { renderCart, removeFromCart } from './cart.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const token = localStorage.getItem('token');

    // 1. Redirect to login if not authenticated
    if (!token) {
      alert('You must be logged in to contact us.');
      window.location.href = 'login.html';
      return;
    }

    // 2. Pre-fill name and email using /api/auth/me
  fetch('/api/auth/me', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(user => {
      document.getElementById('name').value = user.name;
      document.getElementById('email').value = user.email;
      document.getElementById('name').readOnly = true;
      document.getElementById('email').readOnly = true;
    })
    .catch(err => {
      console.error('Failed to fetch user data:', err);
    });

  // 3. Handle form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
          },
        body: JSON.stringify({ name, email, message })
      });

      const data = await res.json();

      if (res.ok) {
        alert('Thank you for contacting us!');
        form.reset();
      } else {
        alert(data.message || 'Failed to submit message.');
      }
    } catch (err) {
      console.error('Error submitting contact form:', err);
      alert('Something went wrong. Please try again later.');
    }
  });
  renderCart(); // Call renderCart to update the cart in the offcanvas
});
