import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { feature } from "topojson-client";
import type { Feature, FeatureCollection, Geometry } from "geojson";

// Build a vibrant equirectangular world map texture from world-atlas topojson.
function buildEarthTexture(countries: FeatureCollection): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const w = 2048;
  const h = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Ocean — vibrant deep blue/purple gradient
  const ocean = ctx.createLinearGradient(0, 0, w, h);
  ocean.addColorStop(0, "#0a1844");
  ocean.addColorStop(0.5, "#15205c");
  ocean.addColorStop(1, "#1a1248");
  ctx.fillStyle = ocean;
  ctx.fillRect(0, 0, w, h);

  // Subtle latitude grid
  ctx.strokeStyle = "rgba(120,180,255,0.07)";
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

  // Land fill — neon cyan→magenta gradient per feature based on centroid hue
  const palette = ["#3ee0ff", "#7cf0d0", "#b48bff", "#ff7bc5", "#ffb15e", "#5fb3ff"];
  ctx.lineWidth = 1.2;

  countries.features.forEach((f: Feature, idx: number) => {
    const color = palette[idx % palette.length];
    ctx.fillStyle = color;
    ctx.strokeStyle = "rgba(255,255,255,0.55)";
    ctx.globalAlpha = 0.85;
    drawGeom(f.geometry);
  });
  ctx.globalAlpha = 1;

  // Glow pass — re-stroke borders brighter
  ctx.strokeStyle = "rgba(180,230,255,0.4)";
  ctx.lineWidth = 0.6;
  countries.features.forEach((f: Feature) => {
    if (f.geometry.type === "Polygon") {
      f.geometry.coordinates.forEach((ring) => { drawRing(ring); ctx.stroke(); });
    } else if (f.geometry.type === "MultiPolygon") {
      f.geometry.coordinates.forEach((poly) => poly.forEach((ring) => { drawRing(ring); ctx.stroke(); }));
    }
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
        const topo = await res.json();
        // @ts-expect-error topojson types are loose
        const geo = feature(topo, topo.objects.countries) as FeatureCollection;
        if (cancelled) return;
        const tex = buildEarthTexture(geo);
        if (tex) setTexture(tex);
      } catch (e) {
        console.error("Failed to load world map", e);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.05;
  });

  return (
    <group>
      {/* Base sphere with real country map */}
      <mesh ref={ref}>
        <sphereGeometry args={[1, 96, 96]} />
        <meshStandardMaterial
          color={new THREE.Color("#ffffff")}
          emissive={new THREE.Color("#2a3a8a")}
          emissiveIntensity={0.35}
          map={texture ?? undefined}
          roughness={0.6}
          metalness={0.15}
        />
      </mesh>
      {/* Atmosphere */}
      <mesh scale={1.13}>
        <sphereGeometry args={[1, 48, 48]} />
        <shaderMaterial
          transparent
          side={THREE.BackSide}
          depthWrite={false}
          uniforms={{
            uColor: { value: new THREE.Color("#5fd6ff") },
            uColor2: { value: new THREE.Color("#d97bff") },
            uColor3: { value: new THREE.Color("#ff7bc5") },
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
            uniform vec3 uColor3;
            void main() {
              float intensity = pow(0.72 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
              vec3 col = mix(uColor, uColor2, intensity);
              col = mix(col, uColor3, intensity * 0.5);
              gl_FragColor = vec4(col, intensity * 1.4);
            }
          `}
        />
      </mesh>
      {/* Inner glow */}
      <mesh scale={1.025}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshBasicMaterial color="#4d8eff" transparent opacity={0.12} />
      </mesh>
    </group>
  );
}
