/**
 * MAUSAM SETU — Utility Functions
 */

const Utils = {

  // ── Date / Time ────────────────────────────────────────────
  formatTime(date = new Date()) {
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  },

  formatDate(date = new Date()) {
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  },

  formatDateShort(date = new Date()) {
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  },

  formatDay(date = new Date()) {
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const daysHi = ['रविवार','सोमवार','मंगलवार','बुधवार','गुरुवार','शुक्रवार','शनिवार'];
    const lang = LangManager?.current || 'en';
    return lang === 'hi' ? daysHi[date.getDay()] : days[date.getDay()];
  },

  formatDayShort(date = new Date()) {
    return date.toLocaleDateString('en-IN', { weekday: 'short' });
  },

  timeAgo(timestamp) {
    const diff = (Date.now() - timestamp) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  },

  // ── Weather Icons (Emoji-based, accessible) ────────────────
  getWeatherIcon(condition, isDay = true) {
    const c = (condition || '').toLowerCase();
    if (c.includes('thunder'))  return '⛈️';
    if (c.includes('drizzle'))  return '🌦️';
    if (c.includes('heavy rain') || c.includes('torrential')) return '🌧️';
    if (c.includes('rain'))     return isDay ? '🌦️' : '🌧️';
    if (c.includes('snow'))     return '❄️';
    if (c.includes('sleet'))    return '🌨️';
    if (c.includes('hail'))     return '🌩️';
    if (c.includes('fog') || c.includes('mist')) return '🌫️';
    if (c.includes('haze') || c.includes('dust')) return '🌁';
    if (c.includes('smoke'))    return '🔥';
    if (c.includes('cloud'))    return isDay ? '⛅' : '☁️';
    if (c.includes('overcast')) return '☁️';
    if (c.includes('clear') || c.includes('sunny')) return isDay ? '☀️' : '🌕';
    if (c.includes('hot'))      return '🌡️';
    if (c.includes('wind'))     return '💨';
    return isDay ? '🌤️' : '🌙';
  },

  getWeatherIconSVG(condition, isDay = true) {
    // Returns the emoji as a styled span
    const icon = this.getWeatherIcon(condition, isDay);
    return `<span class="weather-emoji" role="img" aria-label="${condition}">${icon}</span>`;
  },

  // ── Wind ───────────────────────────────────────────────────
  windDirection(degrees) {
    const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
    return dirs[Math.round(degrees / 22.5) % 16];
  },

  windBeaufort(kmh) {
    if (kmh < 2)   return { scale: 0, desc: 'Calm' };
    if (kmh < 12)  return { scale: 1, desc: 'Light Air' };
    if (kmh < 20)  return { scale: 2, desc: 'Light Breeze' };
    if (kmh < 29)  return { scale: 3, desc: 'Gentle Breeze' };
    if (kmh < 39)  return { scale: 4, desc: 'Moderate Breeze' };
    if (kmh < 50)  return { scale: 5, desc: 'Fresh Breeze' };
    if (kmh < 62)  return { scale: 6, desc: 'Strong Breeze' };
    if (kmh < 75)  return { scale: 7, desc: 'Near Gale' };
    if (kmh < 89)  return { scale: 8, desc: 'Gale' };
    if (kmh < 103) return { scale: 9, desc: 'Strong Gale' };
    if (kmh < 117) return { scale: 10, desc: 'Storm' };
    if (kmh < 134) return { scale: 11, desc: 'Violent Storm' };
    return { scale: 12, desc: 'Hurricane' };
  },

  // ── UV Index ───────────────────────────────────────────────
  uvLabel(index) {
    if (index <= 2)  return { label: 'Low',       color: '#2E7D32' };
    if (index <= 5)  return { label: 'Moderate',  color: '#F9A825' };
    if (index <= 7)  return { label: 'High',       color: '#E65100' };
    if (index <= 10) return { label: 'Very High',  color: '#C62828' };
    return              { label: 'Extreme',     color: '#6A1B9A' };
  },

  // ── Temperature ────────────────────────────────────────────
  tempColor(celsius) {
    if (celsius <= 5)   return '#1565C0'; // Cold - blue
    if (celsius <= 15)  return '#0288D1'; // Cool
    if (celsius <= 25)  return '#388E3C'; // Comfortable - green
    if (celsius <= 35)  return '#F57F17'; // Warm - amber
    if (celsius <= 40)  return '#E65100'; // Hot - orange
    return '#B71C1C';                      // Very hot - red
  },

  // ── Rain Probability ───────────────────────────────────────
  rainLabel(percent) {
    if (percent < 20)  return { label: 'Very Low',  color: '#2E7D32' };
    if (percent < 40)  return { label: 'Low',        color: '#388E3C' };
    if (percent < 60)  return { label: 'Moderate',   color: '#F9A825' };
    if (percent < 80)  return { label: 'High',        color: '#E65100' };
    return { label: 'Very High', color: '#B71C1C' };
  },

  // ── DOM Helpers ────────────────────────────────────────────
  el(id) { return document.getElementById(id); },
  qs(sel) { return document.querySelector(sel); },
  qsa(sel) { return [...document.querySelectorAll(sel)]; },

  show(el) {
    const e = typeof el === 'string' ? this.el(el) : el;
    if (e) e.classList.remove('hidden');
  },
  hide(el) {
    const e = typeof el === 'string' ? this.el(el) : el;
    if (e) e.classList.add('hidden');
  },
  toggle(el, condition) {
    const e = typeof el === 'string' ? this.el(el) : el;
    if (e) e.classList.toggle('hidden', !condition);
  },

  setText(id, text) {
    const e = this.el(id);
    if (e) e.textContent = text;
  },

  setHTML(id, html) {
    const e = this.el(id);
    if (e) e.innerHTML = html;
  },

  // ── Toast Notifications ────────────────────────────────────
  showToast(message, type = 'info', duration = 4000) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.style.cssText = `
        position: fixed; bottom: 24px; right: 24px;
        z-index: 9999; display: flex; flex-direction: column; gap: 8px;
        max-width: 360px;
      `;
      document.body.appendChild(container);
    }

    const colors = {
      info:    { bg: '#1565C0', icon: 'ℹ️' },
      success: { bg: '#2E7D32', icon: '✅' },
      warning: { bg: '#E65100', icon: '⚠️' },
      error:   { bg: '#B71C1C', icon: '❌' },
      alert:   { bg: '#880E4F', icon: '🚨' },
    };
    const c = colors[type] || colors.info;

    const toast = document.createElement('div');
    toast.style.cssText = `
      background: ${c.bg}; color: white; padding: 12px 16px;
      border-radius: 8px; font-size: 14px; font-weight: 500;
      display: flex; align-items: flex-start; gap: 10px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      animation: fadeIn 0.3s ease;
      cursor: pointer; max-width: 100%;
    `;
    toast.innerHTML = `<span style="font-size:16px">${c.icon}</span><span>${message}</span>`;
    toast.onclick = () => toast.remove();

    container.appendChild(toast);
    setTimeout(() => toast.remove(), duration);
  },

  // ── Modal ──────────────────────────────────────────────────
  showModal(id) {
    const m = document.getElementById(id);
    if (m) { m.classList.add('modal-open'); m.removeAttribute('hidden'); }
  },
  hideModal(id) {
    const m = document.getElementById(id);
    if (m) { m.classList.remove('modal-open'); m.setAttribute('hidden', ''); }
  },

  // ── Number Formatting ──────────────────────────────────────
  formatNumber(n, decimals = 0) {
    return Number(n).toFixed(decimals);
  },

  // ── Safe JSON ──────────────────────────────────────────────
  safeJSON(str, fallback = null) {
    try { return JSON.parse(str); } catch { return fallback; }
  },

  // ── Local Storage Helpers ─────────────────────────────────
  store(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  },
  retrieve(key, fallback = null) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
  },
  remove(key) {
    try { localStorage.removeItem(key); } catch {}
  },

  // ── Debounce ───────────────────────────────────────────────
  debounce(fn, ms = 300) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  },

  // ── Demo Badge (Cleaned) ───────────────────────────────────
  demoBadge() {
    return '';
  },

  demoSimBadge() {
    return '';
  },

  // ── Is Day ─────────────────────────────────────────────────
  isDay(sunrise, sunset) {
    const now = Date.now() / 1000;
    return now >= sunrise && now <= sunset;
  },

  // ── Clipboard ─────────────────────────────────────────────
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      this.showToast('Copied to clipboard', 'success', 2000);
    } catch {
      this.showToast('Unable to copy', 'error', 2000);
    }
  },

  // ── Aqi Label ─────────────────────────────────────────────
  aqiLabel(aqi) {
    const labels = ['', 'Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
    return labels[aqi] || 'Unknown';
  },

  // ── Universal Responsive Mobile Menu ───────────────────────
  initMobileNav() {
    const hamburger = document.getElementById('hamburger-btn');
    if (!hamburger || hamburger._mobileNavInit) return;
    hamburger._mobileNavInit = true;

    let mobileMenu = document.getElementById('mobile-menu');
    if (!mobileMenu) {
      mobileMenu = document.createElement('div');
      mobileMenu.id = 'mobile-menu';
      mobileMenu.className = 'nav-mobile-menu';
      mobileMenu.setAttribute('role', 'navigation');
      mobileMenu.setAttribute('aria-label', 'Mobile navigation');

      const user = (typeof AuthService !== 'undefined') ? AuthService.getCurrentUser() : null;

      mobileMenu.innerHTML = `
        <a href="dashboard.html" class="nav-link">📊 Dashboard</a>
        <a href="forecast.html" class="nav-link">📅 Forecast</a>
        <a href="alerts.html" class="nav-link">⚠️ Alerts</a>
        <a href="chat.html" class="nav-link">🤖 WeatherGPT</a>
        <a href="map.html" class="nav-link">🗺️ Map</a>
        <a href="farmer.html" class="nav-link">🌾 Farmer Mode</a>
        <a href="fisherman.html" class="nav-link">⚓ Fisherman Mode</a>
        <a href="emergency.html" class="nav-link">🚨 Emergency</a>
        <div style="height:1px;background:rgba(255,255,255,0.1);margin:6px 0"></div>
        ${user ? `
          <a href="profile.html" class="nav-link">👤 ${user.name} (Settings)</a>
          ${user.role === 'admin' ? '<a href="admin.html" class="nav-link">🛡️ Admin Panel</a>' : ''}
          <button onclick="AuthService.logout()" class="btn btn-outline btn-full btn-sm" style="color:#FFCDD2;border-color:rgba(239,83,80,0.4);margin-top:6px">🚪 Logout</button>
        ` : `
          <a href="login.html" class="btn btn-primary btn-full btn-sm" style="margin-top:4px">Get Started</a>
        `}
      `;
      const nav = document.querySelector('.navbar');
      if (nav && nav.parentNode) {
        nav.parentNode.insertBefore(mobileMenu, nav.nextSibling);
      } else {
        document.body.appendChild(mobileMenu);
      }
    }

    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      hamburger.textContent = isOpen ? '✕' : '☰';
    });

    document.addEventListener('click', (e) => {
      if (mobileMenu.classList.contains('open') && !hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.textContent = '☰';
      }
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.textContent = '☰';
      });
    });
  },

  // ── Backend API Endpoint Resolver ─────────────────────────
  getApiUrl(endpoint) {
    if (!endpoint) return '';
    const clean = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
    if (typeof window !== 'undefined') {
      if (window.location.protocol === 'file:' || (window.location.port && window.location.port !== '5000')) {
        return `http://localhost:5000${clean}`;
      }
    }
    return clean;
  }
};

// Automatically bind mobile navigation on load
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Utils.initMobileNav());
  } else {
    Utils.initMobileNav();
  }
}

window.Utils = Utils;
