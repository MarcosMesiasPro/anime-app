// src/js/components/AnimeModal.js

import { getImageUrl } from '../api/anilist.js';
import { isFavorite } from '../utils/favoritesManager.js';
import { formatDate, translateStatus, translateRelationType, sanitizeHTML } from '../utils/helpers.js';

/**
 * Create anime details modal
 * @param {Object} anime - Complete anime details
 * @returns {string} HTML string
 */
export function createAnimeModal(anime) {
  const {
    id, title, coverImage, bannerImage, description,
    averageScore, popularity, episodes, duration, status, format,
    season, seasonYear, genres, studios, characters, relations, trailer,
    startDate, endDate
  } = anime;

  const score = averageScore ? (averageScore / 10).toFixed(1) : 'N/A';
  const scoreColor = averageScore >= 80 ? 'text-green-400' : 
                     averageScore >= 60 ? 'text-yellow-400' : 'text-orange-400';
  
  const year = seasonYear || startDate?.year || 'N/A';
  const durationText = duration ? `${duration} min/ep` : 'N/A';
  const epsText = episodes ? `${episodes} episodios` : '? episodios';
  
  const isFav = isFavorite(id);
  const heartIcon = isFav ? '❤️' : '🤍';
  const heartClass = isFav ? 'is-favorite text-red-500' : 'text-white';
  
  const studio = studios?.nodes?.find(s => s.isAnimationStudio)?.name || 
                 studios?.nodes?.[0]?.name || 'N/A';
  
  const mainCharacters = characters?.edges?.filter(e => e.role === 'MAIN').slice(0, 8) || [];
  
  const animeRelations = relations?.edges?.filter(e => e.node.type === 'ANIME').slice(0, 6) || [];
  
  const youtubeTrailer = trailer?.site === 'youtube' ? trailer.id : null;

  // ⭐ NUEVO: Serializar datos del anime para el modal
  const animeData = JSON.stringify({
    id,
    title,
    coverImage: { large: coverImage.large || coverImage.extraLarge },
    averageScore,
    format,
    episodes,
    season,
    seasonYear,
    genres: genres?.slice(0, 5) || []
  });

  return `
    <div id="animeModal" class="fixed inset-0 z-50 flex items-center justify-center p-4" data-anime='${animeData.replace(/'/g, "&apos;")}'>
      <!-- Backdrop -->
      <div id="modalBackdrop" class="modal-backdrop absolute inset-0"></div>

      <!-- Modal Content -->
      <div class="modal-content relative glass-card max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Close Button -->
        <button 
          id="closeModal"
          class="absolute top-4 right-4 z-20 glass-card p-2 rounded-full hover:bg-white/20 transition-all"
          aria-label="Cerrar modal"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <!-- Banner -->
<div class="relative h-64 md:h-96 overflow-hidden rounded-t-xl">
  <img 
    src="${getImageUrl(bannerImage || coverImage.extraLarge)}"
    alt="${title.romaji}"
    class="w-full h-full object-cover"
  />
  <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent"></div>
  
  <!-- Title Overlay -->
  <div class="absolute bottom-0 left-0 right-0 p-6 md:p-8">
    <h2 class="text-3xl md:text-4xl font-bold mb-2">${title.romaji}</h2>
    ${title.english && title.english !== title.romaji ? `
      <p class="text-gray-300 italic text-lg">${title.english}</p>
    ` : ''}
  </div>

  <!-- Favorite Button - POSICIONADO EN ESQUINA SUPERIOR DERECHA -->
  <button
  class="favorite-btn ${heartClass} absolute top-4 left-4 z-20"
  data-anime-id="${id}"
  data-is-favorite="${isFav}"
  aria-label="${isFav ? 'Remover de favoritos' : 'Agregar a favoritos'}"
>
  <span class="text-2xl">${heartIcon}</span>
</button>
</div>

        <!-- Content -->
        <div class="p-6 md:p-8 space-y-6">
          <!-- Stats Row -->
          <div class="flex flex-wrap gap-3">
            <!-- Score -->
            <div class="badge-rating">
              <span class="text-yellow-400 text-xl">⭐</span>
              <span class="${scoreColor} font-bold text-lg">${score}</span>
              <span class="text-gray-400 text-sm">/ 10</span>
            </div>

            <!-- Status -->
            <div class="badge">
              ${status === 'RELEASING' ? '🔴' : status === 'FINISHED' ? '✅' : '📅'}
              <span class="ml-1">${translateStatus(status)}</span>
            </div>

            <!-- Format -->
            <div class="badge-format">
              ${format || 'N/A'}
            </div>

            <!-- Episodes -->
            <div class="badge">
              📊 ${epsText}
            </div>

            <!-- Duration -->
            <div class="badge">
              ⏱️ ${durationText}
            </div>

            <!-- Season -->
            ${season && year !== 'N/A' ? `
              <div class="badge">
                📆 ${season} ${year}
              </div>
            ` : ''}
          </div>

          <!-- Genres -->
          ${genres && genres.length > 0 ? `
            <div>
              <h3 class="text-lg font-bold mb-3 text-gray-400">Géneros</h3>
              <div class="flex flex-wrap gap-2">
                ${genres.map(genre => `
                  <span class="badge-genre">${genre}</span>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Description -->
          ${description ? `
            <div>
              <h3 class="text-xl font-bold mb-3">📖 Sinopsis</h3>
              <div class="text-gray-300 leading-relaxed">
                ${sanitizeHTML(description)}
              </div>
            </div>
          ` : ''}

          <!-- Info Grid -->
          <div class="grid md:grid-cols-2 gap-6">
            <!-- Studio -->
            <div>
              <h3 class="text-lg font-bold mb-2 text-gray-400">🎬 Estudio</h3>
              <p class="text-white">${studio}</p>
            </div>

            <!-- Dates -->
            <div>
              <h3 class="text-lg font-bold mb-2 text-gray-400">📅 Emisión</h3>
              <p class="text-white">
                ${startDate ? formatDate(startDate) : 'N/A'} 
                ${endDate ? `— ${formatDate(endDate)}` : status === 'RELEASING' ? '— En emisión' : ''}
              </p>
            </div>
          </div>

          <!-- Characters -->
          ${mainCharacters.length > 0 ? `
            <div>
              <h3 class="text-xl font-bold mb-4">🎭 Personajes Principales</h3>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                ${mainCharacters.map(char => `
                  <div class="character-card">
                    <div class="aspect-[3/4] overflow-hidden">
                      <img 
                        src="${getImageUrl(char.node.image.large)}"
                        alt="${char.node.name.full}"
                        class="w-full h-full object-cover"
                      />
                    </div>
                    <div class="p-2">
                      <p class="text-sm font-semibold truncate">${char.node.name.full}</p>
                      <p class="text-xs text-gray-400">${char.role}</p>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Trailer -->
          ${youtubeTrailer ? `
            <div>
              <h3 class="text-xl font-bold mb-4">🎬 Trailer</h3>
              <div class="aspect-video rounded-lg overflow-hidden glass-card">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/${youtubeTrailer}"
                  title="Trailer"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                  class="w-full h-full"
                ></iframe>
              </div>
            </div>
          ` : ''}

          <!-- Related Anime -->
          ${animeRelations.length > 0 ? `
            <div>
              <h3 class="text-xl font-bold mb-4">🔗 Anime Relacionados</h3>
              <div class="flex gap-4 overflow-x-auto pb-4">
                ${animeRelations.map(rel => `
                  <div 
                    class="related-anime-card flex-shrink-0 w-32 cursor-pointer"
                    data-anime-id="${rel.node.id}"
                  >
                    <div class="aspect-[2/3] overflow-hidden rounded-lg mb-2">
                      <img 
                        src="${getImageUrl(rel.node.coverImage.large)}"
                        alt="${rel.node.title.romaji}"
                        class="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <p class="text-xs font-semibold truncate">${rel.node.title.romaji}</p>
                    <p class="text-xs text-gray-400">${translateRelationType(rel.relationType)}</p>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

/**
 * Show modal and block body scroll
 */
export function showModal() {
  document.body.style.overflow = 'hidden';
}

/**
 * Close modal and restore scroll
 */
/**
 * Close modal and restore scroll
 */
export function closeModal() {
  const modal = document.getElementById('animeModal');
  if (!modal) return;

  console.log('🔒 Closing modal...');

  modal.classList.add('animate-fadeOut');
  
  setTimeout(() => {
    modal.remove();
    document.body.style.overflow = 'auto';
    console.log('✅ Modal closed');
  }, 200);
}

/**
 * Setup modal event listeners
 */
/**
 * Setup modal event listeners (simplificado - sin ESC ni backdrop)
 */
export function setupModalListeners() {
  // NO hacer nada aquí - los listeners globales lo manejan
  // Esta función existe solo por compatibilidad
  console.log('✅ Modal listeners ready (handled globally)');
}