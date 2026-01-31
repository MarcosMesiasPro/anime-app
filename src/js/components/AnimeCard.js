// src/js/components/AnimeCard.js

import { getImageUrl } from '../api/anilist.js';
import { isFavorite } from '../utils/favoritesManager.js';

/**
 * Create HTML for a single anime card
 * @param {Object} anime - Anime data object
 * @returns {string} HTML string
 */
export function createAnimeCard(anime) {
  const { id, title, coverImage, averageScore, episodes, format, season, seasonYear, genres, status } = anime;
  
  // Format score
  const score = averageScore ? (averageScore / 10).toFixed(1) : 'N/A';
  const scoreColor = averageScore >= 80 ? 'text-green-400' : 
                     averageScore >= 60 ? 'text-yellow-400' : 
                     'text-orange-400';
  
  // Check if favorite
  const isFav = isFavorite(id);
  const heartIcon = isFav ? '❤️' : '🤍';
  const heartClass = isFav ? 'is-favorite text-red-500' : 'text-white';
  
  // Format year
  const year = seasonYear || 'N/A';
  
  // Limit genres
  const displayGenres = genres?.slice(0, 3) || [];
  const remainingGenres = genres?.length > 3 ? genres.length - 3 : 0;
  
  // Format episodes
  const eps = episodes ? `${episodes} eps` : '? eps';
  
  // Status badge
  const isReleasing = status === 'RELEASING';

  // ⭐ NUEVO: Serializar datos del anime para guardar en el DOM
  const animeData = JSON.stringify({
    id,
    title,
    coverImage: { large: coverImage.large },
    averageScore,
    format,
    episodes,
    season,
    seasonYear,
    genres: genres?.slice(0, 5) || []
  });

  return `
    <article class="anime-card group" data-anime-id="${id}" data-anime='${animeData.replace(/'/g, "&apos;")}'>
      <!-- Cover Image -->
      <div class="relative aspect-[2/3] overflow-hidden">
        <img 
          src="${getImageUrl(coverImage.extraLarge || coverImage.large)}"
          alt="${title.romaji}"
          class="cover-image"
          loading="lazy"
        />
        
        <!-- Gradient Overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <!-- Rating Badge -->
        <div class="badge-rating absolute top-3 right-3 z-10">
          <span class="text-yellow-400 text-base">⭐</span>
          <span class="${scoreColor} font-bold text-sm">${score}</span>
        </div>
        
        <!-- Favorite Button -->
        <button 
          class="favorite-btn ${heartClass} absolute top-3 left-3 z-10"
          data-anime-id="${id}"
          data-is-favorite="${isFav}"
          aria-label="${isFav ? 'Remover de favoritos' : 'Agregar a favoritos'}"
        >
          <span class="text-xl">${heartIcon}</span>
        </button>
        
        <!-- Hover Overlay with Details Button -->
        <div class="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <button class="btn-primary w-full text-sm">
            Ver Detalles →
          </button>
        </div>
      </div>
      
      <!-- Info Section -->
      <div class="p-4 space-y-2">
        <!-- Title -->
        <h3 class="font-bold text-base line-clamp-2 group-hover:text-sakura transition-colors">
          ${title.romaji}
        </h3>
        
        <!-- Genres -->
        ${displayGenres.length > 0 ? `
          <div class="flex flex-wrap gap-1.5">
            ${displayGenres.map(genre => `
              <span class="badge-genre text-xs">${genre}</span>
            `).join('')}
            ${remainingGenres > 0 ? `
              <span class="badge-genre text-xs">+${remainingGenres}</span>
            ` : ''}
          </div>
        ` : ''}
        
        <!-- Meta Info -->
        <div class="flex items-center gap-2 text-sm text-gray-400">
          <span class="badge-format">${format || 'N/A'}</span>
          <span>•</span>
          <span>${eps}</span>
          ${isReleasing ? `
            <span class="flex items-center gap-1 text-red-400">
              <span class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              Live
            </span>
          ` : ''}
        </div>
        
        <!-- Season/Year -->
        ${season && year !== 'N/A' ? `
          <p class="text-xs text-gray-500">
            ${season} ${year}
          </p>
        ` : ''}
      </div>
    </article>
  `;
}

/**
 * Render anime list (replace content)
 * @param {Array} animeList - Array of anime objects
 * @param {HTMLElement} container - Container element
 */
export function renderAnime(animeList, container) {
  if (!animeList || animeList.length === 0) {
    container.innerHTML = `
      <div class="col-span-full flex flex-col items-center justify-center py-20">
        <div class="text-6xl mb-4 opacity-50 animate-float">🎌</div>
        <p class="text-gray-400 text-xl">No se encontraron anime</p>
      </div>
    `;
    return;
  }

  const html = animeList.map(anime => createAnimeCard(anime)).join('');
  container.innerHTML = html;
}

/**
 * Append anime to list (for infinite scroll)
 * @param {Array} animeList - Array of anime objects
 * @param {HTMLElement} container - Container element
 */
export function appendAnime(animeList, container) {
  if (!animeList || animeList.length === 0) return;

  const html = animeList.map(anime => createAnimeCard(anime)).join('');
  container.insertAdjacentHTML('beforeend', html);
}