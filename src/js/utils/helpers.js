// src/js/utils/helpers.js

/**
 * Debounce function to limit execution rate
 * @param {Function} func - Function to debounce
 * @param {number} wait - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait = 500) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Show loading state
 */
export function showLoading() {
  const loading = document.getElementById('loading');
  if (loading) loading.classList.remove('hidden');
}

/**
 * Hide loading state
 */
export function hideLoading() {
  const loading = document.getElementById('loading');
  if (loading) loading.classList.add('hidden');
}

/**
 * Show error message
 * @param {string} message - Error message
 */
export function showError(message = 'An error occurred') {
  const errorDiv = document.getElementById('error');
  const errorMessage = document.getElementById('errorMessage');
  
  if (errorDiv && errorMessage) {
    errorMessage.textContent = message;
    errorDiv.classList.remove('hidden');
  }
}

/**
 * Hide error message
 */
export function hideError() {
  const errorDiv = document.getElementById('error');
  if (errorDiv) errorDiv.classList.add('hidden');
}

/**
 * Format date from AniList format
 * @param {Object} date - Date object {year, month, day}
 * @returns {string} Formatted date
 */
export function formatDate(date) {
  if (!date || !date.year) return 'Unknown';
  const { year, month, day } = date;
  if (month && day) {
    return `${day}/${month}/${year}`;
  }
  if (month) {
    return `${month}/${year}`;
  }
  return `${year}`;
}

/**
 * Translate status to Spanish
 * @param {string} status - Anime status
 * @returns {string} Translated status
 */
export function translateStatus(status) {
  const translations = {
    'FINISHED': 'Finalizado',
    'RELEASING': 'En emisión',
    'NOT_YET_RELEASED': 'Próximamente',
    'CANCELLED': 'Cancelado',
    'HIATUS': 'En pausa',
  };
  return translations[status] || status;
}

/**
 * Translate relation type to Spanish
 * @param {string} type - Relation type
 * @returns {string} Translated type
 */
export function translateRelationType(type) {
  const translations = {
    'SEQUEL': 'Secuela',
    'PREQUEL': 'Precuela',
    'ALTERNATIVE': 'Alternativa',
    'SIDE_STORY': 'Historia paralela',
    'SPIN_OFF': 'Spin-off',
    'ADAPTATION': 'Adaptación',
    'SOURCE': 'Fuente',
    'OTHER': 'Otro',
  };
  return translations[type] || type;
}

/**
 * Sanitize HTML to prevent XSS
 * @param {string} html - HTML string
 * @returns {string} Sanitized HTML
 */
export function sanitizeHTML(html) {
  if (!html) return '';
  
  // Remove dangerous tags
  const temp = document.createElement('div');
  temp.textContent = html;
  let sanitized = temp.innerHTML;
  
  // Allow only safe tags
  sanitized = sanitized
    .replace(/&lt;br&gt;/gi, '<br>')
    .replace(/&lt;i&gt;/gi, '<i>')
    .replace(/&lt;\/i&gt;/gi, '</i>')
    .replace(/&lt;b&gt;/gi, '<b>')
    .replace(/&lt;\/b&gt;/gi, '</b>');
  
  return sanitized;
}

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated text
 */
export function truncate(text, length = 100) {
  if (!text || text.length <= length) return text;
  return text.substring(0, length) + '...';
}