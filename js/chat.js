/**
 * MAUSAM SETU — WeatherGPT
 * Rule-based intelligent weather assistant
 * DOES NOT hallucinate — all responses based on fetched weather data
 */

const WeatherGPT = {

  _weather: null,
  _forecast: null,
  _alerts: null,
  _location: null,

  // ── Load current context ──────────────────────────────────
  async loadContext() {
    const loc = Utils.retrieve(MS_CONFIG.STORAGE.LOCATION);
    this._location = loc;
    if (loc) {
      this._weather  = await WeatherService.getCurrentWeather(loc.city, loc.lat, loc.lon);
      this._forecast = await WeatherService.getForecast(loc.city, loc.lat, loc.lon);
      this._alerts   = await AlertService.getAlertsForLocation(loc.lat, loc.lon, loc.state);
    }
  },

  // ── Main response function ────────────────────────────────
  async getResponse(userMessage, lang = 'en') {
    const msg = userMessage.toLowerCase().trim();

    // If no context loaded, try loading
    if (!this._weather) {
      await this.loadContext();
      if (!this._weather) {
        return this._noDataResponse(lang);
      }
    }

    const w = this._weather;
    const f = this._forecast;
    const alerts = this._alerts || [];
    const loc = this._location;
    const locName = loc?.city || 'your area';

    // ── Intent Detection ─────────────────────────────────────
    if (this._matches(msg, ['rain today', 'rain now', 'raining', 'आज बारिश', 'बारिश होगी'])) {
      return this._rainTodayResponse(w, f, locName, lang);
    }
    if (this._matches(msg, ['rain tomorrow', 'tomorrow rain', 'कल बारिश'])) {
      return this._rainTomorrowResponse(f, locName, lang);
    }
    if (this._matches(msg, ['flood', 'flooding', 'बाढ़'])) {
      return this._floodResponse(alerts, w, locName, lang);
    }
    if (this._matches(msg, ['cyclone', 'storm', 'hurricane', 'चक्रवात', 'तूफान'])) {
      return this._cycloneResponse(alerts, locName, lang);
    }
    if (this._matches(msg, ['travel', 'drive', 'road', 'safe to go', 'यात्रा', 'जाना सुरक्षित'])) {
      return this._travelSafetyResponse(w, alerts, locName, lang);
    }
    if (this._matches(msg, ['heatwave', 'heat', 'hot', 'temperature', 'लू', 'गर्मी', 'तापमान'])) {
      return this._heatwaveResponse(w, alerts, locName, lang);
    }
    if (this._matches(msg, ['lightning', 'thunder', 'बिजली', 'तड़ित'])) {
      return this._lightningResponse(alerts, w, locName, lang);
    }
    if (this._matches(msg, ['farmer', 'crop', 'harvest', 'sow', 'farming', 'किसान', 'फसल', 'कटाई', 'बुवाई'])) {
      return this._farmerResponse(w, f, lang);
    }
    if (this._matches(msg, ['fisherman', 'fishing', 'sea', 'boat', 'मछुआरा', 'समुद्र', 'नाव'])) {
      return this._fisherResponse(w, alerts, lang);
    }
    if (this._matches(msg, ['alert', 'warning', 'danger', 'hazard', 'अलर्ट', 'चेतावनी', 'खतरा'])) {
      return this._alertResponse(alerts, locName, lang);
    }
    if (this._matches(msg, ['forecast', 'week', '7 day', 'पूर्वानुमान', 'सप्ताह'])) {
      return this._forecastResponse(f, locName, lang);
    }
    if (this._matches(msg, ['humidity', 'humid', 'आर्द्रता', 'नमी'])) {
      return this._humidityResponse(w, locName, lang);
    }
    if (this._matches(msg, ['wind', 'हवा'])) {
      return this._windResponse(w, locName, lang);
    }
    if (this._matches(msg, ['weather', 'condition', 'मौसम', 'हालत'])) {
      return this._currentWeatherResponse(w, locName, lang);
    }
    if (this._matches(msg, ['hello', 'hi', 'hey', 'namaste', 'नमस्ते', 'हेलो'])) {
      return this._greetingResponse(lang);
    }
    if (this._matches(msg, ['help', 'what can', 'क्या कर', 'मदद'])) {
      return this._helpResponse(lang);
    }

    // Default: general weather + say I don't understand very specific
    return this._generalResponse(w, alerts, locName, lang);
  },

  // ── Response Generators ───────────────────────────────────

  _rainTodayResponse(w, f, loc, lang) {
    const prob = w.rain_prob;
    const mm = w.rain_mm;
    const isDemo = w.isDemo;
    const badge = isDemo ? ' [DEMO DATA]' : '';

    if (lang === 'hi') {
      if (prob > 70) return `🌧️ **${loc} के लिए आज वर्षा की संभावना अधिक है।**${badge}\n\n📊 वर्षा संभावना: **${prob}%**\n💧 अपेक्षित वर्षा: **${mm} मिमी**\n\n${prob > 80 ? '⚠️ भारी वर्षा की संभावना है। अनावश्यक यात्रा से बचें और निचले इलाकों से दूर रहें।' : '🌂 छाता साथ रखें और यात्रा की योजना उसी अनुसार बनाएं।'}\n\n📡 स्रोत: ${w.source || 'मौसम डेटा'}`;
      if (prob > 30) return `🌦️ **${loc} में आज बारिश की संभावना है।**${badge}\n\n📊 वर्षा संभावना: **${prob}%**\n\n🌂 अपनी यात्रा के लिए सावधान रहें — बारिश हो सकती है।\n\n📡 स्रोत: ${w.source || 'मौसम डेटा'}`;
      return `☀️ **आज ${loc} में बारिश की संभावना कम है।**${badge}\n\n📊 वर्षा संभावना: केवल **${prob}%**\n\nआज का मौसम: ${w.condition}। सामान्य गतिविधियों के लिए अच्छा दिन!\n\n📡 स्रोत: ${w.source || 'मौसम डेटा'}`;
    }

    if (prob > 70) return `🌧️ **High chance of rain in ${loc} today.**${badge}\n\n📊 Rain probability: **${prob}%**\n💧 Expected rainfall: **${mm}mm**\n\n${prob > 80 ? '⚠️ Heavy rainfall likely. Avoid unnecessary travel and stay away from low-lying areas.' : '🌂 Carry an umbrella and plan travel accordingly.'}\n\n📡 Source: ${w.source || 'Weather data'}`;
    if (prob > 30) return `🌦️ **Chance of rain in ${loc} today.**${badge}\n\n📊 Rain probability: **${prob}%**\n\n🌂 Be prepared — some rain is possible. Current condition: ${w.condition}.\n\n📡 Source: ${w.source || 'Weather data'}`;
    return `☀️ **Low chance of rain in ${loc} today.**${badge}\n\n📊 Rain probability: only **${prob}%**\n\nCondition: ${w.condition}. Looks like a good day for outdoor activities!\n\n📡 Source: ${w.source || 'Weather data'}`;
  },

  _rainTomorrowResponse(f, loc, lang) {
    const tomorrow = f?.[1];
    if (!tomorrow) return this._noDataResponse(lang);
    const prob = tomorrow.rain_prob;
    const badge = tomorrow.isDemo ? ' [DEMO DATA]' : '';

    if (lang === 'hi') {
      return `📅 **कल ${loc} के लिए पूर्वानुमान:**${badge}\n\n🌡️ तापमान: ${tomorrow.temp_min}°C – ${tomorrow.temp_max}°C\n🌧️ वर्षा संभावना: **${prob}%**\n💨 हवा: ${tomorrow.wind} किमी/घंटा\n🌤️ स्थिति: ${tomorrow.condition}\n\n${prob > 60 ? '⚠️ कल बारिश की संभावना अधिक है। अपनी योजना उसी अनुसार बनाएं।' : 'कल का मौसम सामान्य रहने की उम्मीद है।'}`;
    }
    return `📅 **Tomorrow's forecast for ${loc}:**${badge}\n\n🌡️ Temperature: ${tomorrow.temp_min}°C – ${tomorrow.temp_max}°C\n🌧️ Rain probability: **${prob}%**\n💨 Wind: ${tomorrow.wind} km/h\n🌤️ Condition: ${tomorrow.condition}\n\n${prob > 60 ? '⚠️ High chance of rain tomorrow. Plan accordingly.' : 'Weather looks manageable tomorrow.'}`;
  },

  _floodResponse(alerts, w, loc, lang) {
    const floodAlert = alerts.find(a => a.hazard === 'FLOOD');
    if (floodAlert) {
      const badge = floodAlert.isDemo ? ' [SIMULATION]' : '';
      if (lang === 'hi') return `🚨 **${loc} के पास सक्रिय बाढ़ अलर्ट है!**${badge}\n\n${floodAlert.titleHi || floodAlert.title}\n📍 प्रभावित क्षेत्र: ${floodAlert.area}\n\n⚠️ **क्या करें:** ${floodAlert.actionHi || floodAlert.action}\n\n📞 आपातकालीन: 1078 (NDMA) | 1070 (बाढ़ नियंत्रण)\n📡 स्रोत: ${floodAlert.source}`;
      return `🚨 **Active flood alert near ${loc}!**${badge}\n\n${floodAlert.title}\n📍 Area: ${floodAlert.area}\n\n⚠️ **What to do:** ${floodAlert.action}\n\n📞 Emergency: 1078 (NDMA) | 1070 (Flood Control)\n📡 Source: ${floodAlert.source}`;
    }
    if (w.rain_prob > 80) {
      if (lang === 'hi') return `⚠️ **${loc} में बाढ़ का कोई सक्रिय अलर्ट नहीं है, लेकिन भारी वर्षा की संभावना है।**\n\nवर्षा संभावना: ${w.rain_prob}%। निचले इलाकों से दूर रहें और आधिकारिक अपडेट देखते रहें।`;
      return `⚠️ **No active flood alert for ${loc}, but heavy rainfall is expected.**\n\nRain probability: ${w.rain_prob}%. Avoid low-lying areas and monitor official updates.`;
    }
    if (lang === 'hi') return `✅ **${loc} के लिए कोई सक्रिय बाढ़ अलर्ट नहीं है।**\n\nवर्तमान वर्षा संभावना ${w.rain_prob}% है। नवीनतम अपडेट के लिए मौसम सेतु अलर्ट देखते रहें।`;
    return `✅ **No active flood alert for ${loc}.**\n\nCurrent rain probability is ${w.rain_prob}%. Stay tuned to Mausam Setu for the latest updates.`;
  },

  _cycloneResponse(alerts, loc, lang) {
    const cycloneAlert = alerts.find(a => a.hazard === 'CYCLONE');
    if (cycloneAlert) {
      const badge = cycloneAlert.isDemo ? ' [SIMULATION]' : '';
      if (lang === 'hi') return `🌀 **${loc} के पास सक्रिय चक्रवात चेतावनी!**${badge}\n\n${cycloneAlert.titleHi || cycloneAlert.title}\n📍 प्रभावित: ${cycloneAlert.area}\n\n⚠️ **क्या करें:** ${cycloneAlert.actionHi || cycloneAlert.action}\n\n📞 तट रक्षक: 1554 | NDMA: 1078\n📡 स्रोत: ${cycloneAlert.source}`;
      return `🌀 **Active cyclone alert near ${loc}!**${badge}\n\n${cycloneAlert.title}\n📍 Affected: ${cycloneAlert.area}\n\n⚠️ **Action:** ${cycloneAlert.action}\n\n📞 Coast Guard: 1554 | NDMA: 1078\n📡 Source: ${cycloneAlert.source}`;
    }
    if (lang === 'hi') return `✅ **${loc} के पास कोई सक्रिय चक्रवात नहीं है।**\n\nIMD वर्तमान में इस क्षेत्र में कोई चक्रवाती गतिविधि की सूचना नहीं दे रहा है। जानकारी के लिए अलर्ट पेज देखें।`;
    return `✅ **No active cyclone near ${loc}.**\n\nIMD is not reporting any cyclonic activity in this region currently. Check the Alerts page for updates.`;
  },

  _travelSafetyResponse(w, alerts, loc, lang) {
    const highAlert = alerts.find(a => ['WARNING','EMERGENCY'].includes(a.severity));
    const danger = highAlert || w.rain_prob > 75 || w.wind_speed > 60 || w.temp > 44;

    if (danger) {
      const reason = highAlert ? `Active ${highAlert.hazard.replace('_',' ')} alert` :
                     w.rain_prob > 75 ? `High rain probability (${w.rain_prob}%)` :
                     w.wind_speed > 60 ? `Strong winds (${w.wind_speed} km/h)` :
                     `Extreme heat (${w.temp}°C)`;
      if (lang === 'hi') return `⚠️ **${loc} से यात्रा करना अभी जोखिम भरा हो सकता है।**\n\n❌ कारण: ${reason}\n\n🛡️ सलाह: अनावश्यक यात्रा से बचें। आधिकारिक सलाह का पालन करें। अगर जाना जरूरी है तो सतर्क रहें और आपातकालीन संपर्क साथ रखें।\n\n📞 आपातकाल: 112`;
      return `⚠️ **Travel from ${loc} may be risky right now.**\n\n❌ Reason: ${reason}\n\n🛡️ Advice: Avoid non-essential travel. Follow official advisories. If travel is essential, stay alert and keep emergency contacts handy.\n\n📞 Emergency: 112`;
    }

    if (lang === 'hi') return `✅ **${loc} से यात्रा आम तौर पर आज सुरक्षित दिखती है।**\n\n🌡️ तापमान: ${w.temp}°C | 💨 हवा: ${w.wind_speed} किमी/घंटा | 🌧️ वर्षा संभावना: ${w.rain_prob}%\n\nकोई गंभीर मौसम चेतावनी नहीं है। सुरक्षित यात्रा करें!\n\n🔔 नवीनतम अलर्ट के लिए Mausam Setu देखते रहें।`;
    return `✅ **Travel from ${loc} looks generally safe today.**\n\n🌡️ Temp: ${w.temp}°C | 💨 Wind: ${w.wind_speed} km/h | 🌧️ Rain: ${w.rain_prob}%\n\nNo severe weather warnings active. Travel safely!\n\n🔔 Keep monitoring Mausam Setu for the latest alerts.`;
  },

  _heatwaveResponse(w, alerts, loc, lang) {
    const heatAlert = alerts.find(a => a.hazard === 'HEATWAVE');
    const isHot = w.temp > 40;
    const badge = heatAlert?.isDemo ? ' [SIMULATION]' : '';

    if (heatAlert) {
      if (lang === 'hi') return `🌡️ **${loc} के लिए लू चेतावनी जारी है!**${badge}\n\n${heatAlert.titleHi || heatAlert.title}\n\n⚠️ **क्या करें:** ${heatAlert.actionHi || heatAlert.action}\n\n💧 खूब पानी पिएं। दोपहर 12-4 बजे बाहर न जाएं।\n📞 आपातकाल: 108 (एम्बुलेंस)`;
      return `🌡️ **Heatwave alert active for ${loc}!**${badge}\n\n${heatAlert.title}\n\n⚠️ **What to do:** ${heatAlert.action}\n\n💧 Drink plenty of water. Avoid outdoors 12 PM – 4 PM.\n📞 Emergency: 108 (Ambulance)`;
    }
    if (isHot) {
      if (lang === 'hi') return `☀️ **${loc} में तापमान बहुत अधिक है।**\n\n🌡️ वर्तमान: **${w.temp}°C** (महसूस होता है: ${w.feels_like}°C)\n\n⚠️ गर्म परिस्थितियां — पानी पिएं, दोपहर में बाहर न जाएं, बुजुर्गों और बच्चों का ख्याल रखें।`;
      return `☀️ **Temperature is very high in ${loc}.**\n\n🌡️ Current: **${w.temp}°C** (Feels like: ${w.feels_like}°C)\n\n⚠️ Hot conditions — stay hydrated, avoid going out at noon, check on elderly and children.`;
    }
    if (lang === 'hi') return `🌡️ **${loc} में वर्तमान तापमान: ${w.temp}°C** (महसूस होता है: ${w.feels_like}°C)\n\nकोई लू चेतावनी सक्रिय नहीं है। अगर बाहर जाएं तो पानी साथ रखें।`;
    return `🌡️ **Current temperature in ${loc}: ${w.temp}°C** (Feels like: ${w.feels_like}°C)\n\nNo heatwave alert active. Carry water if going outdoors.`;
  },

  _lightningResponse(alerts, w, loc, lang) {
    const lightningAlert = alerts.find(a => a.hazard === 'LIGHTNING' || a.hazard === 'THUNDERSTORM');
    const hasThunder = (w.condition || '').toLowerCase().includes('thunder');

    if (lightningAlert) {
      const badge = lightningAlert.isDemo ? ' [SIMULATION]' : '';
      if (lang === 'hi') return `⚡ **${loc} के पास बिजली/तूफान अलर्ट है!**${badge}\n\n${lightningAlert.titleHi || lightningAlert.title}\n\n⚠️ **क्या करें:**\n• तुरंत घर के अंदर जाएं\n• खुले मैदानों और पेड़ों से बचें\n• पानी के स्रोतों से दूर रहें\n• बिजली के उपकरण बंद रखें`;
      return `⚡ **Lightning/thunderstorm alert near ${loc}!**${badge}\n\n${lightningAlert.title}\n\n⚠️ **Safety actions:**\n• Move indoors immediately\n• Avoid open fields and trees\n• Stay away from water bodies\n• Unplug electrical equipment`;
    }
    if (hasThunder) {
      if (lang === 'hi') return `⛈️ **${loc} में बिजली के साथ तूफान की स्थिति है।**\n\n⚠️ घर के अंदर रहें। बिजली कड़कते सुनते ही बाहर जाना बंद करें।`;
      return `⛈️ **Thunderstorm conditions in ${loc}.**\n\n⚠️ Stay indoors. Avoid venturing outside when lightning is occurring.`;
    }
    if (lang === 'hi') return `✅ **${loc} के पास कोई सक्रिय बिजली/तूफान चेतावनी नहीं है।**\n\nवर्तमान स्थिति: ${w.condition}। आसमान साफ है।`;
    return `✅ **No active lightning/thunderstorm warning near ${loc}.**\n\nCurrent condition: ${w.condition}. Skies are clear.`;
  },

  _farmerResponse(w, f, lang) {
    const tomorrow = f?.[1];
    const rainNext = f?.slice(0,3).reduce((sum,d) => sum + d.rain_mm, 0) || 0;
    if (lang === 'hi') {
      return `🌾 **किसान मौसम सलाह:**\n\n🌡️ तापमान: ${w.temp}°C (अधिकतम) / ${w.temp-6}°C (न्यूनतम)\n💧 आर्द्रता: ${w.humidity}%\n🌧️ अगले 3 दिनों में अपेक्षित वर्षा: **${Math.round(rainNext)} मिमी**\n\n${w.rain_prob > 60 ? '🌧️ अगले कुछ दिनों में भारी वर्षा की संभावना है। कटाई/बुवाई की योजना उसी अनुसार बनाएं।\n⚠️ अगर फसल काटने के लिए तैयार है तो जल्दी करें।' : w.rain_prob < 20 ? '☀️ अगले कुछ दिन शुष्क दिखते हैं। यह फसल काटने के लिए अच्छा समय हो सकता है।' : '🌤️ मध्यम मौसम की स्थिति। सामान्य कृषि गतिविधियां जारी रखी जा सकती हैं।'}\n\n⚠️ फसल-विशिष्ट सलाह के लिए स्थानीय कृषि अधिकारियों से परामर्श करें।\n📡 स्रोत: ${w.source || 'मौसम डेटा'}`;
    }
    return `🌾 **Farmer Weather Advisory:**\n\n🌡️ Temperature: ${w.temp}°C (max) / ${w.temp-6}°C (min)\n💧 Humidity: ${w.humidity}%\n🌧️ Expected rainfall next 3 days: **${Math.round(rainNext)}mm**\n\n${w.rain_prob > 60 ? '🌧️ Heavy rain likely in coming days. Plan harvesting/sowing accordingly.\n⚠️ If crop is ready for harvest, act promptly.' : w.rain_prob < 20 ? '☀️ Dry conditions expected. Good time for harvesting operations.' : '🌤️ Moderate weather conditions. Normal agricultural activities can continue.'}\n\n⚠️ Consult local agricultural officers for crop-specific guidance.\n📡 Source: ${w.source || 'Weather data'}`;
  },

  _fisherResponse(w, alerts, lang) {
    const cyclone = alerts.find(a => a.hazard === 'CYCLONE');
    const dangerous = cyclone || w.wind_speed > 45;
    if (lang === 'hi') {
      if (dangerous) return `🚫 **मछुआरों के लिए चेतावनी: समुद्र में न जाएं!**\n\n${cyclone ? `🌀 ${cyclone.titleHi || cyclone.title}\n` : ''}💨 हवा की गति: **${w.wind_speed} किमी/घंटा**\n🌊 समुद्री स्थिति: खतरनाक\n\n📞 तट रक्षक: 1554 | NDMA: 1078`;
      return `🚢 **${w.wind_speed > 25 ? 'सतर्कता के साथ' : 'सामान्य'} मछली पकड़ने की स्थिति।**\n\n💨 हवा: **${w.wind_speed} किमी/घंटा** (${Utils.windBeaufort(w.wind_speed).desc})\n🌊 वर्षा संभावना: ${w.rain_prob}%\n\n${w.wind_speed > 25 ? '⚠️ हवा की गति मध्यम से तेज है। सावधान रहें।' : '✅ समुद्री स्थिति अनुकूल दिखती है।'}\n\n📡 स्रोत: ${w.source || 'मौसम डेटा'}`;
    }
    if (dangerous) return `🚫 **FISHERMEN WARNING: Do NOT go to sea!**\n\n${cyclone ? `🌀 ${cyclone.title}\n` : ''}💨 Wind Speed: **${w.wind_speed} km/h**\n🌊 Sea Conditions: Dangerous\n\n📞 Coast Guard: 1554 | NDMA: 1078`;
    return `🚢 **${w.wind_speed > 25 ? 'Caution advised' : 'Normal'} fishing conditions.**\n\n💨 Wind: **${w.wind_speed} km/h** (${Utils.windBeaufort(w.wind_speed).desc})\n🌊 Rain probability: ${w.rain_prob}%\n\n${w.wind_speed > 25 ? '⚠️ Moderate to strong winds. Exercise caution.' : '✅ Sea conditions appear favorable.'}\n\n📡 Source: ${w.source || 'Weather data'}`;
  },

  _alertResponse(alerts, loc, lang) {
    if (!alerts.length) {
      if (lang === 'hi') return `✅ **${loc} के लिए कोई सक्रिय मौसम अलर्ट नहीं है।**\n\nसभी स्पष्ट! कोई वर्तमान खतरे की चेतावनी नहीं है। नवीनतम अपडेट के लिए अलर्ट पेज देखें।`;
      return `✅ **No active weather alerts for ${loc}.**\n\nAll clear! No current hazard warnings. Check the Alerts page for the latest updates.`;
    }
    const top = AlertService.getHighestSeverity(alerts);
    const badge = top.isDemo ? ' [SIMULATION]' : '';
    if (lang === 'hi') return `🚨 **${loc} के लिए ${alerts.length} सक्रिय अलर्ट:**${badge}\n\n📌 सबसे महत्वपूर्ण: **${top.titleHi || top.title}**\nगंभीरता: ${MS_CONFIG.SEVERITY[top.severity]?.labelHi || top.severity}\n📍 क्षेत्र: ${top.area}\n\n⚠️ **क्या करें:** ${top.actionHi || top.action}\n\n📞 आपातकाल: 1078 (NDMA)\n📡 स्रोत: ${top.source}`;
    return `🚨 **${alerts.length} active alert(s) for ${loc}:**${badge}\n\n📌 Most critical: **${top.title}**\nSeverity: ${top.severity}\n📍 Area: ${top.area}\n\n⚠️ **Action:** ${top.action}\n\n📞 Emergency: 1078 (NDMA)\n📡 Source: ${top.source}`;
  },

  _forecastResponse(f, loc, lang) {
    if (!f?.length) return this._noDataResponse(lang);
    const lines = f.slice(0,5).map((d,i) => {
      const day = i === 0 ? (lang === 'hi' ? 'आज' : 'Today') : i === 1 ? (lang === 'hi' ? 'कल' : 'Tomorrow') : d.day;
      return `${Utils.getWeatherIcon(d.condition)} **${day}** — ${d.temp_max}°C/${d.temp_min}°C, ${d.condition}, 🌧️${d.rain_prob}%`;
    }).join('\n');
    if (lang === 'hi') return `📅 **${loc} के लिए 5-दिवसीय पूर्वानुमान:**\n\n${lines}\n\n📡 पूर्ण पूर्वानुमान के लिए पूर्वानुमान पेज देखें।`;
    return `📅 **5-day forecast for ${loc}:**\n\n${lines}\n\n📡 Visit the Forecast page for the complete outlook.`;
  },

  _humidityResponse(w, loc, lang) {
    const level = w.humidity > 80 ? 'Very High' : w.humidity > 60 ? 'High' : w.humidity > 40 ? 'Moderate' : 'Low';
    if (lang === 'hi') return `💧 **${loc} में वर्तमान आर्द्रता: ${w.humidity}%** (${level})\n\n${w.humidity > 75 ? '⚠️ उच्च आर्द्रता से गर्मी और असुविधाजनक महसूस होती है। तरल पदार्थ पिएं।' : '✅ आर्द्रता का स्तर आरामदायक है।'}`;
    return `💧 **Current humidity in ${loc}: ${w.humidity}%** (${level})\n\n${w.humidity > 75 ? '⚠️ High humidity makes heat feel more intense. Stay hydrated.' : '✅ Humidity level is comfortable.'}`;
  },

  _windResponse(w, loc, lang) {
    const bft = Utils.windBeaufort(w.wind_speed);
    const dir = Utils.windDirection(w.wind_dir);
    if (lang === 'hi') return `💨 **${loc} में वर्तमान हवा:**\n\nगति: **${w.wind_speed} किमी/घंटा** (${bft.desc})\nदिशा: ${dir}\n\n${w.wind_speed > 50 ? '⚠️ तेज हवाएं चल रही हैं। बाहरी गतिविधियों से बचें।' : '✅ हवा सामान्य है।'}`;
    return `💨 **Current wind in ${loc}:**\n\nSpeed: **${w.wind_speed} km/h** (${bft.desc})\nDirection: ${dir}\n\n${w.wind_speed > 50 ? '⚠️ Strong winds. Avoid outdoor activities.' : '✅ Wind conditions are normal.'}`;
  },

  _currentWeatherResponse(w, loc, lang) {
    const badge = w.isDemo ? ' [DEMO DATA]' : '';
    if (lang === 'hi') return `🌤️ **${loc} में वर्तमान मौसम${badge}:**\n\n🌡️ तापमान: **${w.temp}°C** (महसूस होता है: ${w.feels_like}°C)\n💧 आर्द्रता: ${w.humidity}%\n💨 हवा: ${w.wind_speed} किमी/घंटा\n👁️ दृश्यता: ${w.visibility} किमी\n🌤️ स्थिति: ${w.condition}\n\n📡 स्रोत: ${w.source || 'मौसम डेटा'}`;
    return `🌤️ **Current weather in ${loc}${badge}:**\n\n🌡️ Temperature: **${w.temp}°C** (Feels like: ${w.feels_like}°C)\n💧 Humidity: ${w.humidity}%\n💨 Wind: ${w.wind_speed} km/h\n👁️ Visibility: ${w.visibility} km\n🌤️ Condition: ${w.condition}\n\n📡 Source: ${w.source || 'Weather data'}`;
  },

  _greetingResponse(lang) {
    if (lang === 'hi') return `🙏 **नमस्ते! मैं WeatherGPT — मौसम सेतु का AI सहायक हूं।**\n\nमैं आपकी मदद कर सकता हूं:\n• 🌧️ आज/कल बारिश की संभावना\n• ⚠️ आपके क्षेत्र के लिए अलर्ट\n• 🌡️ तापमान और हीटवेव जानकारी\n• 🚗 यात्रा सुरक्षा सलाह\n• 🌾 किसान और मछुआरा सलाह\n\nकृपया पूछें!`;
    return `👋 **Hello! I'm WeatherGPT — Mausam Setu's AI weather assistant.**\n\nI can help you with:\n• 🌧️ Rain probability today/tomorrow\n• ⚠️ Active alerts for your area\n• 🌡️ Temperature & heatwave info\n• 🚗 Travel safety advice\n• 🌾 Farmer & fisherman advisories\n\nWhat would you like to know?`;
  },

  _helpResponse(lang) {
    const suggestions = LangManager.t('chat_suggestions');
    const list = (Array.isArray(suggestions) ? suggestions : T.en.chat_suggestions).map(s => `• "${s}"`).join('\n');
    if (lang === 'hi') return `❓ **मैं इन विषयों पर मदद कर सकता हूं:**\n\n${list}\n\n📡 मेरी सभी जानकारी सत्यापित मौसम डेटा पर आधारित है।`;
    return `❓ **I can help with these topics:**\n\n${list}\n\n📡 All my information is based on verified weather data. I will always tell you when data is unavailable.`;
  },

  _noDataResponse(lang) {
    if (lang === 'hi') return `ℹ️ मुझे इस अनुरोध के लिए पर्याप्त सत्यापित मौसम जानकारी नहीं है। कृपया पहले अपना स्थान सेट करें और पुनः प्रयास करें।\n\n📡 आधिकारिक जानकारी के लिए: mausam.imd.gov.in`;
    return `ℹ️ I don't have enough verified weather information for this request. Please set your location first and try again.\n\n📡 Official source: mausam.imd.gov.in`;
  },

  _generalResponse(w, alerts, loc, lang) {
    return this._currentWeatherResponse(w, loc, lang) + '\n\n💬 Ask me about rain, alerts, travel safety, heatwaves, or farming!';
  },

  _matches(msg, keywords) {
    return keywords.some(k => msg.includes(k.toLowerCase()));
  },

  // ── Format message as HTML ─────────────────────────────────
  formatMessage(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>')
      .replace(/• (.*?)(<br>|$)/g, '<span style="display:block;margin:2px 0">• $1</span>');
  },
};

window.WeatherGPT = WeatherGPT;
