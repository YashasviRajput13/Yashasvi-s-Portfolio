import './folio-style.css';
import './index.css';

// Load the 3D portfolio bundle directly into #root
const baseUrl = import.meta.env.BASE_URL || '/';
const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

if (!document.querySelector('script[data-folio-bundle="true"]')) {
  const script = document.createElement('script');
  script.type = 'module';
  script.src = `${normalizedBase}assets/folio-bundle.js`;
  script.dataset.folioBundle = 'true';
  document.body.appendChild(script);
}
