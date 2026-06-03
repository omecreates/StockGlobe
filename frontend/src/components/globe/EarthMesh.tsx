import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { feature } from "topojson-client";
import type { Feature, FeatureCollection, Geometry } from "geojson";

// Build a clean, sleek equirectangular world map texture
function buildEarthTexture(countries: FeatureCollection): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const w = 2048;
  const h = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Ocean — dark, sleek grey/blue
  ctx.fillStyle = "#0a0a0f";
  ctx.fillRect(0, 0, w, h);

  // Subtle latitude grid
  ctx.strokeStyle = "rgba(255,255,255,0.03)";
  ctx.lineWidth = 1;
  for (let lat = -80; lat <= 80; lat += 20) {
    const y = ((90 - lat) / 180) * h;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }
  for (let lng = -180; lng <= 180; lng += 20) {
    const x = ((lng + 180) / 360) * w;
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }

  const project = (lng: number, lat: number): [number, number] => [
    ((lng + 180) / 360) * w,
    ((90 - lat) / 180) * h,
  ];

  const drawRing = (ring: number[][]) => {
    ctx.beginPath();
    ring.forEach((pt, i) => {
      const [x, y] = project(pt[0], pt[1]);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.closePath();
  };

  const drawGeom = (geom: Geometry) => {
    if (geom.type === "Polygon") {
      geom.coordinates.forEach((ring) => { drawRing(ring); ctx.fill(); ctx.stroke(); });
    } else if (geom.type === "MultiPolygon") {
      geom.coordinates.forEach((poly) => poly.forEach((ring) => { drawRing(ring); ctx.fill(); ctx.stroke(); }));
    }
  };

  // Land fill — subtle monotone color
  ctx.lineWidth = 1.0;

  countries.features.forEach((f: Feature) => {
    ctx.fillStyle = "#1a1a24";
    ctx.strokeStyle = "rgba(120, 140, 180, 0.4)"; // subtle blue/grey outline
    drawGeom(f.geometry);
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

export function EarthMesh() {
  const ref = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json");
        if (!res.ok) throw new Error("Fetch failed");
        const topo = await res.json();
        // @ts-expect-error topojson types are loose
        const geo = feature(topo, topo.objects.countries) as FeatureCollection;
        if (cancelled) return;
        const tex = buildEarthTexture(geo);
        if (tex) setTexture(tex);
      } catch (e) {
        console.error("Failed to load world map, using fallback", e);
        // Fallback: draw an empty grid texture if fetch fails
        if (!cancelled) {
          const canvas = document.createElement("canvas");
          canvas.width = 1024; canvas.height = 512;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.fillStyle = "#0a0a0f";
            ctx.fillRect(0, 0, 1024, 512);
            ctx.strokeStyle = "rgba(255,255,255,0.05)";
            for (let i=0; i<1024; i+=32) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,512); ctx.stroke(); }
            for (let i=0; i<512; i+=32) { ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(1024,i); ctx.stroke(); }
            const tex = new THREE.CanvasTexture(canvas);
            tex.colorSpace = THREE.SRGBColorSpace;
            setTexture(tex);
          }
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.02; // Slower, more elegant rotation
  });

  return (
    <group>
      {/* Base sphere with clean map */}
      <mesh ref={ref}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color={new THREE.Color("#ffffff")}
          emissive={new THREE.Color("#05050a")}
          emissiveIntensity={0.2}
          map={texture ?? undefined}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      {/* Subtle Atmosphere */}
      <mesh scale={1.05}>
        <sphereGeometry args={[1, 48, 48]} />
        <shaderMaterial
          transparent
          side={THREE.BackSide}
          depthWrite={false}
          uniforms={{
            uColor: { value: new THREE.Color("#2a4a6a") },
            uColor2: { value: new THREE.Color("#1a2a3a") },
          }}
          vertexShader={`
            varying vec3 vNormal;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            varying vec3 vNormal;
            uniform vec3 uColor;
            uniform vec3 uColor2;
            void main() {
              float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
              vec3 col = mix(uColor2, uColor, intensity);
              gl_FragColor = vec4(col, intensity * 0.8);
            }
          `}
        />
      </mesh>
    </group>
  );
}
