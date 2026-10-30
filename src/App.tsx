/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { initDeviceOrientationParallax } from './utils/deviceOrientationParallax';

export default function App() {
  useEffect(() => {
    const cleanupParallax = initDeviceOrientationParallax();

    const scriptId = 'mousham-folio-engine';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.type = 'module';
      script.src = '/assets/folio-bundle.js';
      document.body.appendChild(script);
    }

    return () => {
      cleanupParallax();
    };
  }, []);

  return <div id="folio-root" />;
}
