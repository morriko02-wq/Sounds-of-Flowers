import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

interface ChibiScene3DProps {
  onAnimationComplete?: () => void;
  replayTrigger?: number;
}

export const ChibiScene3D: React.FC<ChibiScene3DProps> = ({
  onAnimationComplete,
  replayTrigger = 0,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 420;

    // 1. Three.js Scene & Camera setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x808000, 0.035);

    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 50);
    camera.position.set(0, 0.15, 3.4);
    camera.lookAt(0, 0.05, 0);

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 3. Studio Lighting & Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    const ambientLight = new THREE.AmbientLight(0xfff6e6, 1.15);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffae6, 2.2);
    keyLight.position.set(2, 3.5, 3);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffd580, 1.2);
    fillLight.position.set(-2.5, 2, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffce1b, 1.6);
    rimLight.position.set(0, 3, -2.5);
    scene.add(rimLight);

    // Soft garden pedestal base
    const pedestalGeo = new THREE.CylinderGeometry(1.8, 2.0, 0.18, 36);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x4f6022,
      roughness: 0.8,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -0.85;
    pedestal.receiveShadow = true;
    scene.add(pedestal);

    // Common Materials
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xfde3cf,
      roughness: 0.42,
      metalness: 0.02,
    });
    const blushMat = new THREE.MeshStandardMaterial({
      color: 0xff6b8b,
      roughness: 0.5,
      transparent: true,
      opacity: 0.85,
    });
    const darkFeatureMat = new THREE.MeshStandardMaterial({
      color: 0x1c1919,
      roughness: 0.25,
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0x664d00,
      emissiveIntensity: 0.25,
    });
    const silverMat = new THREE.MeshStandardMaterial({
      color: 0xdddddd,
      metalness: 0.9,
      roughness: 0.15,
    });

    // Helper: 3D Comma Hair
    const createCommaBangsMesh = (color: number, flip = false): THREE.Group => {
      const commaGroup = new THREE.Group();
      const hairMat = new THREE.MeshStandardMaterial({ color, roughness: 0.52 });

      // Curved comma bangs with distinct inward curl framing the forehead
      const curvePoints = flip
        ? [
            new THREE.Vector3(0.22, 0.30, 0.38),
            new THREE.Vector3(0.10, 0.36, 0.45),
            new THREE.Vector3(-0.06, 0.32, 0.48),
            new THREE.Vector3(-0.14, 0.20, 0.46),
            new THREE.Vector3(-0.08, 0.11, 0.44), // inward comma curl
          ]
        : [
            new THREE.Vector3(-0.22, 0.30, 0.38),
            new THREE.Vector3(-0.10, 0.36, 0.45),
            new THREE.Vector3(0.06, 0.32, 0.48),
            new THREE.Vector3(0.14, 0.20, 0.46),
            new THREE.Vector3(0.08, 0.11, 0.44), // inward comma curl
          ];

      const curve = new THREE.CatmullRomCurve3(curvePoints);
      const tubeGeo = new THREE.TubeGeometry(curve, 26, 0.075, 12, false);
      const mainLock = new THREE.Mesh(tubeGeo, hairMat);
      mainLock.castShadow = true;
      commaGroup.add(mainLock);

      // Complementary outer fringe lock
      const subPoints = flip
        ? [
            new THREE.Vector3(0.18, 0.34, 0.42),
            new THREE.Vector3(0.04, 0.36, 0.47),
            new THREE.Vector3(-0.08, 0.24, 0.47),
            new THREE.Vector3(-0.04, 0.17, 0.45),
          ]
        : [
            new THREE.Vector3(-0.18, 0.34, 0.42),
            new THREE.Vector3(-0.04, 0.36, 0.47),
            new THREE.Vector3(0.08, 0.24, 0.47),
            new THREE.Vector3(0.04, 0.17, 0.45),
          ];
      const subCurve = new THREE.CatmullRomCurve3(subPoints);
      const subGeo = new THREE.TubeGeometry(subCurve, 18, 0.048, 10, false);
      const subLock = new THREE.Mesh(subGeo, hairMat);
      subLock.castShadow = true;
      commaGroup.add(subLock);

      return commaGroup;
    };

    // ========================================================
    // CHARACTER 1: AYI (LEFT)
    // From reference drawing:
    // - Black hair with parted comma bangs
    // - Crescent moon clip
    // - Squinted happy eyes, deep blush hatching ///, tiny open mouth "o"
    // - 3 wavy emotion lines floating above head
    // - Ear piercing dot
    // - Little arrow-through-heart nearby
    // ========================================================
    const blackHairColor = 0x191a24;
    const ayiGroup = new THREE.Group();
    // Snug close positioning: Ayi at -0.38
    ayiGroup.position.set(-0.38, 0.04, 0);

    // Head base
    const headAyi = new THREE.Mesh(new THREE.SphereGeometry(0.46, 36, 32), skinMat);
    headAyi.castShadow = true;
    ayiGroup.add(headAyi);

    // Deep blushing cheeks with hatching texture
    const cheekGeo = new THREE.SphereGeometry(0.095, 16, 12);
    const leftCheekAyi = new THREE.Mesh(cheekGeo, blushMat);
    leftCheekAyi.position.set(-0.24, -0.08, 0.38);
    leftCheekAyi.scale.set(1.25, 0.75, 0.4);
    ayiGroup.add(leftCheekAyi);

    const rightCheekAyi = leftCheekAyi.clone();
    rightCheekAyi.position.set(0.24, -0.08, 0.38);
    ayiGroup.add(rightCheekAyi);

    // Cute blush hatch lines (like /// in the drawing)
    const hatchMat = new THREE.LineBasicMaterial({ color: 0xcc2952, linewidth: 2 });
    for (let side = -1; side <= 1; side += 2) {
      for (let h = -1; h <= 1; h++) {
        const hatchPoints = [
          new THREE.Vector3(side * 0.24 + h * 0.035 - 0.015, -0.11, 0.44),
          new THREE.Vector3(side * 0.24 + h * 0.035 + 0.015, -0.04, 0.44),
        ];
        const hatchGeo = new THREE.BufferGeometry().setFromPoints(hatchPoints);
        const hatchLine = new THREE.Line(hatchGeo, hatchMat);
        ayiGroup.add(hatchLine);
      }
    }

    // Squinted / happy closed curved eyes (from the drawing)
    const eyeCurveAyi = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-0.065, 0, 0),
      new THREE.Vector3(0, 0.04, 0),
      new THREE.Vector3(0.065, 0, 0)
    );
    const eyeArcGeoAyi = new THREE.TubeGeometry(eyeCurveAyi, 14, 0.02, 8, false);
    const leftEyeAyi = new THREE.Mesh(eyeArcGeoAyi, darkFeatureMat);
    leftEyeAyi.position.set(-0.18, 0.04, 0.42);
    ayiGroup.add(leftEyeAyi);

    const rightEyeAyi = leftEyeAyi.clone();
    rightEyeAyi.position.set(0.18, 0.04, 0.42);
    ayiGroup.add(rightEyeAyi);

    // Tiny surprised open cute mouth ("o" in the drawing)
    const mouthGeoAyi = new THREE.TorusGeometry(0.032, 0.012, 12, 18);
    const mouthAyi = new THREE.Mesh(mouthGeoAyi, darkFeatureMat);
    mouthAyi.position.set(0, -0.14, 0.45);
    mouthAyi.scale.set(0.8, 1.2, 1);
    ayiGroup.add(mouthAyi);

    // Ears with piercing stud
    const earGeo = new THREE.SphereGeometry(0.1, 16, 12);
    const leftEarAyi = new THREE.Mesh(earGeo, skinMat);
    leftEarAyi.position.set(-0.46, -0.02, 0.05);
    leftEarAyi.scale.set(0.6, 1.0, 0.7);
    ayiGroup.add(leftEarAyi);

    const piercingAyi = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), silverMat);
    piercingAyi.position.set(-0.49, -0.06, 0.08);
    ayiGroup.add(piercingAyi);

    // Black Hair base
    const hairMatAyi = new THREE.MeshStandardMaterial({
      color: blackHairColor,
      roughness: 0.5,
    });
    const hairBaseAyi = new THREE.Mesh(
      new THREE.SphereGeometry(0.49, 32, 28, 0, Math.PI * 2, 0, Math.PI * 0.72),
      hairMatAyi
    );
    hairBaseAyi.position.y = 0.03;
    hairBaseAyi.castShadow = true;
    ayiGroup.add(hairBaseAyi);

    // Black Comma Hair bangs (curved inward towards center forehead)
    const commaBangsAyi = createCommaBangsMesh(blackHairColor, true);
    ayiGroup.add(commaBangsAyi);

    // Golden Crescent Moon Clip on Ayi's hair
    const moonShape = new THREE.Shape();
    moonShape.absarc(0, 0, 0.09, 0.55, Math.PI * 1.5, false);
    moonShape.quadraticCurveTo(0.045, 0, 0.07, 0.07);
    const moonGeo = new THREE.ExtrudeGeometry(moonShape, {
      depth: 0.025,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.007,
      bevelThickness: 0.007,
    });
    const moonClip = new THREE.Mesh(moonGeo, goldMat);
    moonClip.position.set(-0.25, 0.32, 0.36);
    moonClip.rotation.set(0.2, -0.3, 0.25);
    moonClip.scale.set(1.1, 1.1, 1.1);
    ayiGroup.add(moonClip);

    // Three wavy emotion floaters above Ayi's head (as drawn in the reference image!)
    const wavyLinesGroup = new THREE.Group();
    const waveMat = new THREE.MeshStandardMaterial({ color: 0xffce1b, roughness: 0.3 });
    [-0.12, 0, 0.12].forEach((xOffset, idx) => {
      const wavePoints = [
        new THREE.Vector3(xOffset, 0.58, 0.1),
        new THREE.Vector3(xOffset + (idx % 2 === 0 ? 0.03 : -0.03), 0.72, 0.08),
        new THREE.Vector3(xOffset - (idx % 2 === 0 ? 0.02 : -0.02), 0.86, 0.06),
        new THREE.Vector3(xOffset, 1.0, 0.04),
      ];
      const waveCurve = new THREE.CatmullRomCurve3(wavePoints);
      const waveMesh = new THREE.Mesh(
        new THREE.TubeGeometry(waveCurve, 16, 0.012, 8, false),
        waveMat
      );
      wavyLinesGroup.add(waveMesh);
    });
    ayiGroup.add(wavyLinesGroup);

    // Little 3D Arrow-through-heart next to Ayi (💘 in reference drawing!)
    const heartGroup = new THREE.Group();
    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, 0);
    heartShape.bezierCurveTo(0, 0.04, -0.06, 0.08, -0.1, 0.08);
    heartShape.bezierCurveTo(-0.16, 0.08, -0.16, 0, -0.16, 0);
    heartShape.bezierCurveTo(-0.16, -0.08, -0.06, -0.14, 0, -0.2);
    heartShape.bezierCurveTo(0.06, -0.14, 0.16, -0.08, 0.16, 0);
    heartShape.bezierCurveTo(0.16, 0, 0.16, 0.08, 0.1, 0.08);
    heartShape.bezierCurveTo(0.06, 0.08, 0, 0.04, 0, 0);
    const heartMesh = new THREE.Mesh(
      new THREE.ExtrudeGeometry(heartShape, { depth: 0.03, bevelEnabled: true, bevelSize: 0.01 }),
      new THREE.MeshStandardMaterial({ color: 0xff4d6d, roughness: 0.35 })
    );
    heartGroup.add(heartMesh);

    // Arrow piercing through heart
    const arrow = new THREE.Mesh(
      new THREE.CylinderGeometry(0.008, 0.008, 0.38, 8),
      new THREE.MeshStandardMaterial({ color: 0xffce1b, metalness: 0.6 })
    );
    arrow.rotation.z = Math.PI / 4;
    arrow.position.set(0, -0.05, 0.02);
    heartGroup.add(arrow);
    heartGroup.position.set(-0.52, -0.32, 0.25);
    heartGroup.scale.set(0.65, 0.65, 0.65);
    ayiGroup.add(heartGroup);

    scene.add(ayiGroup);

    // ========================================================
    // CHARACTER 2: NJI (RIGHT)
    // From reference drawing:
    // - Brown hair with parted comma bangs
    // - Star clip on right side of hair
    // - Affectionate squinted eyes (- ‿ -) with sweet curved smile
    // - Sparkles ✨ beside cheek/star clip
    // - Ear piercing dot
    // - ONE cute hand reaching out offering the flower to Ayi!
    // ========================================================
    const brownHairColor = 0x543622;
    const njiGroup = new THREE.Group();
    // Snug close positioning: Nji at +0.38 (touching close proximity!)
    njiGroup.position.set(0.38, 0.04, 0);

    // Head base
    const headNji = new THREE.Mesh(new THREE.SphereGeometry(0.46, 36, 32), skinMat);
    headNji.castShadow = true;
    njiGroup.add(headNji);

    // Blushing rosy cheeks
    const leftCheekNji = new THREE.Mesh(cheekGeo, blushMat);
    leftCheekNji.position.set(-0.24, -0.08, 0.38);
    leftCheekNji.scale.set(1.25, 0.75, 0.4);
    njiGroup.add(leftCheekNji);

    const rightCheekNji = leftCheekNji.clone();
    rightCheekNji.position.set(0.24, -0.08, 0.38);
    njiGroup.add(rightCheekNji);

    // Happy affectionate squinted eyes (from reference drawing: curved lines with gentle angle)
    const eyeCurveNji = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-0.065, 0, 0),
      new THREE.Vector3(0, 0.035, 0),
      new THREE.Vector3(0.065, -0.015, 0)
    );
    const eyeArcGeoNji = new THREE.TubeGeometry(eyeCurveNji, 14, 0.02, 8, false);
    const leftEyeNji = new THREE.Mesh(eyeArcGeoNji, darkFeatureMat);
    leftEyeNji.position.set(-0.18, 0.04, 0.42);
    njiGroup.add(leftEyeNji);

    const rightEyeNji = leftEyeNji.clone();
    rightEyeNji.position.set(0.18, 0.04, 0.42);
    njiGroup.add(rightEyeNji);

    // Sweet cat-like / curved smile (‿ from drawing)
    const mouthCurveNji = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-0.05, 0, 0),
      new THREE.Vector3(0, -0.04, 0),
      new THREE.Vector3(0.05, 0, 0)
    );
    const mouthGeoNji = new THREE.TubeGeometry(mouthCurveNji, 12, 0.016, 8, false);
    const mouthNji = new THREE.Mesh(mouthGeoNji, darkFeatureMat);
    mouthNji.position.set(0, -0.15, 0.45);
    njiGroup.add(mouthNji);

    // Ears with piercing stud
    const rightEarNji = new THREE.Mesh(earGeo, skinMat);
    rightEarNji.position.set(0.46, -0.02, 0.05);
    rightEarNji.scale.set(0.6, 1.0, 0.7);
    njiGroup.add(rightEarNji);

    const piercingNji = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), silverMat);
    piercingNji.position.set(0.49, -0.06, 0.08);
    njiGroup.add(piercingNji);

    // Brown Hair base
    const hairMatNji = new THREE.MeshStandardMaterial({
      color: brownHairColor,
      roughness: 0.52,
    });
    const hairBaseNji = new THREE.Mesh(
      new THREE.SphereGeometry(0.49, 32, 28, 0, Math.PI * 2, 0, Math.PI * 0.72),
      hairMatNji
    );
    hairBaseNji.position.y = 0.03;
    hairBaseNji.castShadow = true;
    njiGroup.add(hairBaseNji);

    // Brown Comma Hair bangs sweeping inward
    const commaBangsNji = createCommaBangsMesh(brownHairColor, false);
    njiGroup.add(commaBangsNji);

    // Golden 5-point Star Clip on Nji's hair
    const starShape = new THREE.Shape();
    const starPoints = 5;
    for (let i = 0; i < starPoints * 2; i++) {
      const r = i % 2 === 0 ? 0.095 : 0.048;
      const a = (i * Math.PI) / starPoints - Math.PI / 2;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (i === 0) starShape.moveTo(x, y);
      else starShape.lineTo(x, y);
    }
    const starGeo = new THREE.ExtrudeGeometry(starShape, {
      depth: 0.025,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.009,
      bevelThickness: 0.009,
    });
    const starClip = new THREE.Mesh(starGeo, goldMat);
    starClip.position.set(0.28, 0.32, 0.36);
    starClip.rotation.set(0.2, 0.3, -0.25);
    starClip.scale.set(1.05, 1.05, 1.05);
    njiGroup.add(starClip);

    // Sparkles ✨ beside Nji (from reference drawing!)
    const sparkleGroup = new THREE.Group();
    const sparkleMat = new THREE.MeshStandardMaterial({
      color: 0xffea75,
      emissive: 0xffcf24,
      emissiveIntensity: 0.4,
    });
    const createSparkle = (s: number, x: number, y: number) => {
      const spShape = new THREE.Shape();
      spShape.moveTo(0, s);
      spShape.quadraticCurveTo(0, 0, s, 0);
      spShape.quadraticCurveTo(0, 0, 0, -s);
      spShape.quadraticCurveTo(0, 0, -s, 0);
      spShape.quadraticCurveTo(0, 0, 0, s);
      const mesh = new THREE.Mesh(
        new THREE.ExtrudeGeometry(spShape, { depth: 0.015, bevelEnabled: false }),
        sparkleMat
      );
      mesh.position.set(x, y, 0.35);
      return mesh;
    };
    sparkleGroup.add(createSparkle(0.07, 0.48, -0.08));
    sparkleGroup.add(createSparkle(0.045, 0.54, -0.22));
    njiGroup.add(sparkleGroup);

    // ========================================================
    // ONE REACHING HAND FOR NJI (STAR CLIP)
    // Reaching forward towards Ayi, offering the flower right up close!
    // ========================================================
    const reachingHandGroup = new THREE.Group();
    const sleeve = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.058, 0.32, 16),
      new THREE.MeshStandardMaterial({ color: 0x6b8e23, roughness: 0.65 })
    );
    sleeve.position.set(0, -0.15, 0);
    sleeve.castShadow = true;
    reachingHandGroup.add(sleeve);

    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.078, 16, 14), skinMat);
    hand.position.set(0, -0.32, 0);
    hand.castShadow = true;
    reachingHandGroup.add(hand);

    const thumb = new THREE.Mesh(new THREE.SphereGeometry(0.032, 10, 10), skinMat);
    thumb.position.set(0.055, -0.30, 0.03);
    reachingHandGroup.add(thumb);

    // Blooming White Daisy Blossom held in Nji's reaching hand
    const flowerGroup = new THREE.Group();
    const stemCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-0.02, 0.16, 0),
      new THREE.Vector3(0, 0.30, 0)
    );
    const stem = new THREE.Mesh(
      new THREE.TubeGeometry(stemCurve, 10, 0.015, 8, false),
      new THREE.MeshStandardMaterial({ color: 0x3d7e35, roughness: 0.6 })
    );
    flowerGroup.add(stem);

    const flowerHead = new THREE.Group();
    flowerHead.position.set(0, 0.30, 0);
    const flowerCenter = new THREE.Mesh(
      new THREE.SphereGeometry(0.048, 16, 16),
      new THREE.MeshStandardMaterial({
        color: 0xffce1b,
        emissive: 0x886600,
        emissiveIntensity: 0.25,
      })
    );
    flowerHead.add(flowerCenter);

    const petalCount = 8;
    const petalGeo = new THREE.SphereGeometry(0.042, 12, 10);
    const petalMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25 });
    for (let i = 0; i < petalCount; i++) {
      const a = (i * Math.PI * 2) / petalCount;
      const petal = new THREE.Mesh(petalGeo, petalMat);
      petal.position.set(Math.cos(a) * 0.07, Math.sin(a) * 0.07, 0);
      petal.scale.set(0.65, 1.25, 0.25);
      petal.rotation.z = a + Math.PI / 2;
      flowerHead.add(petal);
    }
    flowerGroup.add(flowerHead);
    flowerGroup.position.set(0, -0.34, 0.08);
    flowerGroup.rotation.set(-Math.PI / 5, 0, -0.2);
    reachingHandGroup.add(flowerGroup);

    // Position hand reaching out from Nji's left side directly toward Ayi!
    reachingHandGroup.position.set(-0.25, -0.32, 0.18);
    reachingHandGroup.rotation.set(-1.15, -0.35, 0.65); // reached out toward Ayi!
    njiGroup.add(reachingHandGroup);

    scene.add(njiGroup);

    // ========================================================
    // FLOATING 3D GOLDEN PARTICLES & HEARTS
    // ========================================================
    const particleGeo = new THREE.BufferGeometry();
    const count = 30;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 3;
      pos[i + 1] = Math.random() * 2 - 0.5;
      pos[i + 2] = (Math.random() - 0.5) * 2;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffe270,
      size: 0.06,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ========================================================
    // DRAG ROTATION & ANIMATION
    // ========================================================
    let animTime = 0;
    let sceneRotY = 0;
    let isDragging = false;
    let prevMouseX = 0;
    let hasNotified = false;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      prevMouseX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    };
    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const deltaX = clientX - prevMouseX;
      sceneRotY += deltaX * 0.008;
      prevMouseX = clientX;
    };
    const onPointerUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    container.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      animTime += delta;

      // Smooth scene rotation from drag
      scene.rotation.y = THREE.MathUtils.lerp(scene.rotation.y, sceneRotY, 0.08);

      // Sweet synchronized cheek-to-cheek hovering bob
      const bobAyi = Math.sin(animTime * 2.4) * 0.035;
      const bobNji = Math.sin(animTime * 2.4 + 0.5) * 0.035;

      ayiGroup.position.y = 0.04 + bobAyi;
      njiGroup.position.y = 0.04 + bobNji;

      // Gentle affectionate head tilts towards one another
      ayiGroup.rotation.y = 0.16 + Math.sin(animTime * 1.5) * 0.03;
      ayiGroup.rotation.z = -0.06 + Math.sin(animTime * 2) * 0.015;

      njiGroup.rotation.y = -0.16 + Math.sin(animTime * 1.5 + 0.4) * 0.03;
      njiGroup.rotation.z = 0.06 + Math.sin(animTime * 2 + 0.4) * 0.015;

      // Nji's reaching hand gently offers the flower closer and closer
      const reachPulse = Math.sin(animTime * 2.5) * 0.04;
      reachingHandGroup.position.x = -0.25 - reachPulse;
      reachingHandGroup.position.z = 0.18 + reachPulse * 0.5;

      // Ayi's wavy emotion lines float gently
      wavyLinesGroup.position.y = Math.sin(animTime * 3) * 0.03;

      // Sparkles rotate gently
      sparkleGroup.rotation.z = Math.sin(animTime * 2) * 0.1;

      // Particle floating
      const posArray = particleGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < posArray.length; i += 3) {
        posArray[i] += delta * 0.18;
        if (posArray[i] > 1.8) posArray[i] = -0.6;
      }
      particleGeo.attributes.position.needsUpdate = true;

      if (animTime > 2.8 && !hasNotified) {
        hasNotified = true;
        if (onAnimationComplete) onAnimationComplete();
      }

      renderer.render(scene, camera);
    };

    animate();
    setIsReady(true);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 640;
      const h = container.clientHeight || 420;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      container.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);

      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [replayTrigger]);

  return (
    <div className="relative w-full h-[360px] sm:h-[420px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none">
      <div ref={mountRef} className="w-full h-full" />
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center text-yellow-300 font-serif italic text-sm">
          Rendering Ayi &amp; Nji...
        </div>
      )}

      {/* Floating labels as drawn in the user's reference image! */}
      <div className="absolute top-6 right-[26%] sm:right-[30%] pointer-events-none">
        <span
          className="font-cursive text-2xl sm:text-3xl font-bold text-yellow-300 select-none drop-shadow-md"
          style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
        >
          Nji ⭐
        </span>
      </div>

      <div className="absolute bottom-6 left-[26%] sm:left-[30%] pointer-events-none">
        <span
          className="font-cursive text-2xl sm:text-3xl font-bold text-yellow-300 select-none drop-shadow-md"
          style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
        >
          🌙 Ayi
        </span>
      </div>

      <div className="absolute bottom-2 right-4 text-[11px] text-yellow-200/50 italic pointer-events-none">
        Drag to rotate 3D view
      </div>
    </div>
  );
};
