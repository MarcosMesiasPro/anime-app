// src/js/components/TabNavigation.js

/**
 * Create tab navigation HTML
 * @param {string} activeTab - Currently active tab
 * @param {number} favoritesCount - Number of favorites
 * @returns {string} HTML string
 */
export function createTabNavigation(activeTab = 'trending', favoritesCount = 0) {
  return `
    <div class="flex gap-2 border-b border-white/10 pb-2 mb-6">
      <button 
        class="tab-btn ${activeTab === 'trending' ? 'active' : ''}"
        data-tab="trending"
      >
        🔥 Trending
      </button>
      <button 
        class="tab-btn ${activeTab === 'favorites' ? 'active' : ''}"
        data-tab="favorites"
      >
        💖 Favoritos
        ${favoritesCount > 0 ? `
          <span class="ml-2 bg-sakura/30 text-sakura text-xs px-2 py-0.5 rounded-full font-bold">
            ${favoritesCount}
          </span>
        ` : ''}
      </button>
    </div>
  `;
}

/**
 * Update active tab styling
 * @param {string} tabName - Tab name to activate
 */
export function updateActiveTab(tabName) {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    if (tab.dataset.tab === tabName) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });
}