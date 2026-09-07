/**
 * MAUSAM SETU — Location Service
 */

const LocationService = {

  current: null,

  init() {
    this.current = Utils.retrieve(MS_CONFIG.STORAGE.LOCATION);
    return this.current;
  },

  async getGPS() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) { reject(new Error('GPS not supported')); return; }
      navigator.geolocation.getCurrentPosition(
        async pos => {
          const { latitude, longitude } = pos.coords;
          const geo = await WeatherService.reverseGeocode(latitude, longitude).catch(() => null);
          const location = {
            lat: latitude, lon: longitude,
            city: geo?.city || 'Unknown',
            district: geo?.district || '',
            state: geo?.state || '',
            display: geo?.display || `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`,
            method: 'gps',
          };
          this.current = location;
          Utils.store(MS_CONFIG.STORAGE.LOCATION, location);
          resolve(location);
        },
        err => reject(err),
        { timeout: 10000, maximumAge: 300000 }
      );
    });
  },

  setManual(city, district, state, lat, lon) {
    const location = {
      lat: lat || null, lon: lon || null,
      city, district, state,
      display: `${city}, ${district ? district + ', ' : ''}${state}`,
      method: 'manual',
    };
    this.current = location;
    Utils.store(MS_CONFIG.STORAGE.LOCATION, location);
    return location;
  },

  getDisplayString() {
    if (!this.current) return 'Location not set';
    const { city, district, state } = this.current;
    const parts = [city, district, state].filter(Boolean);
    return parts.slice(0, 2).join(', ');
  },

  clear() {
    this.current = null;
    Utils.remove(MS_CONFIG.STORAGE.LOCATION);
  },
};

window.LocationService = LocationService;

/**
 * MAUSAM SETU — Notification Service
 * Architecture for in-app, browser push, SMS, WhatsApp
 */

const NotificationService = {

  _browserPermission: 'default',

  async init() {
    if ('Notification' in window) {
      this._browserPermission = Notification.permission;
    }
  },

  async requestBrowserPermission() {
    if (!('Notification' in window)) return false;
    const result = await Notification.requestPermission();
    this._browserPermission = result;
    return result === 'granted';
  },

  showBrowserNotification(title, body, icon = '🌦️') {
    if (this._browserPermission !== 'granted') return;
    try {
      new Notification(`${icon} ${title}`, {
        body,
        icon: '/assets/icon-192.png',
        badge: '/assets/icon-72.png',
        tag: 'mausam-setu-alert',
      });
    } catch {}
  },

  // In-app notification (using Utils.showToast)
  showInApp(message, type = 'info') {
    Utils.showToast(message, type);
  },

  // SMS integration (placeholder — requires approved provider)
  async sendSMS(mobile, message) {
    console.info('[NotificationService] SMS architecture ready — provider integration needed.');
    return { success: false, note: 'SMS integration pending provider approval.' };
  },

  // WhatsApp integration (placeholder)
  async sendWhatsApp(mobile, message) {
    console.info('[NotificationService] WhatsApp architecture ready — provider integration needed.');
    return { success: false, note: 'WhatsApp integration pending provider approval.' };
  },

  // Alert notification router
  async notifyAlert(alert, channels = ['in-app', 'browser']) {
    const title = alert.title;
    const body = `${alert.area} — ${alert.action}`;
    if (channels.includes('in-app')) {
      const type = alert.severity === 'EMERGENCY' ? 'alert'
                 : alert.severity === 'WARNING' ? 'warning' : 'info';
      this.showInApp(`🚨 ${title}`, type);
    }
    if (channels.includes('browser')) {
      this.showBrowserNotification(title, body, MS_CONFIG.HAZARD[alert.hazard]?.icon || '⚠️');
    }
  },

  // ── Phone Notification for Email / Gmail Usage ─────────────────
  async sendEmailActivityPhoneNotification(email, websiteName = 'Mausam Setu', phoneNumber = '') {
    if (!email) return;

    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5000';
    const site = `${websiteName} (${origin})`;
    const phone = phoneNumber || (typeof AuthService !== 'undefined' && AuthService.getCurrentUser()?.mobile) || '9876543210';
    const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

    // 1. Play native audio chime
    this.playNotificationChime();

    // 2. Vibrate phone if supported
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate([150, 100, 150]); } catch {}
    }

    // 3. Trigger Real Browser / Device Notification
    try {
      if ('Notification' in window) {
        if (Notification.permission === 'default') {
          await Notification.requestPermission();
        }
        if (Notification.permission === 'granted') {
          new Notification('📱 Mausam Setu Security Alert', {
            body: `📧 Email Used: ${email}\n🌐 Website: ${site}\n📱 Phone: +91 ${phone}`,
            icon: 'assets/logo-transparent.png',
            badge: 'assets/logo-transparent.png',
            tag: 'email-activity-' + Date.now(),
          });
        }
      }
    } catch (e) {
      console.warn('Browser push notification exception:', e);
    }

    // 4. Render on-screen Phone Lockscreen Notification Card (Dynamic Island / Mobile Banner)
    this.renderPhoneNotificationCard({ email, website: site, phone, time: timeStr });

    // 5. Persist to local activity history
    try {
      const history = JSON.parse(localStorage.getItem('ms_email_notifications') || '[]');
      history.unshift({
        email,
        website: site,
        phone,
        timestamp: Date.now(),
        timeStr,
      });
      localStorage.setItem('ms_email_notifications', JSON.stringify(history.slice(0, 30)));
    } catch {}

    // 6. Report to Backend for Audit Log
    try {
      fetch('/api/auth/notify-email-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone, website: site }),
      }).catch(() => {});
    } catch {}
  },

  playNotificationChime() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {}
  },

  renderPhoneNotificationCard({ email, website, phone, time }) {
    if (typeof document === 'undefined') return;

    // Remove existing card if any
    const existing = document.getElementById('ms-phone-notification-card');
    if (existing) existing.remove();

    const card = document.createElement('div');
    card.id = 'ms-phone-notification-card';
    card.setAttribute('role', 'alert');
    card.setAttribute('aria-live', 'assertive');

    card.style.cssText = `
      position: fixed;
      top: 18px;
      left: 50%;
      transform: translateX(-50%) translateY(-100px);
      z-index: 999999;
      width: calc(100% - 28px);
      max-width: 440px;
      background: rgba(15, 23, 42, 0.96);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1.5px solid rgba(56, 189, 248, 0.45);
      border-radius: 20px;
      box-shadow: 0 20px 40px -8px rgba(0, 0, 0, 0.6), 0 0 25px rgba(56, 189, 248, 0.25);
      color: #F8FAFC;
      padding: 16px 18px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      opacity: 0;
    `;

    card.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:8px">
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:18px">📱</span>
          <span style="font-size:11.5px;font-weight:800;letter-spacing:0.06em;color:#38BDF8;text-transform:uppercase">PHONE NOTIFICATION</span>
          <span style="font-size:10.5px;color:#94A3B8;background:rgba(255,255,255,0.1);padding:2px 7px;border-radius:12px">${time}</span>
        </div>
        <button onclick="document.getElementById('ms-phone-notification-card')?.remove()" style="background:none;border:none;color:#94A3B8;cursor:pointer;font-size:16px;line-height:1;padding:2px 6px">✕</button>
      </div>

      <div style="font-size:14px;font-weight:700;color:#FFFFFF;margin-bottom:6px;display:flex;align-items:center;gap:6px">
        <span>🔔</span> Account Security & Email Verification
      </div>

      <div style="display:flex;flex-direction:column;gap:5px;font-size:12.5px;color:#CBD5E1;background:rgba(0,0,0,0.25);padding:10px 12px;border-radius:12px;border:1px solid rgba(255,255,255,0.06)">
        <div style="display:flex;align-items:center;gap:6px">
          <span style="color:#94A3B8;width:95px;flex-shrink:0">📧 Email Used:</span>
          <strong style="color:#38BDF8;word-break:break-all">${email}</strong>
        </div>
        <div style="display:flex;align-items:center;gap:6px">
          <span style="color:#94A3B8;width:95px;flex-shrink:0">🌐 Website:</span>
          <strong style="color:#34D399">${website}</strong>
        </div>
        <div style="display:flex;align-items:center;gap:6px">
          <span style="color:#94A3B8;width:95px;flex-shrink:0">📲 User Phone:</span>
          <strong style="color:#FBBF24">+91 ${phone}</strong>
        </div>
      </div>

      <div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px;font-size:11px;color:#94A3B8">
        <span>⚡ Delivered directly from website client</span>
        <span style="color:#38BDF8;font-weight:700">Verified ✓</span>
      </div>
    `;

    document.body.appendChild(card);

    // Slide-down animation
    requestAnimationFrame(() => {
      card.style.transform = 'translateX(-50%) translateY(0)';
      card.style.opacity = '1';
    });

    // Auto-remove after 9 seconds
    setTimeout(() => {
      if (card.parentNode) {
        card.style.transform = 'translateX(-50%) translateY(-100px)';
        card.style.opacity = '0';
        setTimeout(() => card.remove(), 400);
      }
    }, 9000);
  },
};

window.NotificationService = NotificationService;

/**
 * MAUSAM SETU — Pages CSS (page-specific)
 * Injected via JS for all pages needing it
 */
