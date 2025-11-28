// profile.js
const deleteAccountBtn = document.getElementById('deleteAccountBtn');
const deleteAccountModal = document.getElementById('deleteAccountModal');
const closeDeleteAccountModal = document.getElementById('closeDeleteAccountModal');
const confirmDeleteAccountBtn = document.getElementById('confirmDeleteAccountBtn');
const cancelDeleteAccountBtn = document.getElementById('cancelDeleteAccountBtn');
const toast = document.getElementById('toast');

function showModal(modal) { modal.classList.add('show'); }
function hideModal(modal) { modal.classList.remove('show'); }
function showToast(msg, type = 'success') {
  toast.textContent = msg;
  toast.className = `toast show ${type}`;
  setTimeout(() => { toast.className = 'toast'; }, 2500);
}

deleteAccountBtn.addEventListener('click', () => showModal(deleteAccountModal));
closeDeleteAccountModal.addEventListener('click', () => hideModal(deleteAccountModal));
cancelDeleteAccountBtn.addEventListener('click', () => hideModal(deleteAccountModal));
confirmDeleteAccountBtn.addEventListener('click', () => {
  // Simulate delete
  showToast('Account deleted!');
  hideModal(deleteAccountModal);
  setTimeout(() => { window.location.href = 'index.html'; }, 1200);
});
