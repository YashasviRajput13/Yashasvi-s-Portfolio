import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { zenSound } from '../utils/soundEngine';

interface ToriiIntroOverlayProps {
  onFinish: () => void;
}

const TORII_PATH_D = `M486.203,30.815c-29.313,10.366-118.518,41.91-230.204,41.91S55.11,41.181,25.796,30.815L0,21.694l20.842,121.92 l8.888,3.144c24.586,8.694,63.632,15.025,113.844,18.682v42.577c-50.544-4.079-79.679-10.691-96.364-16.592l-10.709,30.282 c5.313,1.879,11.144,3.638,17.479,5.283v70.587h57.472v192.73h96.365v-192.73h96.365v192.73h96.365v-192.73h57.472v-70.587 c6.335-1.644,12.167-3.404,17.48-5.283l-10.709-30.283c-16.685,5.901-45.819,12.513-96.364,16.592v-42.577 c50.212-3.656,89.258-9.988,113.844-18.682l8.888-3.144l20.842-121.92L486.203,30.815z M175.695,458.184h-32.122V297.577h32.122 V458.184z M368.425,458.184h-32.122V297.577h32.122V458.184z M425.897,233.616v31.839H86.102v-31.839 c42.297,6.926,99.137,10.424,169.898,10.424C326.76,244.041,383.6,240.541,425.897,233.616z M175.695,210.091v-42.751 c13.641,0.637,27.928,1.105,42.829,1.394v42.821C203.048,211.247,188.805,210.745,175.695,210.091z M250.646,201.212V169.09 h10.707v32.122H250.646z M293.475,211.556v-42.821c14.901-0.289,29.188-0.757,42.829-1.394v42.751 C323.194,210.745,308.951,211.247,293.475,211.556z M462.732,119.265c-39.719,11.295-113.966,17.703-206.732,17.703 S88.986,130.56,49.267,119.265l-8.446-49.403c43.292,13.97,121.55,34.985,215.178,34.985s171.886-21.015,215.178-34.985 L462.732,119.265z`;

function createParchmentArtworkTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 576;
  const ctx = canvas.getContext('2d')!;

  // Warm parchment & mist gradient inspired by mousham.design's /images/main2.webp
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, '#D9C7A7');
  grad.addColorStop(0.55, '#E3D4B8');
  grad.addColorStop(1, '#B3C6D4');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Soft sun disk
  const sunGrad = ctx.createRadialGradient(512, 230, 10, 512, 230, 160);
  sunGrad.addColorStop(0, 'rgba(235, 92, 68, 0.78)');
  sunGrad.addColorStop(0.6, 'rgba(235, 92, 68, 0.25)');
  sunGrad.addColorStop(1, 'rgba(235, 92, 68, 0)');
  ctx.fillStyle = sunGrad;
  ctx.beginPath();
  ctx.arc(512, 230, 160, 0, Math.PI * 2);
  ctx.fill();

  // Distant mountain silhouettes
  ctx.fillStyle = 'rgba(42, 56, 76, 0.18)';
  ctx.beginPath();
  ctx.moveTo(0, 420);
  ctx.quadraticCurveTo(220, 290, 450, 390);
  ctx.quadraticCurveTo(720, 260, 1024, 380);
  ctx.lineTo(1024, 576);
  ctx.lineTo(0, 576);
  ctx.closePath();
  ctx.fill();

  // Torii silhouette in center
  ctx.strokeStyle = 'rgba(30, 41, 59, 0.65)';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(390, 210);
  ctx.quadraticCurveTo(512, 235, 634, 210);
  ctx.moveTo(410, 245);
  ctx.lineTo(614, 245);
  ctx.moveTo(445, 218);
  ctx.lineTo(445, 395);
  ctx.moveTo(579, 218);
  ctx.lineTo(579, 395);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

export const ToriiIntroOverlay: React.FC<ToriiIntroOverlayProps> = ({ onFinish }) => {
  const [stage, setStage] = useState<'stroke' | 'dissolve'>('stroke');
  const [dissolving, setDissolving] = useState(false);
  const pathRef = useRef<SVGPathElement | null>(null);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const startDissolveRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len}`;
    path.style.strokeDashoffset = `${len}`;
    path.style.transition = 'stroke-dashoffset 1.6s cubic-bezier(0.16, 1, 0.3, 1)';
    const raf = requestAnimationFrame(() => {
      path.style.strokeDashoffset = '0';
    });
    const timer = window.setTimeout(() => {
      setStage('dissolve');
    }, 1700);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (stage !== 'dissolve') return;
    const container = mountRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setPixelRatio(1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.inset = '0';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const tex = createParchmentArtworkTexture();

    const uniforms = {
      uTexture: { value: tex },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uTime: { value: 0 },
      uProgress: { value: 0 }
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        uniform sampler2D uTexture;
        uniform vec2 uResolution;
        uniform float uTime;
        uniform float uProgress;

        float random(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
        float noise(vec2 p){
          vec2 i = floor(p);
          vec2 f = fract(p);
          float a = random(i);
          float b = random(i + vec2(1.0, 0.0));
          float c = random(i + vec2(0.0, 1.0));
          float d = random(i + vec2(1.0, 1.0));
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }
        float fbm(vec2 p){
          float v = 0.0;
          float a = 0.5;
          for(int i = 0; i < 5; i++){
            v += a * noise(p);
            p *= 2.0;
            a *= 0.5;
          }
          return v;
        }
        void main() {
          vec2 st = vUv * vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);
          float n = fbm(st * 2.2 + uTime * 0.6);
          float threshold = smoothstep(0.0, 1.0, (n - (1.0 - uProgress * 1.35)));
          float alpha = 1.0 - threshold;
          vec4 color = texture2D(uTexture, vUv);
          gl_FragColor = vec4(color.rgb, color.a * alpha);
        }
      `
    });

    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(quad);

    let rafId = 0;
    let dissolvingNow = false;
    let dissolveStart = 0;
    const startClock = performance.now();

    const tick = () => {
      const now = performance.now();
      uniforms.uTime.value = (now - startClock) * 0.001;
      if (dissolvingNow) {
        const elapsed = (now - dissolveStart) / 1600;
        uniforms.uProgress.value = Math.min(1.5, elapsed * 1.5);
        if (elapsed >= 1.0) {
          onFinish();
          return;
        }
      }
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    startDissolveRef.current = () => {
      if (dissolvingNow) return;
      dissolvingNow = true;
      dissolveStart = performance.now();
      setDissolving(true);
      zenSound.playWhoosh();
      zenSound.startAmbient();
    };

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      tex.dispose();
      material.dispose();
      quad.geometry.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [stage, onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto">
      {stage === 'stroke' ? (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#E3D4B8] text-slate-800 px-6">
          <div className="relative w-32 h-32 mb-8">
            <svg
              viewBox="0 0 511.999 511.999"
              className="w-full h-full"
              style={{ filter: 'drop-shadow(0 0 24px rgba(55, 65, 81, 0.25))' }}
            >
              <path
                ref={pathRef}
                d={TORII_PATH_D}
                stroke="#374151"
                strokeWidth="3.2"
                fill="none"
              />
            </svg>
          </div>
          <p className="font-display text-xs tracking-[0.35em] uppercase text-slate-700">
            Yashasvi Singh Rajput · Sanctuary Folio
          </p>
          <button
            onClick={onFinish}
            className="mt-6 text-xs text-slate-600 hover:text-slate-900 underline underline-offset-4 cursor-pointer"
          >
            Skip Intro →
          </button>
        </div>
      ) : (
        <div ref={mountRef} className="fixed inset-0 flex items-center justify-center">
          {!dissolving && (
            <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-xl">
              <p className="text-xs font-mono uppercase tracking-[0.35em] text-slate-700 mb-3">
                Bhopal, India · AI &amp; ML Engineering
              </p>
              <h1 className="font-display text-4xl md:text-6xl font-bold text-slate-900 tracking-tight mb-4">
                Yashasvi Singh Rajput
              </h1>
              <p className="text-sm md:text-base text-slate-700 mb-8 max-w-md leading-relaxed">
                Step through the Torii Sanctuary to explore AI architectures, computer vision research, and full-stack systems in 3D.
              </p>
              <button
                onClick={() => startDissolveRef.current?.()}
                className="shine-button px-8 py-3.5 rounded-full bg-slate-900 text-white font-display text-sm tracking-wider uppercase shadow-xl hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-3"
              >
                <span>Enter Sanctuary</span>
                <span className="transition-transform duration-200">→</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
