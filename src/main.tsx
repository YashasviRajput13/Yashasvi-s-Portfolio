import './index.css';

// Load the mousham.design 3D portfolio bundle directly into #root
const script = document.createElement('script');
script.type = 'module';
script.src = '/assets/folio-bundle.js';
document.body.appendChild(script);
