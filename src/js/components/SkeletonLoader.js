// src/js/components/SkeletonLoader.js

/**
 * Create skeleton card HTML
 * @returns {string} HTML string
 */
function createSkeletonCard() {
  return `
    <div class="skeleton-card animate-pulse">
      <!-- Cover -->
      <div class="aspect-[2/3] bg-gray-800/50 rounded-t-xl"></div>
      
      <!-- Info -->
      <div class="p-4 space-y-3">
        <!-- Title -->
        <div class="h-5 bg-gray-800/50 rounded w-3/4"></div>
        
        <!-- Genres -->
        <div class="flex gap-2">
          <div class="h-6 bg-gray-800/50 rounded-full w-16"></div>
          <div class="h-6 bg-gray-800/50 rounded-full w-20"></div>
        </div>
        
        <!-- Meta -->
        <div class="h-4 bg-gray-800/50 rounded w-1/2"></div>
      </div>
    </div>
  `;
}

/**
 * Show skeleton loaders
 * @param {number} count - Number of skeletons
 * @param {HTMLElement} container - Container element
 */
export function showSkeletonLoaders(count = 20, container) {
  if (!container) return;
  
  const html = Array(count).fill(null).map(() => createSkeletonCard()).join('');
  container.innerHTML = html;
}