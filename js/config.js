/**
 * MAUSAM SETU — Application Configuration
 * National Disaster Early-Warning Platform
 *
 * NOTE: All data is in DEMO MODE unless a real API is configured.
 * Demo data is clearly labelled throughout the application.
 */

const MS_CONFIG = {
  // ── App Identity ───────────────────────────────────────────
  APP_NAME:    'Mausam Setu',
  APP_TAGLINE: 'Connecting Citizens with Weather, Warnings & Safety',
  APP_VERSION: '1.0.0',
  PLATFORM: 'Mausam Setu',
  

  // ── Live Weather Mode ──────────────────────────────────────
  // Set to false = fetches real-time meteorological observation feeds
  DEMO_MODE: false,

  // ── Connected API Keys ─────────────────────────────────────
  // Connected User API Key
  AI_API_KEY: 'sk-EOew2hJCgYLivbfis17oI563PyAnVhVKTKMnSXA49TTgGDyh',
  OPENAI_API_KEY: 'sk-EOew2hJCgYLivbfis17oI563PyAnVhVKTKMnSXA49TTgGDyh',
  API_KEY_CONNECTED: true,
  CONNECTED_KEY_MASKED: 'sk-EOew2•••••••••••••••••••••••••••••••••••••••GDyh',

  // ── Weather API Configuration ──────────────────────────────
  OWM_API_KEY: 'sk-EOew2hJCgYLivbfis17oI563PyAnVhVKTKMnSXA49TTgGDyh',
  OPENWEATHER_KEY: 'sk-EOew2hJCgYLivbfis17oI563PyAnVhVKTKMnSXA49TTgGDyh',
  OWM_BASE_URL: 'https://api.openweathermap.org/data/2.5',

  // ── Geocoding ──────────────────────────────────────────────
  GEOCODE_URL: 'https://nominatim.openstreetmap.org',

  // ── Update Intervals ───────────────────────────────────────
  WEATHER_REFRESH_MS:  600_000,   // 10 minutes
  ALERT_REFRESH_MS:    300_000,   // 5 minutes
  CLOCK_REFRESH_MS:    60_000,    // 1 minute

  // ── Alert Severity Levels ──────────────────────────────────
  SEVERITY: {
    WATCH:     { level: 1, label: 'WATCH',     labelHi: 'सतर्कता',   color: '#F57F17', bg: '#FFF8E1', border: '#F9A825', text: '#7B5800' },
    ADVISORY:  { level: 2, label: 'ADVISORY',  labelHi: 'परामर्श',   color: '#E65100', bg: '#FFF3E0', border: '#EF6C00', text: '#BF360C' },
    WARNING:   { level: 3, label: 'WARNING',   labelHi: 'चेतावनी',   color: '#D32F2F', bg: '#FFEBEE', border: '#C62828', text: '#B71C1C' },
    EMERGENCY: { level: 4, label: 'EMERGENCY', labelHi: 'आपातकाल',   color: '#AD1457', bg: '#FCE4EC', border: '#880E4F', text: '#880E4F' },
  },

  // ── Hazard Types ───────────────────────────────────────────
  HAZARD: {
    HEAVY_RAIN:    { icon: '🌧️', label: 'Heavy Rainfall',        labelHi: 'भारी वर्षा' },
    VERY_HEAVY_RAIN: { icon: '⛈️', label: 'Very Heavy Rainfall', labelHi: 'अत्यंत भारी वर्षा' },
    FLOOD:         { icon: '🌊', label: 'Flood Risk',             labelHi: 'बाढ़ का खतरा' },
    CYCLONE:       { icon: '🌀', label: 'Cyclone',                labelHi: 'चक्रवात' },
    THUNDERSTORM:  { icon: '⛈️', label: 'Thunderstorm',           labelHi: 'तूफान' },
    LIGHTNING:     { icon: '⚡', label: 'Lightning',              labelHi: 'बिजली' },
    HEATWAVE:      { icon: '🌡️', label: 'Heatwave',               labelHi: 'लू' },
    STRONG_WIND:   { icon: '💨', label: 'Strong Wind',            labelHi: 'तेज़ हवा' },
    COLD_WAVE:     { icon: '🌨️', label: 'Cold Wave',              labelHi: 'शीतलहर' },
    FOG:           { icon: '🌫️', label: 'Dense Fog',              labelHi: 'घना कोहरा' },
  },

  // ── Indian States/Regions ──────────────────────────────────
  STATES: [
    'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
    'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
    'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
    'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
    'Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
    'Delhi','Chandigarh','Jammu & Kashmir','Ladakh','Lakshadweep',
    'Puducherry','Andaman & Nicobar Islands','Dadra & Nagar Haveli',
    'Daman & Diu'
  ],

  // ── Emergency Numbers (Official / Verified) ───────────────
  EMERGENCY_NUMBERS: [
    { name: 'National Emergency',       number: '112',  org: 'Govt. of India' },
    { name: 'NDMA Helpline',            number: '1078', org: 'National Disaster Management Authority' },
    { name: 'Police',                   number: '100',  org: 'Police' },
    { name: 'Fire',                     number: '101',  org: 'Fire Services' },
    { name: 'Ambulance',                number: '108',  org: 'Health Ministry' },
    { name: 'Women Helpline',           number: '1091', org: 'Govt. of India' },
    { name: 'Child Helpline',           number: '1098', org: 'CHILDLINE India' },
    { name: 'Flood Control Room',       number: '1070', org: 'State Disaster Mgmt' },
  ],

  // ── Data Sources (Official) ────────────────────────────────
  DATA_SOURCES: [
    { name: 'India Meteorological Department (IMD)', url: 'https://mausam.imd.gov.in', logo: 'IMD' },
    { name: 'National Disaster Management Authority (NDMA)', url: 'https://ndma.gov.in', logo: 'NDMA' },
    { name: 'Ministry of Earth Sciences (MoES)', url: 'https://moes.gov.in', logo: 'MoES' },
    { name: 'Indian National Centre for Ocean Info. Services (INCOIS)', url: 'https://incois.gov.in', logo: 'INCOIS' },
  ],

  // ── Storage Keys ───────────────────────────────────────────
  STORAGE: {
    USER:     'ms_user',
    LOCATION: 'ms_location',
    LANG:     'ms_lang',
    PREFS:    'ms_prefs',
    ALERTS:   'ms_alerts_seen',
    DEMO:     'ms_demo_active',
    CHAT_HISTORY: 'ms_chat_history',
  },

  // ── Routes ─────────────────────────────────────────────────
  ROUTES: {
    HOME:       'index.html',
    LOGIN:      'login.html',
    DASHBOARD:  'dashboard.html',
    FORECAST:   'forecast.html',
    ALERTS:     'alerts.html',
    CHAT:       'chat.html',
    MAP:        'map.html',
    FARMER:     'farmer.html',
    FISHERMAN:  'fisherman.html',
    PROFILE:    'profile.html',
    ADMIN:      'admin.html',
    EMERGENCY:  'emergency.html',
  },
};

// Make config globally available
window.MS_CONFIG = MS_CONFIG;
