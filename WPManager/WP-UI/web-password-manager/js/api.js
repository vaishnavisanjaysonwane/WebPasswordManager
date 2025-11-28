// js/api.js
export const API_BASE = "http://localhost:8080/api/passwords";
export const AUTH_BASE = "http://localhost:8080/auth";
export const GET_ALL = `${API_BASE}`;
export const ADD = `${API_BASE}`;
export const UPDATE = id => `${API_BASE}/${id}`;
export const DELETE = id => `${API_BASE}/${id}`;
export const REGISTER = `${AUTH_BASE}/register`;
export const LOGIN = `${AUTH_BASE}/login`;
export const LOGOUT = `${AUTH_BASE}/logout`;
