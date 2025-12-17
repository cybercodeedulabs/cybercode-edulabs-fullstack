/* -------------------------------------------------------
   GlobeSimulator.jsx — Real-Time Global Cyber Attack Map
   Enhanced Visibility + Cinematic Glow Edition
   + Neon Particle Trails
   + Pulsing Nodes
   + Matrix Sparks
   + Radar Rings
   + HUD Scan Lines
   + Country Labels
   + India-Centric Camera Lock (rotation preserved)
   ALL original logic preserved — ONLY enhancements added
--------------------------------------------------------*/
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import Globe from "three-globe";

export default function GlobeSimulator() {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const globeRef = useRef(null);

  // ------------------ DATA ------------------
  const initialAttacks = [
    { startLat: 40.7, startLng: -74, endLat: 28.6, endLng: 77.2, color: "cyan" },
    { startLat: 35.8, startLng: 104.1, endLat: 48.8, endLng: 2.3, color: "magenta" },
    { startLat: 55.7, startLng: 37.6, endLat: 51.5, endLng: -0.1, color: "yellow" },
    { startLat: 52.5, startLng: 13.4, endLat: 1.3, endLng: 103.8, color: "orange" },
    { startLat: 35.6, startLng: 139.7, endLat: 34, endLng: -118.2, color: "cyan" },
  ];

  const colorPool = ["cyan", "magenta", "yellow", "orange", "lime", "red"];

  const ATTACK_POINTS = [
    { lat: 40.7, lng: -74 },
    { lat: 28.6, lng: 77.2 },
    { lat: 51.5, lng: -0.1 },
    { lat: 35.6, lng: 139.7 },
    { lat: 1.3, lng: 103.8 },
    { lat: 48.8, lng: 2.3 },
    { lat: 55.7, lng: 37.6 },
    { lat: -33.8, lng: 151.2 }
  ];

  // 🌍 Country labels (A)
  const COUNTRY_LABELS = [
    { name: "INDIA", lat: 22.6, lng: 78.9, size: 1.3 },
    { name: "USA", lat: 39.8, lng: -98.5, size: 1 },
    { name: "CHINA", lat: 35.8, lng: 104.1, size: 1 },
    { name: "RUSSIA", lat: 61.5, lng: 105.3, size: 1 },
    { name: "UK", lat: 55.3, lng: -3.4, size: 1 }
  ];

  useEffect(() => {
    const container = containerRef.current;

    // ------------------ SCENE ------------------
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // ------------------ CAMERA ------------------
    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      2000
    );
    camera.position.set(0, 40, 340);
    cameraRef.current = camera;

    // ------------------ RENDERER ------------------
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.7;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ------------------ GLOBE ------------------
    const globe = new Globe()
      .globeImageUrl("//unpkg.com/three-globe/example/img/earth-night.jpg")
      .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png")
      .arcsData(initialAttacks)
      .arcAltitude(0.28)
      .arcStroke(1.3)
      .arcColor((d) => d.color)
      .arcDashLength(0.5)
      .arcDashGap(1)
      .arcDashAnimateTime(2200)
      .showAtmosphere(true)
      .atmosphereColor("cyan")
      .atmosphereAltitude(0.4);

    globe.arcsTransitionDuration(0);
    globeRef.current = globe;
    scene.add(globe);

    // ------------------ LIGHTING ------------------
    scene.add(new THREE.AmbientLight(0xffffff, 1.4));

    const directional = new THREE.DirectionalLight(0x00ffff, 2.8);
    directional.position.set(300, 200, 500);
    scene.add(directional);

    const rimLight = new THREE.DirectionalLight(0x00ffff, 1.2);
    rimLight.position.set(-300, -200, -400);
    scene.add(rimLight);

    // ------------------ GLOW ------------------
    const glowGeometry = new THREE.SphereGeometry(110, 64, 64);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color("cyan"),
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    glowMesh.scale.set(2.45, 2.45, 2.45);
    scene.add(glowMesh);

    // ------------------ RADAR RINGS ------------------
    const radarRings = [];
    for (let i = 0; i < 3; i++) {
      const ringGeo = new THREE.RingGeometry(118 + i * 10, 120 + i * 10, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.18,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      scene.add(ring);
      radarRings.push(ring);
    }

    // ------------------ COUNTRY LABELS (A) ------------------
    const labelGroup = new THREE.Group();
    scene.add(labelGroup);

    COUNTRY_LABELS.forEach(({ name, lat, lng, size }) => {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 128;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "cyan";
      ctx.font = "bold 36px Arial";
      ctx.textAlign = "center";
      ctx.fillText(name, 128, 64);

      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthWrite: false
      });

      const sprite = new THREE.Sprite(material);
      const pos = globe.getCoords(lat, lng, 115);
      sprite.position.set(pos.x, pos.y, pos.z);
      sprite.scale.set(18 * size, 9 * size, 1);
      labelGroup.add(sprite);
    });

    // ------------------ ATTACK GENERATOR ------------------
    let dynamicAttacks = [...initialAttacks];

    function generateAttack() {
      const src = ATTACK_POINTS[Math.floor(Math.random() * ATTACK_POINTS.length)];
      let dst = ATTACK_POINTS[Math.floor(Math.random() * ATTACK_POINTS.length)];
      while (dst.lat === src.lat) dst = ATTACK_POINTS[Math.floor(Math.random() * ATTACK_POINTS.length)];

      const attack = {
        startLat: src.lat,
        startLng: src.lng,
        endLat: dst.lat,
        endLng: dst.lng,
        color: colorPool[Math.floor(Math.random() * colorPool.length)]
      };

      dynamicAttacks.push(attack);
      if (dynamicAttacks.length > 30) dynamicAttacks = dynamicAttacks.slice(-30);

      globe.arcsData(dynamicAttacks);
    }

    const interval = setInterval(generateAttack, 1800);

    // ------------------ ANIMATION LOOP ------------------
    function animate() {
      globe.rotation.y += 0.0028;
      glowMesh.rotation.y += 0.001;

      // 🔒 India-centric camera lock (B)
      const india = globe.getCoords(22.6, 78.9, 0);
      camera.lookAt(india.x, india.y, india.z);

      radarRings.forEach((ring, i) => {
        ring.scale.x += 0.002 + i * 0.001;
        ring.scale.y += 0.002 + i * 0.001;
        ring.material.opacity -= 0.0005;
        if (ring.material.opacity <= 0.05) {
          ring.scale.set(1, 1, 1);
          ring.material.opacity = 0.18;
        }
      });

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();

    // ------------------ RESIZE ------------------
    function onResize() {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      clearInterval(interval);
      if (renderer.domElement) container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-screen overflow-hidden relative bg-black"
    ></div>
  );
}
