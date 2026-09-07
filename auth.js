/* KrishiDrishti Authentication & Token Handler */

const Auth = {
  TOKEN_KEY: 'krishi_jwt_token',
  USER_KEY: 'krishi_user_info',

  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  },

  getUser() {
    const raw = localStorage.getItem(this.USER_KEY);
    try {
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },

  saveAuth(token, user) {
    if (token) localStorage.setItem(this.TOKEN_KEY, token);
    if (user) localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  },

  clearAuth() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  logout() {
    this.clearAuth();
    if (typeof showToast === 'function') {
      showToast('Logged out successfully', 'info');
    }
    setTimeout(() => {
      window.location.href = '/login.html';
    }, 400);
  },

  requireAuth() {
    if (!this.isAuthenticated()) {
      window.location.href = '/login.html';
    }
  },

  getAuthHeaders() {
    const token = this.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
};

window.Auth = Auth;
