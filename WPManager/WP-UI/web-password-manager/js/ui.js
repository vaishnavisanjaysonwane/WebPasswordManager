// js/ui.js
import { getAllPasswords, addPassword, updatePassword, deletePassword } from './service.js';

let passwords = [];
let searchQuery = '';
let sortType = 'az';
let editingId = null;
let deletingId = null;

// DOM Elements
const passwordTable = document.getElementById('passwordTable');
const searchInput = document.getElementById('searchInput');
const sortDropdown = document.getElementById('sortDropdown');
const addBtn = document.getElementById('addBtn');
const addModal = document.getElementById('addModal');
const editModal = document.getElementById('editModal');
const deleteModal = document.getElementById('deleteModal');
const closeAddModal = document.getElementById('closeAddModal');
const closeEditModal = document.getElementById('closeEditModal');
const closeDeleteModal = document.getElementById('closeDeleteModal');
const addForm = document.getElementById('addForm');
const editForm = document.getElementById('editForm');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const toast = document.getElementById('toast');

function showModal(modal) { modal.classList.add('show'); }
function hideModal(modal) { modal.classList.remove('show'); }
function showToast(msg, type = 'success') {
  toast.textContent = msg;
  toast.className = `toast show ${type}`;
  setTimeout(() => { toast.className = 'toast'; }, 2500);
}

function maskPassword(pw) {
  return '•'.repeat(Math.max(8, pw.length));
}

function renderTable() {
  let filtered = passwords.filter(p => p.website.toLowerCase().includes(searchQuery.toLowerCase()));
  if (sortType === 'az') filtered.sort((a, b) => a.website.localeCompare(b.website));
  else if (sortType === 'za') filtered.sort((a, b) => b.website.localeCompare(a.website));
  else if (sortType === 'new') filtered.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
  else if (sortType === 'old') filtered.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));

  let html = `<table class="password-table"><thead><tr><th>Website Name</th><th>Username/Email</th><th>Password</th><th>Date Added</th><th>Actions</th></tr></thead><tbody>`;
  for (const p of filtered) {
    html += `<tr>
      <td>${p.website}</td>
      <td>${p.username}</td>
      <td><span class="pw-mask" data-id="${p.id}">${maskPassword(p.password)}</span> <button class="show-hide" data-id="${p.id}"><i class="fa-solid fa-eye"></i></button></td>
      <td>${new Date(p.dateAdded).toLocaleDateString()}</td>
      <td>
        <button class="action-btn edit" data-id="${p.id}"><i class="fa-solid fa-pen"></i></button>
        <button class="action-btn delete" data-id="${p.id}"><i class="fa-solid fa-trash"></i></button>
      </td>
    </tr>`;
  }
  html += '</tbody></table>';
  passwordTable.innerHTML = html;
}

async function loadPasswords() {
  try {
    passwords = await getAllPasswords();
    renderTable();
  } catch (e) {
    showToast(e.message, 'error');
  }
}

searchInput.addEventListener('input', e => {
  searchQuery = e.target.value;
  renderTable();
});
sortDropdown.addEventListener('change', e => {
  sortType = e.target.value;
  renderTable();
});
addBtn.addEventListener('click', () => showModal(addModal));
closeAddModal.addEventListener('click', () => hideModal(addModal));
closeEditModal.addEventListener('click', () => hideModal(editModal));
closeDeleteModal.addEventListener('click', () => hideModal(deleteModal));
cancelDeleteBtn.addEventListener('click', () => hideModal(deleteModal));

addForm.addEventListener('submit', async e => {
  e.preventDefault();
  const data = {
    website: addForm.website.value,
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
});

passwordTable.addEventListener('click', e => {
  if (e.target.closest('.edit')) {
    const id = e.target.closest('.edit').dataset.id;
    const p = passwords.find(x => x.id == id);
    if (p) {
      editingId = p.id;
      editForm.editWebsite.value = p.website;
      editForm.editUsername.value = p.username;
      editForm.editPassword.value = p.password;
      showModal(editModal);
    }
  } else if (e.target.closest('.delete')) {
    deletingId = e.target.closest('.delete').dataset.id;
    showModal(deleteModal);
  } else if (e.target.closest('.show-hide')) {
    const id = e.target.closest('.show-hide').dataset.id;
    const p = passwords.find(x => x.id == id);
    const mask = document.querySelector(`.pw-mask[data-id='${id}']`);
    if (mask && p) {
      if (mask.textContent.startsWith('•')) {
        mask.textContent = p.password;
      } else {
        mask.textContent = maskPassword(p.password);
      }
    }
  }
});

editForm.addEventListener('submit', async e => {
  e.preventDefault();
  const data = {
    website: editForm.editWebsite.value,
    username: editForm.editUsername.value,
    password: editForm.editPassword.value,
    dateAdded: new Date().toISOString()
  };
  try {
    await updatePassword(editingId, data);
    showToast('Password updated!');
    hideModal(editModal);
    loadPasswords();
  } catch (err) {
    showToast(err.message, 'error');
  }
});

confirmDeleteBtn.addEventListener('click', async () => {
  try {
    await deletePassword(deletingId);
    showToast('Password deleted!');
    hideModal(deleteModal);
    loadPasswords();
  } catch (err) {
    showToast(err.message, 'error');
  }
});

window.addEventListener('DOMContentLoaded', loadPasswords);
