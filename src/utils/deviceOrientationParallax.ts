/**
 * Mobile Device Orientation Parallax Controller
 * Listens to `deviceorientation` events on mobile viewports/devices and provides
 * normalized, smoothed tilt coordinates for 3D scene parallax effects.
 */

export interface ParallaxTiltState {
  /** Normalized horizontal tilt in [-1, 1] (from gamma) */
  targetX: number;
  /** Normalized vertical tilt in [-1, 1] (from beta relative to baseline) */
  targetY: number;
  /** Damped horizontal tilt in [-1, 1] */
  currentX: number;
  /** Damped vertical tilt in [-1, 1] */
  currentY: number;
  /** Whether a valid deviceorientation reading has been received */
  active: boolean;
  /** Baseline beta angle captured from initial holding posture */
  baselineBeta: number | null;
}

declare global {
  interface Window {
    __FOLIO_PARALLAX__?: ParallaxTiltState;
    __requestFolioOrientationPermission__?: () => Promise<void>;
  }
}

const MAX_TILT_DEG = 30;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function isMobileViewportOrDevice(): boolean {
  if (typeof window === 'undefined') return false;
  const mq = window.matchMedia?.('(max-width: 1024px), (pointer: coarse)');
  if (mq?.matches) return true;
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || '');
}

export function initDeviceOrientationParallax(): () => void {
  if (typeof window === 'undefined') return () => {};

  const state: ParallaxTiltState = window.__FOLIO_PARALLAX__ || {
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0,
    active: false,
    baselineBeta: null,
  };
  window.__FOLIO_PARALLAX__ = state;

  const reducedMotionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');

  const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
    if (reducedMotionQuery?.matches) {
      state.targetX = 0;
      state.targetY = 0;
      return;
    }

    if (!isMobileViewportOrDevice()) {
      state.targetX = 0;
      state.targetY = 0;
      return;
    }

    const { beta, gamma } = event;
    if (gamma === null || beta === null || Number.isNaN(gamma) || Number.isNaN(beta)) {
      return;
    }

    if (state.baselineBeta === null) {
      state.baselineBeta = clamp(beta, -45, 85);
    }

    const deltaGamma = clamp(gamma, -MAX_TILT_DEG, MAX_TILT_DEG);
    const deltaBeta = clamp(beta - state.baselineBeta, -MAX_TILT_DEG, MAX_TILT_DEG);

    state.targetX = deltaGamma / MAX_TILT_DEG;
    state.targetY = deltaBeta / MAX_TILT_DEG;
    state.active = true;
  };

  let permissionGranted = false;
  const requestPermissionIfNeeded = async () => {
    if (permissionGranted) return;
    try {
      const DeviceOrientationEventAny = DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<'granted' | 'denied'>;
      };
      if (typeof DeviceOrientationEventAny?.requestPermission === 'function') {
        const status = await DeviceOrientationEventAny.requestPermission();
        if (status === 'granted') {
          permissionGranted = true;
          window.addEventListener('deviceorientation', handleDeviceOrientation, { passive: true });
        }
      }
    } catch {
      // Ignore permission errors on non-HTTPS or unsupported browsers
    }
  };

  window.__requestFolioOrientationPermission__ = requestPermissionIfNeeded;

  window.addEventListener('deviceorientation', handleDeviceOrientation, { passive: true });
  window.addEventListener('touchstart', requestPermissionIfNeeded, { passive: true, once: true });

  return () => {
    window.removeEventListener('deviceorientation', handleDeviceOrientation);
    window.removeEventListener('touchstart', requestPermissionIfNeeded);
  };
}
