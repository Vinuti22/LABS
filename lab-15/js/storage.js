// LocalStorage helper
export const STORAGE_USERS = 'mini_catalog_users_v1';
export const STORAGE_PRODUCTS = 'mini_catalog_products_v1';

export function save(key, obj) { localStorage.setItem(key, JSON.stringify(obj)); }
export function load(key) {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch(e){ console.warn('LS parse', e); return null; }
}
export function clearKey(key){ localStorage.removeItem(key); }
