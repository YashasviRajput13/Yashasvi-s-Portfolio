/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    const scriptId = 'mousham-folio-engine';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.type = 'module';
      script.src = '/assets/folio-bundle.js';
      document.body.appendChild(script);
    }
  }, []);

  return <div id="folio-root" />;
}
