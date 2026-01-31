// src/js/components/SearchBar.js

/**
 * Create search bar HTML
 * @returns {string} HTML string
 */
export function createSearchBar() {
  return `
    <div class="relative w-full md:w-96">
      <!-- Search Input -->
      <div class="relative">
        <input 
          type="text" 
          id="searchInput"
          placeholder="Buscar anime..."
          autocomplete="off"
        />
        
        <!-- Search Icon -->
        <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>

        <!-- Clear Button -->
        <button 
          id="clearSearch"
          class="hidden absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          aria-label="Limpiar búsqueda"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <!-- Loading Spinner -->
        <div id="searchLoading" class="hidden absolute right-3 top-1/2 -translate-y-1/2">
          <div class="w-5 h-5 border-2 border-gray-400 border-t-sakura rounded-full animate-spin"></div>
        </div>
      </div>

      <!-- Results Count -->
      <p id="searchResultsCount" class="hidden text-sm text-gray-400 mt-2"></p>
    </div>
  `;
}

/**
 * Show search loading spinner
 */
export function showSearchLoading() {
  const loading = document.getElementById('searchLoading');
  const clearBtn = document.getElementById('clearSearch');
  
  if (loading) loading.classList.remove('hidden');
  if (clearBtn) clearBtn.classList.add('hidden');
}

/**
 * Hide search loading spinner
 */
export function hideSearchLoading() {
  const loading = document.getElementById('searchLoading');
  const clearBtn = document.getElementById('clearSearch');
  const input = document.getElementById('searchInput');
  
  if (loading) loading.classList.add('hidden');
  if (clearBtn && input?.value) clearBtn.classList.remove('hidden');
}

/**
 * Show results count
 * @param {number} count - Number of results
 * @param {string} query - Search query
 */
export function showResultsCount(count, query, hasMore = false) {
  const counter = document.getElementById('searchResultsCount');
  if (counter) {
    counter.classList.remove('hidden');
    
    if (hasMore) {
      counter.textContent = `Mostrando ${count} de muchos resultados para "${query}"`;
    } else {
      counter.textContent = `${count} resultado${count !== 1 ? 's' : ''} encontrado${count !== 1 ? 's' : ''} para "${query}"`;
    }
  }
}

/**
 * Hide results count
 */
export function hideResultsCount() {
  const counter = document.getElementById('searchResultsCount');
  if (counter) counter.classList.add('hidden');
}