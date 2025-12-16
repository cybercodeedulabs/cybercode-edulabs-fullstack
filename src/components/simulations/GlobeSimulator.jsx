/* -------------------------------------------------------
   GlobeSimulator.jsx — Enhanced Futuristic Cyber Globe
   Improvements:
   - Increased visibility
   - Neon glow ring
   - Reduced dark overlay impact
   - Larger globe scaling
--------------------------------------------------------*/
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import Globe from "three-globe";

export default function GlobeSimulator() {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      2000
    );
    camera.position.z = 380;
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

    // Neon glow ring behind the globe
    const glowGeometry = new THREE.RingGeometry(180, 220, 64);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color("cyan"),
      opacity: 0.25,
      transparent: true,
      side: THREE.DoubleSide,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.rotation.x = Math.PI / 2;
    glow.position.z = -80;
    scene.add(glow);

    // Globe
    const globe = new Globe()
      .globeImageUrl("//unpkg.com/three-globe/example/img/earth-night.jpg")
      .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png")
      .showAtmosphere(true)
      .atmosphereColor("cyan")
      .atmosphereAltitude(0.35);

    // Slightly scale up the globe for hero visibility
    globe.scale.set(1.18, 1.18, 1.18);
    scene.add(globe);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 1.1));
    const dir = new THREE.DirectionalLight(0x00ffff, 1.4);
    dir.position.set(200, 180, 260);
    scene.add(dir);

    // Animation
    function animate() {
      globe.rotation.y += 0.0018;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();

    // Resize handler
    function onResize() {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full bg-black"
    ></div>
  );
}
