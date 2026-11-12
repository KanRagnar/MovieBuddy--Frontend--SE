/**
 * Validates review form input according to User Story S-3 (rate 1-10, max 80 chars).
 * @param {string} comment
 * @param {number|string} rate
 * @returns {string|null} Error message or null if valid.
 */
export const validateReview = (comment, rate) => {
  if (!comment || comment.trim().length === 0) {
    return 'Please write a short review comment.';
  }
  if (comment.trim().length > 80) {
    return 'Review comment must be 80 characters or fewer.';
  }
  const numRate = Number(rate);
  if (Number.isNaN(numRate) || numRate < 1 || numRate > 10) {
    return 'Rating must be between 1 and 10.';
  }
  return null;
};

/**
 * Validates profile update fields.
 * @param {Object} profile
 * @returns {string|null} Error message or null if valid.
 */
export const validateProfile = (profile) => {
  if (!profile.name || profile.name.trim().length < 2) {
    return 'Name must be at least 2 characters long.';
  }
  const age = Number(profile.age);
  if (Number.isNaN(age) || age < 18 || age > 120) {
    return 'Age must be between 18 and 120.';
  }
  return null;
};
