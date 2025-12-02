// js/service.js
import { GET_ALL, ADD, UPDATE, DELETE, REGISTER, LOGIN, LOGOUT } from './api.js';

export async function getAllPasswords(userId) {
  if (!userId) throw new Error('Missing userId');
  const res = await fetch(GET_ALL(userId));
  if (!res.ok) throw new Error('Failed to fetch passwords');
  return await res.json();
}

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
