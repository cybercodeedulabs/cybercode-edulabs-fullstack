/* -------------------------------------------------------
   GlobeSimulator.jsx — Real-Time Global Cyber Attack Map
   Enhanced Visibility + Cinematic Glow Edition
   All original logic preserved — ONLY visual clarity improved
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

    // Camera — slightly closer to reduce blur
    const camera = new THREE.PerspectiveCamera(
      55,                                           // reduced FOV for clarity
      container.clientWidth / container.clientHeight,
      0.1,
      2000
    );
    camera.position.z = 350;                       // closer zoom
    cameraRef.current = camera;

    // Renderer — improved tone mapping
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;      // cinematic
    renderer.toneMappingExposure = 1.4;                      // brightness boost
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Globe — enhanced clarity
    const globe = new Globe()
      .globeImageUrl("//unpkg.com/three-globe/example/img/earth-night.jpg")
      .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png")
      .arcsData(initialAttacks)
      .arcAltitude(0.25)                          // slightly higher arcs
      .arcStroke(1.1)                             // sharper lines
      .arcColor((d) => d.color)
      .arcDashLength(0.5)
      .arcDashGap(1)
      .arcDashAnimateTime(2500)
      .showAtmosphere(true)
      .atmosphereColor("cyan")
      .atmosphereAltitude(0.35);                  // stronger glow

    globeRef.current = globe;
    scene.add(globe);

    // Ambient + Directional lighting — much brighter
    scene.add(new THREE.AmbientLight(0xffffff, 1.2));

    const directional = new THREE.DirectionalLight(0x00ffff, 2);
    directional.position.set(200, 200, 400);
    scene.add(directional);

    // Add outer glow sphere for cinematic look
    const glowGeometry = new THREE.SphereGeometry(110, 64, 64);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color("cyan"),
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending
    });
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    glowMesh.scale.set(2.3, 2.3, 2.3);
    scene.add(glowMesh);

    // ---------- REAL-TIME ATTACK GENERATOR ----------
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

      if (dynamicAttacks.length > 30) {
        dynamicAttacks = dynamicAttacks.slice(-30);
      }

      globe.arcsData(dynamicAttacks);
    }

    const interval = setInterval(generateAttack, 1800); // slightly faster

    // ---------- Animation Loop ----------
    function animate() {
      globe.rotation.y += 0.003;         // slightly faster rotation
      glowMesh.rotation.y += 0.001;      // slow atmospheric halo rotation
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();

    // ---------- Resize ----------
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
