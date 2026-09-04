/**
 * MAUSAM SETU — Authentication Service
 * Uses localStorage for SIH demo. Production would use server auth.
 */

const AuthService = {

  // ── Demo accounts ─────────────────────────────────────────
  DEMO_USERS: [
    { id: 'U001', name: 'Arjun Singh', mobile: '9876543210', email: 'user@demo.com',    password: 'demo123', role: 'citizen',  state: 'Delhi' },
    { id: 'U002', name: 'Priya Patel', mobile: '9123456789', email: 'farmer@demo.com',  password: 'demo123', role: 'farmer',   state: 'Gujarat' },
    { id: 'U003', name: 'Rajan Kumar', mobile: '9012345678', email: 'fish@demo.com',    password: 'demo123', role: 'fisherman', state: 'Tamil Nadu' },
    { id: 'ADM1', name: 'Admin User',  mobile: '9000000000', email: 'admin@mausam.gov', password: 'admin@sih2026', role: 'admin', state: 'Delhi' },
  ],

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
    await this._delay(500); // Simulate network

    const user = this.DEMO_USERS.find(u =>
      (u.mobile === identifier || u.email === identifier.toLowerCase()) &&
      u.password === password
    );

    if (!user) {
      return { success: false, error: 'Invalid mobile/email or password. Try: user@demo.com / demo123' };
    }

    const session = {
      id: user.id,
      name: user.name,
      mobile: user.mobile,
      email: user.email,
      role: user.role,
      state: user.state,
      loginAt: Date.now(),
    };

    this.currentUser = session;
    Utils.store(MS_CONFIG.STORAGE.USER, session);
    return { success: true, user: session };
  },

  // ── Register ──────────────────────────────────────────────
  async register(data) {
    await this._delay(600);

    // Basic validation
    if (!data.name || data.name.trim().length < 2) return { success: false, error: 'Please enter a valid name.' };
    if (!data.mobile || !/^[6-9]\d{9}$/.test(data.mobile)) return { success: false, error: 'Please enter a valid 10-digit Indian mobile number.' };
    if (!data.password || data.password.length < 6) return { success: false, error: 'Password must be at least 6 characters.' };

    const session = {
      id: 'U' + Date.now(),
      name: data.name.trim(),
      mobile: data.mobile,
      email: data.email || '',
      role: data.role || 'citizen',
      state: data.state || '',
      loginAt: Date.now(),
    };

    this.currentUser = session;
    Utils.store(MS_CONFIG.STORAGE.USER, session);
    return { success: true, user: session };
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

  _delay(ms) { return new Promise(r => setTimeout(r, ms)); },
};

window.AuthService = AuthService;
