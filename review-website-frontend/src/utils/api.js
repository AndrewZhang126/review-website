const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

/**
 * Helper to extract backend error messages
 * @param {Response} res - Fetch response object
 * @param {string} fallback - Fallback error message
 * @returns {Promise<Error>}
 */
async function extractError(res, fallback) {
  try {
    const data = await res.json();
    return new Error(data.error || fallback);
  } catch {
    return new Error(fallback);
  }
}

/**
 * Fetch all restaurant reviews from backend.
 * @returns {Promise<Array>} List of reviews
 */
export const fetchReviewsAPI = async () => {
  const res = await fetch(`${API_BASE}/api/reviews`);
  if (!res.ok) {
    throw await extractError(res, "Failed to fetch reviews");
  }
  return await res.json();
};

/**
 * Delete a review by ID with authorization.
 * @param {number} id - The review ID to delete
 * @param {string} token - Bearer token for authentication
 * @returns {Promise<void>}
 */
export const deleteReviewAPI = async (id, token) => {
  const res = await fetch(`${API_BASE}/api/reviews/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw await extractError(res, "Failed to delete review");
  }
};

/**
 * Add a review by its data with authorization
 * @param {FormData} formData - The data for the review
 * @param {string} token - Bearer token for authentication
 * @returns {Promise<void>}
 */
export async function postReviewAPI(formData, token) {
  const res = await fetch(`${API_BASE}/api/reviews`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    throw await extractError(res, "Failed to submit review");
  }
}
