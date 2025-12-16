/* -------------------------------------------------------
   GlobeSimulator.jsx — Real-Time Global Cyber Attack Map
   Upgraded: Auto-generate new attacks every 2 seconds
   Uses: three, three-globe
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
    { startLat: 40.7, startLng: -74, endLat: 28.6, endLng: 77.2, color: "cyan" },      // USA → India
    { startLat: 35.8, startLng: 104.1, endLat: 48.8, endLng: 2.3, color: "magenta" },  // China → France
    { startLat: 55.7, startLng: 37.6, endLat: 51.5, endLng: -0.1, color: "yellow" },   // Russia → UK
    { startLat: 52.5, startLng: 13.4, endLat: 1.3, endLng: 103.8, color: "orange" },   // Germany → Singapore
    { startLat: 35.6, startLng: 139.7, endLat: 34, endLng: -118.2, color: "cyan" },    // Japan → USA
  ];

  // Colors for new attacks
  const colorPool = ["cyan", "magenta", "yellow", "orange", "lime", "red"];

  // Random locations for dynamic attacks
  const ATTACK_POINTS = [
    { lat: 40.7, lng: -74 },   // USA
    { lat: 28.6, lng: 77.2 },  // India
    { lat: 51.5, lng: -0.1 },  // UK
    { lat: 35.6, lng: 139.7 }, // Japan
    { lat: 1.3, lng: 103.8 },  // Singapore
    { lat: 48.8, lng: 2.3 },   // France
    { lat: 55.7, lng: 37.6 },  // Russia
    { lat: -33.8, lng: 151.2 } // Australia
  ];

  useEffect(() => {
    const container = containerRef.current;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      2000
    );
    camera.position.z = 400;
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Globe
    const globe = new Globe()
      .globeImageUrl("//unpkg.com/three-globe/example/img/earth-night.jpg")
      .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png")
      .arcsData(initialAttacks)
      .arcAltitude(0.18)
      .arcStroke(0.7)
      .arcColor((d) => d.color)
      .arcDashLength(0.4)
      .arcDashGap(1)
      .arcDashAnimateTime(3000)
      .showAtmosphere(true)
      .atmosphereColor("cyan")
      .atmosphereAltitude(0.25);

    globeRef.current = globe;
    scene.add(globe);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const directional = new THREE.DirectionalLight(0x00ffff, 1);
    directional.position.set(300, 200, 400);
    scene.add(directional);

    // ---------- 🔥 REAL-TIME ATTACK GENERATOR ----------
    let dynamicAttacks = [...initialAttacks];

    function generateAttack() {
      const src = ATTACK_POINTS[Math.floor(Math.random() * ATTACK_POINTS.length)];
      let dst = ATTACK_POINTS[Math.floor(Math.random() * ATTACK_POINTS.length)];

      // avoid same point → point attack
      while (dst.lat === src.lat) {
        dst = ATTACK_POINTS[Math.floor(Math.random() * ATTACK_POINTS.length)];
      }

      const attack = {
        startLat: src.lat,
        startLng: src.lng,
        endLat: dst.lat,
        endLng: dst.lng,
        color: colorPool[Math.floor(Math.random() * colorPool.length)],
      };

      // Add the new attack to list
      dynamicAttacks.push(attack);

      // limit old arcs (keeps globe clean)
      if (dynamicAttacks.length > 25) {
        dynamicAttacks = dynamicAttacks.slice(-25);
      }

      // update globe arcs
      globe.arcsData(dynamicAttacks);
    }

    const interval = setInterval(generateAttack, 2000); // every 2 sec

    // ---------- Animation Loop ----------
    function animate() {
      globe.rotation.y += 0.002;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();

    // ---------- Resize Handler ----------
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
