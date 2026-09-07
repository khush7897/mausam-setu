/**
 * MAUSAM SETU — Translation System
 * Supports: English (en), Hindi (hi)
 * Architecture: Add new languages by adding a key to T object
 */

const T = {
  en: {
    // App
    app_name: 'Mausam Setu',
    app_tagline: 'Connecting Citizens with Weather, Warnings & Safety',
    app_short: 'Your AI-powered bridge to trusted weather information and disaster alerts.',
    demo_mode: 'DEMO MODE',
    demo_label: 'DEMO DATA',
    simulation_label: 'SIMULATION',

    // Navigation
    nav_home: '🏠 Home',
    nav_dashboard: '📊 Dashboard',
    nav_forecast: '📅 Forecast',
    nav_alerts: '⚠️ Alerts',
    nav_chat: '🤖 WeatherGPT',
    nav_map: '🗺️ Map',
    nav_farmer: '🌾 Farmer',
    nav_fisherman: '⚓ Fisherman',
    nav_emergency: '🚨 Emergency',
    nav_profile: '👤 Profile & Settings',
    nav_admin: '🛡️ Admin Dashboard',
    nav_logout: '🚪 Logout',

    // Landing
    hero_title: 'Your Safety. Our Priority.',
    hero_subtitle: 'AI-powered weather intelligence for every Indian citizen. Get real-time alerts, forecasts, and safety guidance.',
    btn_get_started: 'Get Started',
    btn_check_weather: 'Check Weather',
    btn_learn_more: 'Learn More',
    emergency_strip: '🚨 Emergency Helpline: 1078 (NDMA) | 112 (National Emergency)',

    // Auth
    login_title: 'Login to Mausam Setu',
    register_title: 'Create Account',
    label_mobile: 'Mobile Number / Email',
    label_password: 'Password',
    label_name: 'Full Name',
    label_state: 'State',
    label_role: 'I am a',
    btn_login: 'Login',
    btn_register: 'Register',
    btn_forgot: 'Forgot Password?',
    have_account: 'Already have an account?',
    no_account: "Don't have an account?",
    role_citizen: 'General Citizen',
    role_farmer: 'Farmer',
    role_fisherman: 'Fisherman',
    role_student: 'Student',
    role_official: 'Disaster Management Official',
    admin_unauthorized: 'Access restricted: Administrator credentials required.',

    // Location
    location_title: 'Set Your Location',
    location_gps: 'Allow Location Access',
    location_manual: 'Enter Location Manually',
    location_detecting: 'Detecting your location...',
    location_detected: 'Location Detected',
    location_denied: 'GPS permission denied. Please enter manually.',
    label_city: 'City / Village',
    label_district: 'District',
    label_state_loc: 'State',
    btn_confirm_location: 'Confirm Location',

    // Dashboard
    dash_title: 'Weather Dashboard',
    dash_location: 'Your Location',
    dash_current: 'Current Weather',
    dash_feels_like: 'Feels Like',
    dash_humidity: 'Humidity',
    dash_wind: 'Wind',
    dash_visibility: 'Visibility',
    dash_pressure: 'Pressure',
    dash_uv_index: 'UV Index',
    dash_sunrise: 'Sunrise',
    dash_sunset: 'Sunset',
    dash_hourly: 'Hourly Forecast',
    dash_forecast: '7-Day Forecast',
    dash_no_alert: 'No active alerts for your area',
    dash_safe: '✅ No immediate weather hazard detected',
    dash_safety_tip: 'Safety Recommendation',
    dash_source: 'Data Source',
    dash_updated: 'Last Updated',

    // Weather conditions
    weather_clear: 'Clear Sky',
    weather_clouds: 'Cloudy',
    weather_rain: 'Rain',
    weather_drizzle: 'Drizzle',
    weather_thunderstorm: 'Thunderstorm',
    weather_snow: 'Snow',
    weather_mist: 'Mist/Fog',
    weather_haze: 'Haze',
    weather_hot: 'Hot & Humid',

    // Forecast
    forecast_title: '7-Day Weather Forecast',
    forecast_today: 'Today',
    forecast_tomorrow: 'Tomorrow',
    forecast_rain_prob: 'Rain Probability',
    forecast_max: 'Max',
    forecast_min: 'Min',
    forecast_wind: 'Wind',
    forecast_humidity: 'Humidity',

    // Alerts
    alerts_title: 'Weather & Disaster Alerts',
    alerts_active: 'Active Alerts',
    alerts_history: 'Past Alerts',
    alerts_none: 'No active alerts for your area.',
    alerts_all_clear: '✅ All Clear — No active weather hazards',
    alert_issued: 'Issued',
    alert_expires: 'Expires',
    alert_area: 'Affected Area',
    alert_source: 'Source',
    alert_action: 'Recommended Action',
    alert_severity: 'Severity',
    alert_type: 'Hazard Type',

    // WeatherGPT
    chat_title: 'WeatherGPT — Your AI Weather Assistant',
    chat_subtitle: 'Ask me anything about weather, alerts, or safety',
    chat_placeholder: 'Ask about weather, alerts, or safety...',
    chat_send: 'Send',
    chat_thinking: 'Analysing weather data...',
    chat_disclaimer: '⚠️ WeatherGPT provides information based on available weather data. Always follow official advisories in emergencies.',
    chat_data_unavailable: "I don't have enough verified weather information for this request right now. Please check official sources.",
    chat_suggestions: [
      'Will it rain today?',
      'Is there a flood risk near me?',
      'Is it safe to travel?',
      'What should I do during heavy rain?',
      'Is there a cyclone nearby?',
      'Should farmers delay harvesting?',
    ],

    // Safety
    safety_flood: 'Avoid flooded roads. Do not cross moving water. Move to higher ground if advised.',
    safety_lightning: 'Move indoors immediately. Avoid open areas, trees, and metal objects.',
    safety_heatwave: 'Stay hydrated. Avoid outdoor exposure during 12–4 PM. Seek shade.',
    safety_cyclone: 'Follow evacuation instructions. Secure loose objects. Stay away from coast.',
    safety_heavy_rain: 'Avoid unnecessary travel. Stay away from low-lying areas. Keep drains clear.',
    safety_strong_wind: 'Secure loose objects. Avoid outdoor activities. Stay away from trees.',
    safety_fog: 'Drive slowly with low-beam headlights. Maintain safe distances. Use hazard lights.',
    safety_general: 'Follow official weather advisories. Stay informed. Keep emergency contacts ready.',

    // Map
    map_title: 'Weather & Disaster Map',
    map_legend: 'Map Legend',
    map_your_location: 'Your Location',
    map_alert_zone: 'Alert Zone',
    map_rainfall: 'Rainfall',

    // Farmer
    farmer_title: 'Farmer Weather Dashboard',
    farmer_subtitle: 'Weather information for agricultural planning',
    farmer_rainfall: 'Expected Rainfall',
    farmer_temp: 'Temperature',
    farmer_wind: 'Wind',
    farmer_advisory: 'Agricultural Advisory',
    farmer_disclaimer: 'Agricultural advisories are based on weather data. Consult local agricultural officers for crop-specific guidance.',

    // Fisherman
    fish_title: 'Fisherman Weather Dashboard',
    fish_subtitle: 'Coastal and marine weather for fishing communities',
    fish_wind: 'Wind Speed',
    fish_sea: 'Sea Conditions',
    fish_cyclone: 'Cyclone Status',
    fish_advisory: 'Safety Advisory',
    fish_warning: '⚠️ Do not venture into the sea during warnings.',

    // Profile
    profile_title: 'Profile & Settings',
    profile_name: 'Full Name',
    profile_mobile: 'Mobile Number',
    profile_language: 'Preferred Language',
    profile_location: 'Saved Location',
    profile_role: 'Account Type',
    profile_notifications: 'Notification Settings',
    profile_notif_app: 'In-App Notifications',
    profile_notif_browser: 'Browser Push Notifications',
    profile_notif_sms: 'SMS Alerts (Coming Soon)',
    profile_notif_whatsapp: 'WhatsApp Alerts (Coming Soon)',
    btn_save: 'Save Changes',
    btn_change_location: 'Change Location',

    // Admin
    admin_title: 'Admin Dashboard',
    admin_active_alerts: 'Active Alerts',
    admin_api_status: 'API Status',
    admin_system_health: 'System Health',
    admin_users: 'User Activity',
    admin_unauthorized: 'Access Denied. Admin privileges required.',

    // Emergency
    emergency_title: 'Emergency Information',
    emergency_subtitle: 'Verified emergency contacts and safety information',
    emergency_call: 'Call',

    // General
    loading: 'Loading...',
    retry: 'Retry',
    error_weather: 'Weather information is temporarily unavailable. Please try again.',
    error_location: 'Unable to determine location. Please enter manually.',
    source_label: 'Source:',
    last_updated: 'Last updated:',
    change: 'Change',
    back: 'Back',
    next: 'Next',
    close: 'Close',
    view_all: 'View All',
    verified: '✅ Verified Source',
    official_data: 'Official Government Data',
  },

  hi: {
    // App
    app_name: 'मौसम सेतु',
    app_tagline: 'नागरिकों को मौसम, चेतावनियों और सुरक्षा से जोड़ना',
    app_short: 'विश्वसनीय मौसम जानकारी और आपदा अलर्ट के लिए आपका AI-संचालित पुल।',
    demo_mode: 'डेमो मोड',
    demo_label: 'डेमो डेटा',
    simulation_label: 'सिमुलेशन',

    // Navigation
    nav_home: '🏠 होम',
    nav_dashboard: '📊 डैशबोर्ड',
    nav_forecast: '📅 पूर्वानुमान',
    nav_alerts: '⚠️ अलर्ट',
    nav_chat: '🤖 वेदर GPT',
    nav_map: '🗺️ नक्शा',
    nav_farmer: '🌾 किसान',
    nav_fisherman: '⚓ मछुआरा',
    nav_emergency: '🚨 आपातकाल',
    nav_profile: '👤 प्रोफाइल व सेटिंग्स',
    nav_admin: '🛡️ एडमिन डैशबोर्ड',
    nav_logout: '🚪 लॉगआउट',

    // Landing
    hero_title: 'आपकी सुरक्षा। हमारी प्राथमिकता।',
    hero_subtitle: 'हर भारतीय नागरिक के लिए AI-संचालित मौसम जानकारी। रीयल-टाइम अलर्ट, पूर्वानुमान और सुरक्षा मार्गदर्शन प्राप्त करें।',
    btn_get_started: 'शुरू करें',
    btn_check_weather: 'मौसम जांचें',
    btn_learn_more: 'और जानें',
    emergency_strip: '🚨 आपातकालीन हेल्पलाइन: 1078 (NDMA) | 112 (राष्ट्रीय आपातकाल)',

    // Auth
    login_title: 'मौसम सेतु में लॉगिन करें',
    register_title: 'खाता बनाएं',
    label_mobile: 'मोबाइल नंबर / ईमेल',
    label_password: 'पासवर्ड',
    label_name: 'पूरा नाम',
    label_state: 'राज्य',
    label_role: 'मैं हूँ',
    btn_login: 'लॉगिन',
    btn_register: 'रजिस्टर',
    btn_forgot: 'पासवर्ड भूल गए?',
    have_account: 'पहले से खाता है?',
    no_account: 'खाता नहीं है?',
    role_citizen: 'सामान्य नागरिक',
    role_farmer: 'किसान',
    role_fisherman: 'मछुआरा',
    role_student: 'छात्र',
    role_official: 'आपदा प्रबंधन अधिकारी',
    admin_unauthorized: 'पहुंच प्रतिबंधित: केवल प्रशासकों (Admin) के लिए अनुमत है।',

    // Location
    location_title: 'अपना स्थान सेट करें',
    location_gps: 'स्थान की अनुमति दें',
    location_manual: 'स्थान मैन्युअल रूप से दर्ज करें',
    location_detecting: 'आपका स्थान पता लगाया जा रहा है...',
    location_detected: 'स्थान पहचाना गया',
    location_denied: 'GPS अनुमति अस्वीकृत। कृपया मैन्युअल रूप से दर्ज करें।',
    label_city: 'शहर / गाँव',
    label_district: 'जिला',
    label_state_loc: 'राज्य',
    btn_confirm_location: 'स्थान की पुष्टि करें',

    // Dashboard
    dash_title: 'मौसम डैशबोर्ड',
    dash_location: 'आपका स्थान',
    dash_current: 'वर्तमान मौसम',
    dash_feels_like: 'महसूस होता है',
    dash_humidity: 'आर्द्रता',
    dash_wind: 'हवा',
    dash_visibility: 'दृश्यता',
    dash_pressure: 'दबाव',
    dash_uv_index: 'UV इंडेक्स',
    dash_sunrise: 'सूर्योदय',
    dash_sunset: 'सूर्यास्त',
    dash_hourly: 'प्रति घंटा पूर्वानुमान',
    dash_forecast: '7-दिन का पूर्वानुमान',
    dash_no_alert: 'आपके क्षेत्र के लिए कोई सक्रिय अलर्ट नहीं',
    dash_safe: '✅ कोई तत्काल मौसम खतरा नहीं',
    dash_safety_tip: 'सुरक्षा सिफारिश',
    dash_source: 'डेटा स्रोत',
    dash_updated: 'अंतिम अपडेट',

    // Weather conditions
    weather_clear: 'साफ आसमान',
    weather_clouds: 'बादल',
    weather_rain: 'बारिश',
    weather_drizzle: 'बूंदाबांदी',
    weather_thunderstorm: 'तूफान',
    weather_snow: 'बर्फ',
    weather_mist: 'कोहरा',
    weather_haze: 'धुंध',
    weather_hot: 'गर्म और उमस भरा',

    // Forecast
    forecast_title: '7-दिन का मौसम पूर्वानुमान',
    forecast_today: 'आज',
    forecast_tomorrow: 'कल',
    forecast_rain_prob: 'वर्षा संभावना',
    forecast_max: 'अधिकतम',
    forecast_min: 'न्यूनतम',
    forecast_wind: 'हवा',
    forecast_humidity: 'आर्द्रता',

    // Alerts
    alerts_title: 'मौसम और आपदा अलर्ट',
    alerts_active: 'सक्रिय अलर्ट',
    alerts_history: 'पिछले अलर्ट',
    alerts_none: 'आपके क्षेत्र के लिए कोई सक्रिय अलर्ट नहीं।',
    alerts_all_clear: '✅ सब ठीक है — कोई सक्रिय मौसम खतरा नहीं',
    alert_issued: 'जारी किया',
    alert_expires: 'समाप्त होता है',
    alert_area: 'प्रभावित क्षेत्र',
    alert_source: 'स्रोत',
    alert_action: 'अनुशंसित कार्रवाई',
    alert_severity: 'गंभीरता',
    alert_type: 'खतरे का प्रकार',

    // WeatherGPT
    chat_title: 'मौसम GPT — आपका AI मौसम सहायक',
    chat_subtitle: 'मौसम, अलर्ट या सुरक्षा के बारे में कुछ भी पूछें',
    chat_placeholder: 'मौसम, अलर्ट या सुरक्षा के बारे में पूछें...',
    chat_send: 'भेजें',
    chat_thinking: 'मौसम डेटा का विश्लेषण हो रहा है...',
    chat_disclaimer: '⚠️ मौसम GPT उपलब्ध मौसम डेटा के आधार पर जानकारी प्रदान करता है। आपातकाल में हमेशा आधिकारिक सलाह का पालन करें।',
    chat_data_unavailable: 'मुझे अभी इस अनुरोध के लिए पर्याप्त सत्यापित मौसम जानकारी नहीं है। कृपया आधिकारिक स्रोत जांचें।',
    chat_suggestions: [
      'क्या आज बारिश होगी?',
      'क्या मेरे पास बाढ़ का खतरा है?',
      'क्या यात्रा करना सुरक्षित है?',
      'भारी बारिश में क्या करें?',
      'क्या पास में चक्रवात है?',
      'क्या किसानों को फसल काटना स्थगित करना चाहिए?',
    ],

    // Safety
    safety_flood: 'बाढ़ग्रस्त सड़कों से बचें। बहते पानी को पार न करें। सलाह मिलने पर ऊंचाई पर जाएं।',
    safety_lightning: 'तुरंत घर के अंदर जाएं। खुले क्षेत्रों, पेड़ों और धातु की वस्तुओं से बचें।',
    safety_heatwave: 'पानी पीते रहें। दोपहर 12-4 बजे बाहर न जाएं। छाया में रहें।',
    safety_cyclone: 'निकासी निर्देशों का पालन करें। ढीली वस्तुओं को सुरक्षित करें। तट से दूर रहें।',
    safety_heavy_rain: 'अनावश्यक यात्रा से बचें। निचले इलाकों से दूर रहें। नाले साफ रखें।',
    safety_strong_wind: 'ढीली वस्तुओं को सुरक्षित करें। बाहरी गतिविधियों से बचें। पेड़ों से दूर रहें।',
    safety_fog: 'धीरे चलाएं, लो-बीम हेडलाइट्स का उपयोग करें। सुरक्षित दूरी बनाए रखें।',
    safety_general: 'आधिकारिक मौसम सलाह का पालन करें। जानकारी रखें। आपातकालीन संपर्क तैयार रखें।',

    // Map
    map_title: 'मौसम और आपदा नक्शा',
    map_legend: 'नक्शा लेजेंड',
    map_your_location: 'आपका स्थान',
    map_alert_zone: 'अलर्ट क्षेत्र',
    map_rainfall: 'वर्षा',

    // Farmer
    farmer_title: 'किसान मौसम डैशबोर्ड',
    farmer_subtitle: 'कृषि योजना के लिए मौसम जानकारी',
    farmer_rainfall: 'अपेक्षित वर्षा',
    farmer_temp: 'तापमान',
    farmer_wind: 'हवा',
    farmer_advisory: 'कृषि सलाह',
    farmer_disclaimer: 'कृषि सलाह मौसम डेटा पर आधारित है। फसल-विशिष्ट मार्गदर्शन के लिए स्थानीय कृषि अधिकारियों से परामर्श करें।',

    // Fisherman
    fish_title: 'मछुआरा मौसम डैशबोर्ड',
    fish_subtitle: 'मछली पकड़ने वाले समुदायों के लिए तटीय और समुद्री मौसम',
    fish_wind: 'हवा की गति',
    fish_sea: 'समुद्री स्थिति',
    fish_cyclone: 'चक्रवात स्थिति',
    fish_advisory: 'सुरक्षा सलाह',
    fish_warning: '⚠️ चेतावनी के दौरान समुद्र में न जाएं।',

    // Profile
    profile_title: 'प्रोफ़ाइल और सेटिंग्स',
    profile_name: 'पूरा नाम',
    profile_mobile: 'मोबाइल नंबर',
    profile_language: 'पसंदीदा भाषा',
    profile_location: 'सहेजा गया स्थान',
    profile_role: 'खाता प्रकार',
    profile_notifications: 'अधिसूचना सेटिंग्स',
    profile_notif_app: 'इन-ऐप अधिसूचनाएं',
    profile_notif_browser: 'ब्राउज़र पुश अधिसूचनाएं',
    profile_notif_sms: 'SMS अलर्ट (जल्द आ रहा है)',
    profile_notif_whatsapp: 'WhatsApp अलर्ट (जल्द आ रहा है)',
    btn_save: 'बदलाव सहेजें',
    btn_change_location: 'स्थान बदलें',

    // Admin
    admin_title: 'एडमिन डैशबोर्ड',
    admin_active_alerts: 'सक्रिय अलर्ट',
    admin_api_status: 'API स्थिति',
    admin_system_health: 'सिस्टम स्वास्थ्य',
    admin_users: 'उपयोगकर्ता गतिविधि',
    admin_unauthorized: 'पहुंच अस्वीकृत। एडमिन विशेषाधिकार आवश्यक है।',

    // Emergency
    emergency_title: 'आपातकालीन जानकारी',
    emergency_subtitle: 'सत्यापित आपातकालीन संपर्क और सुरक्षा जानकारी',
    emergency_call: 'कॉल करें',

    // General
    loading: 'लोड हो रहा है...',
    retry: 'पुनः प्रयास',
    error_weather: 'मौसम जानकारी अस्थायी रूप से अनुपलब्ध है। कृपया पुनः प्रयास करें।',
    error_location: 'स्थान निर्धारित करने में असमर्थ। कृपया मैन्युअल रूप से दर्ज करें।',
    source_label: 'स्रोत:',
    last_updated: 'अंतिम अपडेट:',
    change: 'बदलें',
    back: 'वापस',
    next: 'अगला',
    close: 'बंद करें',
    view_all: 'सभी देखें',
    verified: '✅ सत्यापित स्रोत',
    official_data: 'आधिकारिक सरकारी डेटा',
  }
};

// ── Language Manager ─────────────────────────────────────────
const LangManager = {
  current: 'en',

  init() {
    const saved = localStorage.getItem(typeof MS_CONFIG !== 'undefined' ? MS_CONFIG.STORAGE.LANG : 'ms_lang') || 'en';
    this.setLanguage(saved, false);

    // Automatically bind all language toggle buttons across the page
    if (typeof document !== 'undefined' && !this._delegated) {
      this._delegated = true;
      document.addEventListener('click', (e) => {
        const btn = e.target.closest('.lang-toggle-btn');
        if (btn && btn.dataset && btn.dataset.lang) {
          e.preventDefault();
          this.setLanguage(btn.dataset.lang);
        }
      });
    }
  },

  setLanguage(lang, save = true) {
    if (!T[lang]) lang = 'en';
    this.current = lang;
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      document.body.classList.toggle('lang-hi', lang === 'hi');
    }
    if (save && typeof localStorage !== 'undefined') {
      localStorage.setItem(typeof MS_CONFIG !== 'undefined' ? MS_CONFIG.STORAGE.LANG : 'ms_lang', lang);
    }
    this.applyTranslations();
    this.updateToggles();

    // Dispatch global language change event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ms:languagechange', { detail: { lang } }));

      // Automatically notify known page re-render functions
      try {
        if (typeof window.onLanguageChange === 'function') window.onLanguageChange(lang);
        if (typeof window.loadForecast === 'function') window.loadForecast();
        if (typeof window.renderAlerts === 'function') window.renderAlerts();
        if (typeof window.renderSafetyGrid === 'function') window.renderSafetyGrid();
        if (typeof window.renderFarmerPage === 'function') window.renderFarmerPage();
        if (typeof window.renderFishPage === 'function') window.renderFishPage();
        if (typeof window.renderPrepGuides === 'function') window.renderPrepGuides();
        if (typeof window.startNewChat === 'function' && document.getElementById('welcome-box')) window.startNewChat();
      } catch (err) {
        console.warn('Page re-render after language change error:', err);
      }
    }
  },

  t(key) {
    return T[this.current]?.[key] || T['en']?.[key] || key;
  },

  applyTranslations() {
    if (typeof document === 'undefined') return;

    // Standard data-t attributes
    document.querySelectorAll('[data-t]').forEach(el => {
      const key = el.getAttribute('data-t');
      el.textContent = this.t(key);
    });
    document.querySelectorAll('[data-t-placeholder]').forEach(el => {
      el.placeholder = this.t(el.getAttribute('data-t-placeholder'));
    });
    document.querySelectorAll('[data-t-title]').forEach(el => {
      el.title = this.t(el.getAttribute('data-t-title'));
    });
    document.querySelectorAll('[data-t-aria]').forEach(el => {
      el.setAttribute('aria-label', this.t(el.getAttribute('data-t-aria')));
    });

    // Translate Navigation Bar Links
    const navMap = [
      { href: 'dashboard.html', key: 'nav_dashboard' },
      { href: 'forecast.html',  key: 'nav_forecast' },
      { href: 'alerts.html',    key: 'nav_alerts', hasDot: true },
      { href: 'chat.html',      key: 'nav_chat' },
      { href: 'map.html',       key: 'nav_map' },
      { href: 'farmer.html',    key: 'nav_farmer' },
      { href: 'fisherman.html', key: 'nav_fisherman' },
      { href: 'emergency.html', key: 'nav_emergency' },
    ];

    navMap.forEach(item => {
      document.querySelectorAll(`a[href*="${item.href}"]`).forEach(link => {
        if (link.classList.contains('nav-link') || link.classList.contains('bottom-nav-item')) {
          if (item.hasDot) {
            const dot = link.querySelector('#alerts-badge-dot');
            const dotClass = dot ? dot.className : '';
            const dotDisplay = dot ? dot.style.display : '';
            link.innerHTML = `${this.t(item.key)} <span class="${dotClass}" id="alerts-badge-dot" style="${dotDisplay}"></span>`;
          } else {
            link.textContent = this.t(item.key);
          }
        }
      });
    });
  },

  updateToggles() {
    if (typeof document === 'undefined') return;
    document.querySelectorAll('.lang-toggle-btn').forEach(btn => {
      const isCurrent = btn.dataset.lang === this.current;
      btn.setAttribute('aria-pressed', isCurrent);
      btn.classList.toggle('active', isCurrent);
    });
  },

  toggle() {
    this.setLanguage(this.current === 'en' ? 'hi' : 'en');
  }
};

// Global shorthand functions for easy invocation from inline handlers or scripts
if (typeof window !== 'undefined') {
  window.setLang = function(lang) { LangManager.setLanguage(lang); };
  window.setChatLang = function(lang) { LangManager.setLanguage(lang); };
}

window.T = T;
window.LangManager = LangManager;
