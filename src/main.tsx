import './folio-style.css';
import './index.css';
import { HACKATHONS_DATA, OTHER_ACHIEVEMENTS_DATA } from './data/hackathonsData';
import { checkWebGLAvailable, installLoaderTimeoutWatchdog } from './components/ErrorBoundary';

const win = window as unknown as {
  __FOLIO_VITE_ACTIVE__?: boolean;
  __FOLIO_DEV__?: boolean;
};
win.__FOLIO_VITE_ACTIVE__ = true;
win.__FOLIO_DEV__ = Boolean(import.meta.env.DEV);

window.__HACKATHON_DATA__ = {
  hackathons: HACKATHONS_DATA,
  achievements: OTHER_ACHIEVEMENTS_DATA,
};

// Ensure #root container exists before mounting the 3D bundle
if (!document.getElementById('root')) {
  const rootDiv = document.createElement('div');
  rootDiv.id = 'root';
  document.body.prepend(rootDiv);
}

// Show a visible dev-only message if WebGL is unavailable
if (
  (import.meta.env.DEV ||
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1') &&
  !checkWebGLAvailable()
) {
  console.error('[SceneErrorBoundary:WebGL] WebGL context is unavailable in this browser.');
  if (!document.getElementById('webgl-dev-warning')) {
    const banner = document.createElement('div');
    banner.id = 'webgl-dev-warning';
    banner.setAttribute('role', 'alert');
    banner.style.cssText =
      'position:fixed;top:64px;left:50%;transform:translateX(-50%);z-index:9999;background:#FFF8F0;color:#8B3A5E;border:2px solid #F9D5E5;border-radius:16px;padding:12px 20px;font-family:"Nunito",sans-serif;font-size:14px;font-weight:700;box-shadow:0 12px 32px rgba(0,0,0,0.35);max-width:92vw;text-align:center;';
    banner.textContent =
      'Dev Warning: WebGL is unavailable in this browser or hardware acceleration is disabled. The 3D scene requires WebGL.';
    document.body.appendChild(banner);
  }
}

// Install loader timeout watchdog so one slow/failed asset can never block the portfolio indefinitely
installLoaderTimeoutWatchdog(4000);

// Load the 3D portfolio bundle directly into #root
const baseUrl = import.meta.env.BASE_URL || '/';
const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

if (!document.querySelector('script[data-folio-bundle="true"]')) {
  const script = document.createElement('script');
  script.type = 'module';
  script.src = `${normalizedBase}assets/folio-bundle.js`;
  script.dataset.folioBundle = 'true';
  script.onerror = () => {
    console.error('[Portfolio]: Failed to load /assets/folio-bundle.js, retrying...');
    const fallbackScript = document.createElement('script');
    fallbackScript.type = 'module';
    fallbackScript.src = './assets/folio-bundle.js';
    document.body.appendChild(fallbackScript);
  };
  document.body.appendChild(script);
}

