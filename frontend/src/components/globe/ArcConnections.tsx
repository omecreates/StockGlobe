import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { QuadraticBezierLine } from "@react-three/drei";
import { ARC_PAIRS, MARKETS } from "@/data/markets";
import { latLngToVec3 } from "./utils";
import { useGlobeStore } from "@/store/globeStore";

const R = 1.005;

function getArcColor(sentiment: string) {
  if (sentiment.includes("Bullish")) return "#00ffaa";
  if (sentiment.includes("Bearish")) return "#ff0044";
  return "#44aaff";
}

function parseVolume(volStr: string) {
  if (volStr.endsWith("B")) return parseFloat(volStr) * 1000;
  if (volStr.endsWith("M")) return parseFloat(volStr);
  return 500;
}

export function ArcConnections() {
  const heatmapMode = useGlobeStore(state => state.heatmapMode);

  const lookup = useMemo(() => Object.fromEntries(MARKETS.map((m) => [m.code, {
    pos: latLngToVec3(m.lat, m.lng, R),
    sentiment: m.sentiment,
    volume: parseVolume(m.volume)
  }])), []);

  const arcs = useMemo(
    () =>
      ARC_PAIRS.map(([a, b], i) => {
        const source = lookup[a];
        const target = lookup[b];
        if (!source || !target) return null;
        
        const mid = source.pos.clone().add(target.pos).multiplyScalar(0.5);
        const dist = source.pos.distanceTo(target.pos);
        mid.normalize().multiplyScalar(R + 0.15 + dist * 0.2);

        // Calculate thickness based on average volume
        const avgVol = (source.volume + target.volume) / 2;
        const thickness = Math.max(0.5, Math.min(3, avgVol / 1000));
        
        // Color based on source sentiment
        const color = getArcColor(source.sentiment);

        return {
          i,
          start: source.pos,
          mid,
          end: target.pos,
          color,
          thickness
        };
      }).filter(Boolean) as any[],
    [lookup]
  );

  return (
    <group>
      {arcs.map((a) => (
        <Arc 
          key={a.i} 
          start={a.start} 
          mid={a.mid} 
          end={a.end} 
          color={a.color} 
          thickness={a.thickness} 
          offset={a.i * 0.4} 
          heatmapMode={heatmapMode}
        />
      ))}
    </group>
  );
}

function Arc({ start, mid, end, color, thickness, offset, heatmapMode }: { start: THREE.Vector3, mid: THREE.Vector3, end: THREE.Vector3, color: string, thickness: number, offset: number, heatmapMode: boolean }) {
  const dotRef = useRef<THREE.Mesh>(null);
  const curve = useMemo(() => new THREE.QuadraticBezierCurve3(start, mid, end), [start, mid, end]);

  useFrame((state) => {
    if (!dotRef.current) return;
    const t = ((state.clock.elapsedTime * 0.4 + offset) % 1 + 1) % 1;
    const p = curve.getPoint(t);
    dotRef.current.position.copy(p);
  });

  return (
    <group>
      <QuadraticBezierLine
        start={start}
        end={end}
        mid={mid}
        color={color}
        lineWidth={heatmapMode ? thickness * 1.5 : thickness}
        transparent
        opacity={heatmapMode ? 0.6 : 0.3}
      />
      <mesh ref={dotRef}>
        <sphereGeometry args={[heatmapMode ? 0.015 : 0.01, 12, 12]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    </group>
  );
}
