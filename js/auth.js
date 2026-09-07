/**
 * MAUSAM SETU — Authentication Service
 * Communicates with Node.js Express & MySQL/SQLite backend API.
 * Features automatic offline/demo fallback and session caching.
 */

const AuthService = {

  // ── Offline Demo Accounts (Graceful fallback if backend server is unreachable) ──
  DEMO_USERS: [
    { id: 'U001', name: 'Arjun Singh', mobile: '9876543210', email: 'user@demo.com',   password: 'demo123', role: 'citizen',   state: 'Delhi' },
    { id: 'U002', name: 'Priya Patel', mobile: '9123456789', email: 'farmer@demo.com', password: 'demo123', role: 'farmer',    state: 'Gujarat' },
    { id: 'U003', name: 'Rajan Kumar', mobile: '9012345678', email: 'fish@demo.com',   password: 'demo123', role: 'fisherman', state: 'Tamil Nadu' },
    { id: 'ADM1', name: 'Admin User',  mobile: '9000000000', email: 'admin@mausam.gov', password: 'admin123', role: 'admin',  state: 'Delhi' },
  ],

  // ── Current user session ──────────────────────────────────
  currentUser: null,

  // ── Backend API Endpoint Resolver ─────────────────────────
  getApiUrl(endpoint) {
    if (window.location.protocol === 'file:') {
      return `http://localhost:5000/api/auth${endpoint}`;
    }
    if (window.location.port && window.location.port !== '5000') {
      return `http://localhost:5000/api/auth${endpoint}`;
    }
    return `/api/auth${endpoint}`;
  },

  SESSION_VERSION: 'v2_clean_reset',

  // ── Initialize ────────────────────────────────────────────
  init() {
    // Purge stale test sessions so app begins completely fresh
    if (typeof localStorage !== 'undefined') {
      try {
        const savedVersion = localStorage.getItem('ms_session_v');
        if (savedVersion !== this.SESSION_VERSION) {
          localStorage.removeItem(MS_CONFIG.STORAGE.USER);
          localStorage.removeItem('ms_user_email');
          localStorage.removeItem('ms_user_mobile');
          localStorage.removeItem('ms_email_notifications');
          localStorage.setItem('ms_session_v', this.SESSION_VERSION);
          this.currentUser = null;
        }
      } catch (e) {}
    }

    const stored = Utils.retrieve(MS_CONFIG.STORAGE.USER);
    if (stored) this.currentUser = stored;
    try { this.updateNav(); } catch {}
    return this.currentUser;
  },

  getCurrentUser() {
    if (!this.currentUser) {
      this.currentUser = Utils.retrieve(MS_CONFIG.STORAGE.USER);
    }
    return this.currentUser;
  },

  _saveUser(user) {
    this.currentUser = user;
    Utils.store(MS_CONFIG.STORAGE.USER, user);
  },

  // ── Login ─────────────────────────────────────────────────
  async login(identifier, password) {
    try {
      const response = await fetch(this.getApiUrl('/login'), {
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
      this._saveUser(result.user);
      return { success: true, user: result.user };
    } catch (networkError) {
      console.warn('Backend API unreachable, checking offline demo accounts:', networkError);

      // Offline fallback: check demo users
      const match = this.DEMO_USERS.find(u =>
        (u.mobile === identifier || (u.email && u.email.toLowerCase() === identifier.toLowerCase())) &&
        u.password === password
      );

      if (match) {
        const session = {
          id: match.id,
          name: match.name,
          mobile: match.mobile,
          email: match.email || '',
          role: match.role,
          state: match.state,
          loginAt: Date.now(),
          offlineMode: true,
        };
        this._saveUser(session);
        return { success: true, user: session };
      }

      return {
        success: false,
        error: 'Unable to connect to server. Please ensure backend is running (npm start) or use demo credentials (user@demo.com / demo123).',
      };
    }
  },

  // ── Register ──────────────────────────────────────────────
  async register(data) {
    try {
      const payload = {
        full_name: data.name,
        mobile_number: data.mobile,
        email: data.email || null,
        password: data.password,
        role: data.role || 'citizen',
        state: data.state || '',
      };

      const response = await fetch(this.getApiUrl('/register'), {
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
      this._saveUser(result.user);
      return { success: true, user: result.user };
    } catch (networkError) {
      console.warn('Backend API unreachable during registration:', networkError);

      // Offline fallback: create local session
      const session = {
        id: 'U' + Date.now(),
        name: data.name ? data.name.trim() : 'User',
        mobile: data.mobile,
        email: data.email || '',
        role: data.role || 'citizen',
        state: data.state || '',
        loginAt: Date.now(),
        offlineMode: true,
      };

      this._saveUser(session);
      return { success: true, user: session };
    }
  },

  // ── Logout ────────────────────────────────────────────────
  logout() {
    this.currentUser = null;
    Utils.remove(MS_CONFIG.STORAGE.USER);
    Utils.remove(MS_CONFIG.STORAGE.LOCATION);
    Utils.remove('ms_user_email');
    Utils.remove('ms_user_mobile');
    try { sessionStorage.clear(); } catch {}
    
    // Clear cookies if any
    try {
      document.cookie.split(";").forEach(c => { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
    } catch {}

    // Show feedback toast and redirect to login page
    if (typeof Utils !== 'undefined' && Utils.showToast) {
      Utils.showToast('You have been logged out successfully.', 'info');
    }
    setTimeout(() => {
      window.location.href = MS_CONFIG.ROUTES.LOGIN;
    }, 350);
  },

  // ── Navbar State Synchronizer ─────────────────────────────
  updateNav() {
    if (typeof document === 'undefined') return;
    const user = this.getCurrentUser();
    const userMenu = document.querySelector('.user-menu');
    const nameEl = document.getElementById('user-name-nav');
    const avatarEl = document.getElementById('user-avatar-initials');
    const adminLink = document.getElementById('admin-link');
    const navActions = document.querySelector('.nav-actions');

    if (user && user.name) {
      if (nameEl) nameEl.textContent = user.name.split(' ')[0];
      if (avatarEl) avatarEl.textContent = this.getUserInitials();
      if (adminLink) adminLink.style.display = this.isAdmin() ? 'flex' : 'none';
      if (userMenu) userMenu.style.display = 'inline-flex';
      const signinBtn = document.getElementById('nav-signin-btn');
      if (signinBtn) signinBtn.remove();
    } else {
      // User is logged out
      if (userMenu) userMenu.style.display = 'none';
      if (navActions && !document.getElementById('nav-signin-btn')) {
        const signinBtn = document.createElement('a');
        signinBtn.id = 'nav-signin-btn';
        signinBtn.href = MS_CONFIG.ROUTES.LOGIN;
        signinBtn.className = 'btn btn-primary btn-sm';
        signinBtn.style.cssText = 'padding:6px 16px;font-size:13px;font-weight:700;border-radius:20px;text-decoration:none;display:inline-flex;align-items:center;gap:6px';
        signinBtn.innerHTML = '<span>🔑</span> <span>Sign In</span>';
        navActions.appendChild(signinBtn);
      }
    }
  },

  // ── Guards ────────────────────────────────────────────────
  requireAuth() {
    if (!this.currentUser && !this.getCurrentUser()) {
      window.location.href = MS_CONFIG.ROUTES.LOGIN;
      return false;
    }
    return true;
  },

  requireAdmin() {
    const user = this.getCurrentUser();
    if (!user || user.role !== 'admin') {
      Utils.showToast(LangManager?.t('admin_unauthorized') || 'Admin access required. Please sign in.', 'error');
      setTimeout(() => window.location.href = MS_CONFIG.ROUTES.LOGIN, 1200);
      return false;
    }
    return true;
  },

  isLoggedIn() { return !!this.getCurrentUser(); },
  isAdmin()    { return this.getCurrentUser()?.role === 'admin'; },

  getUserInitials() {
    const user = this.getCurrentUser();
    if (!user?.name) return 'U';
    return user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  },
};

// Auto-sync nav on init
const origInit = AuthService.init.bind(AuthService);
AuthService.init = function() {
  const u = origInit();
  try { this.updateNav(); } catch {}
  return u;
};

window.AuthService = AuthService;
