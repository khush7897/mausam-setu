/**
 * MAUSAM SETU — Permissions & Access Gatekeeper
 * Requests phone number, GPS (required), microphone, and notifications/messages
 * before granting access to the platform.
 */

const PermissionsManager = {
  STORAGE_KEY: 'ms_permissions_v1',

  state: {
    phone: '',
    gpsGranted: false,
    micGranted: false,
    notifGranted: false,
    locationData: null
  },

  isGranted() {
    try {
      const data = JSON.parse(localStorage.getItem(this.STORAGE_KEY));
      return !!(data && data.completed && data.phone && data.phone.length >= 10);
    } catch {
      return false;
    }
  },

  getSavedPermissions() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || null;
    } catch {
      return null;
    }
  },

  init() {
    // If already verified, do nothing
    if (this.isGranted()) {
      return;
    }

    // Otherwise render the full-screen modal gatekeeper
    this.renderModal();
  },

  renderModal() {
    // Prevent multiple modals
    if (document.getElementById('permission-gatekeeper-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'permission-gatekeeper-overlay';
    overlay.className = 'permission-overlay';

    overlay.innerHTML = `
      <div class="permission-modal-card">
        <!-- Header -->
        <div class="perm-header">
          <div class="perm-logo-row">
            <img src="assets/logo-transparent.png" alt="Mausam Setu Logo" class="perm-logo-img">
            <div>
              <div class="perm-org-tag">भारत सरकार · राष्ट्रीय आपदा प्रबंधन (NDMA/IMD)</div>
              <h2 class="perm-title">Mausam Setu Access Authorization</h2>
            </div>
          </div>
          <p class="perm-subtitle">
            To provide life-saving early disaster warnings, personalized weather broadcasts, and WeatherGPT assistance, please grant the necessary emergency service permissions.
          </p>
        </div>

        <!-- Notification Banner -->
        <div class="perm-notice">
          <span class="perm-notice-icon">🛡️</span>
          <div class="perm-notice-text">
            <strong>Public Safety Verification:</strong> In accordance with early-warning protocols, GPS location and an active phone number are required for emergency alerts.
          </div>
        </div>

        <!-- Permission List -->
        <div class="perm-list">
          <!-- 1. GPS Location (Required) -->
          <div class="perm-item" id="perm-item-gps">
            <div class="perm-item-icon">📍</div>
            <div class="perm-item-content">
              <div class="perm-item-title-row">
                <span class="perm-item-name">GPS Location</span>
                <span class="perm-badge required">REQUIRED</span>
                <span class="perm-status" id="gps-status-text">Not Granted</span>
              </div>
              <p class="perm-item-desc">
                Enables hyper-local cyclone, flood, and lightning early warnings pinpointed to your exact coordinates.
              </p>
            </div>
            <button type="button" class="btn btn-primary btn-sm perm-btn" id="btn-request-gps" onclick="PermissionsManager.requestGPS()">
              Allow GPS
            </button>
          </div>

          <!-- 2. Mobile Phone Number (Required) -->
          <div class="perm-item" id="perm-item-phone">
            <div class="perm-item-icon">📱</div>
            <div class="perm-item-content">
              <div class="perm-item-title-row">
                <span class="perm-item-name">Phone Number</span>
                <span class="perm-badge required">REQUIRED</span>
              </div>
              <p class="perm-item-desc">
                Used to dispatch priority SMS and WhatsApp emergency warnings during imminent danger.
              </p>
              <div class="perm-phone-input-wrap">
                <span class="perm-country-code">🇮🇳 +91</span>
                <input 
                  type="tel" 
                  id="perm-phone-input" 
                  class="perm-phone-input" 
                  placeholder="Enter 10-digit mobile number" 
                  maxlength="10"
                  oninput="PermissionsManager.handlePhoneInput(this)"
                />
              </div>
              <div id="phone-error-msg" class="perm-error-text" style="display:none">
                Please enter a valid 10-digit Indian mobile number.
              </div>
            </div>
          </div>

          <!-- 3. Microphone (Voice Assistant) -->
          <div class="perm-item" id="perm-item-mic">
            <div class="perm-item-icon">🎙️</div>
            <div class="perm-item-content">
              <div class="perm-item-title-row">
                <span class="perm-item-name">Microphone Permission</span>
                <span class="perm-badge optional">RECOMMENDED</span>
                <span class="perm-status" id="mic-status-text">Not Granted</span>
              </div>
              <p class="perm-item-desc">
                Powers voice interaction with WeatherGPT and hands-free voice search during agricultural or fishing work.
              </p>
            </div>
            <button type="button" class="btn btn-outline btn-sm perm-btn" id="btn-request-mic" onclick="PermissionsManager.requestMic()">
              Enable Mic
            </button>
          </div>

          <!-- 4. Messages / Push Alerts -->
          <div class="perm-item" id="perm-item-notif">
            <div class="perm-item-icon">🔔</div>
            <div class="perm-item-content">
              <div class="perm-item-title-row">
                <span class="perm-item-name">Emergency Messages & Alerts</span>
                <span class="perm-badge optional">RECOMMENDED</span>
                <span class="perm-status" id="notif-status-text">Not Granted</span>
              </div>
              <p class="perm-item-desc">
                Allows instant high-priority browser alerts for severe weather and official NDMA advisories.
              </p>
            </div>
            <button type="button" class="btn btn-outline btn-sm perm-btn" id="btn-request-notif" onclick="PermissionsManager.requestNotifications()">
              Enable Alerts
            </button>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="perm-footer">
          <div class="perm-hint" id="perm-submit-hint">
            ⚠️ Please grant GPS location and enter your 10-digit mobile number to proceed.
          </div>
          <button 
            type="button" 
            class="btn btn-primary btn-full btn-lg perm-submit-btn" 
            id="perm-grant-all-btn" 
            onclick="PermissionsManager.submitAndEnter()"
          >
            🛡️ Confirm Permissions & Access Mausam Setu
          </button>
          <div class="perm-security-note">
            🔒 Your data is protected. Emergency numbers are solely utilized for disaster preparedness communications.
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Lock scrolling on page
    document.body.style.overflow = 'hidden';

    // Auto check if browser permissions already granted
    this.checkExistingPermissions();
  },

  async checkExistingPermissions() {
    // Check Notification status
    if ('Notification' in window && Notification.permission === 'granted') {
      this.state.notifGranted = true;
      this.updateItemUI('notif', true);
    }

    // Auto-fill existing phone from AuthService if logged in
    try {
      if (typeof AuthService !== 'undefined') {
        const u = AuthService.getCurrentUser();
        if (u && u.phone) {
          const input = document.getElementById('perm-phone-input');
          if (input) {
            input.value = u.phone.replace('+91', '').trim();
            this.handlePhoneInput(input);
          }
        }
      }
    } catch {}
  },

  handlePhoneInput(input) {
    input.value = input.value.replace(/\D/g, '').slice(0, 10);
    this.state.phone = input.value;

    const errorMsg = document.getElementById('phone-error-msg');
    if (this.state.phone.length === 10) {
      if (errorMsg) errorMsg.style.display = 'none';
      input.classList.add('valid');
      input.classList.remove('invalid');
    } else {
      input.classList.remove('valid');
    }
    this.checkCompletion();
  },

  async requestGPS() {
    const btn = document.getElementById('btn-request-gps');
    const statusText = document.getElementById('gps-status-text');

    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Locating...';
    }

    if (!('geolocation' in navigator)) {
      alert('Geolocation is not supported by your browser. Defaulting to New Delhi.');
      this.state.gpsGranted = true;
      this.updateItemUI('gps', true);
      this.checkCompletion();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.state.gpsGranted = true;
        this.state.locationData = {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude
        };

        // Save location into LocationService if available
        if (typeof LocationService !== 'undefined') {
          LocationService.setLocation({
            city: 'Current Location',
            state: 'GPS Detected',
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
            isGPS: true
          });
        }

        this.updateItemUI('gps', true);
        this.checkCompletion();
      },
      (err) => {
        console.warn('GPS request failed or denied:', err);
        // Fallback: allow proceeding with simulation coordinates
        const proceedFallback = confirm(
          'GPS permission was not granted by browser settings. Would you like to use simulated GPS (New Delhi Coordinates) for this session?'
        );
        if (proceedFallback) {
          this.state.gpsGranted = true;
          this.state.locationData = { lat: 28.6139, lon: 77.2090, simulated: true };
          if (typeof LocationService !== 'undefined') {
            LocationService.setLocation({
              city: 'New Delhi',
              state: 'Delhi',
              lat: 28.6139,
              lon: 77.2090,
              isGPS: true
            });
          }
          this.updateItemUI('gps', true, 'Simulated GPS');
        } else {
          if (btn) {
            btn.disabled = false;
            btn.textContent = 'Retry GPS';
          }
          if (statusText) statusText.textContent = 'Denied';
        }
        this.checkCompletion();
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  },

  async requestMic() {
    const btn = document.getElementById('btn-request-mic');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Requesting...';
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.state.micGranted = true;
      this.updateItemUI('mic', true, 'Simulated');
      this.checkCompletion();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop tracks immediately after verifying permission
      stream.getTracks().forEach(t => t.stop());
      this.state.micGranted = true;
      this.updateItemUI('mic', true);
    } catch (err) {
      console.warn('Microphone permission not granted:', err);
      // Soft grant for non-critical mic
      this.state.micGranted = false;
      this.updateItemUI('mic', false, 'Denied / Skipped');
    }
    this.checkCompletion();
  },

  async requestNotifications() {
    const btn = document.getElementById('btn-request-notif');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Requesting...';
    }

    if (!('Notification' in window)) {
      this.state.notifGranted = true;
      this.updateItemUI('notif', true, 'In-App Only');
      this.checkCompletion();
      return;
    }

    try {
      const result = await Notification.requestPermission();
      if (result === 'granted') {
        this.state.notifGranted = true;
        this.updateItemUI('notif', true);
      } else {
        this.state.notifGranted = false;
        this.updateItemUI('notif', false, 'Denied');
      }
    } catch (err) {
      console.warn('Notification permission error:', err);
      this.state.notifGranted = false;
      this.updateItemUI('notif', false, 'Skipped');
    }
    this.checkCompletion();
  },

  updateItemUI(type, granted, label = '') {
    const btn = document.getElementById(`btn-request-${type}`);
    const statusText = document.getElementById(`${type}-status-text`);
    const item = document.getElementById(`perm-item-${type}`);

    if (granted) {
      if (btn) {
        btn.textContent = '✓ Granted';
        btn.className = 'btn btn-sm perm-btn granted';
        btn.disabled = true;
      }
      if (statusText) {
        statusText.textContent = label || '✓ Granted';
        statusText.className = 'perm-status granted';
      }
      if (item) item.classList.add('completed');
    } else {
      if (btn) {
        btn.textContent = 'Retry';
        btn.disabled = false;
      }
      if (statusText) {
        statusText.textContent = label || 'Denied';
        statusText.className = 'perm-status denied';
      }
    }
  },

  checkCompletion() {
    const phoneValid = this.state.phone && this.state.phone.length === 10;
    const gpsValid = this.state.gpsGranted;
    const submitBtn = document.getElementById('perm-grant-all-btn');
    const hint = document.getElementById('perm-submit-hint');

    if (phoneValid && gpsValid) {
      if (submitBtn) {
        submitBtn.classList.remove('disabled');
        submitBtn.classList.add('ready');
      }
      if (hint) {
        hint.innerHTML = '✅ Required permissions verified! Click below to enter.';
        hint.style.color = '#2E7D32';
      }
      return true;
    } else {
      if (submitBtn) {
        submitBtn.classList.add('disabled');
        submitBtn.classList.remove('ready');
      }
      if (hint) {
        const missing = [];
        if (!gpsValid) missing.push('GPS location');
        if (!phoneValid) missing.push('10-digit mobile number');
        hint.innerHTML = `⚠️ Please complete required: <strong>${missing.join(' and ')}</strong>`;
        hint.style.color = '#C62828';
      }
      return false;
    }
  },

  submitAndEnter() {
    const phoneInput = document.getElementById('perm-phone-input');
    if (phoneInput) {
      this.state.phone = phoneInput.value.replace(/\D/g, '').slice(0, 10);
    }

    if (!this.state.phone || this.state.phone.length !== 10) {
      const errorMsg = document.getElementById('phone-error-msg');
      if (errorMsg) errorMsg.style.display = 'block';
      if (phoneInput) phoneInput.focus();
      return;
    }

    if (!this.state.gpsGranted) {
      alert('GPS Permission is required to access Mausam Setu early warning system. Please click "Allow GPS".');
      this.requestGPS();
      return;
    }

    // Save permissions
    const payload = {
      completed: true,
      phone: this.state.phone,
      gps: this.state.gpsGranted,
      mic: this.state.micGranted,
      notifications: this.state.notifGranted,
      location: this.state.locationData,
      grantedAt: new Date().toISOString()
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(payload));

    // Update current user mobile in AuthService if available
    try {
      if (typeof AuthService !== 'undefined') {
        const u = AuthService.getCurrentUser();
        if (u) {
          u.phone = '+91' + this.state.phone;
          AuthService._saveUser(u);
        }
      }
    } catch {}

    // Animate modal dismissal
    const overlay = document.getElementById('permission-gatekeeper-overlay');
    if (overlay) {
      overlay.classList.add('closing');
      setTimeout(() => {
        overlay.remove();
        document.body.style.overflow = '';
      }, 400);
    }

    if (typeof Utils !== 'undefined' && Utils.showToast) {
      Utils.showToast('✅ Permissions authorized. Welcome to Mausam Setu!', 'success', 3500);
    }
  },

  // Reset helper (for settings / testing)
  resetPermissions() {
    localStorage.removeItem(this.STORAGE_KEY);
    window.location.reload();
  }
};

// Auto-run on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => PermissionsManager.init());
  } else {
    PermissionsManager.init();
  }
}

window.PermissionsManager = PermissionsManager;
