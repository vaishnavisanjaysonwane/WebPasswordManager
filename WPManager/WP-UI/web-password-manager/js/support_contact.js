// support_contact.js
const supportForm = document.getElementById('supportForm');
const toast = document.getElementById('toast');

function showToast(msg, type = 'success') {
  toast.textContent = msg;
  toast.className = `toast show ${type}`;
  setTimeout(() => { toast.className = 'toast'; }, 2500);
}

supportForm.addEventListener('submit', function(e) {
  e.preventDefault();
  // Simulate sending support message
  showToast('Message sent! We will contact you soon.');
  supportForm.reset();
});
