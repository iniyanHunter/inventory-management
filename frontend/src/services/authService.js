// Authentication Service for React Frontend
const API_BASE_URL = 'http://localhost:8080';

class AuthService {
  // Login user and store JWT token
  async login(username, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      
      // Store JWT token in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        username: data.username,
        email: data.email,
        name: data.name,
        role: data.role
      }));

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Register new user
  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Registration failed');
      }

      return await response.text();
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Logout user
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Get current user from localStorage
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Get JWT token
  getToken() {
    return localStorage.getItem('token');
  }

  // Check if user is logged in
  isLoggedIn() {
    const token = this.getToken();
    if (!token) return false;

    // Check if token is expired (optional)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  // Make authenticated API calls
  async apiCall(url, options = {}) {
    const token = this.getToken();
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    // Add Authorization header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${url}`, config);
      
      // If unauthorized, logout user
      if (response.status === 401) {
        this.logout();
        window.location.reload();
        return;
      }

      return response;
    } catch (error) {
      console.error('API call error:', error);
      throw error;
    }
  }

  // Helper function to get authenticated fetch headers
  getAuthHeaders() {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  // Helper function for authenticated fetch calls (for existing code)
  async authenticatedFetch(url, options = {}) {
    const headers = this.getAuthHeaders();
    
    const config = {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    };

    const response = await fetch(url, config);
    
    // If unauthorized, logout user
    if (response.status === 401) {
      this.logout();
      window.location.reload();
      return;
    }

    return response;
  }
}

export default new AuthService(); 