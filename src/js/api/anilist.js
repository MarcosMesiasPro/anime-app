// src/js/api/anilist.js

const BASE_URL = 'https://graphql.anilist.co';

/**
 * Base GraphQL fetch function
 * @param {string} query - GraphQL query
 * @param {Object} variables - Query variables
 * @returns {Promise<Object>} API response data
 */
async function fetchGraphQL(query, variables = {}) {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // NO incluir 'Origin' - el navegador lo maneja automáticamente
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.errors) {
      console.error('GraphQL Errors:', data.errors);
      throw new Error(data.errors[0].message);
    }

    return data.data;
  } catch (error) {
    console.error('❌ [fetchGraphQL] error:', error);
    throw error;
  }
}

/**
 * Get trending anime
 * @param {number} page - Page number
 * @param {number} perPage - Items per page
 * @returns {Promise<Object>} Trending anime data
 */
export async function getTrendingAnime(page = 1, perPage = 20) {
  console.log(`🔍 [getTrendingAnime] page ${page}`);

  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
        media(type: ANIME, sort: TRENDING_DESC) {
          id
          title {
            romaji
            english
            native
          }
          coverImage {
            large
            extraLarge
          }
          bannerImage
          averageScore
          popularity
          favourites
          episodes
          season
          seasonYear
          format
          status
          genres
          description
        }
      }
    }
  `;

  try {
    const data = await fetchGraphQL(query, { page, perPage });
    console.log(`✅ [getTrendingAnime] ${data.Page.media.length} anime loaded`);
    return data.Page;
  } catch (error) {
    console.error('❌ [getTrendingAnime] error:', error);
    throw error;
  }
}

/**
 * Search anime by query
 * @param {string} searchQuery - Search term
 * @param {number} page - Page number
 * @param {number} perPage - Items per page
 * @returns {Promise<Object>} Search results
 */
export async function searchAnime(searchQuery, page = 1, perPage = 20) {
  if (!searchQuery || !searchQuery.trim()) {
    throw new Error('Search query cannot be empty');
  }

  console.log(`🔍 [searchAnime] "${searchQuery}" page ${page}`);

  const query = `
    query ($search: String, $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
        media(type: ANIME, search: $search, sort: SEARCH_MATCH) {
          id
          title {
            romaji
            english
            native
          }
          coverImage {
            large
            extraLarge
          }
          bannerImage
          averageScore
          popularity
          favourites
          episodes
          season
          seasonYear
          format
          status
          genres
          description
        }
      }
    }
  `;

  try {
    const data = await fetchGraphQL(query, { search: searchQuery, page, perPage });
    console.log(`✅ [searchAnime] ${data.Page.media.length} results for "${searchQuery}"`);
    return data.Page;
  } catch (error) {
    console.error('❌ [searchAnime] error:', error);
    throw error;
  }
}

/**
 * Get anime details by ID
 * @param {number} id - Anime ID
 * @returns {Promise<Object>} Anime details
 */
export async function getAnimeDetails(id) {
  if (!id || typeof id !== 'number' || id <= 0) {
    throw new Error('Invalid anime ID');
  }

  console.log(`🔍 [getAnimeDetails] ID: ${id}`);

  const query = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          large
          extraLarge
        }
        bannerImage
        startDate {
          year
          month
          day
        }
        endDate {
          year
          month
          day
        }
        description
        season
        seasonYear
        episodes
        duration
        status
        format
        genres
        averageScore
        meanScore
        popularity
        favourites
        studios {
          nodes {
            name
            isAnimationStudio
          }
        }
        characters(page: 1, perPage: 8, sort: ROLE) {
          edges {
            role
            node {
              id
              name {
                full
              }
              image {
                large
              }
            }
          }
        }
        relations {
          edges {
            relationType
            node {
              id
              type
              title {
                romaji
              }
              coverImage {
                large
              }
              format
            }
          }
        }
        trailer {
          id
          site
          thumbnail
        }
        tags {
          name
          rank
        }
      }
    }
  `;

  try {
    const data = await fetchGraphQL(query, { id });
    console.log(`✅ [getAnimeDetails] loaded: ${data.Media.title.romaji}`);
    return data.Media;
  } catch (error) {
    console.error('❌ [getAnimeDetails] error:', error);
    throw error;
  }
}

/**
 * Get image URL with fallback
 * @param {string} url - Image URL
 * @returns {string} Image URL or placeholder
 */
export function getImageUrl(url) {
  return url || 'https://via.placeholder.com/460x644/1a1a2e/eee?text=No+Image';
}