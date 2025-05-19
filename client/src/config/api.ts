const API_BASE_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/user/login`,
    REGISTER: `${API_BASE_URL}/api/user/register`,
    PROFILE: (userId: string) => `${API_BASE_URL}/api/user/${userId}`,
    UPDATE_PROFILE: (userId: string) =>
      `${API_BASE_URL}/api/user/${userId}/profile`,
  },
  DUCKS: {
    BASE: `${API_BASE_URL}/api/ducks`,
    SINGLE_DUCK: (duckId: string) => `${API_BASE_URL}/api/ducks/${duckId}`,
    OPTIONS: `${API_BASE_URL}/api/ducks/options`,
    LIKED: `${API_BASE_URL}/api/ducks/liked`,
    CHECK_LIKES: `${API_BASE_URL}/api/ducks/check-likes`,
    LIKE: (duckId: string) => `${API_BASE_URL}/api/ducks/${duckId}/like`,
    UNLIKE: (duckId: string) => `${API_BASE_URL}/api/ducks/${duckId}/unlike`,
    BY_USER: (userId: string) =>
      `${API_BASE_URL}/api/ducks/?uploadedBy=${userId}`,
  },
  COMMENTS: {
    // Get comments for a duck or post a new comment
    DUCK_COMMENTS: (duckId: string) => `${API_BASE_URL}/api/comments/${duckId}`,
    // Update or delete a specific comment
    COMMENT: (commentId: string) => `${API_BASE_URL}/api/comments/${commentId}`,
    // Like/unlike a comment
    LIKE: (commentId: string) =>
      `${API_BASE_URL}/api/comments/${commentId}/like`,
    UNLIKE: (commentId: string) =>
      `${API_BASE_URL}/api/comments/${commentId}/unlike`,
  },
};
