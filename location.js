/* KrishiDrishti Live Location Detection Service */

const LocationService = {
  LOCATION_KEY: 'krishi_live_location',

  getLocation() {
    const raw = localStorage.getItem(this.LOCATION_KEY);
    try {
      return raw ? JSON.parse(raw) : { name: 'Ludhiana, Punjab', lat: 30.9, lon: 75.85, isLive: false };
    } catch (e) {
      return { name: 'Ludhiana, Punjab', lat: 30.9, lon: 75.85, isLive: false };
    }
  },

  setLocation(locData) {
    localStorage.setItem(this.LOCATION_KEY, JSON.stringify(locData));
    this.updateLocationUI();
    // Dispatch custom location change event
    window.dispatchEvent(new CustomEvent('krishi_location_changed', { detail: locData }));
  },

  async detectLiveLocation() {
    if (!navigator.geolocation) {
      if (typeof showToast === 'function') showToast('Geolocation is not supported by your browser.', 'error');
      return null;
    }

    this.updateLocationUIState('Detecting...');

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          let placeName = `Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`;
          try {
            // Reverse geocode via BigDataCloud / Open-Meteo free API
            const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
            const data = await res.json();

            const city = data.locality || data.city || data.principalSubdivisionCode || 'Local Region';
            const state = data.principalSubdivision || 'India';
            placeName = `${city}, ${state}`;
          } catch (e) {
            console.warn('[Location] Reverse geocode fallback used:', e);
          }

          const locObj = { name: placeName, lat, lon, isLive: true };
          this.setLocation(locObj);
          if (typeof showToast === 'function') showToast(`Location updated: ${placeName}`, 'success');
          resolve(locObj);
        },
        (error) => {
          console.warn('[Location] Geolocation error:', error.message);
          if (typeof showToast === 'function') showToast('Unable to detect live GPS location. Using default location.', 'info');
          const defaultLoc = this.getLocation();
          this.updateLocationUI();
          resolve(defaultLoc);
        },
        { timeout: 8000, maximumAge: 60000 }
      );
    });
  },

  updateLocationUIState(text) {
    const badgeEls = document.querySelectorAll('.live-loc-text');
    badgeEls.forEach(el => el.textContent = text);
  },

  updateLocationUI() {
    const loc = this.getLocation();
    const badgeEls = document.querySelectorAll('.live-loc-text');
    const badgeIcons = document.querySelectorAll('.live-loc-icon');

    badgeEls.forEach(el => el.textContent = loc.name);
    badgeIcons.forEach(icon => {
      if (loc.isLive) {
        icon.className = 'fas fa-location-arrow';
        icon.style.color = 'var(--accent-light)';
      } else {
        icon.className = 'fas fa-map-marker-alt';
        icon.style.color = 'var(--text-muted)';
      }
    });
  }
};

window.LocationService = LocationService;
