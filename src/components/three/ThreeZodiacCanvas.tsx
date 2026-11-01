import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ZodiacAnimalId, MascotAnimationState } from '../../types';

interface ThreeZodiacCanvasProps {
  zodiacId: ZodiacAnimalId;
  animationState?: MascotAnimationState;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  autoRotate?: boolean;
  interactive?: boolean;
  className?: string;
  showAura?: boolean;
}

// Animal color palettes & decorative attributes matching Mongolian culture
const ZODIAC_SPECS: Record<
  ZodiacAnimalId,
  {
    name: string;
    mongolName: string;
    bodyColor: number;
    accentColor: number;
    deelColor: number;
    beltColor: number;
    gemColor: number;
    auraColor: number;
    hatFlapColor: number;
  }
> = {
  khulgana: {
    name: 'Хулгана',
    mongolName: 'Овсгоотой Хулгана',
    bodyColor: 0x94a3b8, // silver grey
    accentColor: 0xf472b6, // pink inner ears
    deelColor: 0x0284c7, // vibrant sky blue deel
    beltColor: 0xf59e0b, // amber gold belt
    gemColor: 0x38bdf8,
    auraColor: 0x38bdf8,
    hatFlapColor: 0x0369a1,
  },
  ukher: {
    name: 'Үхэр',
    mongolName: 'Хүчит Үхэр',
    bodyColor: 0x78716c, // sturdy stone brown
    accentColor: 0xfbbf24, // golden horns
    deelColor: 0x059669, // deep emerald deel
    beltColor: 0xe2e8f0, // silver belt
    gemColor: 0x10b981,
    auraColor: 0x10b981,
    hatFlapColor: 0x047857,
  },
  bar: {
    name: 'Бар',
    mongolName: 'Зоригт Бар',
    bodyColor: 0xf97316, // bold tiger orange
    accentColor: 0x1e293b, // dark tiger stripes
    deelColor: 0xd97706, // golden yellow deel
    beltColor: 0xef4444, // ruby red belt
    gemColor: 0xf59e0b,
    auraColor: 0xf97316,
    hatFlapColor: 0xb45309,
  },
  tuulai: {
    name: 'Туулай',
    mongolName: 'Сэргэлэн Туулай',
    bodyColor: 0xf8fafc, // snow white
    accentColor: 0xf472b6, // soft rose
    deelColor: 0x06b6d4, // cyan deel
    beltColor: 0xfacc15, // yellow gold belt
    gemColor: 0x22d3ee,
    auraColor: 0x06b6d4,
    hatFlapColor: 0x0891b2,
  },
  luu: {
    name: 'Луу',
    mongolName: 'Сүрлэг Луу',
    bodyColor: 0x0284c7, // azure celestial blue
    accentColor: 0xfbbf24, // mythic golden antlers
    deelColor: 0x4f46e5, // imperial indigo
    beltColor: 0xf59e0b, // gold dragon belt
    gemColor: 0x06b6d4,
    auraColor: 0x38bdf8,
    hatFlapColor: 0x4338ca,
  },
  mogoi: {
    name: 'Могой',
    mongolName: 'Ухаант Могой',
    bodyColor: 0x10b981, // jade green
    accentColor: 0xa855f7, // mystic purple hood trim
    deelColor: 0x15803d, // dark green silk
    beltColor: 0xfbbf24, // golden coils
    gemColor: 0x8b5cf6,
    auraColor: 0x10b981,
    hatFlapColor: 0x166534,
  },
  mori: {
    name: 'Морь',
    mongolName: 'Хурдан Хүлэг',
    bodyColor: 0x92400e, // chestnut steed
    accentColor: 0x38bdf8, // glowing cyan wind mane
    deelColor: 0x0369a1, // blue deel
    beltColor: 0xf59e0b, // gold belt
    gemColor: 0x38bdf8,
    auraColor: 0x0284c7,
    hatFlapColor: 0x075985,
  },
  khoni: {
    name: 'Хонь',
    mongolName: 'Дөлгөөн Хонь',
    bodyColor: 0xf1f5f9, // soft cloud wool
    accentColor: 0xd97706, // amber spiral horns
    deelColor: 0xec4899, // lotus pink deel
    beltColor: 0x38bdf8, // cyan belt
    gemColor: 0xf472b6,
    auraColor: 0xec4899,
    hatFlapColor: 0xdb2777,
  },
  bich: {
    name: 'Бич',
    mongolName: 'Авхаалжит Бич',
    bodyColor: 0xb45309, // amber monkey brown
    accentColor: 0xfef08a, // light golden face & circlet
    deelColor: 0xb91c1c, // crimson warrior vest
    beltColor: 0xfbbf24, // gold belt
    gemColor: 0xfbbf24,
    auraColor: 0xf59e0b,
    hatFlapColor: 0x991b1b,
  },
  takhia: {
    name: 'Тахиа',
    mongolName: 'Сэргэлэн Тахиа',
    bodyColor: 0xf8fafc, // white plumage
    accentColor: 0xef4444, // bright red comb & wattle
    deelColor: 0xe11d48, // fiery ruby deel
    beltColor: 0xfbbf24, // gold buckle
    gemColor: 0xf43f5e,
    auraColor: 0xef4444,
    hatFlapColor: 0xbe123c,
  },
  nokhoi: {
    name: 'Нохой',
    mongolName: 'Үнэнч Банхар',
    bodyColor: 0x1e293b, // dark slate black (Mongolian Bankhar)
    accentColor: 0xd97706, // golden tan "four-eyes" spots & muzzle
    deelColor: 0x047857, // forest green deel
    beltColor: 0xf59e0b, // bronze / brass belt
    gemColor: 0x10b981,
    auraColor: 0x22c55e,
    hatFlapColor: 0x065f46,
  },
  gakhai: {
    name: 'Гахай',
    mongolName: 'Өгөөмөр Гахай',
    bodyColor: 0xfda4af, // cute rosy pink
    accentColor: 0xf43f5e, // cheerful snout & tusks
    deelColor: 0x7c3aed, // royal violet deel
    beltColor: 0xfbbf24, // golden coin belt
    gemColor: 0xa855f7,
    auraColor: 0x8b5cf6,
    hatFlapColor: 0x6d28d9,
  },
};

export const ThreeZodiacCanvas: React.FC<ThreeZodiacCanvasProps> = ({
  zodiacId,
  animationState = 'idle',
  size = 'md',
  autoRotate = true,
  interactive = true,
  className = '',
  showAura = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [currentAnim, setCurrentAnim] = useState<MascotAnimationState>(animationState);

  // Keep internal animation state in sync with external prop
  useEffect(() => {
    setCurrentAnim(animationState);
  }, [animationState]);

  // Size mapping
  const sizeDims = {
    sm: { width: 100, height: 100 },
    md: { width: 180, height: 180 },
    lg: { width: 280, height: 280 },
    hero: { width: 420, height: 420 },
  }[size];

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || sizeDims.width;
    const height = container.clientHeight || sizeDims.height;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 1.3, 4.4);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const spec = ZODIAC_SPECS[zodiacId] || ZODIAC_SPECS.tuulai;

    // 1. Lighting Setup (Studio 3-Point Cyber Mongolian Lighting)
    const ambientLight = new THREE.HemisphereLight(0x38bdf8, 0x0f172a, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(3, 5, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(spec.auraColor, 2.2);
    rimLight.position.set(-3, 3, -3);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(spec.deelColor, 1.2, 10);
    fillLight.position.set(0, -1, 2);
    scene.add(fillLight);

    // 2. Character Hierarchy Root
    const characterRoot = new THREE.Group();
    characterRoot.position.y = -0.4;
    scene.add(characterRoot);

    // Shared Materials
    const bodyMat = new THREE.MeshStandardMaterial({
      color: spec.bodyColor,
      roughness: 0.35,
      metalness: 0.1,
    });
    const accentMat = new THREE.MeshStandardMaterial({
      color: spec.accentColor,
      roughness: 0.3,
      metalness: 0.25,
    });
    const deelMat = new THREE.MeshStandardMaterial({
      color: spec.deelColor,
      roughness: 0.45,
      metalness: 0.2,
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      roughness: 0.2,
      metalness: 0.85,
    });
    const silverMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.25,
      metalness: 0.9,
    });
    const gemMat = new THREE.MeshStandardMaterial({
      color: spec.gemColor,
      emissive: spec.gemColor,
      emissiveIntensity: 0.6,
      roughness: 0.1,
      metalness: 0.5,
    });
    const darkMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.3,
    });
    const bootMat = new THREE.MeshStandardMaterial({
      color: 0x451a03,
      roughness: 0.4,
      metalness: 0.2,
    });

    // 3. Build Mongolian Deel Torso & Waist
    const bodyGroup = new THREE.Group();
    characterRoot.add(bodyGroup);

    // Torso (Trapezoidal Deel Robe)
    const torsoGeo = new THREE.CylinderGeometry(0.42, 0.58, 0.95, 24);
    const torso = new THREE.Mesh(torsoGeo, deelMat);
    torso.position.y = 0.58;
    torso.castShadow = true;
    torso.receiveShadow = true;
    bodyGroup.add(torso);

    // High Mongolian Embroidered Collar (Захны эмжээр)
    const collarGeo = new THREE.TorusGeometry(0.36, 0.05, 12, 32);
    const collar = new THREE.Mesh(collarGeo, goldMat);
    collar.rotation.x = Math.PI / 2;
    collar.position.y = 1.05;
    bodyGroup.add(collar);

    // Mongolian Silver Belt with Engraved Buckle (Мөнгөн бүс)
    const beltGeo = new THREE.CylinderGeometry(0.53, 0.54, 0.14, 24);
    const belt = new THREE.Mesh(beltGeo, goldMat);
    belt.position.y = 0.48;
    bodyGroup.add(belt);

    // Buckle (Ulzii knot emblem on belt center)
    const buckleGeo = new THREE.BoxGeometry(0.18, 0.14, 0.08);
    const buckle = new THREE.Mesh(buckleGeo, silverMat);
    buckle.position.set(0, 0.48, 0.54);
    bodyGroup.add(buckle);

    const buckleGemGeo = new THREE.SphereGeometry(0.04, 12, 12);
    const buckleGem = new THREE.Mesh(buckleGemGeo, gemMat);
    buckleGem.position.set(0, 0.48, 0.59);
    bodyGroup.add(buckleGem);

    // 4. Head & Face Rig
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.45, 0);
    characterRoot.add(headGroup);

    // Head base (Spherical with slight cyber taper)
    const headGeo = new THREE.SphereGeometry(0.5, 32, 28);
    const head = new THREE.Mesh(headGeo, bodyMat);
    head.castShadow = true;
    headGroup.add(head);

    // Eyes (Big expressive animated cyber anime eyes)
    const leftEyeGroup = new THREE.Group();
    leftEyeGroup.position.set(-0.18, 0.08, 0.42);
    headGroup.add(leftEyeGroup);

    const rightEyeGroup = new THREE.Group();
    rightEyeGroup.position.set(0.18, 0.08, 0.42);
    headGroup.add(rightEyeGroup);

    const eyeWhiteGeo = new THREE.SphereGeometry(0.11, 16, 16);
    const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 });
    const eyePupilGeo = new THREE.SphereGeometry(0.075, 16, 16);
    const eyePupilMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.1,
      metalness: 0.3,
    });
    const eyeHighlightGeo = new THREE.SphereGeometry(0.03, 12, 12);
    const eyeHighlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    [leftEyeGroup, rightEyeGroup].forEach((eg) => {
      const white = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat);
      white.scale.set(1, 1.1, 0.5);
      eg.add(white);

      const pupil = new THREE.Mesh(eyePupilGeo, eyePupilMat);
      pupil.position.z = 0.05;
      eg.add(pupil);

      const high = new THREE.Mesh(eyeHighlightGeo, eyeHighlightMat);
      high.position.set(0.03, 0.03, 0.1);
      eg.add(high);
    });

    // Mongolian Traditional Hat: Jinst Toortsoq (Жинстэй Тоорцог малгай)
    const hatGroup = new THREE.Group();
    hatGroup.position.set(0, 0.42, 0);
    headGroup.add(hatGroup);

    // Conical hat base
    const hatConeGeo = new THREE.ConeGeometry(0.52, 0.42, 24);
    const hatMat = new THREE.MeshStandardMaterial({
      color: spec.hatFlapColor,
      roughness: 0.5,
      metalness: 0.1,
    });
    const hatCone = new THREE.Mesh(hatConeGeo, hatMat);
    hatCone.position.y = 0.2;
    hatGroup.add(hatCone);

    // Upturned velvet brim
    const brimGeo = new THREE.TorusGeometry(0.48, 0.06, 12, 32);
    const brimMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6 });
    const brim = new THREE.Mesh(brimGeo, brimMat);
    brim.rotation.x = Math.PI / 2;
    hatGroup.add(brim);

    // Top Golden Finial / Jins (Жинс)
    const jinsGeo = new THREE.CylinderGeometry(0.04, 0.08, 0.15, 12);
    const jins = new THREE.Mesh(jinsGeo, goldMat);
    jins.position.y = 0.45;
    hatGroup.add(jins);

    // Top Gemstone
    const gemGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const gem = new THREE.Mesh(gemGeo, gemMat);
    gem.position.y = 0.58;
    hatGroup.add(gem);

    // Red Tassel (Улаан залаа) flowing down back
    const tasselGeo = new THREE.CylinderGeometry(0.02, 0.05, 0.35, 8);
    const tasselMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.7 });
    const tassel = new THREE.Mesh(tasselGeo, tasselMat);
    tassel.rotation.x = 0.4;
    tassel.position.set(0, 0.4, -0.22);
    hatGroup.add(tassel);

    // 5. Unique 3D Anatomical Features for Each of the 12 Animals
    const earsGroup = new THREE.Group();
    headGroup.add(earsGroup);

    if (zodiacId === 'khulgana') {
      // Big cute round mouse ears with inner pink
      const earGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.04, 24);
      const leftEar = new THREE.Mesh(earGeo, bodyMat);
      leftEar.rotation.z = 0.4;
      leftEar.rotation.x = 0.2;
      leftEar.position.set(-0.48, 0.45, -0.05);
      const rightEar = new THREE.Mesh(earGeo, bodyMat);
      rightEar.rotation.z = -0.4;
      rightEar.rotation.x = 0.2;
      rightEar.position.set(0.48, 0.45, -0.05);
      earsGroup.add(leftEar, rightEar);

      // Cute snout & whiskers
      const snoutGeo = new THREE.ConeGeometry(0.12, 0.2, 16);
      const snout = new THREE.Mesh(snoutGeo, accentMat);
      snout.rotation.x = Math.PI / 2;
      snout.position.set(0, -0.08, 0.52);
      headGroup.add(snout);
    } else if (zodiacId === 'ukher') {
      // Golden Ox Horns
      const hornCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(-0.35, 0.3, 0.1),
        new THREE.Vector3(-0.2, 0.55, 0.2)
      );
      const hornGeo = new THREE.TubeGeometry(hornCurve, 16, 0.07, 8, false);
      const leftHorn = new THREE.Mesh(hornGeo, accentMat);
      leftHorn.position.set(-0.35, 0.3, 0);
      const rightHorn = leftHorn.clone();
      rightHorn.scale.x = -1;
      rightHorn.position.x = 0.35;
      earsGroup.add(leftHorn, rightHorn);

      // Strong sturdy muzzle & nose ring
      const muzzleGeo = new THREE.CylinderGeometry(0.22, 0.26, 0.2, 16);
      const muzzle = new THREE.Mesh(muzzleGeo, accentMat);
      muzzle.rotation.x = 0.4;
      muzzle.position.set(0, -0.15, 0.45);
      headGroup.add(muzzle);

      const ringGeo = new THREE.TorusGeometry(0.08, 0.02, 12, 16);
      const ring = new THREE.Mesh(ringGeo, goldMat);
      ring.position.set(0, -0.25, 0.52);
      headGroup.add(ring);
    } else if (zodiacId === 'bar') {
      // Tiger ears with dark tips
      const earGeo = new THREE.SphereGeometry(0.16, 16, 16);
      const leftEar = new THREE.Mesh(earGeo, bodyMat);
      leftEar.scale.set(0.6, 1.2, 0.4);
      leftEar.position.set(-0.4, 0.42, 0);
      const rightEar = leftEar.clone();
      rightEar.position.x = 0.4;
      earsGroup.add(leftEar, rightEar);

      // Tiger forehead mark (Хаан/Зоригт хээ)
      const markGeo = new THREE.BoxGeometry(0.16, 0.04, 0.02);
      const mark1 = new THREE.Mesh(markGeo, darkMat);
      mark1.position.set(0, 0.28, 0.48);
      const mark2 = mark1.clone();
      mark2.scale.set(0.7, 1, 1);
      mark2.position.y = 0.35;
      headGroup.add(mark1, mark2);
    } else if (zodiacId === 'tuulai') {
      // Long tall bunny ears with inner pink
      const earGeo = new THREE.CylinderGeometry(0.12, 0.16, 0.85, 16);
      const leftEar = new THREE.Mesh(earGeo, bodyMat);
      leftEar.rotation.z = -0.15;
      leftEar.position.set(-0.32, 0.72, -0.05);
      const rightEar = new THREE.Mesh(earGeo, bodyMat);
      rightEar.rotation.z = 0.15;
      rightEar.position.set(0.32, 0.72, -0.05);

      const innerEarGeo = new THREE.CylinderGeometry(0.06, 0.09, 0.7, 16);
      const leftInner = new THREE.Mesh(innerEarGeo, accentMat);
      leftInner.position.set(0, 0, 0.06);
      leftEar.add(leftInner);
      const rightInner = leftInner.clone();
      rightEar.add(rightInner);

      earsGroup.add(leftEar, rightEar);
    } else if (zodiacId === 'luu') {
      // Mythic Dragon Antlers & Whiskers
      const antlerGeo = new THREE.ConeGeometry(0.08, 0.65, 8);
      const leftAntler = new THREE.Mesh(antlerGeo, goldMat);
      leftAntler.rotation.z = -0.4;
      leftAntler.rotation.x = -0.3;
      leftAntler.position.set(-0.35, 0.6, -0.1);
      const rightAntler = leftAntler.clone();
      rightAntler.rotation.z = 0.4;
      rightAntler.position.x = 0.35;
      earsGroup.add(leftAntler, rightAntler);

      // Dragon whiskers (Long cyber ribbons)
      const whiskerGeo = new THREE.CylinderGeometry(0.015, 0.03, 0.5, 8);
      const leftW = new THREE.Mesh(whiskerGeo, goldMat);
      leftW.rotation.z = -1.2;
      leftW.position.set(-0.35, -0.1, 0.4);
      const rightW = leftW.clone();
      rightW.rotation.z = 1.2;
      rightW.position.x = 0.35;
      headGroup.add(leftW, rightW);
    } else if (zodiacId === 'mogoi') {
      // Snake Crown & mystic third eye
      const crownGeo = new THREE.ConeGeometry(0.2, 0.35, 6);
      const crown = new THREE.Mesh(crownGeo, goldMat);
      crown.position.set(0, 0.6, 0);
      headGroup.add(crown);

      const thirdEye = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), gemMat);
      thirdEye.position.set(0, 0.28, 0.48);
      headGroup.add(thirdEye);
    } else if (zodiacId === 'mori') {
      // Horse mane (cyber flowing crest)
      const maneGeo = new THREE.BoxGeometry(0.1, 0.5, 0.45);
      const mane = new THREE.Mesh(maneGeo, gemMat);
      mane.position.set(0, 0.25, -0.35);
      headGroup.add(mane);

      // Horse muzzle
      const muzzleGeo = new THREE.BoxGeometry(0.3, 0.24, 0.35);
      const muzzle = new THREE.Mesh(muzzleGeo, accentMat);
      muzzle.position.set(0, -0.12, 0.45);
      headGroup.add(muzzle);
    } else if (zodiacId === 'khoni') {
      // Curly ram horns
      const hornGeo = new THREE.TorusGeometry(0.22, 0.07, 12, 24, Math.PI * 1.5);
      const leftHorn = new THREE.Mesh(hornGeo, accentMat);
      leftHorn.rotation.y = -Math.PI / 2;
      leftHorn.position.set(-0.45, 0.15, 0);
      const rightHorn = leftHorn.clone();
      rightHorn.scale.x = -1;
      rightHorn.position.x = 0.45;
      earsGroup.add(leftHorn, rightHorn);
    } else if (zodiacId === 'bich') {
      // Golden monkey circlet / headband
      const circletGeo = new THREE.TorusGeometry(0.51, 0.04, 8, 32);
      const circlet = new THREE.Mesh(circletGeo, goldMat);
      circlet.rotation.x = Math.PI / 2;
      circlet.position.y = 0.15;
      headGroup.add(circlet);

      const earGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.05, 16);
      const leftEar = new THREE.Mesh(earGeo, accentMat);
      leftEar.rotation.y = Math.PI / 2;
      leftEar.position.set(-0.52, 0.05, 0);
      const rightEar = leftEar.clone();
      rightEar.position.x = 0.52;
      earsGroup.add(leftEar, rightEar);
    } else if (zodiacId === 'takhia') {
      // Rooster red comb & beak
      const combGeo = new THREE.BoxGeometry(0.08, 0.35, 0.4);
      const comb = new THREE.Mesh(combGeo, accentMat);
      comb.position.set(0, 0.6, 0);
      headGroup.add(comb);

      const beakGeo = new THREE.ConeGeometry(0.1, 0.24, 4);
      const beak = new THREE.Mesh(beakGeo, goldMat);
      beak.rotation.x = Math.PI / 2;
      beak.position.set(0, -0.05, 0.56);
      headGroup.add(beak);
    } else if (zodiacId === 'nokhoi') {
      // Mongolian Bankhar Dog: Distinctive "Four-Eyes" spots!
      const spotGeo = new THREE.SphereGeometry(0.05, 12, 12);
      const leftSpot = new THREE.Mesh(spotGeo, accentMat);
      leftSpot.position.set(-0.18, 0.25, 0.44);
      const rightSpot = leftSpot.clone();
      rightSpot.position.x = 0.18;
      headGroup.add(leftSpot, rightSpot);

      // Floppy Bankhar ears
      const earGeo = new THREE.BoxGeometry(0.16, 0.35, 0.1);
      const leftEar = new THREE.Mesh(earGeo, darkMat);
      leftEar.rotation.z = 0.3;
      leftEar.position.set(-0.46, 0.18, 0);
      const rightEar = leftEar.clone();
      rightEar.rotation.z = -0.3;
      rightEar.position.x = 0.46;
      earsGroup.add(leftEar, rightEar);
    } else if (zodiacId === 'gakhai') {
      // Pig snout with 2 nostrils
      const snoutGeo = new THREE.CylinderGeometry(0.16, 0.18, 0.14, 16);
      const snout = new THREE.Mesh(snoutGeo, accentMat);
      snout.rotation.x = Math.PI / 2;
      snout.position.set(0, -0.1, 0.52);
      headGroup.add(snout);

      const nostrilGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.05, 8);
      const leftNostril = new THREE.Mesh(nostrilGeo, darkMat);
      leftNostril.rotation.x = Math.PI / 2;
      leftNostril.position.set(-0.06, -0.1, 0.6);
      const rightNostril = leftNostril.clone();
      rightNostril.position.x = 0.06;
      headGroup.add(leftNostril, rightNostril);
    }

    // 6. Articulated Limbs with Mongolian Boots & Wide Deel Sleeves
    // Left Arm (Shoulder Pivot)
    const leftArmPivot = new THREE.Group();
    leftArmPivot.position.set(-0.52, 0.9, 0);
    characterRoot.add(leftArmPivot);

    const armGeo = new THREE.CylinderGeometry(0.14, 0.18, 0.55, 16);
    const leftArm = new THREE.Mesh(armGeo, deelMat);
    leftArm.position.y = -0.28;
    leftArmPivot.add(leftArm);

    const pawGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const leftPaw = new THREE.Mesh(pawGeo, bodyMat);
    leftPaw.position.y = -0.55;
    leftArmPivot.add(leftPaw);

    // Right Arm (Shoulder Pivot)
    const rightArmPivot = new THREE.Group();
    rightArmPivot.position.set(0.52, 0.9, 0);
    characterRoot.add(rightArmPivot);

    const rightArm = new THREE.Mesh(armGeo, deelMat);
    rightArm.position.y = -0.28;
    rightArmPivot.add(rightArm);

    const rightPaw = new THREE.Mesh(pawGeo, bodyMat);
    rightPaw.position.y = -0.55;
    rightArmPivot.add(rightPaw);

    // Left Leg with Upturned Mongolian Boot (Монгол гутал)
    const leftLegPivot = new THREE.Group();
    leftLegPivot.position.set(-0.25, 0.25, 0);
    characterRoot.add(leftLegPivot);

    const legGeo = new THREE.CylinderGeometry(0.13, 0.15, 0.45, 16);
    const leftLeg = new THREE.Mesh(legGeo, bootMat);
    leftLeg.position.y = -0.2;
    leftLegPivot.add(leftLeg);

    // Mongolian Boot with Upturned Toe (Дээшээ эргэсэн хоншоор)
    const bootFootGeo = new THREE.BoxGeometry(0.18, 0.14, 0.32);
    const leftFoot = new THREE.Mesh(bootFootGeo, bootMat);
    leftFoot.position.set(0, -0.42, 0.08);
    leftLegPivot.add(leftFoot);

    const toeUpturnGeo = new THREE.ConeGeometry(0.08, 0.14, 8);
    const leftToe = new THREE.Mesh(toeUpturnGeo, goldMat);
    leftToe.rotation.x = -Math.PI / 3;
    leftToe.position.set(0, -0.38, 0.24);
    leftLegPivot.add(leftToe);

    // Right Leg & Boot
    const rightLegPivot = new THREE.Group();
    rightLegPivot.position.set(0.25, 0.25, 0);
    characterRoot.add(rightLegPivot);

    const rightLeg = new THREE.Mesh(legGeo, bootMat);
    rightLeg.position.y = -0.2;
    rightLegPivot.add(rightLeg);

    const rightFoot = leftFoot.clone();
    rightLegPivot.add(rightFoot);
    const rightToe = leftToe.clone();
    rightLegPivot.add(rightToe);

    // 7. Articulating Tail (swaying)
    const tailPivot = new THREE.Group();
    tailPivot.position.set(0, 0.35, -0.45);
    characterRoot.add(tailPivot);

    const tailGeo = new THREE.CylinderGeometry(0.04, 0.09, 0.48, 12);
    const tail = new THREE.Mesh(tailGeo, bodyMat);
    tail.rotation.x = -0.6;
    tail.position.set(0, 0.15, -0.2);
    tailPivot.add(tail);

    // 8. Glowing Sacred Aura Base (Toono/Ulzii Halo)
    let auraRing: THREE.Mesh | null = null;
    if (showAura) {
      const ringGeo = new THREE.RingGeometry(0.7, 0.95, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: spec.auraColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.45,
      });
      auraRing = new THREE.Mesh(ringGeo, ringMat);
      auraRing.rotation.x = Math.PI / 2;
      auraRing.position.y = -0.15;
      characterRoot.add(auraRing);
    }

    // Interactive Drag Rotation
    let isDragging = false;
    let prevMouseX = 0;
    let targetRotationY = 0;
    let targetRotationX = 0;

    const onMouseDown = (e: MouseEvent) => {
      if (!interactive) return;
      isDragging = true;
      prevMouseX = e.clientX;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging && interactive) {
        const deltaX = e.clientX - prevMouseX;
        targetRotationY += deltaX * 0.015;
        prevMouseX = e.clientX;
      }
      // Gentle head look-at
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotationX = normY * 0.2;
      if (!isDragging) {
        headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, normX * 0.4, 0.1);
        headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, -normY * 0.2, 0.1);
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    if (interactive) {
      container.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }

    // 9. Animation Engine Loop (via THREE.Clock)
    const clock = new THREE.Clock();
    let reqId: number;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth auto-rotation or user drag interpolation
      if (autoRotate && !isDragging) {
        targetRotationY += 0.008;
      }
      characterRoot.rotation.y = THREE.MathUtils.lerp(
        characterRoot.rotation.y,
        targetRotationY,
        0.08
      );

      // Aura slow spinning & pulse
      if (auraRing) {
        auraRing.rotation.z += 0.015;
        (auraRing.material as THREE.MeshBasicMaterial).opacity =
          0.35 + Math.sin(elapsed * 3) * 0.15;
      }

      // Tail natural sway
      tailPivot.rotation.y = Math.sin(elapsed * 3.5) * 0.3;
      tailPivot.rotation.z = Math.cos(elapsed * 2.5) * 0.15;

      // Animate based on currentAnim state
      switch (currentAnim) {
        case 'walk':
        case 'run':
        case 'walk_run': {
          // Bipedal running / walking gait
          const runFreq = currentAnim === 'walk' ? 5 : 9;
          const swing = Math.sin(elapsed * runFreq);
          leftLegPivot.rotation.x = swing * 0.65;
          rightLegPivot.rotation.x = -swing * 0.65;
          leftArmPivot.rotation.x = -swing * 0.55;
          rightArmPivot.rotation.x = swing * 0.55;
          characterRoot.position.y = -0.4 + Math.abs(Math.sin(elapsed * runFreq)) * 0.12;
          bodyGroup.rotation.z = swing * 0.05;
          break;
        }

        case 'attack': {
          // Martial arts cyber strike: lunge forward, thrust right paw
          const strikeCycle = (elapsed * 3) % 2;
          if (strikeCycle < 1) {
            characterRoot.position.z = Math.sin(strikeCycle * Math.PI) * 0.4;
            characterRoot.position.y = -0.45;
            rightArmPivot.rotation.x = -Math.PI / 2 + Math.sin(strikeCycle * Math.PI) * 0.3;
            rightArmPivot.rotation.z = -0.2;
            leftArmPivot.rotation.z = 0.8;
            bodyGroup.rotation.y = -0.3;
          } else {
            characterRoot.position.z = 0;
            rightArmPivot.rotation.x = 0;
            leftArmPivot.rotation.z = 0.2;
            bodyGroup.rotation.y = 0;
          }
          break;
        }

        case 'jump': {
          // Energetic jump cycle
          const jumpArc = Math.sin(elapsed * 4);
          characterRoot.position.y = -0.4 + Math.max(0, jumpArc) * 0.45;
          if (jumpArc > 0) {
            leftArmPivot.rotation.z = 1.2;
            rightArmPivot.rotation.z = -1.2;
            leftLegPivot.rotation.x = 0.4;
            rightLegPivot.rotation.x = 0.4;
          } else {
            leftArmPivot.rotation.z = 0.2;
            rightArmPivot.rotation.z = -0.2;
            leftLegPivot.rotation.x = -0.1;
            rightLegPivot.rotation.x = -0.1;
          }
          break;
        }

        case 'dance': {
          // Traditional Mongolian Bielgee shoulder ripple & joyous dance
          const bielgee = Math.sin(elapsed * 6);
          leftArmPivot.rotation.z = 0.8 + Math.sin(elapsed * 5) * 0.4;
          rightArmPivot.rotation.z = -0.8 - Math.cos(elapsed * 5) * 0.4;
          leftArmPivot.rotation.y = bielgee * 0.3;
          rightArmPivot.rotation.y = -bielgee * 0.3;
          bodyGroup.rotation.y = Math.sin(elapsed * 3) * 0.25;
          characterRoot.position.y = -0.4 + Math.abs(Math.sin(elapsed * 6)) * 0.08;
          break;
        }

        case 'victory': {
          // Double fist pump, chest proud, hopping with joy
          const hop = Math.abs(Math.sin(elapsed * 5));
          characterRoot.position.y = -0.4 + hop * 0.25;
          leftArmPivot.rotation.z = 2.2 + Math.sin(elapsed * 8) * 0.2;
          rightArmPivot.rotation.z = -2.2 - Math.sin(elapsed * 8) * 0.2;
          headGroup.rotation.x = -0.2;
          break;
        }

        case 'defeat':
        case 'sad': {
          // Drooping shoulders, hanging head
          characterRoot.position.y = -0.45;
          headGroup.rotation.x = 0.35;
          leftArmPivot.rotation.z = 0.1;
          rightArmPivot.rotation.z = -0.1;
          leftArmPivot.rotation.x = 0.15;
          rightArmPivot.rotation.x = 0.15;
          break;
        }

        case 'idle':
        default: {
          // Natural breathing rhythm & subtle life
          const breath = Math.sin(elapsed * 2.2);
          bodyGroup.scale.set(1 + breath * 0.02, 1 + breath * 0.03, 1 + breath * 0.02);
          headGroup.position.y = 1.45 + breath * 0.025;
          leftArmPivot.rotation.z = 0.15 + breath * 0.05;
          rightArmPivot.rotation.z = -0.15 - breath * 0.05;
          leftLegPivot.rotation.x = 0;
          rightLegPivot.rotation.x = 0;
          characterRoot.position.y = -0.4;
          break;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || sizeDims.width;
      const newHeight = container.clientHeight || sizeDims.height;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        container.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      }
      renderer.dispose();
      container.innerHTML = '';
    };
  }, [zodiacId, currentAnim, autoRotate, interactive, showAura, sizeDims.height, sizeDims.width]);

  return (
    <div
      ref={mountRef}
      onMouseEnter={() => {
        setIsHovered(true);
        if (currentAnim === 'idle') setCurrentAnim('happy');
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        if (currentAnim === 'happy') setCurrentAnim('idle');
      }}
      className={`relative select-none flex items-center justify-center cursor-grab active:cursor-grabbing ${className}`}
      style={{
        width: sizeDims.width,
        height: sizeDims.height,
      }}
    />
  );
};
