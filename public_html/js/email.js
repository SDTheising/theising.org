document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const status = params.get('status');
  const statusEl = document.getElementById('status-message');

  if (status === 'success') {
    statusEl.textContent = 'Message sent successfully!';
    statusEl.style.color = 'green';
  } else if (status === 'error') {
    statusEl.textContent = 'There was an error sending your message.';
    statusEl.style.color = 'red';
  }
});