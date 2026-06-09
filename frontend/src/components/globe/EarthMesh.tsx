import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGlobeStore } from "@/store/globeStore";

/**
 * Simplified continent path data as [lat, lng] polygon outlines.
 * Each continent is an array of coordinate pairs that approximate its shape.
 */
const CONTINENT_PATHS: [number, number][][] = [
  // North America
  [
    [60, -140], [65, -168], [72, -162], [71, -156], [57, -135],
    [55, -131], [60, -140],
  ],
  [
    [72, -162], [76, -155], [78, -120], [76, -90], [73, -80],
    [62, -75], [52, -55], [47, -53], [44, -59], [44, -63],
    [47, -65], [45, -67], [43, -65], [41, -70], [30, -82],
    [25, -80], [25, -90], [20, -87], [15, -83], [10, -84],
    [8, -77], [10, -75], [18, -88], [20, -91], [19, -96],
    [21, -105], [25, -108], [30, -114], [32, -117], [37, -122],
    [40, -124], [48, -124], [50, -128], [55, -131], [57, -135],
    [71, -156], [72, -162],
  ],
  // South America
  [
    [12, -72], [10, -75], [8, -77], [6, -75], [2, -70],
    [-5, -80], [-7, -80], [-15, -76], [-18, -70], [-23, -70],
    [-28, -65], [-35, -57], [-40, -62], [-45, -66], [-48, -66],
    [-52, -70], [-55, -68], [-56, -68], [-55, -64], [-52, -68],
    [-48, -66], [-42, -63], [-38, -57], [-34, -54], [-23, -40],
    [-15, -39], [-10, -37], [-5, -35], [-2, -42], [2, -50],
    [6, -56], [7, -60], [10, -62], [12, -72],
  ],
  // Europe
  [
    [36, -6], [38, -9], [43, -9], [43, -2], [46, -2],
    [48, -5], [49, -1], [51, 2], [52, 5], [54, 8],
    [56, 8], [58, 12], [60, 5], [62, 5], [65, 14],
    [69, 16], [71, 26], [70, 32], [67, 41], [62, 40],
    [56, 40], [54, 37], [50, 40], [47, 42], [45, 37],
    [42, 36], [38, 27], [36, 28], [40, 26], [38, 24],
    [36, 22], [38, 20], [37, 15], [40, 18], [41, 16],
    [39, 16], [38, 13], [36, 14], [38, 12], [41, 9],
    [44, 8], [44, 12], [46, 7], [48, 7], [46, 3],
    [43, 3], [42, 0], [37, -2], [36, -6],
  ],
  // Africa
  [
    [37, -2], [36, -6], [34, -2], [32, -5], [30, -10],
    [26, -15], [20, -17], [15, -17], [10, -15], [5, -8],
    [5, 2], [2, 10], [4, 10], [6, 1], [4, 7],
    [0, 9], [-3, 12], [-5, 12], [-12, 14], [-12, 24],
    [-16, 36], [-25, 35], [-27, 33], [-34, 26], [-34, 18],
    [-30, 18], [-25, 15], [-18, 12], [-12, 14], [-6, 10],
    [-5, 12], [-3, 12], [0, 9], [4, 10], [2, 10],
    [5, 2], [5, -8], [10, -15], [15, -17], [17, -16],
    [20, -17], [21, -17], [30, -10], [32, -5], [34, -2],
    [35, 10], [32, 32], [30, 33], [25, 35], [20, 40],
    [15, 42], [12, 44], [10, 44], [12, 50], [2, 42],
    [-1, 42], [-12, 49], [-16, 36], [-12, 24],
  ],
  // Asia (simplified)
  [
    [70, 32], [71, 26], [69, 16], [65, 14], [60, 30],
    [55, 50], [50, 52], [42, 44], [38, 44], [35, 36],
    [32, 32], [30, 33], [25, 35], [20, 40], [15, 42],
    [12, 44], [10, 44], [12, 50], [8, 60], [5, 70],
    [8, 77], [13, 80], [15, 76], [22, 89], [20, 97],
    [22, 100], [23, 104], [18, 106], [12, 109], [4, 104],
    [1, 104], [-8, 110], [-8, 115], [-6, 106], [1, 104],
    [4, 104], [12, 109], [18, 106], [23, 104], [22, 100],
    [20, 97], [22, 89], [27, 89], [28, 97], [22, 100],
    [25, 102], [30, 105], [35, 104], [38, 110], [40, 117],
    [42, 130], [45, 132], [40, 140], [35, 137], [35, 132],
    [33, 130], [30, 120], [24, 120], [22, 115], [22, 108],
    [30, 105], [35, 104], [38, 75], [36, 62], [40, 50],
    [42, 44], [50, 52], [55, 50], [60, 55], [55, 65],
    [55, 70], [50, 80], [55, 73], [60, 68], [55, 80],
    [55, 85], [52, 88], [50, 87], [50, 80], [55, 73],
    [60, 68], [62, 78], [60, 90], [55, 85], [55, 98],
    [50, 87], [48, 90], [44, 88], [48, 90], [55, 98],
    [60, 100], [55, 110], [50, 110], [55, 130], [55, 135],
    [58, 140], [60, 150], [62, 160], [66, 170], [67, 180],
    [70, 170], [65, 180], [67, 180], [72, 180], [76, 155],
    [78, 120], [76, 90], [73, 80], [70, 70], [73, 55],
    [70, 32],
  ],
  // Australia
  [
    [-12, 131], [-12, 137], [-15, 141], [-17, 146],
    [-22, 150], [-28, 153], [-32, 152], [-38, 146],
    [-38, 140], [-35, 137], [-32, 133], [-32, 128],
    [-32, 122], [-28, 114], [-22, 114], [-18, 122],
    [-14, 127], [-12, 131],
  ],
  // Greenland
  [
    [60, -45], [60, -50], [66, -54], [70, -54], [72, -56],
    [76, -68], [78, -72], [82, -60], [83, -40], [82, -22],
    [78, -18], [75, -18], [72, -22], [70, -27], [65, -37],
    [63, -42], [60, -45],
  ],
  // Japan (simplified)
  [
    [31, 131], [33, 130], [35, 132], [35, 137], [38, 140],
    [40, 140], [42, 143], [45, 145], [43, 145], [40, 140],
    [35, 137], [35, 132], [33, 130], [31, 131],
  ],
  // UK & Ireland (simplified)
  [
    [50, -6], [51, -3], [52, 0], [53, 0], [54, -3],
    [56, -3], [58, -5], [58, -3], [57, -2], [55, -1],
    [54, 0], [52, 2], [51, 1], [50, -1], [50, -6],
  ],
  [
    [51, -10], [52, -10], [54, -8], [54, -6], [52, -6],
    [51, -10],
  ],
  // New Zealand (simplified)
  [
    [-35, 174], [-37, 175], [-39, 177], [-42, 174],
    [-46, 167], [-47, 168], [-46, 170], [-44, 172],
    [-42, 174], [-39, 177], [-37, 175], [-35, 174],
  ],
  // Madagascar
  [
    [-12, 49], [-16, 50], [-19, 44], [-23, 44], [-25, 47],
    [-22, 44], [-19, 44], [-16, 50], [-12, 49],
  ],
  // Indonesia (simplified main islands)
  [
    [-5, 95], [-6, 105], [-8, 110], [-8, 115], [-7, 115],
    [-6, 110], [-5, 106], [-5, 95],
  ],
  [
    [-2, 118], [-4, 116], [-4, 118], [-2, 120], [-2, 118],
  ],
];

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

  // Draw continents
  for (const path of CONTINENT_PATHS) {
    if (path.length < 3) continue;

    ctx.beginPath();
    for (let i = 0; i < path.length; i++) {
      const [lat, lng] = path[i];
      const x = ((lng + 180) / 360) * width;
      const y = ((90 - lat) / 180) * height;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();

    // Land fill
    ctx.fillStyle = landColor;
    ctx.fill();

    // Land border
    ctx.strokeStyle = landStroke;
    ctx.lineWidth = 1.5;
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
