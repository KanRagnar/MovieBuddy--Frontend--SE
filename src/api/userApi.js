import axiosClient from './axiosClient.js';

/**
 * Authenticates user via query parameters per OpenAPI spec.
 * @param {string} username
 * @param {string} password
 */
export const loginUser = async (username, password) => {
  return await axiosClient.get('/user/login', {
    params: { username, password }
  });
};

/**
 * Logs out current user.
 */
export const logoutUser = async () => {
  return await axiosClient.get('/user/logout');
};

/**
 * Fetches all users.
 */
export const fetchAllUsers = async () => {
  return await axiosClient.get('/user');
};

/**
 * Fetches a single user by numeric ID.
 * @param {number|string} userId
 */
export const fetchUserById = async (userId) => {
  return await axiosClient.get(`/user/${userId}`);
};

/**
 * Registers a new user.
 * @param {Object} payload
 */
export const registerUser = async (payload) => {
  return await axiosClient.post('/user', payload);
};

/**
 * Updates user profile details.
 * @param {number|string} userId
 * @param {Object} payload
 */
export const updateUserProfile = async (userId, payload) => {
  return await axiosClient.put(`/user/${userId}`, payload);
};

/**
 * Records a left/right swipe on another user profile.
 * @param {number|string} userId
 * @param {number} targetUserId
 * @param {'left'|'right'} direction
 */
export const swipeUser = async (userId, targetUserId, direction) => {
  return await axiosClient.post(`/user/${userId}/swipe`, {
    targetUserId,
    direction
  });
};
