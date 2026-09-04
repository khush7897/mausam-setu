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
};

window.NotificationService = NotificationService;

/**
 * MAUSAM SETU — Pages CSS (page-specific)
 * Injected via JS for all pages needing it
 */
