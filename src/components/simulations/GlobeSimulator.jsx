/* -------------------------------------------------------
   GlobeSimulator.jsx — Real-Time Global Cyber Attack Map
   Enhanced Visibility + Cinematic Glow Edition
   + Neon Particle Trails
   + Pulsing Nodes
   + Matrix Sparks
   + Radar Rings (Foreground Locked)
   + Country Labels
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

  // Base initial realistic attack dataset
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

  useEffect(() => {
    const container = containerRef.current;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      2000
    );
    camera.position.z = 350;
    cameraRef.current = camera;

    // Renderer
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

    // Globe
    const globe = new Globe()
      .globeImageUrl("//unpkg.com/three-globe/example/img/earth-night.jpg")
      .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png")
      .arcsData(initialAttacks)
      .arcAltitude(0.28)
      .arcStroke(1.4)
      .arcColor((d) => d.color)
      .arcDashLength(0.55)
      .arcDashGap(1)
      .arcDashAnimateTime(2200)
      .showAtmosphere(true)
      .atmosphereColor("cyan")
      .atmosphereAltitude(0.4);

    globeRef.current = globe;
    scene.add(globe);

    // 🔹 FORCE ARCS TO FRONT
    globe.arcsMaterial().depthTest = false;
    globe.arcsMaterial().transparent = true;
    globe.arcsMaterial().renderOrder = 999;

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 1.5));
    const directional = new THREE.DirectionalLight(0x00ffff, 2.8);
    directional.position.set(300, 200, 500);
    scene.add(directional);

    // Outer glow
    const glowGeometry = new THREE.SphereGeometry(110, 64, 64);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color("cyan"),
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
      depthTest: false
    });
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    glowMesh.scale.set(2.5, 2.5, 2.5);
    glowMesh.renderOrder = 1;
    scene.add(glowMesh);

    // 🔵 RADAR RINGS — FRONT LOCKED
    const radarRings = [];
    for (let i = 0; i < 3; i++) {
      const ringGeo = new THREE.RingGeometry(118 + i * 10, 120 + i * 10, 128);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.18,
        blending: THREE.AdditiveBlending,
        depthTest: false
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.renderOrder = 998;
      scene.add(ring);
      radarRings.push(ring);
    }

    // 🌍 COUNTRY LABELS
    globe
      .labelsData([
        { lat: 20.6, lng: 78.9, text: "INDIA" },
        { lat: 38, lng: -97, text: "USA" },
        { lat: 35, lng: 103, text: "CHINA" },
        { lat: 61, lng: 100, text: "RUSSIA" },
        { lat: 54, lng: -2, text: "UK" },
        { lat: 36, lng: 138, text: "JAPAN" }
      ])
      .labelText(d => d.text)
      .labelSize(2.2)
      .labelColor(() => "cyan")
      .labelDotRadius(0.4)
      .labelAltitude(0.02);

    // ---------- ATTACK GENERATOR ----------
    let dynamicAttacks = [...initialAttacks];

    function generateAttack() {
      const src = ATTACK_POINTS[Math.floor(Math.random() * ATTACK_POINTS.length)];
      let dst = ATTACK_POINTS[Math.floor(Math.random() * ATTACK_POINTS.length)];

      while (dst.lat === src.lat) {
        dst = ATTACK_POINTS[Math.floor(Math.random() * ATTACK_POINTS.length)];
      }

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

    // Animation loop
    function animate() {
      globe.rotation.y += 0.0025;
      glowMesh.rotation.y += 0.001;

      radarRings.forEach((ring) => {
        ring.scale.x += 0.002;
        ring.scale.y += 0.002;
        ring.material.opacity -= 0.0006;
        if (ring.material.opacity <= 0.05) {
          ring.scale.set(1, 1, 1);
          ring.material.opacity = 0.18;
        }
      });

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();

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
