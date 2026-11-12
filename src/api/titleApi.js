import axiosClient from './axiosClient.js';

/**
 * Fetches all titles or filters by genre.
 * @param {string} [genre]
 */
export const fetchTitles = async (genre) => {
  const params = genre && genre !== 'All' ? { genre } : {};
  return await axiosClient.get('/title', { params });
};

/**
 * Searches titles by keyword query and optional genre.
 * @param {string} query
 * @param {string} [genre]
 */
export const searchTitles = async (query, genre) => {
  const params = { query };
  if (genre && genre !== 'All') params.genre = genre;
  return await axiosClient.get('/title/search', { params });
};

/**
 * Retrieves detailed info for a single title.
 * @param {number|string} titleId
 */
export const fetchTitleById = async (titleId) => {
  return await axiosClient.get(`/title/${titleId}`);
};

/**
 * Adds a title to the user's favorites.
 * @param {number|string} titleId
 * @param {number} userId
 */
export const addTitleToFavorites = async (titleId, userId) => {
  return await axiosClient.post(`/title/${titleId}/AddToFavorites`, { userId });
};

/**
 * Removes a title from the user's favorites.
 * @param {number|string} titleId
 * @param {number} userId
 */
export const removeTitleFromFavorites = async (titleId, userId) => {
  return await axiosClient.delete(`/title/${titleId}/AddToFavorites`, {
    params: { userId }
  });
};
