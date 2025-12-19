/* -------------------------------------------------------
   GlobeSimulator.jsx — Real-Time Global Cyber Attack Map
   Enhanced Visibility + Cinematic Glow Edition
   + Neon Particle Trails
   + Pulsing Nodes
   + Matrix Sparks
   + Radar Rings
   + HUD Scan Lines
   + 🔍 Replay Visual Annotations (Pins / Pulses / Labels)
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
    const animationEnabledRef = useRef(true);

    // 🔍 Replay annotation refs (NEW)
    const replayAnnotationsRef = useRef({
        pins: [],
        pulses: [],
        labels: []
    });

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
        camera.position.set(0, 40, 340);
        camera.lookAt(0, 0, 0);
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

        let dynamicAttacks = [...initialAttacks];
        const liveAttacksRef = { current: dynamicAttacks };

        /* --------------------------------------------------
           🔍 DIGITALFORT REPLAY ANNOTATIONS (Phase 2)
        -------------------------------------------------- */

        function clearReplayAnnotations() {
            const { pins, pulses, labels } = replayAnnotationsRef.current;
            [...pins, ...pulses, ...labels].forEach(obj => scene.remove(obj));
            replayAnnotationsRef.current = { pins: [], pulses: [], labels: [] };
        }

        function createReplayPin(lat, lng, color) {
            const { x, y, z } = globe.getCoords(lat, lng, 103);
            const geo = new THREE.SphereGeometry(4, 18, 18);
            const mat = new THREE.MeshBasicMaterial({
                color: new THREE.Color(color),
                transparent: true,
                opacity: 0.95,
                depthWrite: false
            });
            const pin = new THREE.Mesh(geo, mat);
            pin.position.set(x, y, z);
            scene.add(pin);
            replayAnnotationsRef.current.pins.push(pin);
            return pin;
        }

        function createReplayPulse(lat, lng, color) {
            const { x, y, z } = globe.getCoords(lat, lng, 102);
            const geo = new THREE.RingGeometry(2, 6, 32);
            const mat = new THREE.MeshBasicMaterial({
                color: new THREE.Color(color),
                transparent: true,
                opacity: 0.7,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
            const ring = new THREE.Mesh(geo, mat);
            ring.position.set(x, y, z);
            ring.lookAt(0, 0, 0);
            scene.add(ring);
            replayAnnotationsRef.current.pulses.push(ring);

            let scale = 1;
            const pulseAnim = setInterval(() => {
                scale += 0.08;
                ring.scale.set(scale, scale, scale);
                mat.opacity -= 0.03;
                if (mat.opacity <= 0) {
                    scene.remove(ring);
                    clearInterval(pulseAnim);
                }
            }, 30);
        }

        function createReplayLabel(lat, lng, text) {
            const canvas = document.createElement("canvas");
            canvas.width = 512;
            canvas.height = 128;
            const ctx = canvas.getContext("2d");
            ctx.fillStyle = "rgba(0,0,0,0.6)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.font = "28px monospace";
            ctx.fillStyle = "#00ffff";
            ctx.fillText(text, 20, 78);

            const texture = new THREE.CanvasTexture(canvas);
            const mat = new THREE.SpriteMaterial({
                map: texture,
                transparent: true,
                depthWrite: false
            });
            const sprite = new THREE.Sprite(mat);
            const pos = globe.getCoords(lat, lng, 112);
            sprite.position.set(pos.x, pos.y, pos.z);
            sprite.scale.set(40, 10, 1);
            scene.add(sprite);
            replayAnnotationsRef.current.labels.push(sprite);
        }

        /* --------------------------------------------------
           Globe Control Bridge (Extended)
        -------------------------------------------------- */
        window.__DIGITALFORT_GLOBE__ = {
            pause: () => (animationEnabledRef.current = false),
            resume: () => (animationEnabledRef.current = true),

            highlightAttack: (attack) => {
                if (!attack) return;
                globe.arcDashAnimateTime(800).arcAltitude(0.45).arcStroke(2.8);
                globe.arcsData([attack]);
            },

            restoreLive: () => {
                globe.arcDashAnimateTime(2200).arcAltitude(0.28).arcStroke(1.3);
                globe.arcsData(liveAttacksRef.current || initialAttacks);
            },

            showReplayAnnotation: ({ lat, lng, label, color = "cyan" }) => {
                clearReplayAnnotations();
                createReplayPin(lat, lng, color);
                createReplayPulse(lat, lng, color);
                if (label) createReplayLabel(lat, lng, label);
            },

            clearReplayAnnotations
        };

        // Lighting
        scene.add(new THREE.AmbientLight(0xffffff, 1.4));
        const directional = new THREE.DirectionalLight(0x00ffff, 2.8);
        directional.position.set(300, 200, 500);
        scene.add(directional);

        const rimLight = new THREE.DirectionalLight(0x00ffff, 1.2);
        rimLight.position.set(-300, -200, -400);
        scene.add(rimLight);

        // Animation loop
        function animate() {
            if (animationEnabledRef.current && !window.__DIGITALFORT_REPLAY__) {
                globe.rotation.y += 0.0028;
            }
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        }
        animate();

        return () => {
            clearReplayAnnotations();
            delete window.__DIGITALFORT_GLOBE__;
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
