/**
 * MAUSAM SETU — Alert Service
 * GPS-based alert matching, deduplication, severity hierarchy
 * All demo alerts are clearly labeled SIMULATION
 */

const AlertService = {

  // ── Demo Alert Database ────────────────────────────────────
  DEMO_ALERTS: [
    {
      id: 'ALERT-2026-001',
      hazard: 'CYCLONE',
      severity: 'WARNING',
      title: 'Cyclone Watch — Bay of Bengal',
      titleHi: 'चक्रवात चेतावनी — बंगाल की खाड़ी',
      area: 'Coastal Odisha, West Bengal, Andhra Pradesh',
      statesAffected: ['Odisha', 'West Bengal', 'Andhra Pradesh'],
      description: 'A deep depression in the Bay of Bengal has intensified into a cyclonic storm. Coastal districts are at risk of very heavy rainfall, strong winds (60–90 kmph), and rough sea conditions.',
      descriptionHi: 'बंगाल की खाड़ी में एक गहरे अवदाब ने चक्रवाती तूफान का रूप ले लिया है। तटीय जिलों में अत्यधिक भारी वर्षा, तेज हवाएं (60-90 किमी/घंटा) और समुद्र में ऊंची लहरें उठने की संभावना है।',
      action: 'Fishermen are advised NOT to venture into the sea. Coastal residents should follow evacuation instructions from local authorities.',
      actionHi: 'मछुआरों को समुद्र में न जाने की सलाह दी जाती है। तटीय निवासी स्थानीय अधिकारियों के निर्देशों का पालन करें।',
      source: 'India Meteorological Department (IMD)',
      issued: new Date(Date.now() - 3 * 3600000).toISOString(),
      expires: new Date(Date.now() + 48 * 3600000).toISOString(),
      isDemo: true,
      lat: 20.0, lon: 86.0, radius_km: 500,
    },
    {
      id: 'ALERT-2026-002',
      hazard: 'HEAVY_RAIN',
      severity: 'ADVISORY',
      title: 'Heavy Rainfall Advisory — Mumbai Metropolitan Region',
      titleHi: 'भारी वर्षा परामर्श — मुंबई महानगर क्षेत्र',
      area: 'Mumbai, Thane, Raigad, Palghar',
      statesAffected: ['Maharashtra'],
      description: 'Heavy to very heavy rainfall (115–204 mm) is expected over next 24 hours. Low-lying areas may experience waterlogging.',
      descriptionHi: 'अगले 24 घंटों में भारी से बहुत भारी वर्षा (115-204 मिमी) की संभावना है। निचले इलाकों में जलभराव हो सकता है।',
      action: 'Avoid unnecessary travel. Stay away from low-lying areas. Keep emergency contacts ready.',
      actionHi: 'अनावश्यक यात्रा से बचें। निचले इलाकों से दूर रहें। आपातकालीन संपर्क तैयार रखें।',
      source: 'IMD Mumbai',
      issued: new Date(Date.now() - 1 * 3600000).toISOString(),
      expires: new Date(Date.now() + 24 * 3600000).toISOString(),
      isDemo: true,
      lat: 19.0760, lon: 72.8777, radius_km: 80,
    },
    {
      id: 'ALERT-2026-003',
      hazard: 'HEATWAVE',
      severity: 'WARNING',
      title: 'Severe Heatwave Warning — Rajasthan',
      titleHi: 'गंभीर लू चेतावनी — राजस्थान',
      area: 'Jaipur, Barmer, Jodhpur, Bikaner, Churu',
      statesAffected: ['Rajasthan'],
      description: 'Maximum temperature likely to remain above 44°C for next 3 days. Heat stroke risk is high. Vulnerable populations including elderly, children, and outdoor workers are at greatest risk.',
      descriptionHi: 'अगले 3 दिनों तक अधिकतम तापमान 44°C से अधिक रहने की संभावना है। लू लगने का खतरा अधिक है।',
      action: 'Stay indoors between 12 PM – 4 PM. Drink water regularly. Wear light clothing. Seek immediate medical help if you feel dizzy or faint.',
      actionHi: 'दोपहर 12-4 बजे घर के अंदर रहें। नियमित रूप से पानी पिएं। हल्के कपड़े पहनें।',
      source: 'IMD Jaipur',
      issued: new Date(Date.now() - 6 * 3600000).toISOString(),
      expires: new Date(Date.now() + 72 * 3600000).toISOString(),
      isDemo: true,
      lat: 26.9124, lon: 75.7873, radius_km: 200,
    },
    {
      id: 'ALERT-2026-004',
      hazard: 'LIGHTNING',
      severity: 'WATCH',
      title: 'Lightning Watch — Eastern UP & Bihar',
      titleHi: 'बिजली सतर्कता — पूर्वी UP और बिहार',
      area: 'Varanasi, Patna, Gaya, Muzaffarpur',
      statesAffected: ['Uttar Pradesh', 'Bihar'],
      description: 'Thunderstorms with lightning activity expected during afternoon/evening hours. Pre-monsoon convective activity is responsible.',
      descriptionHi: 'दोपहर/शाम के घंटों के दौरान बिजली के साथ तूफान की संभावना है।',
      action: 'Move indoors when thunder is heard. Avoid open fields, tall trees, and water bodies.',
      actionHi: 'बिजली कड़कने पर घर के अंदर जाएं। खुले मैदानों, ऊंचे पेड़ों और जल निकायों से बचें।',
      source: 'IMD Patna',
      issued: new Date(Date.now() - 2 * 3600000).toISOString(),
      expires: new Date(Date.now() + 12 * 3600000).toISOString(),
      isDemo: true,
      lat: 25.5941, lon: 85.1376, radius_km: 150,
    },
    {
      id: 'ALERT-2026-005',
      hazard: 'FLOOD',
      severity: 'EMERGENCY',
      title: '🚨 FLASH FLOOD EMERGENCY — Assam River Plains',
      titleHi: '🚨 अचानक बाढ़ आपातकाल — असम नदी मैदान',
      area: 'Dibrugarh, Lakhimpur, Dhemaji, Jorhat',
      statesAffected: ['Assam'],
      description: 'Extreme rainfall upstream has caused Brahmaputra tributaries to overflow. Flash flooding is occurring in multiple districts. Evacuation orders are in effect.',
      descriptionHi: 'ऊपरी इलाकों में अत्यधिक वर्षा के कारण ब्रह्मपुत्र की सहायक नदियां उफान पर हैं। कई जिलों में बाढ़ आ रही है।',
      action: '🚨 EVACUATE IMMEDIATELY if in low-lying areas. Call 1078 (NDMA) or 1070 (Flood Control). Do NOT attempt to cross flooded roads.',
      actionHi: '🚨 निचले इलाकों में हैं तो तुरंत निकलें। 1078 (NDMA) या 1070 (बाढ़ नियंत्रण) पर कॉल करें।',
      source: 'Assam SDMA & IMD Guwahati',
      issued: new Date(Date.now() - 30 * 60000).toISOString(),
      expires: new Date(Date.now() + 36 * 3600000).toISOString(),
      isDemo: true,
      lat: 27.4728, lon: 94.9120, radius_km: 180,
    },
  ],

  // ── Deduplication Storage ─────────────────────────────────
  _seenAlerts: new Set(),

  // ── Initialize ────────────────────────────────────────────
  init() {
    const seen = Utils.retrieve(MS_CONFIG.STORAGE.ALERTS, []);
    seen.forEach(id => this._seenAlerts.add(id));
  },

  // ── Get All Alerts ────────────────────────────────────────
  async getAllAlerts() {
    if (MS_CONFIG.DEMO_MODE) {
      await this._delay(400);
      return this.DEMO_ALERTS.filter(a => !this._isExpired(a));
    }
    return []; // Real API integration point
  },

  // ── Get Alerts for Location ────────────────────────────────
  async getAlertsForLocation(lat, lon, state) {
    const all = await this.getAllAlerts();
    return all.filter(alert => {
      // State match
      if (state && alert.statesAffected.some(s =>
        s.toLowerCase().includes(state.toLowerCase()) ||
        state.toLowerCase().includes(s.toLowerCase())
      )) return true;
      // Distance match
      if (lat && lon && alert.lat && alert.lon && alert.radius_km) {
        const dist = this._haversine(lat, lon, alert.lat, alert.lon);
        return dist <= alert.radius_km;
      }
      return false;
    });
  },

  // ── Get Highest Severity Alert ────────────────────────────
  getHighestSeverity(alerts) {
    if (!alerts?.length) return null;
    const order = { EMERGENCY: 4, WARNING: 3, ADVISORY: 2, WATCH: 1 };
    return alerts.reduce((top, a) =>
      (order[a.severity] || 0) > (order[top.severity] || 0) ? a : top
    );
  },

  // ── Mark alert as seen ────────────────────────────────────
  markSeen(alertId) {
    this._seenAlerts.add(alertId);
    Utils.store(MS_CONFIG.STORAGE.ALERTS, [...this._seenAlerts]);
  },

  isNew(alertId) { return !this._seenAlerts.has(alertId); },

  // ── Demo: Trigger specific scenario ───────────────────────
  getDemoScenario(scenario) {
    const scenarios = {
      cyclone:    this.DEMO_ALERTS[0],
      heavy_rain: this.DEMO_ALERTS[1],
      heatwave:   this.DEMO_ALERTS[2],
      lightning:  this.DEMO_ALERTS[3],
      flood:      this.DEMO_ALERTS[4],
    };
    return scenarios[scenario] || null;
  },

  // ── Format alert for display ──────────────────────────────
  formatAlertCard(alert, lang = 'en') {
    const sev = MS_CONFIG.SEVERITY[alert.severity];
    const haz = MS_CONFIG.HAZARD[alert.hazard];
    const title = lang === 'hi' && alert.titleHi ? alert.titleHi : alert.title;
    const desc = lang === 'hi' && alert.descriptionHi ? alert.descriptionHi : alert.description;
    const action = lang === 'hi' && alert.actionHi ? alert.actionHi : alert.action;
    const issuedDate = new Date(alert.issued);
    const expiresDate = new Date(alert.expires);

    return `
    <div class="alert-card ${alert.severity.toLowerCase()} fade-in" role="alert" aria-live="polite">
      <div class="alert-card-header">
        <div style="display:flex;align-items:center;gap:12px">
          <span class="alert-hazard-icon" aria-hidden="true">${haz?.icon || '⚠️'}</span>
          <span class="alert-severity-badge severity-${alert.severity.toLowerCase()}">
            ${sev?.label || alert.severity}
          </span>
          ${alert.isDemo ? Utils.demoSimBadge() : ''}
        </div>
        <span class="text-sm text-muted">${Utils.formatTime(issuedDate)}</span>
      </div>

      <div class="alert-title">${title}</div>

      <div class="alert-meta">
        <span class="alert-meta-item">📍 ${alert.area}</span>
        <span class="alert-meta-item">🕐 Issued: ${Utils.formatDate(issuedDate)}</span>
        <span class="alert-meta-item">⏱️ Until: ${Utils.formatDate(expiresDate)}</span>
      </div>

      <div class="alert-description">${desc}</div>

      <div class="alert-action-box">
        💡 <strong>What to do:</strong> ${action}
      </div>

      <div class="alert-source">
        <span>📡 Source: ${alert.source}</span>
        <span style="margin-left:12px">🔄 Updated: ${Utils.timeAgo(issuedDate.getTime())}</span>
      </div>
    </div>
    `;
  },

  // ── Helpers ───────────────────────────────────────────────
  _haversine(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) *
              Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  },

  _isExpired(alert) {
    return new Date(alert.expires) < new Date();
  },

  _delay(ms) { return new Promise(r => setTimeout(r, ms)); },
};

window.AlertService = AlertService;
