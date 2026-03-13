const trimTrailingSlash = (value) => value.replace(/\/+$/, '');

const rawApiOrigin = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const rawStorageOrigin = import.meta.env.VITE_STORAGE_URL || rawApiOrigin;

export const API_ORIGIN = trimTrailingSlash(rawApiOrigin);
export const STORAGE_ORIGIN = trimTrailingSlash(rawStorageOrigin);
export const API_BASE_URL = `${API_ORIGIN}/api`;
export const STORAGE_BASE_URL = `${STORAGE_ORIGIN}/storage`;
