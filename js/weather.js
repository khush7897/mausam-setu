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

  // ── Get current weather ───────────────────────────────────
  async getCurrentWeather(city, lat, lon) {
    if (MS_CONFIG.DEMO_MODE || !MS_CONFIG.OWM_API_KEY) {
      return this._getDemoWeather(city, lat, lon);
    }
    return this._fetchRealWeather(lat, lon);
  },

  async _getDemoWeather(city, lat, lon) {
    // Simulate network delay
    await this._delay(600);

    // Find closest city match or use lat/lon
    let data = null;
    if (city) {
      const key = Object.keys(this.DEMO_CITIES).find(k =>
        k.toLowerCase() === city.toLowerCase() ||
        city.toLowerCase().includes(k.toLowerCase())
      );
      if (key) data = { ...this.DEMO_CITIES[key] };
    }

    if (!data && lat && lon) {
      // Find closest by lat/lon
      let minDist = Infinity;
      Object.values(this.DEMO_CITIES).forEach(c => {
        if (!c.lat) return;
        const d = Math.hypot(c.lat - lat, c.lon - lon);
        if (d < minDist) { minDist = d; data = { ...c }; }
      });
    }

    if (!data) data = { ...this.DEMO_CITIES['default'] };

    // Add small random variation for realism
    data.temp = data.temp + Math.round(Math.random() * 2 - 1);
    data.humidity = Math.min(100, data.humidity + Math.round(Math.random() * 4 - 2));
    data.isDemo = true;
    data.source = 'DEMO DATA — Not real IMD data';
    data.updatedAt = Date.now();

    return data;
  },

  async _fetchRealWeather(lat, lon) {
    try {
      const url = `${MS_CONFIG.OWM_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${MS_CONFIG.OWM_API_KEY}&units=metric`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const d = await res.json();
      return {
        city: d.name, district: '', state: '',
        lat, lon,
        temp: Math.round(d.main.temp),
        feels_like: Math.round(d.main.feels_like),
        humidity: d.main.humidity,
        wind_speed: Math.round(d.wind.speed * 3.6),
        wind_dir: d.wind.deg || 0,
        visibility: Math.round((d.visibility || 10000) / 1000),
        pressure: d.main.pressure,
        uv: 0,
        condition: d.weather[0].main,
        description: d.weather[0].description,
        rain_prob: d.rain ? 80 : 20,
        rain_mm: d.rain?.['1h'] || 0,
        sunrise: new Date(d.sys.sunrise * 1000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }),
        sunset: new Date(d.sys.sunset * 1000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }),
        is_day: Date.now() / 1000 > d.sys.sunrise && Date.now() / 1000 < d.sys.sunset,
        isDemo: false,
        source: 'OpenWeatherMap',
        updatedAt: Date.now(),
      };
    } catch (e) {
      console.error('Weather fetch failed:', e);
      return null;
    }
  },

  // ── 7-day Forecast ────────────────────────────────────────
  async getForecast(city, lat, lon) {
    if (MS_CONFIG.DEMO_MODE || !MS_CONFIG.OWM_API_KEY) {
      return this._getDemoForecast(city);
    }
    return this._fetchRealForecast(lat, lon);
  },

  async _getDemoForecast(city) {
    await this._delay(500);
    const base = this.DEMO_CITIES[city] || this.DEMO_CITIES['default'];
    const conditions = ['Clear Sky','Cloudy','Rain','Heavy Rain','Partly Cloudy','Thunderstorm','Drizzle'];
    const now = new Date();

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() + i);
      const variation = Math.round(Math.random() * 4 - 2);
      const cond = conditions[Math.floor(Math.random() * conditions.length)];
      const rainProb = cond.toLowerCase().includes('rain') ? Math.round(60 + Math.random()*35)
                     : cond.toLowerCase().includes('thunder') ? Math.round(70 + Math.random()*25)
                     : Math.round(Math.random() * 40);
      days.push({
        date: d,
        day: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : Utils.formatDayShort(d),
        dateStr: Utils.formatDateShort(d),
        condition: cond,
        temp_max: base.temp + variation + 2,
        temp_min: base.temp + variation - 6,
        humidity: Math.min(100, base.humidity + Math.round(Math.random() * 10 - 5)),
        wind: Math.round(base.wind_speed + Math.random() * 8 - 4),
        rain_prob: rainProb,
        rain_mm: rainProb > 50 ? Math.round(rainProb / 10) : 0,
        isDemo: true,
      });
    }
    return days;
  },

  async _fetchRealForecast(lat, lon) {
    try {
      const url = `${MS_CONFIG.OWM_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${MS_CONFIG.OWM_API_KEY}&units=metric&cnt=56`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const d = await res.json();
      // Group by day
      const byDay = {};
      d.list.forEach(item => {
        const day = new Date(item.dt * 1000).toDateString();
        if (!byDay[day]) byDay[day] = [];
        byDay[day].push(item);
      });
      return Object.entries(byDay).slice(0, 7).map(([day, items], i) => {
        const temps = items.map(x => x.main.temp);
        const d = new Date(day);
        return {
          date: d,
          day: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : Utils.formatDayShort(d),
          dateStr: Utils.formatDateShort(d),
          condition: items[0].weather[0].main,
          temp_max: Math.round(Math.max(...temps)),
          temp_min: Math.round(Math.min(...temps)),
          humidity: Math.round(items.reduce((s,x) => s + x.main.humidity, 0) / items.length),
          wind: Math.round(items.reduce((s,x) => s + x.wind.speed * 3.6, 0) / items.length),
          rain_prob: items.some(x => x.rain) ? 70 : 20,
          rain_mm: items.reduce((s,x) => s + (x.rain?.['3h'] || 0), 0),
          isDemo: false,
        };
      });
    } catch (e) {
      console.error('Forecast fetch failed:', e);
      return null;
    }
  },

  // ── Hourly Forecast ───────────────────────────────────────
  async getHourlyForecast(city, lat, lon) {
    await this._delay(400);
    const base = this.DEMO_CITIES[city] || this.DEMO_CITIES['default'];
    const hours = [];
    const now = new Date();
    const conditions = ['Clear Sky', 'Partly Cloudy', 'Cloudy', 'Rain', 'Drizzle'];
    for (let i = 0; i < 12; i++) {
      const h = new Date(now.getTime() + i * 3600000);
      const isNight = h.getHours() < 6 || h.getHours() > 20;
      const variation = Math.sin(i * 0.5) * 2;
      const rainRise = base.rain_prob + (i > 4 ? 15 : 0);
      hours.push({
        time: i === 0 ? 'Now' : h.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
        temp: Math.round(base.temp + variation - (isNight ? 3 : 0)),
        condition: base.condition,
        rain_prob: Math.min(100, rainRise + Math.round(Math.random() * 10)),
        wind: Math.round(base.wind_speed + Math.random() * 6 - 3),
        isNight,
        isDemo: true,
      });
    }
    return hours;
  },

  // ── Geocoding ─────────────────────────────────────────────
  async geocode(query) {
    try {
      const url = `${MS_CONFIG.GEOCODE_URL}/search?q=${encodeURIComponent(query + ', India')}&format=json&limit=5&accept-language=en`;
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

  async reverseGeocode(lat, lon) {
    try {
      const url = `${MS_CONFIG.GEOCODE_URL}/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=en`;
      const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
      const d = await res.json();
      return {
        city: d.address?.city || d.address?.town || d.address?.village || 'Unknown',
        district: d.address?.county || d.address?.district || '',
        state: d.address?.state || '',
        display: d.display_name,
      };
    } catch {
      return { city: 'Unknown', district: '', state: '', display: '' };
    }
  },

  // ── Helpers ───────────────────────────────────────────────
  _delay(ms) { return new Promise(r => setTimeout(r, ms)); },
};

window.WeatherService = WeatherService;
