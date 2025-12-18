import { adminGetAllUsers, adminGetUserQueries, logout } from './service.js';

// This file is optional - admin.html currently inlines logic.
// Keeping a small module in case you want to expand admin features later.

export async function renderUsers(container) {
  const tbody = container;
  try {
    const users = await adminGetAllUsers();
    tbody.innerHTML = '';
    if (!Array.isArray(users) || users.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="small-muted">No users found</td></tr>';
      return;
    }

    users.forEach(u => {
      const id = u.id || u.userId || u.user_id || u.username;
      const username = u.username || u.userName || u.user || '';
      const email = u.email || '';
      const pwdCount = (u.passwordCount !== undefined) ? u.passwordCount : '-';
      const queryCount = (u.queryCount !== undefined) ? u.queryCount : '-';

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${username}</td>
        <td>${email}</td>
        <td>${pwdCount}</td>
        <td>${queryCount}</td>
        <td><button class="action-btn btn-view" data-user-id="${id}">View Queries</button></td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="5" class="small-muted">Error loading users: ${err.message}</td></tr>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logoutBtn');

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to logout?')) {
        logout();
      }
    });
  }
});

