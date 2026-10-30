import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RESUME_DATA } from '../data/resumeData';
import { initDeviceOrientationParallax } from '../utils/deviceOrientationParallax';

interface OceanWorld3DProps {
  scrollProgress: number;
  isDarkMode: boolean;
  onSelectProject: (projectId: number) => void;
  projectRingRotationOffset: number;
}

// Pre-allocated math helpers outside the render loop (Zero GC)
const _camPos = new THREE.Vector3();
const _lookPos = new THREE.Vector3();
const _smoothCamPos = new THREE.Vector3(0, 2.2, 12);
const _smoothLookPos = new THREE.Vector3(0, 2.0, -25);
const _dummyMatrix = new THREE.Matrix4();
const _dummyPos = new THREE.Vector3();
const _dummyQuat = new THREE.Quaternion();
const _dummyScale = new THREE.Vector3();
const _dummyEuler = new THREE.Euler();
const _dummyColor = new THREE.Color();

function createProceduralWaterNormalMap(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const imgData = ctx.createImageData(256, 256);
  const data = imgData.data;

  for (let y = 0; y < 256; y++) {
    for (let x = 0; x < 256; x++) {
      const idx = (y * 256 + x) * 4;
      const nx =
        Math.sin((x / 256) * Math.PI * 8) * 0.5 +
        Math.cos(((x + y) / 256) * Math.PI * 16) * 0.25;
      const ny =
        Math.cos((y / 256) * Math.PI * 8) * 0.5 +
        Math.sin(((x - y) / 256) * Math.PI * 16) * 0.25;
      data[idx] = Math.floor((nx * 0.5 + 0.5) * 255);
      data[idx + 1] = Math.floor((ny * 0.5 + 0.5) * 255);
      data[idx + 2] = 235;
      data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(45, 45);
  texture.needsUpdate = true;
  return texture;
}

function createTextBannerTexture(
  renderer: THREE.WebGLRenderer,
  lines: string[],
  options: {
    width?: number;
    height?: number;
    titleColor?: string;
    subColor?: string;
    bgColor?: string;
    borderColor?: string;
    brushFont?: boolean;
  } = {}
): THREE.CanvasTexture {
  const width = options.width || 1024;
  const height = options.height || 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, width, height);

  if (options.bgColor) {
    ctx.fillStyle = options.bgColor;
    ctx.beginPath();
    ctx.roundRect(16, 16, width - 32, height - 32, 28);
    ctx.fill();
  }

  if (options.borderColor) {
    ctx.strokeStyle = options.borderColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(16, 16, width - 32, height - 32, 28);
    ctx.stroke();
  }

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const totalLines = lines.length;
  const startY = height * 0.5 - ((totalLines - 1) * 68) * 0.5;

  lines.forEach((line, idx) => {
    const isFirst = idx === 0;
    const fontName = options.brushFont
      ? '"Permanent Marker", "Outfit", sans-serif'
      : '"Outfit", "Plus Jakarta Sans", sans-serif';
    ctx.font = isFirst
      ? `bold 64px ${fontName}`
      : `500 42px ${fontName}`;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
    ctx.shadowBlur = 16;
    ctx.fillStyle = isFirst
      ? options.titleColor || '#FFFFFF'
      : options.subColor || '#E2E8F0';
    ctx.fillText(line, width / 2, startY + idx * 72);
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  tex.needsUpdate = true;
  return tex;
}

function createProjectCardTexture(
  renderer: THREE.WebGLRenderer,
  project: (typeof RESUME_DATA.projects)[0]
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 560;
  const ctx = canvas.getContext('2d')!;

  // Deep architectural card background
  const grad = ctx.createLinearGradient(0, 0, 1024, 560);
  grad.addColorStop(0, '#0B1326');
  grad.addColorStop(0.6, '#101D38');
  grad.addColorStop(1, '#080E1C');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect(8, 8, 1008, 544, 32);
  ctx.fill();

  // Accent top bar & border
  ctx.strokeStyle = project.accentColor;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.roundRect(12, 12, 1000, 536, 28);
  ctx.stroke();

  // Ambient glow orb
  const radial = ctx.createRadialGradient(860, 130, 10, 860, 130, 260);
  radial.addColorStop(0, `${project.accentColor}55`);
  radial.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, 1024, 560);

  // Number index
  ctx.font = '800 120px "Outfit", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.textAlign = 'right';
  ctx.fillText(project.short, 960, 145);

  // Category Kicker
  ctx.textAlign = 'left';
  ctx.font = '600 26px "JetBrains Mono", monospace';
  ctx.fillStyle = project.accentColor;
  ctx.fillText(project.category.toUpperCase(), 64, 92);

  // Title
  ctx.font = '800 68px "Outfit", sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(project.title, 64, 178);

  // Subtitle
  ctx.font = '500 32px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#CBD5E1';
  ctx.fillText(project.subtitle, 64, 232);

  // Divider line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(64, 268);
  ctx.lineTo(960, 268);
  ctx.stroke();

  // Tech stack summary
  ctx.font = '500 26px "JetBrains Mono", monospace';
  ctx.fillStyle = '#9DDCE9';
  const stackLine = project.techStack.slice(0, 6).join(' · ');
  ctx.fillText(stackLine, 64, 330);

  // Architecture flow preview
  ctx.font = '400 25px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#94A3B8';
  const archLine = project.architecturePattern.length > 68
    ? project.architecturePattern.slice(0, 68) + '...'
    : project.architecturePattern;
  ctx.fillText(archLine, 64, 390);

  // Interactive prompt footer
  ctx.fillStyle = project.accentColor;
  ctx.beginPath();
  ctx.roundRect(64, 438, 310, 64, 14);
  ctx.fill();

  ctx.font = '700 26px "Outfit", sans-serif';
  ctx.fillStyle = '#060B16';
  ctx.fillText('CLICK TO INSPECT →', 92, 479);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  tex.needsUpdate = true;
  return tex;
}

// Composite 3–12 part procedural Runestone Island base (mousham.design runestone.glb equivalent)
function createRunestoneIslandBase(): THREE.Group {
  const group = new THREE.Group();

  const stoneDarkMat = new THREE.MeshStandardMaterial({
    color: 0x263142,
    roughness: 0.82,
    metalness: 0.12
  });
  const stoneMidMat = new THREE.MeshStandardMaterial({
    color: 0x36455c,
    roughness: 0.65,
    metalness: 0.18
  });
  const runeGlowMat = new THREE.MeshStandardMaterial({
    color: 0x9ddce9,
    emissive: 0x38bdf8,
    emissiveIntensity: 1.4,
    roughness: 0.25,
    metalness: 0.5
  });

  // 5 Concentric Stepped Stone Platforms
  const tiers = [
    { radius: 13.5, height: 1.6, y: 0.8, rot: 0 },
    { radius: 11.4, height: 1.4, y: 2.2, rot: Math.PI / 8 },
    { radius: 9.2, height: 1.2, y: 3.4, rot: -Math.PI / 6 },
    { radius: 7.2, height: 1.1, y: 4.4, rot: Math.PI / 4 },
    { radius: 5.4, height: 1.0, y: 5.3, rot: 0 }
  ];

  tiers.forEach((t, i) => {
    const geo = new THREE.CylinderGeometry(t.radius * 0.96, t.radius, t.height, 8);
    const mesh = new THREE.Mesh(geo, i % 2 === 0 ? stoneDarkMat : stoneMidMat);
    mesh.position.y = t.y;
    mesh.rotation.y = t.rot;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);

    // Glowing Rune Ring Inlay
    if (i === 1 || i === 3) {
      const ringGeo = new THREE.TorusGeometry(t.radius * 0.98, 0.09, 8, 24);
      const ring = new THREE.Mesh(ringGeo, runeGlowMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = t.y + t.height * 0.35;
      group.add(ring);
    }
  });

  // 4 Ancient Perimeter Stone Pillars with Beveled Caps
  const pillarAngles = [Math.PI * 0.2, Math.PI * 0.8, Math.PI * 1.25, Math.PI * 1.75];
  pillarAngles.forEach((angle, idx) => {
    const pillarGroup = new THREE.Group();
    const r = 10.2;
    pillarGroup.position.set(Math.cos(angle) * r, 2.5, Math.sin(angle) * r);
    pillarGroup.rotation.y = -angle;

    const h = 5.5 + (idx % 2) * 1.6;
    const base = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.0, 1.7), stoneDarkMat);
    base.position.y = 0.5;
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.72, h, 6), stoneMidMat);
    shaft.position.y = 1.0 + h * 0.5;
    const cap = new THREE.Mesh(new THREE.ConeGeometry(0.95, 1.1, 6), stoneDarkMat);
    cap.position.y = 1.0 + h + 0.55;
    const runeStrip = new THREE.Mesh(new THREE.BoxGeometry(0.18, h * 0.65, 0.18), runeGlowMat);
    runeStrip.position.set(0, 1.0 + h * 0.5, 0.62);

    pillarGroup.add(base, shaft, cap, runeStrip);
    group.add(pillarGroup);
  });

  return group;
}

// Composite 10-part Japanese Torii Gate Sanctuary (mousham.design yW equivalent)
function createToriiGateMonument(): THREE.Group {
  const group = new THREE.Group();

  const vermilionMat = new THREE.MeshStandardMaterial({
    color: 0xd93829,
    roughness: 0.38,
    metalness: 0.15
  });
  const darkCedarMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.68,
    metalness: 0.25
  });
  const goldTrimMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.22,
    metalness: 0.88
  });
  const stonePlinthMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.85,
    metalness: 0.1
  });

  // Stepped Underwater & Surface Sanctuary Plinth
  const plinth1 = new THREE.Mesh(new THREE.BoxGeometry(22, 1.4, 8), stonePlinthMat);
  plinth1.position.y = 0.7;
  const plinth2 = new THREE.Mesh(new THREE.BoxGeometry(18, 0.9, 6), stonePlinthMat);
  plinth2.position.y = 1.6;
  group.add(plinth1, plinth2);

  // Left & Right Kamebara (Black Stone Column Bases) + Hashira (Vermilion Columns)
  [-5.2, 5.2].forEach((x) => {
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 1.05, 2.2, 16), darkCedarMat);
    base.position.set(x, 2.8, 0);

    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.75, 13.5, 20), vermilionMat);
    col.position.set(x, 9.5, 0);
    col.castShadow = true;

    const goldBand = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.68, 0.35, 20), goldTrimMat);
    goldBand.position.set(x, 13.0, 0);

    group.add(base, col, goldBand);
  });

  // Nuki (Lower Horizontal Crossbeam)
  const nuki = new THREE.Mesh(new THREE.BoxGeometry(15.2, 0.78, 0.75), vermilionMat);
  nuki.position.set(0, 12.6, 0);
  const nukiWedgesLeft = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.05, 0.95), darkCedarMat);
  nukiWedgesLeft.position.set(-5.2, 12.6, 0);
  const nukiWedgesRight = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.05, 0.95), darkCedarMat);
  nukiWedgesRight.position.set(5.2, 12.6, 0);
  group.add(nuki, nukiWedgesLeft, nukiWedgesRight);

  // Shimaki (Secondary Upper Lintel)
  const shimaki = new THREE.Mesh(new THREE.BoxGeometry(16.6, 0.75, 1.05), vermilionMat);
  shimaki.position.set(0, 15.6, 0);
  group.add(shimaki);

  // Kasagi (Curved Top Roof Beam)
  const kasagiMain = new THREE.Mesh(new THREE.BoxGeometry(18.2, 0.85, 1.45), darkCedarMat);
  kasagiMain.position.set(0, 16.35, 0);
  const kasagiTipL = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.75, 1.48), darkCedarMat);
  kasagiTipL.position.set(-9.6, 16.65, 0);
  kasagiTipL.rotation.z = -0.18;
  const kasagiTipR = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.75, 1.48), darkCedarMat);
  kasagiTipR.position.set(9.6, 16.65, 0);
  kasagiTipR.rotation.z = 0.18;
  group.add(kasagiMain, kasagiTipL, kasagiTipR);

  // Gakuzuka (Central Vertical Strut & Golden Plaque)
  const strut = new THREE.Mesh(new THREE.BoxGeometry(0.95, 3.0, 0.65), vermilionMat);
  strut.position.set(0, 14.1, 0);
  const plaque = new THREE.Mesh(new THREE.BoxGeometry(2.1, 2.7, 0.82), darkCedarMat);
  plaque.position.set(0, 14.1, 0);
  const plaqueTrim = new THREE.Mesh(new THREE.BoxGeometry(2.3, 2.9, 0.75), goldTrimMat);
  plaqueTrim.position.set(0, 14.1, 0);
  group.add(strut, plaque, plaqueTrim);

  return group;
}

// Composite 6-part Japanese Lantern (mousham.design bT equivalent)
function createJapaneseLantern(
  renderer: THREE.WebGLRenderer,
  topText: string,
  bottomText: string
): THREE.Group {
  const group = new THREE.Group();

  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.6,
    metalness: 0.35
  });
  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.25,
    metalness: 0.85
  });
  const paperMat = new THREE.MeshStandardMaterial({
    color: 0xfff7ed,
    emissive: 0xf59e0b,
    emissiveIntensity: 0.65,
    roughness: 0.4,
    metalness: 0.05
  });

  // Pedestal + Post + Top Cap + Glowing Paper Body + Roof
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.4, 0.9, 8), frameMat);
  base.position.y = 0.45;

  const body = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.15, 3.2, 16), paperMat);
  body.position.y = 2.5;

  const lowerRing = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.12, 8, 24), goldMat);
  lowerRing.rotation.x = Math.PI / 2;
  lowerRing.position.y = 1.0;

  const upperRing = new THREE.Mesh(new THREE.TorusGeometry(1.28, 0.12, 8, 24), goldMat);
  upperRing.rotation.x = Math.PI / 2;
  upperRing.position.y = 4.0;

  const roof = new THREE.Mesh(new THREE.ConeGeometry(2.1, 1.2, 8), frameMat);
  roof.position.y = 4.65;

  const finial = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 12), goldMat);
  finial.position.y = 5.35;

  // Floating Label Plaque in front of Lantern
  const labelTex = createTextBannerTexture(renderer, [topText, bottomText], {
    width: 512,
    height: 256,
    bgColor: 'rgba(11, 19, 38, 0.88)',
    borderColor: '#719CED',
    titleColor: '#FFFFFF',
    subColor: '#9DDCE9',
    brushFont: true
  });
  const labelPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(4.2, 2.1),
    new THREE.MeshBasicMaterial({ map: labelTex, transparent: true, side: THREE.DoubleSide })
  );
  labelPlane.position.set(0, 2.5, 1.55);

  group.add(base, body, lowerRing, upperRing, roof, finial, labelPlane);
  return group;
}

// Composite Lotus Flower Sculpture (mousham.design flower.gltf equivalent)
function createLotusSculpture(): THREE.Group {
  const group = new THREE.Group();
  const petalMat = new THREE.MeshStandardMaterial({
    color: 0xf43f5e,
    emissive: 0x881337,
    emissiveIntensity: 0.35,
    roughness: 0.35,
    metalness: 0.2
  });
  const goldCoreMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    roughness: 0.2,
    metalness: 0.9
  });

  const core = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.0, 0.7, 16), goldCoreMat);
  core.position.y = 0.6;
  group.add(core);

  const petalGeo = new THREE.ConeGeometry(0.65, 2.4, 5);
  petalGeo.translate(0, 1.1, 0);

  for (let ring = 0; ring < 2; ring++) {
    const count = ring === 0 ? 8 : 12;
    const tilt = ring === 0 ? 0.55 : 0.95;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + ring * 0.25;
      const petal = new THREE.Mesh(petalGeo, petalMat);
      petal.rotation.order = 'YXZ';
      petal.rotation.y = angle;
      petal.rotation.x = tilt;
      petal.position.y = 0.5;
      group.add(petal);
    }
  }
  return group;
}

// Composite Sakura Cherry Blossom Tree (mousham.design sakura_tree.glb equivalent)
function createSakuraTree(): THREE.Group {
  const group = new THREE.Group();
  const barkMat = new THREE.MeshStandardMaterial({
    color: 0x3b2314,
    roughness: 0.88,
    metalness: 0.05
  });
  const blossomMat = new THREE.MeshStandardMaterial({
    color: 0xf9a8d4,
    emissive: 0xf472b6,
    emissiveIntensity: 0.28,
    roughness: 0.5,
    metalness: 0.08
  });

  // Gnarled Trunk + 4 Primary Limbs
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 1.05, 6.2, 10), barkMat);
  trunk.position.y = 3.0;
  trunk.rotation.z = 0.08;
  group.add(trunk);

  const branches = [
    { pos: [1.2, 5.8, 0.4], rot: [0.3, 0, -0.6], scale: [0.35, 3.8, 0.35] },
    { pos: [-1.4, 5.5, -0.5], rot: [-0.25, 0, 0.65], scale: [0.35, 3.6, 0.35] },
    { pos: [0.3, 6.1, 1.3], rot: [0.6, 0, -0.15], scale: [0.3, 3.3, 0.3] },
    { pos: [-0.4, 6.0, -1.2], rot: [-0.55, 0, 0.2], scale: [0.3, 3.2, 0.3] }
  ];

  branches.forEach((b) => {
    const limb = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.8, 1, 8), barkMat);
    limb.position.set(b.pos[0], b.pos[1], b.pos[2]);
    limb.rotation.set(b.rot[0], b.rot[1], b.rot[2]);
    limb.scale.set(b.scale[0], b.scale[1], b.scale[2]);
    group.add(limb);
  });

  // Instanced Cherry Blossom Canopy Clouds
  const blossomCount = 95;
  const blossomGeo = new THREE.DodecahedronGeometry(0.85, 1);
  const instancedBlossoms = new THREE.InstancedMesh(blossomGeo, blossomMat, blossomCount);

  for (let i = 0; i < blossomCount; i++) {
    const theta = (i / blossomCount) * Math.PI * 2 * 5;
    const radius = 1.0 + Math.sqrt(i / blossomCount) * 4.6;
    const bx = Math.cos(theta) * radius;
    const bz = Math.sin(theta) * radius;
    const by = 6.2 + Math.sin(i * 1.7) * 1.35 + (1 - radius / 5.5) * 1.6;
    const s = 0.65 + (i % 5) * 0.14;

    _dummyPos.set(bx, by, bz);
    _dummyEuler.set(i * 0.3, i * 0.5, 0);
    _dummyQuat.setFromEuler(_dummyEuler);
    _dummyScale.set(s * 1.3, s * 0.85, s * 1.3);
    _dummyMatrix.compose(_dummyPos, _dummyQuat, _dummyScale);
    instancedBlossoms.setMatrixAt(i, _dummyMatrix);

    _dummyColor.setHex(i % 3 === 0 ? 0xfbcfe8 : i % 3 === 1 ? 0xf472b6 : 0xf9a8d4);
    instancedBlossoms.setColorAt(i, _dummyColor);
  }
  instancedBlossoms.instanceMatrix.needsUpdate = true;
  if (instancedBlossoms.instanceColor) instancedBlossoms.instanceColor.needsUpdate = true;
  instancedBlossoms.computeBoundingSphere();
  group.add(instancedBlossoms);

  return group;
}

// Composite Floating Wooden Raft & Signpost (mousham.design mJ + gJ + vJ equivalent)
function createConnectRaftMonument(renderer: THREE.WebGLRenderer): THREE.Group {
  const group = new THREE.Group();

  const timberMat = new THREE.MeshStandardMaterial({
    color: 0x78350f,
    roughness: 0.85,
    metalness: 0.08
  });
  const ropeMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.7,
    metalness: 0.1
  });
  const signBoardMat = new THREE.MeshStandardMaterial({
    color: 0x451a03,
    roughness: 0.78,
    metalness: 0.12
  });

  // 9 Logs forming the Floating Raft
  for (let i = -4; i <= 4; i++) {
    const log = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 11.5, 12), timberMat);
    log.rotation.z = Math.PI / 2;
    log.position.set(0, 0.4, i * 0.92);
    log.castShadow = true;
    group.add(log);
  }

  // Cross-Beams & Rope Lashings
  [-3.8, 3.8].forEach((x) => {
    const cross = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 8.6, 10), ropeMat);
    cross.rotation.x = Math.PI / 2;
    cross.position.set(x, 0.85, 0);
    group.add(cross);
  });

  // Tall Wooden Signpost on Raft
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.38, 9.5, 10), signBoardMat);
  post.position.set(-2.5, 4.8, -1.8);
  const arm = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.45, 0.45), signBoardMat);
  arm.position.set(-0.8, 8.6, -1.8);
  group.add(post, arm);

  // Brush Script 3D Calligraphy Banner above Raft (mousham.design vJ text)
  const connectTex = createTextBannerTexture(
    renderer,
    [
      "Let's build something impressive.",
      '[ Get in touch → ryashasvi77@gmail.com ]',
      '[ Connect on LinkedIn & GitHub → ]'
    ],
    {
      width: 1024,
      height: 384,
      bgColor: 'rgba(7, 13, 25, 0.78)',
      borderColor: '#9DDCE9',
      titleColor: '#FFFFFF',
      subColor: '#9DDCE9',
      brushFont: true
    }
  );
  const signMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(13.5, 5.0),
    new THREE.MeshBasicMaterial({ map: connectTex, transparent: true, side: THREE.DoubleSide })
  );
  signMesh.position.set(0, 6.8, 0);
  group.add(signMesh);

  return group;
}

export const OceanWorld3D: React.FC<OceanWorld3DProps> = ({
  scrollProgress,
  isDarkMode,
  onSelectProject,
  projectRingRotationOffset
}) => {
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const scrollProgressRef = useRef(scrollProgress);
  const isDarkModeRef = useRef(isDarkMode);
  const onSelectProjectRef = useRef(onSelectProject);
  const externalRingOffsetRef = useRef(projectRingRotationOffset);

  useEffect(() => {
    scrollProgressRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    isDarkModeRef.current = isDarkMode;
  }, [isDarkMode]);

  useEffect(() => {
    onSelectProjectRef.current = onSelectProject;
  }, [onSelectProject]);

  useEffect(() => {
    externalRingOffsetRef.current = projectRingRotationOffset;
  }, [projectRingRotationOffset]);

  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    // 1. Software WebGL detection per Three.js skill
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance'
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const initialBgHex = isDarkModeRef.current ? 0x070d19 : 0x6ea0e8;
    scene.background = new THREE.Color(initialBgHex);
    scene.fog = new THREE.FogExp2(initialBgHex, 0.0068);

    // 2. Mandatory Studio Environment Reflection (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    const isMobile = window.innerWidth <= 768;
    const camera = new THREE.PerspectiveCamera(
      isMobile ? 85 : 68,
      window.innerWidth / window.innerHeight,
      0.1,
      900
    );
    camera.position.set(0, 3.0, 12);

    // 3. Balanced 3-Point Studio & Atmospheric Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0x9ddce9, 0x0f172a, 1.1);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfff3db, 2.2);
    dirLight.position.set(45, 75, 30);
    dirLight.castShadow = !isSoftwareGl;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 1;
    dirLight.shadow.camera.far = 300;
    const d = 80;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.bias = -0.0005;
    dirLight.shadow.normalBias = 0.02;
    scene.add(dirLight);

    // 4. Procedural Ocean Water Surface (mousham.design gW equivalent)
    const waterNormalTex = createProceduralWaterNormalMap();
    const waterGeo = new THREE.PlaneGeometry(900, 900, 48, 48);
    waterGeo.rotateX(-Math.PI / 2);
    const waterMat = new THREE.MeshStandardMaterial({
      color: isDarkModeRef.current ? 0x0a192f : 0x1d4ed8,
      roughness: 0.14,
      metalness: 0.86,
      normalMap: waterNormalTex,
      normalScale: new THREE.Vector2(0.45, 0.45)
    });
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.position.set(0, -1.2, -250);
    waterMesh.receiveShadow = true;
    scene.add(waterMesh);

    // 5. Camera Spline Path & LookAt Path (mousham.design hu.path / hu.look)
    const cameraCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 2.6, 10),
      new THREE.Vector3(0, 2.8, -14),
      new THREE.Vector3(10, 4.2, -72),
      new THREE.Vector3(12, 4.5, -105),
      new THREE.Vector3(-8, 4.6, -168),
      new THREE.Vector3(-12, 4.8, -205),
      new THREE.Vector3(10, 5.2, -278),
      new THREE.Vector3(14, 5.5, -315),
      new THREE.Vector3(-10, 4.8, -378),
      new THREE.Vector3(-12, 4.6, -410),
      new THREE.Vector3(-2, 3.6, -458),
      new THREE.Vector3(0, 3.2, -472)
    ]);

    const lookCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 4.2, -26),
      new THREE.Vector3(0, 4.5, -45),
      new THREE.Vector3(18, 4.2, -105),
      new THREE.Vector3(18, 4.5, -118),
      new THREE.Vector3(-18, 4.5, -205),
      new THREE.Vector3(-18, 4.8, -218),
      new THREE.Vector3(18, 5.8, -320),
      new THREE.Vector3(18, 5.8, -335),
      new THREE.Vector3(-18, 4.8, -415),
      new THREE.Vector3(-18, 4.8, -425),
      new THREE.Vector3(0, 3.8, -492),
      new THREE.Vector3(0, 3.8, -502)
    ]);

    // 6. Swirling Spirit Particle Stream along the Ocean Path (mousham.design _W)
    const particleCount = 2600;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const t = i / particleCount;
      const pt = cameraCurve.getPointAt(t);
      const angle = t * Math.PI * 28 + (i % 7);
      const swirlR = 2.5 + Math.sin(t * Math.PI * 8) * 3.5 + (i % 5) * 0.9;
      particlePositions[i * 3] = pt.x + Math.cos(angle) * swirlR;
      particlePositions[i * 3 + 1] = -0.3 + Math.abs(Math.sin(angle * 1.3)) * 5.2;
      particlePositions[i * 3 + 2] = pt.z - 8 + Math.sin(angle) * swirlR;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x9ddce9,
      size: 0.28,
      transparent: true,
      opacity: 0.78,
      blending: THREE.AdditiveBlending
    });
    const particleStream = new THREE.Points(particleGeo, particleMat);
    scene.add(particleStream);

    // 7. Build the 6 Architectural Monument Stations
    // Station 0: Torii Gate Sanctuary at [0, -1.2, -26]
    const toriiMonument = createToriiGateMonument();
    toriiMonument.position.set(0, -1.2, -26);
    scene.add(toriiMonument);

    // Station 1: About & Education Runestone Altar at [18, -1.2, -112]
    const aboutAltar = createRunestoneIslandBase();
    aboutAltar.position.set(18, -14, -112); // Starts submerged and rises on approach
    const lotus = createLotusSculpture();
    lotus.position.set(0, 5.8, 0);
    aboutAltar.add(lotus);

    const aboutSignTex = createTextBannerTexture(
      renderer,
      ['About Me', ...RESUME_DATA.aboutBrushLines.slice(0, 3)],
      {
        width: 1024,
        height: 420,
        bgColor: 'rgba(7, 13, 25, 0.78)',
        borderColor: '#719CED',
        titleColor: '#FFFFFF',
        subColor: '#9DDCE9',
        brushFont: true
      }
    );
    const aboutSign = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 4.8),
      new THREE.MeshBasicMaterial({ map: aboutSignTex, transparent: true, side: THREE.DoubleSide })
    );
    aboutSign.position.set(0, 11.2, 0);
    aboutSign.rotation.y = -0.25;
    aboutAltar.add(aboutSign);
    scene.add(aboutAltar);

    // Station 2: Skills & Experience Runestone Shrine at [-18, -1.2, -212]
    const skillsAltar = createRunestoneIslandBase();
    skillsAltar.position.set(-18, -18, -212);

    const lanternOffsets = [
      { pos: [-5.2, 5.8, 1.5], rot: 0.25, pillar: RESUME_DATA.skillPillars[0] },
      { pos: [0, 6.4, -1.8], rot: 0, pillar: RESUME_DATA.skillPillars[1] },
      { pos: [5.2, 5.8, 1.5], rot: -0.25, pillar: RESUME_DATA.skillPillars[2] }
    ];
    lanternOffsets.forEach((l) => {
      const lantern = createJapaneseLantern(
        renderer,
        l.pillar.lanternTitleTop,
        l.pillar.lanternTitleBottom
      );
      lantern.position.set(l.pos[0], l.pos[1], l.pos[2]);
      lantern.rotation.y = l.rot;
      skillsAltar.add(lantern);
    });
    scene.add(skillsAltar);

    // Station 3: Projects Sakura Island & 360° Curved Shader Ring at [18, -1.2, -328]
    const projectsAltar = createRunestoneIslandBase();
    projectsAltar.position.set(18, -18, -328);
    const sakuraTree = createSakuraTree();
    sakuraTree.position.set(0, 5.8, 0);
    projectsAltar.add(sakuraTree);

    const projectRingGroup = new THREE.Group();
    projectRingGroup.position.set(0, 8.8, 0);
    projectsAltar.add(projectRingGroup);

    const projectMeshes: THREE.Mesh[] = [];
    const ringRadius = 11.2;
    const totalProjects = RESUME_DATA.projects.length;

    RESUME_DATA.projects.forEach((proj, idx) => {
      const angle = (idx / totalProjects) * Math.PI * 2;
      const cardGeo = new THREE.PlaneGeometry(6.8, 3.7, 24, 1);
      // Subtle cylindrical curve matching mousham.design pJ shader: sin(uv.x * PI) * 0.45
      const posAttr = cardGeo.attributes.position;
      for (let v = 0; v < posAttr.count; v++) {
        const vx = posAttr.getX(v);
        const normalizedX = (vx / 6.8) + 0.5;
        const curveZ = Math.sin(normalizedX * Math.PI) * 0.55;
        posAttr.setZ(v, curveZ);
      }
      cardGeo.computeVertexNormals();

      const cardTex = createProjectCardTexture(renderer, proj);
      const cardMat = new THREE.MeshBasicMaterial({
        map: cardTex,
        side: THREE.DoubleSide
      });

      const mesh = new THREE.Mesh(cardGeo, cardMat);
      mesh.position.set(Math.sin(angle) * ringRadius, 0, Math.cos(angle) * ringRadius);
      mesh.rotation.y = angle;
      mesh.userData = { projectId: proj.id };
      projectMeshes.push(mesh);
      projectRingGroup.add(mesh);
    });

    scene.add(projectsAltar);

    // Station 4: Achievements & Patent Honor Pavilion at [-18, -1.2, -418]
    const honoursAltar = createRunestoneIslandBase();
    honoursAltar.position.set(-18, -18, -418);

    const obeliskMat = new THREE.MeshStandardMaterial({
      color: 0x0f766e,
      emissive: 0x0d9488,
      emissiveIntensity: 0.4,
      roughness: 0.25,
      metalness: 0.75
    });
    for (let i = 0; i < 5; i++) {
      const a = ((i - 2) / 4) * Math.PI * 0.85;
      const obelisk = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.7, 5.2, 6), obeliskMat);
      obelisk.position.set(Math.sin(a) * 5.8, 8.2, Math.cos(a) * 5.8 - 2.0);
      honoursAltar.add(obelisk);
    }

    const patentSignTex = createTextBannerTexture(
      renderer,
      [
        'Patent & National Honours',
        'Indian Patent: AI Crop Drone · 2nd Runner-Up Tech Sprint ’26',
        'MANIT Top 21 · Google Big Code Top 15K · NPTEL 87%'
      ],
      {
        width: 1024,
        height: 384,
        bgColor: 'rgba(7, 13, 25, 0.84)',
        borderColor: '#F59E0B',
        titleColor: '#FBBF24',
        subColor: '#FFFFFF',
        brushFont: true
      }
    );
    const patentSign = new THREE.Mesh(
      new THREE.PlaneGeometry(12.5, 4.6),
      new THREE.MeshBasicMaterial({ map: patentSignTex, transparent: true, side: THREE.DoubleSide })
    );
    patentSign.position.set(0, 11.4, 1.5);
    patentSign.rotation.y = 0.22;
    honoursAltar.add(patentSign);
    scene.add(honoursAltar);

    // Station 5: Connect Floating Wooden Raft at [0, -1.1, -492]
    const connectRaft = createConnectRaftMonument(renderer);
    connectRaft.position.set(0, -14, -492);
    scene.add(connectRaft);

    // 8. Interactive Drag & Click Raycasting for the 3D Project Carousel Ring
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let isDragging = false;
    let dragStartX = 0;
    let pointerDownX = 0;
    let manualRingAngle = 0;
    let targetRingAngle = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      dragStartX = e.clientX;
      pointerDownX = e.clientX;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartX;
      targetRingAngle += dx * 0.005;
      dragStartX = e.clientX;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const onCanvasClick = (e: MouseEvent) => {
      if (Math.abs(e.clientX - pointerDownX) > 6) return;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(projectMeshes, false);
      if (hits.length > 0) {
        const projId = hits[0].object.userData.projectId;
        if (typeof projId === 'number') {
          onSelectProjectRef.current(projId);
        }
      }
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    domElem.addEventListener('click', onCanvasClick);

    // 8b. Mobile Device Orientation Parallax Tilt Listener
    const cleanupParallax = initDeviceOrientationParallax();
    const parallaxGroup = new THREE.Group();
    parallaxGroup.name = 'MobileParallaxRig';
    scene.add(parallaxGroup);
    parallaxGroup.add(
      particleStream,
      toriiMonument,
      aboutAltar,
      skillsAltar,
      projectsAltar,
      honoursAltar,
      connectRaft
    );

    // 9. Animation Loop with Software-WebGL Pacing & Exponential Damping
    const clock = new THREE.Clock();
    let frameId = 0;
    let smoothedProgress = scrollProgressRef.current;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || !gl.fenceSync) {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      const dt = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      // Theme transition (Day / Night sky & water)
      const targetSkyHex = isDarkModeRef.current ? 0x070d19 : 0x5c8fd6;
      _dummyColor.setHex(targetSkyHex);
      if (scene.background instanceof THREE.Color) {
        scene.background.lerp(_dummyColor, dt * 3.0);
      }
      if (scene.fog instanceof THREE.FogExp2) {
        scene.fog.color.lerp(_dummyColor, dt * 3.0);
      }
      _dummyColor.setHex(isDarkModeRef.current ? 0x0a192f : 0x1e40af);
      waterMat.color.lerp(_dummyColor, dt * 3.0);

      // Animate Ocean Normal Map
      waterNormalTex.offset.x = elapsed * 0.03;
      waterNormalTex.offset.y = elapsed * 0.02;

      // Smoothly damp scroll progress along the 3D spline
      smoothedProgress = THREE.MathUtils.damp(
        smoothedProgress,
        Math.max(0, Math.min(1, scrollProgressRef.current)),
        4.5,
        dt
      );

      cameraCurve.getPointAt(smoothedProgress, _camPos);
      lookCurve.getPointAt(smoothedProgress, _lookPos);

      // Apply subtle mobile device orientation parallax tilt
      const pState = window.__FOLIO_PARALLAX__;
      if (pState) {
        pState.currentX = THREE.MathUtils.damp(pState.currentX, pState.targetX, 4.5, dt);
        pState.currentY = THREE.MathUtils.damp(pState.currentY, pState.targetY, 4.5, dt);
        parallaxGroup.rotation.y = pState.currentX * 0.045;
        parallaxGroup.rotation.x = pState.currentY * 0.03;
        parallaxGroup.rotation.z = -pState.currentX * 0.018;
        parallaxGroup.position.x = pState.currentX * 0.65;
        parallaxGroup.position.y = -pState.currentY * 0.35;
        _lookPos.x += pState.currentX * 1.1;
        _lookPos.y -= pState.currentY * 0.65;
      }

      _smoothCamPos.lerp(_camPos, 1 - Math.exp(-6.5 * dt));
      _smoothLookPos.lerp(_lookPos, 1 - Math.exp(-6.5 * dt));

      camera.position.copy(_smoothCamPos);
      camera.lookAt(_smoothLookPos);

      // Keep ocean centered near camera Z
      waterMesh.position.z = camera.position.z - 140;

      // Rise-from-the-ocean animations triggered by camera progress (matching mousham.design lJ, fJ, pJ, vJ)
      const aboutTargetY = smoothedProgress >= 0.08 ? -1.2 : -14.0;
      aboutAltar.position.y = THREE.MathUtils.damp(aboutAltar.position.y, aboutTargetY, 3.5, dt);
      lotus.rotation.y = elapsed * 0.35;

      const skillsTargetY = smoothedProgress >= 0.28 ? -1.2 : -18.0;
      skillsAltar.position.y = THREE.MathUtils.damp(skillsAltar.position.y, skillsTargetY, 3.5, dt);

      const projectsTargetY = smoothedProgress >= 0.5 ? -1.2 : -18.0;
      projectsAltar.position.y = THREE.MathUtils.damp(projectsAltar.position.y, projectsTargetY, 3.5, dt);

      const honoursTargetY = smoothedProgress >= 0.7 ? -1.2 : -18.0;
      honoursAltar.position.y = THREE.MathUtils.damp(honoursAltar.position.y, honoursTargetY, 3.5, dt);

      const raftTargetY =
        smoothedProgress >= 0.84
          ? -1.1 + Math.sin(elapsed * 1.8) * 0.22
          : -14.0;
      connectRaft.position.y = THREE.MathUtils.damp(connectRaft.position.y, raftTargetY, 3.5, dt);
      connectRaft.rotation.z = Math.sin(elapsed * 1.3) * 0.025;

      // Rotate the 3D Project Carousel Ring smoothly (auto-spin + user drag + button offset)
      if (!isDragging) {
        targetRingAngle += dt * 0.22;
      }
      const combinedRingTarget = targetRingAngle + externalRingOffsetRef.current;
      manualRingAngle = THREE.MathUtils.damp(manualRingAngle, combinedRingTarget, 5.0, dt);
      projectRingGroup.rotation.y = manualRingAngle;

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }
    tick();

    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.fov = w <= 768 ? 85 : 68;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cleanupParallax();
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', onResize);
      domElem.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      domElem.removeEventListener('click', onCanvasClick);
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={canvasMountRef}
      className="fixed inset-0 w-full h-screen z-0 overflow-hidden"
      aria-label="Interactive 3D Ocean Sanctuary Portfolio World"
    />
  );
};
