export interface StoredData<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export const ONE_DAY_MS = 24 * 60 * 60 * 1000; // 1 day in milliseconds

/**
 * Save an item to localStorage with a TTL (default: 1 day).
 */
export function setStorageWithTTL<T>(key: string, data: T, ttlMs: number = ONE_DAY_MS): void {
  try {
    const now = Date.now();
    const item: StoredData<T> = {
      data,
      timestamp: now,
      expiresAt: now + ttlMs,
    };
    localStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.warn(`Failed to save ${key} to localStorage:`, error);
  }
}

/**
 * Get an item from localStorage if it has not expired yet.
 * If expired or invalid, removes it and returns null.
 */
export function getStorageWithTTL<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const item = JSON.parse(raw) as StoredData<T>;
    const now = Date.now();

    if (!item || typeof item.expiresAt !== 'number' || now > item.expiresAt) {
      localStorage.removeItem(key);
      return null;
    }

    return item.data;
  } catch (error) {
    console.warn(`Failed to read ${key} from localStorage:`, error);
    localStorage.removeItem(key);
    return null;
  }
}

/**
 * Remove an item from localStorage.
 */
export function removeStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn(`Failed to remove ${key} from localStorage:`, error);
  }
}
