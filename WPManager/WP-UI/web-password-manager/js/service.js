// js/service.js
import { GET_ALL, ADD, UPDATE, DELETE, REGISTER, LOGIN, LOGOUT, GET_PROFILE, UPDATE_PROFILE, CHANGE_PASSWORD, DELETE_PROFILE } from './api.js';

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
