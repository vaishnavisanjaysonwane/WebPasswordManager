// js/api.js
export const API_BASE = "http://localhost:8080/api/passwords";
export const AUTH_BASE = "http://localhost:8080/auth";
export const PROFILE_BASE = "http://localhost:8080/api/profile";
export const GET_ALL = `${API_BASE}`;
export const ADD = `${API_BASE}`;
export const UPDATE = id => `${API_BASE}/${id}`;
export const DELETE = id => `${API_BASE}/${id}`;
export const REGISTER = `${AUTH_BASE}/register`;
export const LOGIN = `${AUTH_BASE}/login`;
export const LOGOUT = `${AUTH_BASE}/logout`;
export const GET_PROFILE = id => `${PROFILE_BASE}/${id}`;
export const UPDATE_PROFILE = id => `${PROFILE_BASE}/update/${id}`;
export const CHANGE_PASSWORD = id => `${PROFILE_BASE}/change-password/${id}`;
export const DELETE_PROFILE = id => `${PROFILE_BASE}/delete/${id}`;
