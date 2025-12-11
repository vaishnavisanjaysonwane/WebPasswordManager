// js/service.js
import { GET_ALL, ADD, UPDATE, DELETE, REGISTER, LOGIN, LOGOUT, FORGOT_PASSWORD, GET_PROFILE, UPDATE_PROFILE, CHANGE_PASSWORD, DELETE_PROFILE, SUPPORT_CREATE, SUPPORT_GET_ALL, SUPPORT_UPDATE, SUPPORT_DELETE, ADMIN_GET_USERS, ADMIN_USER_STATS, ADMIN_USER_QUERIES, ADMIN_CREATE_USER, ADMIN_UPDATE_QUERY_STATUS } from './api.js';

// Get all passwords for a user
export async function getAllPasswords(userId) {
  if (!userId) throw new Error('Missing userId');
  const res = await fetch(GET_ALL(userId));
  if (!res.ok) throw new Error('Failed to fetch passwords');
  return await res.json();
}

// Add password for a user
export async function addPassword(userId, data) {
  if (!userId) throw new Error('Missing userId');
  const res = await fetch(ADD(userId), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to add password');
  return await res.json();
}

export async function updatePassword(id, data) {
  const res = await fetch(UPDATE(id), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update password');
  return await res.json();
}

export async function deletePassword(id) {
  const res = await fetch(DELETE(id), {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete password');
  return true;
}

export async function registerUser(data) {
  const res = await fetch(REGISTER, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to register user');
  
  // Try to parse as JSON, if it fails, return empty object
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await res.json();
  } else {
    // Backend returned plain text, return a default success object
    return { success: true, message: 'Registration successful' };
  }
}

export async function loginUser(credentials) {
  const res = await fetch(LOGIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  if (!res.ok) throw new Error('Invalid username or password');
  
  // Try to parse as JSON, if it fails, return empty object
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await res.json();
  } else {
    // Backend returned plain text, return a default success object
    return { success: true, message: 'Login successful' };
  }
}

export async function logoutUser() {
  const res = await fetch(LOGOUT, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) throw new Error('Failed to logout');
  
  // Try to parse as JSON, if it fails, just return true
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await res.json();
  } else {
    return true;
  }
}

// Profile functions
export async function getProfile(userId) {
  const res = await fetch(GET_PROFILE(userId));
  if (!res.ok) throw new Error('Failed to fetch profile');
  return await res.json();
}

export async function updateProfile(userId, data) {
  const res = await fetch(UPDATE_PROFILE(userId), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return await res.json();
}

export async function changePassword(userId, oldPassword, newPassword) {
  const params = new URLSearchParams();
  params.append('oldPassword', oldPassword);
  params.append('newPassword', newPassword);
  
  const res = await fetch(CHANGE_PASSWORD(userId) + '?' + params.toString(), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) throw new Error('Failed to change password');
  
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await res.json();
  } else {
    return { success: true, message: 'Password updated successfully' };
  }
}

export async function deleteProfile(userId) {
  const res = await fetch(DELETE_PROFILE(userId), {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete profile');
  
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await res.json();
  } else {
    return true;
  }
}

// Support query functions
export async function createSupportQuery(data) {
  const res = await fetch(SUPPORT_CREATE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create support query');
  return await res.json();
}

export async function getSupportQueries(userId) {
  if (!userId) throw new Error('Missing userId');
  const res = await fetch(SUPPORT_GET_ALL(userId));
  if (!res.ok) throw new Error('Failed to fetch support queries');
  return await res.json();
}

export async function updateSupportQuery(queryId, data) {
  const res = await fetch(SUPPORT_UPDATE(queryId), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update support query');
  return await res.json();
}

export async function deleteSupportQuery(queryId) {
  const res = await fetch(SUPPORT_DELETE(queryId), {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete support query');
  return true;
}

// Admin functions (frontend expects backend admin routes and proper auth)
export async function adminGetAllUsers() {
  const res = await fetch(ADMIN_GET_USERS, {
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) throw new Error('Failed to fetch users (admin)');
  return await res.json();
}

export async function adminGetUserStats(userId) {
  if (!userId) throw new Error('Missing userId');
  const res = await fetch(ADMIN_USER_STATS(userId));
  if (!res.ok) throw new Error('Failed to fetch user stats (admin)');
  return await res.json();
}

export async function adminGetUserQueries(userId) {
  if (!userId) throw new Error('Missing userId');
  // reuse support endpoint for queries
  const res = await fetch(ADMIN_USER_QUERIES(userId));
  if (!res.ok) throw new Error('Failed to fetch user queries (admin)');
  return await res.json();
}

export async function adminCreateUser(data) {
  const token = localStorage.getItem('authToken');
  const res = await fetch(ADMIN_CREATE_USER, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || 'Failed to create user (admin)');
  }
  return await res.json();
}

export async function adminUpdateQueryStatus(queryId, status) {
  if (!queryId) throw new Error('Missing queryId');
  const token = localStorage.getItem('authToken');
  const res = await fetch(ADMIN_UPDATE_QUERY_STATUS(queryId), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
    body: JSON.stringify({ status })
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || 'Failed to update query status (admin)');
  }
  return await res.json();
}
