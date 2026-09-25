import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { PresenceType, ThemeDefinition } from '../../types/nova';

interface SpatialCanvasProps {
  presenceType: PresenceType;
  theme: ThemeDefinition;
  audioLevel?: number; // 0 to 1
  isListening?: boolean;
  interactive?: boolean;
}

export const SpatialCanvas: React.FC<SpatialCanvasProps> = ({
  presenceType,
  theme,
  audioLevel = 0,
  isListening = false,
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const audioLevelRef = useRef(audioLevel);
  const isListeningRef = useRef(isListening);
  const themeRef = useRef(theme);
  const presenceTypeRef = useRef(presenceType);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  audioLevelRef.current = audioLevel;
  isListeningRef.current = isListening;
  themeRef.current = theme;
  presenceTypeRef.current = presenceType;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 120;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // --- 1. QUIET LIQUID PARTICULATE ORB ---
    const orbGroup = new THREE.Group();
    masterGroup.add(orbGroup);

    const particleCount = 12000;
    const sphereRadius = 35;
    const orbPositions = new Float32Array(particleCount * 3);
    const orbOriginals = new Float32Array(particleCount * 3);
    const orbColors = new Float32Array(particleCount * 3);

    const curTheme = themeRef.current;
    const primaryColor = new THREE.Color(curTheme.palette.orbParticlePrimary);
    const secondaryColor = new THREE.Color(curTheme.palette.orbParticleSecondary);

    for (let i = 0; i < particleCount; i++) {
      // Fibonacci spiral distribution for smooth optical density
      const phi = Math.acos(1 - 2 * (i + 0.5) / particleCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);

      const r = sphereRadius + (Math.random() - 0.5) * 3.5;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      orbPositions[i * 3] = x;
      orbPositions[i * 3 + 1] = y;
      orbPositions[i * 3 + 2] = z;

      orbOriginals[i * 3] = x;
      orbOriginals[i * 3 + 1] = y;
      orbOriginals[i * 3 + 2] = z;

      const mix = Math.random();
      const mixed = primaryColor.clone().lerp(secondaryColor, mix * 0.5);
      orbColors[i * 3] = mixed.r;
      orbColors[i * 3 + 1] = mixed.g;
      orbColors[i * 3 + 2] = mixed.b;
    }

    const orbGeometry = new THREE.BufferGeometry();
    orbGeometry.setAttribute('position', new THREE.BufferAttribute(orbPositions, 3));
    orbGeometry.setAttribute('color', new THREE.BufferAttribute(orbColors, 3));

    // Smooth Gaussian particle texture
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.25, 'rgba(255,255,255,0.7)');
      grad.addColorStop(0.65, 'rgba(255,255,255,0.15)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const orbMaterial = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      blending: curTheme.isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
      depthWrite: false,
      opacity: curTheme.isDark ? 0.85 : 0.65,
    });

    const orbPoints = new THREE.Points(orbGeometry, orbMaterial);
    orbGroup.add(orbPoints);

    // Subtle, quiet orbital ring
    const ringGeo = new THREE.RingGeometry(43, 43.4, 96);
    const ringMat = new THREE.MeshBasicMaterial({
      color: primaryColor,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.12,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI * 0.42;
    orbGroup.add(ringMesh);

    // --- 2. SYNTHETIC WIREFRAME HUMANOID ---
    const humanoidGroup = new THREE.Group();
    masterGroup.add(humanoidGroup);

    const headWireframeGroup = new THREE.Group();
    humanoidGroup.add(headWireframeGroup);

    const contourCount = 26;
    for (let c = 0; c < contourCount; c++) {
      const t = (c / (contourCount - 1)) * 2 - 1;
      const radiusY = Math.sqrt(Math.max(0, 1 - t * t * 0.85)) * 27;
      const radiusX = radiusY * (0.75 + 0.08 * Math.sin(t * Math.PI));

      const points: THREE.Vector3[] = [];
      const segments = 44;
      for (let s = 0; s <= segments; s++) {
        const angle = (s / segments) * Math.PI * 2;
        let forwardZ = Math.cos(angle) * radiusX;
        let lateralX = Math.sin(angle) * radiusX;
        if (Math.cos(angle) > 0) {
          if (t > -0.2 && t < 0.2) forwardZ += Math.cos(angle) * 6;
          else if (t < -0.4) forwardZ -= Math.cos(angle) * 2.5;
        }
        points.push(new THREE.Vector3(lateralX, t * 30, forwardZ * 0.9));
      }
      const contourGeo = new THREE.BufferGeometry().setFromPoints(points);
      const contourMat = new THREE.LineBasicMaterial({
        color: primaryColor,
        transparent: true,
        opacity: 0.14 + (1 - Math.abs(t)) * 0.28,
      });
      headWireframeGroup.add(new THREE.Line(contourGeo, contourMat));
    }

    // Subtle optical gaze nodes
    const eyeGeo = new THREE.SphereGeometry(1.0, 16, 16);
    const eyeMat = new THREE.MeshBasicMaterial({ color: primaryColor, transparent: true, opacity: 0.7 });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-6, 3.5, 14.5);
    headWireframeGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(6, 3.5, 14.5);
    headWireframeGroup.add(rightEye);

    // Mouse tracking with gentle inertia
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      mouseRef.current.targetX = ((clientX / rect.width) * 2 - 1) * 0.45;
      mouseRef.current.targetY = -((clientY / rect.height) * 2 - 1) * 0.45;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // --- ANIMATION LOOP ---
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const curPresence = presenceTypeRef.current;
      const curAudio = audioLevelRef.current;
      const activeTheme = themeRef.current;

      const pColor = new THREE.Color(activeTheme.palette.orbParticlePrimary);
      const sColor = new THREE.Color(activeTheme.palette.orbParticleSecondary);

      // Smooth inertia
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.04;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.04;

      orbGroup.visible = curPresence === 'orb';
      humanoidGroup.visible = curPresence === 'humanoid';

      if (curPresence === 'orb') {
        orbGroup.rotation.y = elapsedTime * 0.08 + mouseRef.current.x * 0.4;
        orbGroup.rotation.x = Math.sin(elapsedTime * 0.08) * 0.08 + mouseRef.current.y * 0.3;
        ringMesh.rotation.z = elapsedTime * 0.05;

        // Fluid particulate harmonic displacement
        const posAttr = orbGeometry.attributes.position as THREE.BufferAttribute;
        const positions = posAttr.array as Float32Array;

        const pulseScale = 1 + (curAudio * 0.2) + Math.sin(elapsedTime * 1.8) * 0.015;
        const freqOffset = elapsedTime * 2.5;

        for (let i = 0; i < particleCount; i++) {
          const ox = orbOriginals[i * 3];
          const oy = orbOriginals[i * 3 + 1];
          const oz = orbOriginals[i * 3 + 2];

          const dist = Math.sqrt(ox * ox + oy * oy + oz * oz);
          const wave = Math.sin(dist * 0.22 + freqOffset + ox * 0.06) * (0.8 + curAudio * 2.5);

          const factor = pulseScale + wave / sphereRadius;
          positions[i * 3] = ox * factor;
          positions[i * 3 + 1] = oy * factor;
          positions[i * 3 + 2] = oz * factor;
        }
        posAttr.needsUpdate = true;

        orbMaterial.color.lerp(pColor, 0.05);
        ringMat.color.lerp(sColor, 0.05);
      } else {
        headWireframeGroup.rotation.y = mouseRef.current.x * 0.7;
        headWireframeGroup.rotation.x = -mouseRef.current.y * 0.5;
        headWireframeGroup.rotation.z = Math.sin(elapsedTime * 0.4) * 0.015;

        const pulse = 1 + curAudio * 0.08 + Math.sin(elapsedTime * 2.0) * 0.01;
        headWireframeGroup.scale.set(pulse, pulse, pulse);

        eyeMat.color.lerp(pColor, 0.05);
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 400;
      const h = container.clientHeight || 400;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      orbGeometry.dispose();
      orbMaterial.dispose();
      particleTexture.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative flex items-center justify-center pointer-events-none"
      style={{ overflow: 'hidden' }}
    />
  );
};
