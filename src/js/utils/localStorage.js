// src/js/utils/localStorage.js

/**
 * Save data to localStorage
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 * @returns {boolean} Success status
 */
export function saveToStorage(key, value) {
  try {
    const stringified = JSON.stringify(value);
    localStorage.setItem(key, stringified);
    return true;
  } catch (error) {
    console.error('❌ Error saving to storage:', error);
    if (error.name === 'QuotaExceededError') {
      console.error('⚠️ Storage quota exceeded');
    }
    return false;
  }
}

/**
 * Get data from localStorage
 * @param {string} key - Storage key
 * @returns {any|null} Stored value or null
 */
export function getFromStorage(key) {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    return JSON.parse(item);
  } catch (error) {
    console.error('❌ Error reading from storage:', error);
    return null;
  }
}

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 * @returns {boolean} Success status
 */
export function removeFromStorage(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('❌ Error removing from storage:', error);
    return false;
  }
}

/**
 * Clear all localStorage
 * @returns {boolean} Success status
 */
export function clearStorage() {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('❌ Error clearing storage:', error);
    return false;
  }
}