document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '../../login.html';
    return;
  }
  try {
    const res = await fetch('/api/admin/dashboard', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.status === 403 || res.status === 401) {
      window.location.href = '../../login.html';
      return;
    }
    const data = await res.json();
    document.body.classList.remove('hidden');
    
  } catch (err) {
    console.error(err);
    window.location.href = '../../login.html';
  }
});
