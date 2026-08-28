import { frontendConfig } from '../config.js';

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${frontendConfig.VITE_API_BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers }
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return response.status === 204 ? null : response.json();
}
