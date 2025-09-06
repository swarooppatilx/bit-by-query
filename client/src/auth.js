import apiClient from '../apiClient';

export const checkAuthStatus = async () => {
  try {
    const res = await apiClient.post('/api/status');
    if (res.status === 201) {
      return { loggedIn: true, user: res.data.user || null }; 
    }
  } catch (err) {
    return { loggedIn: false, user: null };
  }
};
