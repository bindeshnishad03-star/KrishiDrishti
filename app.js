/* KrishiDrishti Global Application UI & Utilities */

// Global Toast Notification Helper
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let iconClass = 'fa-info-circle';
  if (type === 'success') iconClass = 'fa-check-circle';
  if (type === 'error') iconClass = 'fa-exclamation-circle';

  toast.innerHTML = `<i class="fas ${iconClass}"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Global API Helper
async function fetchAPI(endpoint, options = {}) {
  const url = `${window.KRISHI_CONFIG.API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...Auth.getAuthHeaders(),
    ...options.headers
  };

  try {
    const response = await fetch(url, { ...options, headers });
    const data = await response.json();

    if (response.status === 401) {
      Auth.clearAuth();
      showToast('Session expired. Please log in again.', 'error');
      setTimeout(() => { window.location.href = '/login.html'; }, 1000);
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error(`[API Error] ${endpoint}:`, error);
    throw error;
  }
}

// Initialize Page Controls
document.addEventListener('DOMContentLoaded', () => {
  // Initialize i18n translations
  if (typeof i18n !== 'undefined') {
    i18n.applyTranslations();

    document.querySelectorAll('.lang-selector').forEach(sel => {
      sel.value = i18n.currentLang;
      sel.addEventListener('change', (e) => {
        i18n.setLanguage(e.target.value);
        showToast(`Language updated to ${e.target.options[e.target.selectedIndex].text}`, 'info');
      });
    });
  }

  // Initialize Live Location Service
  if (typeof LocationService !== 'undefined') {
    LocationService.updateLocationUI();

    document.querySelectorAll('.location-badge').forEach(badge => {
      badge.addEventListener('click', async () => {
        await LocationService.detectLiveLocation();
      });
    });
  }

  // Initialize Voice Input Buttons
  if (typeof VoiceService !== 'undefined') {
    document.querySelectorAll('.header-mic-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const activeInput = document.querySelector('input:focus, textarea:focus') || document.querySelector('input[type="text"]');
        VoiceService.startListening((text) => {}, activeInput);
      });
    });
  }

  // Highlight Active Sidebar Item
  const currentPath = window.location.pathname.toLowerCase();
  const navItems = document.querySelectorAll('.nav-item');

  navItems.forEach(item => {
    const href = item.getAttribute('href');
    if (href && (currentPath.endsWith(href) || (currentPath === '/' && href === '/index.html'))) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Render User Info if Authenticated
  const user = Auth.getUser();
  if (user) {
    const nameEls = document.querySelectorAll('.user-name');
    const avatarEls = document.querySelectorAll('.user-avatar');

    nameEls.forEach(el => el.textContent = user.name || 'Farmer');
    avatarEls.forEach(el => {
      const initial = (user.name || 'F').charAt(0).toUpperCase();
      el.textContent = initial;
    });
  }

  // Mobile Menu Sidebar Toggle
  const mobileBtn = document.querySelector('.mobile-toggle');
  const sidebar = document.querySelector('.sidebar');
  if (mobileBtn && sidebar) {
    mobileBtn.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
    });
  }
});

window.showToast = showToast;
window.fetchAPI = fetchAPI;
