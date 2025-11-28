import { getAllPasswords, addPassword, updatePassword, deletePassword, logoutUser } from './service.js';

// Authentication check - redirect to login if not authenticated
function checkAuthentication() {
  const authToken = localStorage.getItem('authToken');
  console.log('Auth check - Token found:', !!authToken, 'Token:', authToken);
  
  if (!authToken) {
    // No token, redirect to login
    console.log('No authentication token, redirecting to login...');
    window.location.href = 'index.html';
    return false;
  }
  console.log('Authentication successful, user is logged in');
  return true;
}

// Prevent back button from accessing dashboard after logout
window.addEventListener('pageshow', (e) => {
  if (e.persisted) {
    // Page was restored from bfcache (browser back button)
    const authToken = localStorage.getItem('authToken');
    console.log('Page restored from cache, checking auth token:', !!authToken);
    if (!authToken) {
      console.log('No token after back button, redirecting to login');
      window.location.href = 'index.html';
    }
  }
});

// UI State
let passwords = [];
let searchQuery = '';
let sortType = 'az';
let deleteId = null;

// DOM Elements
const passwordList = document.getElementById('passwordList');
const searchInput = document.getElementById('searchInput');
const sortDropdown = document.getElementById('sortDropdown');
const addPasswordBtn = document.getElementById('addPasswordBtn');
const addModal = document.getElementById('addModal');
const closeAddModal = document.getElementById('closeAddModal');
const addForm = document.getElementById('addForm');
const toggleAddPassword = document.getElementById('toggleAddPassword');
const editModal = document.getElementById('editModal');
const closeEditModal = document.getElementById('closeEditModal');
const editPasswordForm = document.getElementById('editPasswordForm');
const toggleEditPassword = document.getElementById('toggleEditPassword');
const deleteModal = document.getElementById('deleteModal');
const closeDeleteModal = document.getElementById('closeDeleteModal');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const toast = document.getElementById('toast');

// Modal helpers
function showModal(modal) { modal.classList.add('show'); }
function hideModal(modal) { modal.classList.remove('show'); }

// Toast
function showToast(msg, type = 'success') {
  toast.textContent = msg;
  toast.className = `toast show ${type}`;
  setTimeout(() => { toast.className = 'toast'; }, 2500);
}

// Loading handled by api.js

// Render password list
function renderPasswords() {
  let filtered = passwords.filter(p => p.website.toLowerCase().includes(searchQuery.toLowerCase()));
  if (sortType === 'az') filtered.sort((a, b) => a.website.localeCompare(b.website));
  else if (sortType === 'za') filtered.sort((a, b) => b.website.localeCompare(a.website));
  else if (sortType === 'new') filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  else if (sortType === 'old') filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  if (!filtered.length) {
    passwordList.innerHTML = '<div class="empty">No passwords found.</div>';
    return;
  }
  let html = `<table class="password-table"><thead><tr><th>Website</th><th>Username/Email</th><th>Password</th><th>Category</th><th>Actions</th></tr></thead><tbody>`;
  for (const p of filtered) {
    html += `<tr>
      <td>${p.website}</td>
      <td>${p.username}</td>
      <td><span class="password-dot" data-id="${p.id}">••••••••</span> <button class="show-hide" data-id="${p.id}"><i class="fa-solid fa-eye"></i></button></td>
      <td>${p.category || ''}</td>
      <td>
        <button class="action-btn edit" data-id="${p.id}"><i class="fa-solid fa-pen"></i></button>
        <button class="action-btn delete" data-id="${p.id}"><i class="fa-solid fa-trash"></i></button>
      </td>
    </tr>`;
  }
  html += '</tbody></table>';
  passwordList.innerHTML = html;
}

// Fetch and render
async function loadPasswords() {
  try {
    passwords = await getAllPasswords();
    renderPasswords();
  } catch (e) {
    showToast(e.message, 'error');
  }
}

// Search
searchInput.addEventListener('input', e => {
  searchQuery = e.target.value;
  renderPasswords();
});

// Sort
sortDropdown.addEventListener('change', e => {
  sortType = e.target.value;
  renderPasswords();
});

// Add modal
addPasswordBtn.addEventListener('click', () => showModal(addModal));
closeAddModal.addEventListener('click', () => hideModal(addModal));
addForm.addEventListener('submit', async e => {
  e.preventDefault();
  const data = {
    website: addForm.website.value,
    url: addForm.url.value,
    username: addForm.username.value,
    password: addForm.password.value,
    dateAdded: new Date().toISOString()
  };
  try {
    await addPassword(data);
    showToast('Password added!');
    hideModal(addModal);
    addForm.reset();
    loadPasswords();
  } catch (err) {
    showToast(err.message, 'error');
  }
  const input = addForm.password;
  input.type = input.type === 'password' ? 'text' : 'password';
  toggleAddPassword.innerHTML = `<i class="fa-solid fa-eye${input.type === 'password' ? '' : '-slash'}"></i>`;
});

// Edit modal
passwordList.addEventListener('click', e => {
  if (e.target.closest('.edit')) {
    const id = e.target.closest('.edit').dataset.id;
    const p = passwords.find(x => x.id == id);
    if (p) {
      editPasswordForm.editId.value = p.id;
      editPasswordForm.editWebsite.value = p.website;
      editPasswordForm.editUsername.value = p.username;
      editPasswordForm.editPassword.value = p.password;
      editPasswordForm.editCategory.value = p.category || '';
      showModal(editModal);
    }
  } else if (e.target.closest('.delete')) {
    deleteId = e.target.closest('.delete').dataset.id;
    showModal(deleteModal);
  } else if (e.target.closest('.show-hide')) {
    const id = e.target.closest('.show-hide').dataset.id;
    const p = passwords.find(x => x.id == id);
    const dot = document.querySelector(`.password-dot[data-id='${id}']`);
    if (dot && p) {
      if (dot.textContent === '••••••••') {
        dot.textContent = p.password;
      } else {
        dot.textContent = '••••••••';
      }
    }
  }
});
closeEditModal.addEventListener('click', () => hideModal(editModal));
editPasswordForm.addEventListener('submit', async e => {
  e.preventDefault();
  const id = editPasswordForm.editId.value;
  const data = {
    website: editPasswordForm.editWebsite.value,
    username: editPasswordForm.editUsername.value,
    password: editPasswordForm.editPassword.value,
    category: editPasswordForm.editCategory.value
  };
  try {
    await updatePassword(id, data);
    showToast('Password updated!');
    hideModal(editModal);
    loadPasswords();
  } catch (err) {
    showToast(err.message, 'error');
  }
});
toggleEditPassword.addEventListener('click', () => {
  const input = editPasswordForm.editPassword;
  input.type = input.type === 'password' ? 'text' : 'password';
  toggleEditPassword.innerHTML = `<i class="fa-solid fa-eye${input.type === 'password' ? '' : '-slash'}"></i>`;
});

// Delete modal
closeDeleteModal.addEventListener('click', () => hideModal(deleteModal));
cancelDeleteBtn.addEventListener('click', () => hideModal(deleteModal));
confirmDeleteBtn.addEventListener('click', async () => {
  if (!deleteId) return;
  try {
    await deletePassword(deleteId);
    showToast('Password deleted!');
    hideModal(deleteModal);
    loadPasswords();
  } catch (err) {
    showToast(err.message, 'error');
  }
});

// Logout handler
const logoutLink = document.querySelector('.logout');
if (logoutLink) {
  logoutLink.addEventListener('click', async (e) => {
    e.preventDefault();
    console.log('Logout clicked');
    try {
      const result = await logoutUser();
      console.log('Logout API response:', result);
      showToast('Logging out...', 'success');
      // Clear stored data
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      // Small delay before redirect
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 500);
    } catch (err) {
      console.error('Logout error:', err);
      // Don't show error, just log it and proceed with logout
      showToast('Logging out...', 'success');
      // Clear stored data anyway
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      // Even if logout fails on backend, redirect to login page
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 500);
    }
  });
}

// Initial load
window.addEventListener('DOMContentLoaded', () => {
  if (checkAuthentication()) {
    loadPasswords();
  }
});
