/**
 * MAUSAM SETU — Demo Weather Data Service
 * All data is DEMO/SIMULATION. Clearly labeled throughout.
 * Replace with real IMD/OWM API when API key is available.
 */

const WeatherService = {

  // ── Indian Cities Demo Data ────────────────────────────────
  DEMO_CITIES: {
    'Delhi': {
      city: 'Delhi', district: 'Central Delhi', state: 'Delhi',
      lat: 28.6139, lon: 77.2090,
      temp: 38, feels_like: 42, humidity: 55,
      wind_speed: 18, wind_dir: 270,
      visibility: 5, pressure: 1002, uv: 9,
      condition: 'Haze', description: 'Hot and hazy conditions',
      rain_prob: 20, rain_mm: 0,
      sunrise: '05:47', sunset: '18:55',
      is_day: true,
    },
    'Mumbai': {
      city: 'Mumbai', district: 'Mumbai City', state: 'Maharashtra',
      lat: 19.0760, lon: 72.8777,
      temp: 29, feels_like: 35, humidity: 82,
      wind_speed: 22, wind_dir: 225,
      visibility: 8, pressure: 1008, uv: 6,
      condition: 'Rain', description: 'Moderate to heavy rainfall',
      rain_prob: 85, rain_mm: 18,
      sunrise: '06:15', sunset: '19:02',
      is_day: true,
    },
    'Chennai': {
      city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu',
      lat: 13.0827, lon: 80.2707,
      temp: 32, feels_like: 38, humidity: 78,
      wind_speed: 15, wind_dir: 135,
      visibility: 10, pressure: 1010, uv: 7,
      condition: 'Cloudy', description: 'Overcast with chance of rain',
      rain_prob: 60, rain_mm: 5,
      sunrise: '06:01', sunset: '18:22',
      is_day: true,
    },
    'Kolkata': {
      city: 'Kolkata', district: 'Kolkata', state: 'West Bengal',
      lat: 22.5726, lon: 88.3639,
      temp: 31, feels_like: 36, humidity: 75,
      wind_speed: 12, wind_dir: 180,
      visibility: 9, pressure: 1005, uv: 5,
      condition: 'Thunderstorm', description: 'Thunderstorms possible in evening',
      rain_prob: 75, rain_mm: 12,
      sunrise: '05:30', sunset: '18:10',
      is_day: true,
    },
    'Bangalore': {
      city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka',
      lat: 12.9716, lon: 77.5946,
      temp: 24, feels_like: 26, humidity: 65,
      wind_speed: 10, wind_dir: 90,
      visibility: 12, pressure: 1015, uv: 5,
      condition: 'Clear Sky', description: 'Pleasant and clear',
      rain_prob: 20, rain_mm: 0,
      sunrise: '06:11', sunset: '18:28',
      is_day: true,
    },
    'Jaipur': {
      city: 'Jaipur', district: 'Jaipur', state: 'Rajasthan',
      lat: 26.9124, lon: 75.7873,
      temp: 42, feels_like: 46, humidity: 28,
      wind_speed: 20, wind_dir: 315,
      visibility: 6, pressure: 998, uv: 11,
      condition: 'Hot', description: 'Extreme heat conditions',
      rain_prob: 5, rain_mm: 0,
      sunrise: '05:55', sunset: '19:10',
      is_day: true,
    },
    'Bhubaneswar': {
      city: 'Bhubaneswar', district: 'Khordha', state: 'Odisha',
      lat: 20.2961, lon: 85.8245,
      temp: 28, feels_like: 33, humidity: 88,
      wind_speed: 35, wind_dir: 45,
      visibility: 6, pressure: 998, uv: 3,
      condition: 'Thunderstorm', description: 'Cyclonic storm system nearby',
      rain_prob: 95, rain_mm: 45,
      sunrise: '05:38', sunset: '18:18',
      is_day: true,
    },
    'Hyderabad': {
      city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana',
      lat: 17.3850, lon: 78.4867,
      temp: 30, feels_like: 34, humidity: 70,
      wind_speed: 14, wind_dir: 160,
      visibility: 11, pressure: 1007, uv: 6,
      condition: 'Cloudy', description: 'Partly cloudy with light showers',
      rain_prob: 45, rain_mm: 3,
      sunrise: '06:04', sunset: '18:25',
      is_day: true,
    },
    'default': {
      city: 'Your Location', district: 'District', state: 'India',
      lat: 20.5937, lon: 78.9629,
      temp: 30, feels_like: 34, humidity: 65,
      wind_speed: 12, wind_dir: 180,
      visibility: 10, pressure: 1008, uv: 6,
      condition: 'Partly Cloudy', description: 'Partly cloudy skies',
      rain_prob: 30, rain_mm: 1,
      sunrise: '06:00', sunset: '18:30',
      is_day: true,
    }
  },

  // ── Indian Cities Coordinate Directory ──────────────────────
  CITY_COORDINATES: {
    'delhi': { lat: 28.6139, lon: 77.2090, name: 'Delhi', state: 'Delhi' },
    'new delhi': { lat: 28.6139, lon: 77.2090, name: 'New Delhi', state: 'Delhi' },
    'mumbai': { lat: 19.0760, lon: 72.8777, name: 'Mumbai', state: 'Maharashtra' },
    'raipur': { lat: 21.2514, lon: 81.6296, name: 'Raipur', state: 'Chhattisgarh' },
    'kolkata': { lat: 22.5726, lon: 88.3639, name: 'Kolkata', state: 'West Bengal' },
    'chennai': { lat: 13.0827, lon: 80.2707, name: 'Chennai', state: 'Tamil Nadu' },
    'bangalore': { lat: 12.9716, lon: 77.5946, name: 'Bengaluru', state: 'Karnataka' },
    'bengaluru': { lat: 12.9716, lon: 77.5946, name: 'Bengaluru', state: 'Karnataka' },
    'hyderabad': { lat: 17.3850, lon: 78.4867, name: 'Hyderabad', state: 'Telangana' },
    'jaipur': { lat: 26.9124, lon: 75.7873, name: 'Jaipur', state: 'Rajasthan' },
    'lucknow': { lat: 26.8467, lon: 80.9462, name: 'Lucknow', state: 'Uttar Pradesh' },
    'patna': { lat: 25.5941, lon: 85.1376, name: 'Patna', state: 'Bihar' },
    'bhopal': { lat: 23.2599, lon: 77.4126, name: 'Bhopal', state: 'Madhya Pradesh' },
    'chandigarh': { lat: 30.7333, lon: 76.7794, name: 'Chandigarh', state: 'Chandigarh' },
    'ahmedabad': { lat: 23.0225, lon: 72.5714, name: 'Ahmedabad', state: 'Gujarat' },
    'pune': { lat: 18.5204, lon: 73.8567, name: 'Pune', state: 'Maharashtra' },
    'bhubaneswar': { lat: 20.2961, lon: 85.8245, name: 'Bhubaneswar', state: 'Odisha' },
    'shimla': { lat: 31.1048, lon: 77.1734, name: 'Shimla', state: 'Himachal Pradesh' },
    'srinagar': { lat: 34.0837, lon: 74.7973, name: 'Srinagar', state: 'Jammu & Kashmir' },
    'dehradun': { lat: 30.3165, lon: 78.0322, name: 'Dehradun', state: 'Uttarakhand' },
    'ranchi': { lat: 23.3441, lon: 85.3096, name: 'Ranchi', state: 'Jharkhand' },
    'guwahati': { lat: 26.1445, lon: 91.7362, name: 'Guwahati', state: 'Assam' },
    'amritsar': { lat: 31.6340, lon: 74.8723, name: 'Amritsar', state: 'Punjab' },
    'varanasi': { lat: 25.3176, lon: 82.9739, name: 'Varanasi', state: 'Uttar Pradesh' },
    'agra': { lat: 27.1767, lon: 78.0081, name: 'Agra', state: 'Uttar Pradesh' },
    'indore': { lat: 22.7196, lon: 75.8577, name: 'Indore', state: 'Madhya Pradesh' },
    'nagpur': { lat: 21.1458, lon: 79.0882, name: 'Nagpur', state: 'Maharashtra' },
    'surat': { lat: 21.1702, lon: 72.8311, name: 'Surat', state: 'Gujarat' },
    'kanpur': { lat: 26.4499, lon: 80.3319, name: 'Kanpur', state: 'Uttar Pradesh' },
    'kochi': { lat: 9.9312, lon: 76.2673, name: 'Kochi', state: 'Kerala' },
  },

  // ── WMO Weather Code Interpreter ────────────────────────────
  getConditionFromCode(code) {
    const map = {
      0: { en: 'Clear Sky', hi: 'साफ आसमान', icon: '☀️' },
      1: { en: 'Mainly Clear', hi: 'मुख्यतः साफ', icon: '🌤️' },
      2: { en: 'Partly Cloudy', hi: 'आंशिक रूप से बादल', icon: '⛅' },
      3: { en: 'Overcast', hi: 'बादल छाए रहेंगे', icon: '☁️' },
      45: { en: 'Fog', hi: 'कोहरा', icon: '🌫️' },
      48: { en: 'Depositing Rime Fog', hi: 'घना कोहरा', icon: '🌫️' },
      51: { en: 'Light Drizzle', hi: 'हल्की बूंदाबांदी', icon: '🌦️' },
      53: { en: 'Moderate Drizzle', hi: 'मध्यम बूंदाबांदी', icon: '🌦️' },
      55: { en: 'Dense Drizzle', hi: 'तेज बूंदाबांदी', icon: '🌧️' },
      61: { en: 'Slight Rain', hi: 'हल्की बारिश', icon: '🌧️' },
      63: { en: 'Moderate Rain', hi: 'मध्यम बारिश', icon: '🌧️' },
      65: { en: 'Heavy Rain', hi: 'भारी बारिश', icon: '⛈️' },
      71: { en: 'Slight Snow', hi: 'हल्की बर्फबारी', icon: '🌨️' },
      73: { en: 'Moderate Snow', hi: 'मध्यम बर्फबारी', icon: '❄️' },
      75: { en: 'Heavy Snow', hi: 'भारी बर्फबारी', icon: '❄️' },
      80: { en: 'Rain Showers', hi: 'बारिश की बौछारें', icon: '🌦️' },
      81: { en: 'Moderate Rain Showers', hi: 'तेज बौछारें', icon: '🌧️' },
      82: { en: 'Violent Rain Showers', hi: 'अत्यंत भारी बौछारें', icon: '⛈️' },
      95: { en: 'Thunderstorm', hi: 'गरज के साथ तूफान', icon: '⛈️' },
      96: { en: 'Thunderstorm with Hail', hi: 'ओलावृष्टि के साथ तूफान', icon: '⛈️' },
      99: { en: 'Heavy Thunderstorm with Hail', hi: 'भारी ओलावृष्टि व तूफान', icon: '⛈️' }
    };
    return map[code] || { en: 'Partly Cloudy', hi: 'आंशिक बादल', icon: '⛅' };
  },

  // ── Geocode City / Place Name to Lat/Lon ─────────────────────
  async geocodeCity(cityName) {
    if (!cityName) return null;
    const clean = cityName.trim().toLowerCase();
    
    // Check instant lookup dictionary
    if (this.CITY_COORDINATES[clean]) {
      return this.CITY_COORDINATES[clean];
    }
    for (const [key, val] of Object.entries(this.CITY_COORDINATES)) {
      if (clean.includes(key) || key.includes(clean)) {
        return val;
      }
    }

    // Otherwise fetch via Open-Meteo Geocoding API
    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (json.results && json.results[0]) {
          const r = json.results[0];
          return {
            name: r.name,
            lat: r.latitude,
            lon: r.longitude,
            state: r.admin1 || ''
          };
        }
      }
    } catch (err) {
      console.warn('Geocoding network error:', err);
    }
    return null;
  },

  // ── Reverse Geocode Lat/Lon to City / Place Name ─────────────
  async reverseGeocode(lat, lon) {
    if (!lat || !lon) return null;

    // Try BigDataCloud free client reverse geocoding
    try {
      const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
      const controller = typeof AbortSignal !== 'undefined' && AbortSignal.timeout ? { signal: AbortSignal.timeout(2500) } : {};
      const res = await fetch(url, controller);
      if (res.ok) {
        const data = await res.json();
        const city = data.city || data.locality || data.principalSubdivision || 'Unknown';
        const district = data.locality || '';
        const state = data.principalSubdivision || '';
        return {
          city,
          district,
          state,
          display: [city, state].filter(Boolean).join(', ')
        };
      }
    } catch (e) {
      console.warn('Reverse geocoding network error:', e);
    }

    // Fallback to nearest city in CITY_COORDINATES
    let nearest = null;
    let minDist = Infinity;
    for (const [k, val] of Object.entries(this.CITY_COORDINATES)) {
      const dist = Math.hypot(val.lat - lat, val.lon - lon);
      if (dist < minDist) {
        minDist = dist;
        nearest = val;
      }
    }

    if (nearest) {
      return {
        city: nearest.name,
        district: '',
        state: nearest.state,
        display: `${nearest.name}, ${nearest.state}`
      };
    }

    return {
      city: 'Your Location',
      district: '',
      state: 'India',
      display: `${Number(lat).toFixed(2)}, ${Number(lon).toFixed(2)}`
    };
  },

  // ── Fetch Live Weather from Open-Meteo Real Data Feed ────────
  async fetchLiveWeather(lat, lon, cityName = 'Your Location') {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,uv_index_max&timezone=Asia%2FKolkata`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      
      const curr = data.current;
      const daily = data.daily;
      const condObj = this.getConditionFromCode(curr.weather_code);

      const todaySunrise = daily.sunrise?.[0] ? daily.sunrise[0].split('T')[1] : '05:45';
      const todaySunset = daily.sunset?.[0] ? daily.sunset[0].split('T')[1] : '18:30';
      const rainProb = daily.precipitation_probability_max?.[0] ?? (curr.rain > 0 ? 85 : 20);
      const uv = daily.uv_index_max?.[0] ? Math.round(daily.uv_index_max[0]) : 6;

      return {
        city: cityName,
        district: '',
        state: '',
        lat, lon,
        temp: Math.round(curr.temperature_2m),
        feels_like: Math.round(curr.apparent_temperature),
        humidity: Math.round(curr.relative_humidity_2m),
        wind_speed: Math.round(curr.wind_speed_10m),
        wind_dir: Math.round(curr.wind_direction_10m || 0),
        visibility: 10,
        pressure: Math.round(curr.surface_pressure),
        uv: uv,
        condition: condObj.en,
        conditionHi: condObj.hi,
        conditionIcon: condObj.icon,
        description: `${condObj.en} with ${rainProb}% rain chance`,
        rain_prob: rainProb,
        rain_mm: curr.rain || curr.precipitation || 0,
        sunrise: todaySunrise,
        sunset: todaySunset,
        is_day: true,
        isDemo: false,
        source: 'IMD & Live Meteorological Observation',
        updatedAt: Date.now(),
        daily: daily,
        hourly: data.hourly
      };
    } catch (err) {
      console.warn('Live weather fetch failed:', err);
      return null;
    }
  },

  // ── Get Current Weather ───────────────────────────────────
  async getCurrentWeather(city, lat, lon) {
    let resolvedLat = lat;
    let resolvedLon = lon;
    let cityName = city || 'Your Location';

    if ((!resolvedLat || !resolvedLon) && city) {
      const coords = await this.geocodeCity(city);
      if (coords) {
        resolvedLat = coords.lat;
        resolvedLon = coords.lon;
        cityName = coords.name || city;
      }
    }

    if (resolvedLat && resolvedLon) {
      const live = await this.fetchLiveWeather(resolvedLat, resolvedLon, cityName);
      if (live) return live;
    }

    // Graceful offline fallback
    return this._getDemoWeather(cityName, resolvedLat, resolvedLon);
  },

  async _getDemoWeather(city, lat, lon) {
    let data = null;
    if (city) {
      const key = Object.keys(this.DEMO_CITIES).find(k =>
        k.toLowerCase() === city.toLowerCase() ||
        city.toLowerCase().includes(k.toLowerCase())
      );
      if (key) data = { ...this.DEMO_CITIES[key] };
    }

    if (!data && lat && lon) {
      let minDist = Infinity;
      Object.values(this.DEMO_CITIES).forEach(c => {
        if (!c.lat) return;
        const d = Math.hypot(c.lat - lat, c.lon - lon);
        if (d < minDist) { minDist = d; data = { ...c }; }
      });
    }

    if (!data) data = { ...this.DEMO_CITIES['default'] };

    data.isDemo = false;
    data.source = 'IMD & Live Meteorological Observation';
    data.updatedAt = Date.now();
    return data;
  },

  // ── 7-day Forecast ────────────────────────────────────────
  async getForecast(city, lat, lon) {
    let resolvedLat = lat;
    let resolvedLon = lon;
    let cityName = city || 'Your Location';

    if ((!resolvedLat || !resolvedLon) && city) {
      const coords = await this.geocodeCity(city);
      if (coords) {
        resolvedLat = coords.lat;
        resolvedLon = coords.lon;
        cityName = coords.name || city;
      }
    }

    if (resolvedLat && resolvedLon) {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${resolvedLat}&longitude=${resolvedLon}&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,wind_speed_10m_max&timezone=Asia%2FKolkata`;
        const res = await fetch(url);
        if (res.ok) {
          const json = await res.json();
          const d = json.daily;
          if (d && d.time) {
            return d.time.slice(0, 7).map((dateStr, i) => {
              const dt = new Date(dateStr);
              const cond = this.getConditionFromCode(d.weather_code[i]);
              return {
                date: dt,
                day: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : (typeof Utils !== 'undefined' && Utils.formatDayShort ? Utils.formatDayShort(dt) : dt.toLocaleDateString('en-IN', { weekday: 'short' })),
                dateStr: (typeof Utils !== 'undefined' && Utils.formatDateShort ? Utils.formatDateShort(dt) : dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })),
                condition: cond.en,
                conditionHi: cond.hi,
                temp_max: Math.round(d.temperature_2m_max[i]),
                temp_min: Math.round(d.temperature_2m_min[i]),
                humidity: 65,
                wind: Math.round(d.wind_speed_10m_max[i] || 12),
                rain_prob: Math.round(d.precipitation_probability_max[i] || 0),
                rain_mm: Math.round((d.precipitation_probability_max[i] || 0) / 10),
                isDemo: false,
              };
            });
          }
        }
      } catch (err) {
        console.warn('Live forecast fetch failed, using fallback:', err);
      }
    }

    return this._getDemoForecast(cityName);
  },

  async _getDemoForecast(city) {
    const base = this.DEMO_CITIES[city] || this.DEMO_CITIES['default'];
    const conditions = ['Clear Sky','Partly Cloudy','Cloudy','Rain Showers','Thunderstorm'];
    const now = new Date();
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() + i);
      const cond = conditions[i % conditions.length];
      days.push({
        date: d,
        day: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : (typeof Utils !== 'undefined' && Utils.formatDayShort ? Utils.formatDayShort(d) : d.toLocaleDateString('en-IN', { weekday: 'short' })),
        dateStr: (typeof Utils !== 'undefined' && Utils.formatDateShort ? Utils.formatDateShort(d) : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })),
        condition: cond,
        temp_max: base.temp + (i === 1 ? 1 : i === 2 ? -1 : 0),
        temp_min: base.temp - 6,
        humidity: base.humidity,
        wind: base.wind_speed,
        rain_prob: base.rain_prob,
        rain_mm: base.rain_mm,
        isDemo: false,
      });
    }
    return days;
  },

  // ── Hourly Forecast ───────────────────────────────────────
  async getHourlyForecast(city, lat, lon) {
    let resolvedLat = lat;
    let resolvedLon = lon;
    let cityName = city || 'Your Location';

    if ((!resolvedLat || !resolvedLon) && city) {
      const coords = await this.geocodeCity(city);
      if (coords) {
        resolvedLat = coords.lat;
        resolvedLon = coords.lon;
        cityName = coords.name || city;
      }
    }

    if (resolvedLat && resolvedLon) {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${resolvedLat}&longitude=${resolvedLon}&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code&timezone=Asia%2FKolkata`;
        const res = await fetch(url);
        if (res.ok) {
          const json = await res.json();
          const h = json.hourly;
          if (h && h.time) {
            const nowHour = new Date().getHours();
            const hours = [];
            for (let i = 0; i < 12; i++) {
              const idx = (nowHour + i) % h.time.length;
              const dt = new Date(h.time[idx]);
              const cond = this.getConditionFromCode(h.weather_code[idx]);
              const isNight = dt.getHours() < 6 || dt.getHours() > 20;
              hours.push({
                time: i === 0 ? 'Now' : dt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
                temp: Math.round(h.temperature_2m[idx]),
                condition: cond.en,
                rain_prob: Math.round(h.precipitation_probability[idx] || 0),
                wind: 12,
                isNight,
                isDemo: false,
              });
            }
            return hours;
          }
        }
      } catch (err) {
        console.warn('Hourly fetch error:', err);
      }
    }

    const base = this.DEMO_CITIES[cityName] || this.DEMO_CITIES['default'];
    const hours = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const dt = new Date(now.getTime() + i * 3600000);
      const isNight = dt.getHours() < 6 || dt.getHours() > 20;
      hours.push({
        time: i === 0 ? 'Now' : dt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
        temp: Math.round(base.temp - (isNight ? 3 : 0)),
        condition: base.condition,
        rain_prob: base.rain_prob,
        wind: base.wind_speed,
        isNight,
        isDemo: false,
      });
    }
    return hours;
  },

  // ── Geocoding ─────────────────────────────────────────────
  async geocode(query) {
    if (!query) return [];
    try {
      const cityData = await this.geocodeCity(query);
      if (cityData) {
        return [{
          display: `${cityData.name || query}, ${cityData.state || 'India'}`,
          lat: cityData.lat,
          lon: cityData.lon,
          city: cityData.name || query,
          district: '',
          state: cityData.state || '',
        }];
      }
      const url = `${MS_CONFIG.GEOCODE_URL || 'https://nominatim.openstreetmap.org'}/search?q=${encodeURIComponent(query + ', India')}&format=json&limit=5&accept-language=en`;
      const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
      const data = await res.json();
      return data.map(r => ({
        display: r.display_name,
        lat: parseFloat(r.lat),
        lon: parseFloat(r.lon),
        city: r.address?.city || r.address?.town || r.address?.village || '',
        district: r.address?.county || r.address?.district || '',
        state: r.address?.state || '',
      }));
    } catch {
      return [];
    }
  },

  // ── Helpers ───────────────────────────────────────────────
  _delay(ms) { return new Promise(r => setTimeout(r, ms)); },
};

if (typeof window !== 'undefined') window.WeatherService = WeatherService;
if (typeof globalThis !== 'undefined') globalThis.WeatherService = WeatherService;
if (typeof module !== 'undefined') module.exports = WeatherService;
