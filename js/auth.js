/**
 * MAUSAM SETU — Authentication Service
 * Uses Express backend API with MySQL/MariaDB for production authentication.
 * Server runs on http://localhost:5000
 */

const AuthService = {

  // ── Backend API Configuration ─────────────────────────────
  API_BASE_URL: 'http://localhost:5000/api/auth',

  // ── Current user ──────────────────────────────────────────
  currentUser: null,

  // ── Initialize ────────────────────────────────────────────
  init() {
    const stored = Utils.retrieve(MS_CONFIG.STORAGE.USER);
    if (stored) this.currentUser = stored;
    return this.currentUser;
  },

  // ── Login ─────────────────────────────────────────────────
  async login(identifier, password) {
    try {
      const response = await fetch(`${this.API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
      });

      const result = await response.json();

      if (!result.success) {
        return { success: false, error: result.error || 'Login failed. Please try again.' };
      }

      // Store user session
      this.currentUser = result.user;
      Utils.store(MS_CONFIG.STORAGE.USER, result.user);
      return { success: true, user: result.user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error. Please check your connection and try again.' };
    }
  },

  // ── Register ──────────────────────────────────────────────
  async register(data) {
    try {
      // Map form data to API schema
      const payload = {
        full_name: data.name,
        mobile_number: data.mobile,
        email: data.email || null,
        password: data.password,
        role: data.role || 'citizen',
        state: data.state || '',
      };

      const response = await fetch(`${this.API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!result.success) {
        return { success: false, error: result.error || 'Registration failed. Please try again.' };
      }

      // Store user session
      this.currentUser = result.user;
      Utils.store(MS_CONFIG.STORAGE.USER, result.user);
      return { success: true, user: result.user };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: 'Network error. Please check your connection and try again.' };
    }
  },

  // ── Logout ────────────────────────────────────────────────
  logout() {
    this.currentUser = null;
    Utils.remove(MS_CONFIG.STORAGE.USER);
    Utils.remove(MS_CONFIG.STORAGE.LOCATION);
    window.location.href = MS_CONFIG.ROUTES.HOME;
  },

  // ── Guards ────────────────────────────────────────────────
  requireAuth() {
    if (!this.currentUser) {
      window.location.href = MS_CONFIG.ROUTES.LOGIN;
      return false;
    }
    return true;
  },

  requireAdmin() {
    if (!this.currentUser || this.currentUser.role !== 'admin') {
      Utils.showToast(LangManager.t('admin_unauthorized'), 'error');
      setTimeout(() => window.location.href = MS_CONFIG.ROUTES.DASHBOARD, 1500);
      return false;
    }
    return true;
  },

  isLoggedIn() { return !!this.currentUser; },
  isAdmin()    { return this.currentUser?.role === 'admin'; },

  getUserInitials() {
    if (!this.currentUser?.name) return 'U';
    return this.currentUser.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
  },
};

window.AuthService = AuthService;
