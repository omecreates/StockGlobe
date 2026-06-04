import { useRef, useMemo, useState, useEffect } from "react";
import * as THREE from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import { useGlobeStore } from "@/store/globeStore";

const EARTH_URL = "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg";
const BUMP_URL = "https://unpkg.com/three-globe/example/img/earth-topology.png";
const SPECULAR_URL = "https://unpkg.com/three-globe/example/img/earth-water.png";

export function EarthMesh() {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  
  const heatmapMode = useGlobeStore((state) => state.heatmapMode);

  // Load core textures (these are reliable)
  const [colorMap, bumpMap, specularMap] = useLoader(THREE.TextureLoader, [
    EARTH_URL,
    BUMP_URL,
    SPECULAR_URL,
  ]);

  // Load cloud texture separately so it can fail gracefully
  const [cloudsMap, setCloudsMap] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      "https://unpkg.com/three-globe/example/img/earth-clouds1024.png",
      (tex) => setCloudsMap(tex),
      undefined,
      () => {
        // Cloud texture failed — not critical, just skip it
        console.warn("Cloud texture failed to load — skipping cloud layer.");
      }
    );
  }, []);

  useMemo(() => {
    colorMap.colorSpace = THREE.SRGBColorSpace;
    colorMap.anisotropy = 16;
  }, [colorMap]);

  useFrame((_, delta) => {
    if (earthRef.current) earthRef.current.rotation.y += delta * 0.05;
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.07;
  });

  return (
    <group>
      {/* Base Earth Sphere */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[1, 64, 64]} />
        {heatmapMode ? (
          <meshStandardMaterial
            color="#050510"
            emissive="#0a0a1a"
            emissiveIntensity={0.5}
            wireframe={true}
            transparent
            opacity={0.3}
          />
        ) : (
          <meshPhongMaterial
            map={colorMap}
            bumpMap={bumpMap}
            bumpScale={0.015}
            specularMap={specularMap}
            specular={new THREE.Color("grey")}
            shininess={15}
          />
        )}
      </mesh>

      {/* Clouds Layer — only renders if texture loaded successfully */}
      {!heatmapMode && cloudsMap && (
        <mesh ref={cloudsRef} scale={1.01}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshPhongMaterial
            map={cloudsMap}
            transparent={true}
            opacity={0.4}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}

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
