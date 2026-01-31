// src/js/utils/favoritesManager.js

import { saveToStorage, getFromStorage } from './localStorage.js';

const STORAGE_KEY = 'animeFavorites';

/**
 * Get all favorites
 * @returns {Array} Array of favorite anime
 */
export function getFavorites() {
  const favorites = getFromStorage(STORAGE_KEY);
  return favorites || [];
}

/**
 * Add anime to favorites
 * @param {Object} anime - Anime object
 * @returns {boolean} Success status
 */
export function addToFavorites(anime) {
  if (!anime || !anime.id) {
    console.error('❌ Invalid anime object');
    return false;
  }

  const favorites = getFavorites();
  
  // Check if already exists
  if (favorites.some(fav => fav.id === anime.id)) {
    console.log('ℹ️ Anime already in favorites');
    return false;
  }

  // Create simplified object to save space
  const simplified = {
    id: anime.id,
    title: anime.title,
    coverImage: { large: anime.coverImage.large },
    averageScore: anime.averageScore,
    format: anime.format,
    episodes: anime.episodes,
    season: anime.season,
    seasonYear: anime.seasonYear,
    genres: anime.genres?.slice(0, 3) || [],
  };

  favorites.push(simplified);
  const saved = saveToStorage(STORAGE_KEY, favorites);

  if (saved) {
    console.log('✅ Added to favorites:', anime.title.romaji);
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('favoritesChanged', {
      detail: { 
        animeId: anime.id,
        action: 'add',
        count: favorites.length,
      }
    }));
  }

  return saved;
}

/**
 * Remove anime from favorites
 * @param {number} animeId - Anime ID
 * @returns {boolean} Success status
 */
export function removeFromFavorites(animeId) {
  const favorites = getFavorites();
  const filtered = favorites.filter(fav => fav.id !== animeId);

  if (filtered.length === favorites.length) {
    console.log('ℹ️ Anime not in favorites');
    return false;
  }

  const saved = saveToStorage(STORAGE_KEY, filtered);

  if (saved) {
    console.log('✅ Removed from favorites');
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('favoritesChanged', {
      detail: { 
        animeId,
        action: 'remove',
        count: filtered.length,
      }
    }));
  }

  return saved;
}

/**
 * Check if anime is in favorites
 * @param {number} animeId - Anime ID
 * @returns {boolean} Is favorite
 */
export function isFavorite(animeId) {
  const favorites = getFavorites();
  return favorites.some(fav => fav.id === animeId);
}

/**
 * Get favorites count
 * @returns {number} Number of favorites
 */
export function getFavoritesCount() {
  return getFavorites().length;
}

/**
 * Clear all favorites
 * @returns {boolean} Success status
 */
export function clearFavorites() {
  const saved = saveToStorage(STORAGE_KEY, []);
  
  if (saved) {
    console.log('✅ Cleared all favorites');
    
    window.dispatchEvent(new CustomEvent('favoritesChanged', {
      detail: { 
        action: 'clear',
        count: 0,
      }
    }));
  }

  return saved;
}