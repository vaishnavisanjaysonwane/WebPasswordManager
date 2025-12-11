// js/api.js

export const API_BASE = "http://localhost:8080/api/passwords";
export const AUTH_BASE = "http://localhost:8080/auth";
export const PROFILE_BASE = "http://localhost:8080/api/profile";
export const SUPPORT_BASE = "http://localhost:8080/api/support";

// Password endpoints (USERNAME-based)
export const GET_ALL = username => `${API_BASE}/${username}/all`;
export const ADD = username => `${API_BASE}/${username}`;

// ID-based actions
export const UPDATE = id => `${API_BASE}/id/${id}`;
export const DELETE = id => `${API_BASE}/id/${id}`;

// Auth
export const REGISTER = `${AUTH_BASE}/register`;
export const LOGIN = `${AUTH_BASE}/login`;
export const LOGOUT = `${AUTH_BASE}/logout`;
export const FORGOT_PASSWORD = `${AUTH_BASE}/forgot-password`;

// Profile (still ID-based)
export const GET_PROFILE = id => `${PROFILE_BASE}/${id}`;
export const UPDATE_PROFILE = id => `${PROFILE_BASE}/update/${id}`;
export const CHANGE_PASSWORD = id => `${PROFILE_BASE}/change-password/${id}`;
export const DELETE_PROFILE = id => `${PROFILE_BASE}/delete/${id}`;

// Support queries
export const SUPPORT_CREATE = `${SUPPORT_BASE}`;
export const SUPPORT_GET_ALL = userId => `${SUPPORT_BASE}/${userId}`;
export const SUPPORT_UPDATE = queryId => `${SUPPORT_BASE}/${queryId}`;
export const SUPPORT_DELETE = queryId => `${SUPPORT_BASE}/${queryId}`;

// Admin endpoints (backend must expose these)
export const ADMIN_BASE = "http://localhost:8080/api/admin";
export const ADMIN_GET_USERS = `${ADMIN_BASE}/users`;
// Stats for a single user (e.g. counts of passwords and support queries)
export const ADMIN_USER_STATS = userId => `${ADMIN_BASE}/users/${userId}/stats`;


// Optionally fetch queries for a user (reuses support base)
export const ADMIN_USER_QUERIES = userId => `${SUPPORT_BASE}/id/${userId}`;
// Admin create user
export const ADMIN_CREATE_USER = `${ADMIN_BASE}/users`;
// Admin update support query status
export const ADMIN_UPDATE_QUERY_STATUS = queryId => `${SUPPORT_BASE}/${queryId}`;
