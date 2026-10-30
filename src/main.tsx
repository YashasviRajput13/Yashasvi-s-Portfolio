import './folio-style.css';
import './index.css';
import { HACKATHONS_DATA, OTHER_ACHIEVEMENTS_DATA } from './data/hackathonsData';
import { installLoaderTimeoutWatchdog } from './components/ErrorBoundary';

(window as unknown as { __FOLIO_VITE_ACTIVE__?: boolean }).__FOLIO_VITE_ACTIVE__ = true;

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
