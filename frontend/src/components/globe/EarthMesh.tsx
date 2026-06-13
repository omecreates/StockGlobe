import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGlobeStore } from "@/store/globeStore";

import worldAtlas from "world-atlas/land-110m.json";
import * as topojson from "topojson-client";

// Extract land features from topojson (cast to any to avoid TS strict GeoJSON type issues)
const landData = topojson.feature(worldAtlas as any, worldAtlas.objects.land as any) as any;
const multiPolygonCoords: [number, number][][][] = landData.features[0].geometry.coordinates;

/**
 * Generates a canvas texture with continent outlines drawn on an ocean background.
 */
function createGlobeTexture(
  oceanColor: string,
  landColor: string,
  landStroke: string,
  gridColor: string,
  width = 2048,
  height = 1024
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  // Ocean gradient background
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, oceanColor);
  grad.addColorStop(0.5, shiftColor(oceanColor, 10));
  grad.addColorStop(1, oceanColor);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Subtle grid lines (latitude/longitude)
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 0.5;
  ctx.globalAlpha = 0.15;
  for (let lat = -80; lat <= 80; lat += 20) {
    const y = ((90 - lat) / 180) * height;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  for (let lng = -180; lng < 180; lng += 30) {
    const x = ((lng + 180) / 360) * width;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Draw continents using high-res map data
  for (const polygon of multiPolygonCoords) {
    ctx.beginPath();
    // A polygon is an array of rings (the first is the exterior ring, subsequent are holes)
    for (const ring of polygon as [number, number][][]) {
      for (let i = 0; i < ring.length; i++) {
        const [lng, lat] = ring[i];
        const x = ((lng + 180) / 360) * width;
        const y = ((90 - lat) / 180) * height;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
    }
    // Land fill
    ctx.fillStyle = landColor;
    ctx.fill("evenodd");

    // Land border
    ctx.strokeStyle = landStroke;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 16;
  return tex;
}

/** Lighten or darken a hex color */
function shiftColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

export function EarthMesh() {
  const earthRef = useRef<THREE.Mesh>(null);
  const heatmapMode = useGlobeStore((state) => state.heatmapMode);

  // Create the stylized globe texture
  const normalTexture = useMemo(
    () => createGlobeTexture("#0a1628", "#1a3a5c", "#2a6aaa", "#1a3a6a"),
    []
  );
  const heatmapTexture = useMemo(
    () => createGlobeTexture("#050510", "#1a0a1a", "#4a1040", "#2a0a2a"),
    []
  );

  useFrame((_, delta) => {
    if (earthRef.current) earthRef.current.rotation.y += delta * 0.05;
  });

  return (
    <group>
      {/* Base Earth Sphere */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[1, 64, 64]} />
        {heatmapMode ? (
          <meshStandardMaterial
            map={heatmapTexture}
            emissive="#0a0a1a"
            emissiveIntensity={0.5}
            roughness={0.9}
            metalness={0.1}
          />
        ) : (
          <meshStandardMaterial
            map={normalTexture}
            emissive="#050d1a"
            emissiveIntensity={0.3}
            roughness={0.85}
            metalness={0.15}
          />
        )}
      </mesh>

      {/* Atmospheric Glow */}
      <mesh scale={1.05}>
        <sphereGeometry args={[1, 48, 48]} />
        <shaderMaterial
          transparent
          side={THREE.BackSide}
          depthWrite={false}
          uniforms={{
            uColor: { value: new THREE.Color(heatmapMode ? "#ff0000" : "#4a7aff") },
            uColor2: { value: new THREE.Color(heatmapMode ? "#220000" : "#1a2a4a") },
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
              float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
              vec3 col = mix(uColor2, uColor, intensity);
              gl_FragColor = vec4(col, intensity * (0.8 + 0.2 * sin(intensity)));
            }
          `}
        />
      </mesh>
    </group>
  );
}
