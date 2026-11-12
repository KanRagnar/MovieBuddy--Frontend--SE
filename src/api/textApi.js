import axiosClient from './axiosClient.js';

/**
 * Fetches all chat messages sent or received by a user.
 * @param {string} userId - String username/userId (e.g., 'sampleuser').
 */
export const fetchUserTexts = async (userId) => {
  return await axiosClient.get(`/user/${userId}/text`);
};

/**
 * Sends a chat message from senderId to receiver.
 * @param {string} senderId
 * @param {string} receiver
 * @param {string} script
 */
export const sendUserText = async (senderId, receiver, script) => {
  return await axiosClient.post(`/user/${senderId}/text`, {
    sender: senderId,
    receiver,
    script
  });
};

/**
 * Deletes a message by ID.
 * @param {number|string} textId
 */
export const deleteTextMessage = async (textId) => {
  return await axiosClient.delete(`/text/${textId}`);
};
