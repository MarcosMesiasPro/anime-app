// src/main.js

import './styles/style.css';
import { getTrendingAnime, searchAnime, getAnimeDetails } from './js/api/anilist.js';
import { renderAnime, appendAnime } from './js/components/AnimeCard.js';
import { createAnimeModal, showModal, closeModal, setupModalListeners } from './js/components/AnimeModal.js';
import { createSearchBar, showSearchLoading, hideSearchLoading, showResultsCount, hideResultsCount } from './js/components/SearchBar.js';
import { createTabNavigation, updateActiveTab } from './js/components/TabNavigation.js';
import { showSkeletonLoaders } from './js/components/SkeletonLoader.js';
import { createScrollToTopButton, setupScrollToTop } from './js/components/ScrollToTop.js';
import { initSakuraEffect } from './js/components/SakuraEffect.js';
import { debounce, showLoading, hideLoading } from './js/utils/helpers.js';
import { getFavorites, addToFavorites, removeFromFavorites, isFavorite, getFavoritesCount } from './js/utils/favoritesManager.js';

// Global state
let currentPage = 1;
let totalPages = 1;
let isLoading = false;
let isSearching = false;
let currentQuery = '';
let currentTab = 'trending';
let observer = null;
let currentAnimeList = []; // Store current list for favorite operations

/**
 * Load trending anime
 */
async function loadTrendingAnime(page = 1, append = false) {
  if (isLoading) return;

  try {
    isLoading = true;
    console.log(`🎌 Loading trending anime (page ${page})...`);

    const animeGrid = document.getElementById('animeGrid');
    
    if (!append) {
      showSkeletonLoaders(20, animeGrid);
    }

    const data = await getTrendingAnime(page, 20);
    
    currentPage = data.pageInfo.currentPage;
    totalPages = data.pageInfo.lastPage;
    
    if (append) {
      currentAnimeList = [...currentAnimeList, ...data.media];
      appendAnime(data.media, animeGrid);
    } else {
      currentAnimeList = data.media;
      renderAnime(data.media, animeGrid);
    }

    setupInfiniteScroll();
    
    console.log(`✅ Loaded ${data.media.length} anime`);
  } catch (error) {
    console.error('❌ Error loading trending:', error);
    const animeGrid = document.getElementById('animeGrid');
    animeGrid.innerHTML = `
      <div class="col-span-full text-center py-20">
        <p class="text-red-400 text-xl mb-4">Error al cargar anime</p>
        <button onclick="location.reload()" class="btn-primary">Reintentar</button>
      </div>
    `;
  } finally {
    isLoading = false;
  }
}

/**
 * Perform search
 */
async function performSearch(query, page = 1, append = false) {
  if (!query || !query.trim()) {
    // Reset to trending
    currentQuery = '';
    isSearching = false;
    hideResultsCount();
    loadTrendingAnime(1, false);
    return;
  }

  if (isLoading) return;

  try {
    isLoading = true;
    isSearching = true;
    currentQuery = query;

    console.log(`🔍 Searching: "${query}" (page ${page})...`);

    const animeGrid = document.getElementById('animeGrid');
    
    if (!append) {
      showSearchLoading();
      showSkeletonLoaders(20, animeGrid);
    }

    const data = await searchAnime(query, page, 20);
    
    currentPage = data.pageInfo.currentPage;
    totalPages = data.pageInfo.lastPage;

    if (append) {
      currentAnimeList = [...currentAnimeList, ...data.media];
      appendAnime(data.media, animeGrid);

      // ⭐ Actualizar contador al cargar más
      updateSearchCounter(query);
    } else {
      currentAnimeList = data.media;
      renderAnime(data.media, animeGrid);

        // ⭐ Mostrar contador inicial
        updateSearchCounter(query);

       // ⭐ ACTUALIZAR AQUÍ - Mostrar info más útil
      if (data.pageInfo.hasNextPage) {
        // Hay más páginas - mostrar "Mostrando X, hay más resultados"
        const currentCount = data.media.length;
        showResultsCount(currentCount, query, true); // true = hasMore
      } else {
        // Solo una página - mostrar total exacto
        const exactCount = data.media.length;
        showResultsCount(exactCount, query, false); // false = no hasMore
      }
    }

    hideSearchLoading();
    setupInfiniteScroll();

    console.log(`✅ Found ${data.media.length} results`);
  } catch (error) {
    console.error('❌ Search error:', error);
    hideSearchLoading();
    const animeGrid = document.getElementById('animeGrid');
    animeGrid.innerHTML = `
      <div class="col-span-full text-center py-20">
        <p class="text-red-400 text-xl">Error en la búsqueda</p>
      </div>
    `;
  } finally {
    isLoading = false;
  }
}

/**
 * Load next page (infinite scroll)
 */
async function loadNextPage() {
  if (isLoading || currentPage >= totalPages) return;

  const nextPage = currentPage + 1;

  if (isSearching && currentQuery) {
    await performSearch(currentQuery, nextPage, true);
  } else {
    await loadTrendingAnime(nextPage, true);
  }
}

/**
 * Setup infinite scroll
 */
function setupInfiniteScroll() {
  // Remove old sentinel
  const oldSentinel = document.getElementById('infiniteLoader');
  if (oldSentinel) oldSentinel.remove();

  // Disconnect old observer
  if (observer) observer.disconnect();

  // Check if there are more pages
  if (currentPage >= totalPages) {
    const animeGrid = document.getElementById('animeGrid');
    const noMore = document.getElementById('noMoreResults');
    if (noMore && animeGrid.children.length > 0) {
      noMore.classList.remove('hidden');
    }
    return;
  }

  // Hide "no more" message
  const noMore = document.getElementById('noMoreResults');
  if (noMore) noMore.classList.add('hidden');

  // Create sentinel
  const sentinel = document.createElement('div');
  sentinel.id = 'infiniteLoader';
  sentinel.className = 'col-span-full flex justify-center items-center py-8';
  sentinel.innerHTML = `
    <div class="flex flex-col items-center gap-4">
      <div class="loading-spinner"></div>
      <p class="text-gray-400">Cargando más anime...</p>
    </div>
  `;

  const animeGrid = document.getElementById('animeGrid');
  animeGrid.appendChild(sentinel);

  // Create observer
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !isLoading) {
        loadNextPage();
      }
    },
    { rootMargin: '200px', threshold: 0.1 }
  );

  observer.observe(sentinel);
}

/**
 * Open anime modal
 */
async function openAnimeModal(animeId) {
  try {
    console.log(`🎭 Opening modal for anime: ${animeId}`);

    // Show loading
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'tempLoading';
    loadingDiv.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm';
    loadingDiv.innerHTML = `
      <div class="flex flex-col items-center gap-4">
        <div class="loading-spinner"></div>
        <p class="text-white text-lg">Cargando detalles...</p>
      </div>
    `;
    document.body.appendChild(loadingDiv);

    // Fetch details
    const animeDetails = await getAnimeDetails(animeId);

    // Remove loading
    loadingDiv.remove();

    // Create and show modal
    const modalHTML = createAnimeModal(animeDetails);
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    showModal();
    setupModalListeners();

    console.log('✅ Modal opened');
  } catch (error) {
    console.error('❌ Error opening modal:', error);
    
    const loading = document.getElementById('tempLoading');
    if (loading) loading.remove();
    
    alert('Error al cargar los detalles del anime');
  }
}

/**
 * Setup search listeners
 */
function setupSearchListeners() {
  const searchInput = document.getElementById('searchInput');
  const clearBtn = document.getElementById('clearSearch');

  if (!searchInput) return;

  // Debounced search
  const debouncedSearch = debounce((query) => {
    currentPage = 1;
    performSearch(query, 1, false);
  }, 500);

  // Input event
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();

    // Show/hide clear button
    if (clearBtn) {
      if (query) {
        clearBtn.classList.remove('hidden');
      } else {
        clearBtn.classList.add('hidden');
      }
    }

    debouncedSearch(query);
  });

  // Enter key for immediate search
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const query = e.target.value.trim();
      currentPage = 1;
      performSearch(query, 1, false);
    }
  });

  // Clear button
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      clearBtn.classList.add('hidden');
      currentQuery = '';
      isSearching = false;
      currentPage = 1;
      hideResultsCount();
      loadTrendingAnime(1, false);
    });
  }
}

/**
 * Setup card click listeners
 */
function setupCardListeners() {
  const animeGrid = document.getElementById('animeGrid');

  if (animeGrid) {
    animeGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.anime-card');

      // Skip if clicking favorite button
      if (e.target.closest('.favorite-btn')) {
        return;
      }

      if (card) {
        const animeId = parseInt(card.dataset.animeId);
        if (animeId) {
          openAnimeModal(animeId);
        }
      }
    });
  }
}

/**
 * Setup favorite button listeners (mejorado)
 */
function setupFavoriteButtonListeners() {
  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('.favorite-btn');
    if (!btn) return;

    e.preventDefault();
    e.stopPropagation();

    const animeId = parseInt(btn.dataset.animeId);
    const isFav = btn.dataset.isFavorite === 'true';

    console.log(`💖 Favorite button clicked: ID ${animeId}, isFav: ${isFav}`);

    if (isFav) {
      // Remover de favoritos
      const success = removeFromFavorites(animeId);
      if (success) {
        console.log('✅ Removed from favorites');
      }
    } else {
      // Agregar a favoritos - buscar anime data
      let anime = null;

      // Opción 1: Buscar en el grid (card tiene data-anime)
      const card = document.querySelector(`.anime-card[data-anime-id="${animeId}"]`);
      if (card && card.dataset.anime) {
        try {
          anime = JSON.parse(card.dataset.anime);
          console.log('📦 Anime data found in grid card');
        } catch (e) {
          console.error('Error parsing anime data from card:', e);
        }
      }

      // Opción 2: Buscar en currentAnimeList
      if (!anime) {
        anime = currentAnimeList.find(a => a.id === animeId);
        if (anime) {
          console.log('📦 Anime data found in currentAnimeList');
        }
      }

      // Opción 3: Buscar en el modal (si está abierto)
      if (!anime) {
        const modal = document.getElementById('animeModal');
        if (modal && modal.dataset.anime) {
          try {
            anime = JSON.parse(modal.dataset.anime);
            console.log('📦 Anime data found in modal');
          } catch (e) {
            console.error('Error parsing anime data from modal:', e);
          }
        }
      }

      if (anime) {
        const success = addToFavorites(anime);
        if (success) {
          console.log('✅ Added to favorites');
        }
      } else {
        console.error('❌ Could not find anime data to add to favorites');
      }
    }
  });
}

/**
 * Setup tab listeners
 */
function setupTabListeners() {
  const tabsContainer = document.getElementById('tabsContainer');

  if (tabsContainer) {
    tabsContainer.addEventListener('click', (e) => {
      const tab = e.target.closest('.tab-btn');
      if (!tab) return;

      const tabName = tab.dataset.tab;

      if (tabName === 'trending') {
        showTrendingTab();
      } else if (tabName === 'favorites') {
        showFavoritesTab();
      }
    });
  }
}

/**
 * Show trending tab
 */
function showTrendingTab() {
  currentTab = 'trending';
  currentPage = 1;
  isSearching = false;
  currentQuery = '';

  // Clear search
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.value = '';

  const clearBtn = document.getElementById('clearSearch');
  if (clearBtn) clearBtn.classList.add('hidden');

  hideResultsCount();
  updateActiveTab('trending');
  loadTrendingAnime(1, false);
}

/**
 * Show favorites tab
 */
function showFavoritesTab() {
  currentTab = 'favorites';
  currentPage = 1;

  const favorites = getFavorites();
  const animeGrid = document.getElementById('animeGrid');

  if (favorites.length === 0) {
    animeGrid.innerHTML = `
      <div class="col-span-full flex flex-col items-center justify-center py-20">
        <div class="text-6xl mb-4 opacity-50">💔</div>
        <p class="text-gray-400 text-xl mb-2">No tienes favoritos aún</p>
        <p class="text-gray-500">¡Agrega anime a tus favoritos para verlos aquí!</p>
      </div>
    `;
  } else {
    currentAnimeList = favorites;
    renderAnime(favorites, animeGrid);
  }

  // Remove infinite scroll sentinel
  const sentinel = document.getElementById('infiniteLoader');
  if (sentinel) sentinel.remove();

  if (observer) observer.disconnect();

  updateActiveTab('favorites');
}

/**
 * Handle favorites changed event
 */
function handleFavoritesChanged(event) {
  const { animeId, action, count } = event.detail;

  console.log(`💖 Favorites changed: ${action} (total: ${count})`);

  // Update tabs badge
  const tabsContainer = document.getElementById('tabsContainer');
  if (tabsContainer) {
    tabsContainer.innerHTML = createTabNavigation(currentTab, count);
    setupTabListeners();
  }

  // Sync all favorite buttons
  syncFavoriteButtons(animeId);

  // If in favorites tab, re-render
  if (currentTab === 'favorites') {
    showFavoritesTab();
  }
}

/**
 * Sync favorite button states
 */
function syncFavoriteButtons(animeId) {
  const buttons = document.querySelectorAll(`[data-anime-id="${animeId}"]`);
  const isFav = isFavorite(animeId);

  buttons.forEach(btn => {
    if (!btn.classList.contains('favorite-btn')) return;

    btn.dataset.isFavorite = isFav;

    const icon = btn.querySelector('span');
    if (icon) {
      icon.textContent = isFav ? '❤️' : '🤍';
    }

    if (isFav) {
      btn.classList.add('is-favorite', 'text-red-500');
      btn.classList.remove('text-white');
    } else {
      btn.classList.remove('is-favorite', 'text-red-500');
      btn.classList.add('text-white');
    }
  });
}

/**
 * Initialize app
 */
async function init() {
  document.documentElement.classList.add('hydrated');

  try {
    console.log('🚀 Initializing Anime Discovery App...');

    // Render search bar
    const searchContainer = document.getElementById('searchContainer');
    if (searchContainer) {
      searchContainer.innerHTML = createSearchBar();
      setupSearchListeners();
    }

    // Render tabs
    const tabsContainer = document.getElementById('tabsContainer');
    if (tabsContainer) {
      const favCount = getFavoritesCount();
      tabsContainer.innerHTML = createTabNavigation('trending', favCount);
      setupTabListeners();
    }

    // Setup listeners
    setupCardListeners();
    setupFavoriteButtonListeners();
    setupGlobalModalHandlers(); // ⭐ AGREGAR ESTA LÍNEA

    // Listen for favorites changes
    window.addEventListener('favoritesChanged', handleFavoritesChanged);

    // Add scroll to top button
    document.body.insertAdjacentHTML('beforeend', createScrollToTopButton());
    setupScrollToTop();

    // Initialize sakura effect
    initSakuraEffect();

    // Load initial trending anime
    await loadTrendingAnime(1, false);

    console.log('✅ App initialized successfully');
    console.log('🎨 Glassmorphism theme loaded');
    console.log('💖 Favorites system enabled');
    console.log('🔍 Search ready');
    console.log('🌸 Sakura effect active');
  } catch (error) {
    console.error('❌ Error initializing app:', error);
  }
}

/**
 * Setup global modal handlers (ejecutar UNA SOLA VEZ en init)
 */
function setupGlobalModalHandlers() {
  // Listener global para clicks dentro de modales
  document.body.addEventListener('click', async (e) => {
    // 1. Cerrar modal con botón X
    if (e.target.closest('#closeModal')) {
      e.preventDefault();
      e.stopPropagation();
      closeModal();
      return;
    }

    // 2. Cerrar modal con click en backdrop
    const backdrop = e.target.closest('#modalBackdrop');
    if (backdrop && e.target === backdrop) {
      closeModal();
      return;
    }

    // 3. Abrir anime relacionado
    const relatedCard = e.target.closest('.related-anime-card');
    if (relatedCard) {
      // Verificar que estamos dentro de un modal
      const modal = relatedCard.closest('#animeModal');
      if (!modal) return;

      e.preventDefault();
      e.stopPropagation();

      const animeId = parseInt(relatedCard.dataset.animeId);
      if (!animeId) return;

      console.log('🔗 Opening related anime:', animeId);

      // Cerrar modal actual
      closeModal();

      // Esperar animación de cierre
      await new Promise(resolve => setTimeout(resolve, 300));

      // Abrir nuevo modal
      await openAnimeModal(animeId);
    }
  });

  // ESC key global
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('animeModal');
      if (modal) {
        closeModal();
      }
    }
  });

  console.log('✅ Global modal handlers setup');
}

/**
 * Update search counter with current loaded anime count
 */
function updateSearchCounter(query) {
  const counter = document.getElementById('searchResultsCount');
  if (!counter) return;

  const loadedCount = currentAnimeList.length;
  
  counter.classList.remove('hidden');
  
  if (currentPage < totalPages) {
    // Hay más páginas
    counter.textContent = `Mostrando ${loadedCount} resultados para "${query}" • Página ${currentPage} de ${totalPages}`;
  } else {
    // Última página
    counter.textContent = `${loadedCount} resultado${loadedCount !== 1 ? 's' : ''} encontrado${loadedCount !== 1 ? 's' : ''} para "${query}"`;
  }
}

// Start app when DOM is ready
document.addEventListener('DOMContentLoaded', init);