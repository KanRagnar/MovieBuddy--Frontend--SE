import axiosClient from './axiosClient.js';

/**
 * Fetches reviews, optionally filtered by titleId.
 * @param {number|string} [titleId]
 */
export const fetchReviews = async (titleId) => {
  const params = titleId ? { titleId } : {};
  return await axiosClient.get('/review', { params });
};

/**
 * Submits a new review for a specific title.
 * @param {number|string} titleId
 * @param {{ comment: string, rate: number, userId?: number }} payload
 */
export const createReview = async (titleId, payload) => {
  return await axiosClient.post(`/title/${titleId}/Review`, payload);
};

/**
 * Updates an existing review by ID.
 * @param {number|string} reviewId
 * @param {{ comment: string, rate: number }} payload
 */
export const updateReview = async (reviewId, payload) => {
  return await axiosClient.put(`/review/${reviewId}`, payload);
};

/**
 * Deletes a review by ID.
 * @param {number|string} reviewId
 */
export const deleteReview = async (reviewId) => {
  return await axiosClient.delete(`/review/${reviewId}`);
};
