document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('status-message');

  form.addEventListener('submit', async (e) => {
    // 1. Stop the browser from reloading the page!
    e.preventDefault(); 

    // 2. Let the user know it's working
    statusEl.textContent = 'Sending...';
    statusEl.style.color = 'black';

    try {
      // 3. Gather all the form data (including the invisible Turnstile token)
      const formData = new FormData(form);

      // 4. Send the data to your PHP script in the background
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        redirect: 'follow' // This tells JS to follow your PHP header() redirects
      });

      // 5. Look at the final URL the PHP script sent us to
      const finalUrl = new URL(response.url);
      const status = finalUrl.searchParams.get('status');

      // 6. Update the message based on the status, WITHOUT clearing the form
      if (status === 'success') {
        statusEl.textContent = 'Message sent successfully!';
        statusEl.style.color = 'green';
        form.reset(); // ONLY clear the form if it was successful!
        turnstile.reset(); // Reset the widget for the next use
      } 
      else if (status === 'invalid') {
        statusEl.textContent = 'Security check failed. Please try again.';
        statusEl.style.color = 'red';
        turnstile.reset(); // Reset the Turnstile widget so they can try again
      } 
      else if (status === 'limit') {
        statusEl.textContent = 'Server limit reached. Please try emailing directly.';
        statusEl.style.color = 'red';
      } 
      else {
        statusEl.textContent = 'There was an error sending your message.';
        statusEl.style.color = 'red';
      }
    } catch (error) {
      statusEl.textContent = 'Network error. Please check your connection.';
      statusEl.style.color = 'red';
    }
  });
});