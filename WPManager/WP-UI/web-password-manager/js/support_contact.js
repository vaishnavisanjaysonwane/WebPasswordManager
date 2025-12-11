import { createSupportQuery, getSupportQueries, updateSupportQuery, deleteSupportQuery } from './service.js';

// UI State
let queries = [];
let currentFilter = 'all';
let editingQueryId = null;
let deletingQueryId = null;

// DOM Elements
const supportForm = document.getElementById('supportForm');
const queriesTable = document.getElementById('queriesTable');
const statusFilterBtns = document.querySelectorAll('.filter-btn');
const editQueryModal = document.getElementById('editQueryModal');
const closeEditModal = document.getElementById('closeEditModal');
const editQueryForm = document.getElementById('editQueryForm');
const deleteModal = document.getElementById('deleteModal');
const closeDeleteModal = document.getElementById('closeDeleteModal');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const toast = document.getElementById('toast');

// Helper functions
function showToast(msg, type = 'success') {
  toast.textContent = msg;
  toast.className = `toast show ${type}`;
  setTimeout(() => { toast.className = 'toast'; }, 2500);
}

function showModal(modal) { modal.classList.add('show'); }
function hideModal(modal) { modal.classList.remove('show'); }

function getStatusBadgeClass(status) {
  const statusMap = {
    'pending': 'badge-pending',
    'in-progress': 'badge-in-progress',
    'resolved': 'badge-resolved'
  };
  return statusMap[status] || 'badge-pending';
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString();
}

// Authentication check
function checkAuthentication() {
  const authToken = localStorage.getItem('authToken');
  const userId = localStorage.getItem('userId');
  if (!authToken || !userId) {
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

// Render queries table
function renderQueries() {
  let filtered = queries;
  if (currentFilter !== 'all') {
    filtered = queries.filter(q => q.status === currentFilter);
  }

  if (!filtered.length) {
    queriesTable.innerHTML = '<div class="empty-state"><p>No queries found.</p></div>';
    return;
  }

  let html = `<table class="queries-list">
    <thead>
      <tr>
        <th>Subject</th>
        <th>Status</th>
        <th>Created</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>`;

  for (const q of filtered) {
    const statusBadge = `<span class="status-badge ${getStatusBadgeClass(q.status)}">${q.status}</span>`;
    html += `<tr>
      <td>${q.subject}</td>
      <td>${statusBadge}</td>
      <td>${formatDate(q.createdAt || new Date())}</td>
      <td>
        <button class="action-btn edit-query" data-id="${q.id}"${q.status.toLowerCase() === 'resolved' ? 'disabled' : ''}><i class="fa-solid fa-pen"></i></button>
        <button class="action-btn delete-query" data-id="${q.id}"><i class="fa-solid fa-trash"></i></button>
      </td>
    </tr>`;
  }
  html += '</tbody></table>';
  queriesTable.innerHTML = html;

  // Attach event listeners to action buttons
  queriesTable.querySelectorAll('.edit-query').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      const query = queries.find(q => q.id == id);
      if (query) openEditModal(query);
    });
  });
  queriesTable.querySelectorAll('.delete-query').forEach(btn => {
    btn.addEventListener('click', (e) => {
      deletingQueryId = e.currentTarget.dataset.id;
      showModal(deleteModal);
    });
  });
}

// Load queries from backend
async function loadQueries() {
  try {
    const userId = localStorage.getItem('userId');
    if (!userId) throw new Error('Not authenticated');
    queries = await getSupportQueries(userId);
    renderQueries();
  } catch (err) {
    showToast(err.message, 'error');
    console.error('Error loading queries:', err);
  }
}

// Open edit modal
function openEditModal(query) {
  editingQueryId = query.id;
  document.getElementById('editQueryId').value = query.id;
  document.getElementById('editSubject').value = query.subject;
  document.getElementById('editMessage').value = query.message;
  showModal(editQueryModal);
}

// Form submission (new query)
supportForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const subject = document.getElementById('supportSubject').value;
  const message = document.getElementById('supportMessage').value;
  const username = localStorage.getItem('username') || localStorage.getItem('userId');

  if (!subject || !message) {
    showToast('Please fill in all fields', 'error');
    return;
  }

  try {
    // Send username in payload (backend should derive owner from the authenticated principal)
    const newQuery = await createSupportQuery({
      subject,
      message,
      username,
      status: 'pending',
      createdAt: new Date().toISOString()
    });
    showToast('Query submitted successfully!');
    supportForm.reset();
    await loadQueries();
  } catch (err) {
    showToast(err.message, 'error');
    console.error('Error creating query:', err);
  }
});

// Edit modal handlers
if (closeEditModal) {
  closeEditModal.addEventListener('click', () => hideModal(editQueryModal));
}

editQueryForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const subject = document.getElementById('editSubject').value;
  const message = document.getElementById('editMessage').value;

  if (!subject || !message ) {
    showToast('Please fill in all fields', 'error');
    return;
  }

  try {
    // Users cannot change status; send only editable fields. Backend should ignore any client-supplied status and enforce ownership.
    await updateSupportQuery(editingQueryId, {
      subject,
      message
    });
    showToast('Query updated successfully!');
    hideModal(editQueryModal);
    await loadQueries();
  } catch (err) {
    showToast(err.message, 'error');
    console.error('Error updating query:', err);
  }
});

// Delete modal handlers
if (closeDeleteModal) {
  closeDeleteModal.addEventListener('click', () => hideModal(deleteModal));
}

if (cancelDeleteBtn) {
  cancelDeleteBtn.addEventListener('click', () => hideModal(deleteModal));
}

confirmDeleteBtn.addEventListener('click', async () => {
  if (!deletingQueryId) return;
  try {
    await deleteSupportQuery(deletingQueryId);
    showToast('Query deleted successfully!');
    hideModal(deleteModal);
    await loadQueries();
  } catch (err) {
    showToast(err.message, 'error');
    console.error('Error deleting query:', err);
  }
});

// Status filter buttons
statusFilterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    statusFilterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.status;
    renderQueries();
  });
});

// Page load
window.addEventListener('DOMContentLoaded', () => {
  if (checkAuthentication()) {
    loadQueries();
  }
});

// Prevent back button after logout
window.addEventListener('pageshow', (e) => {
  if (e.persisted) {
    const authToken = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    if (!authToken || !userId) {
      window.location.href = 'index.html';
    }
  }
});
