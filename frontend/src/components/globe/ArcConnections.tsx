import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { ARC_PAIRS, MARKETS } from "@/data/markets";
import { latLngToVec3 } from "./utils";

const R = 1.005;

function buildArc(a: THREE.Vector3, b: THREE.Vector3) {
  const mid = a.clone().add(b).multiplyScalar(0.5);
  const dist = a.distanceTo(b);
  mid.normalize().multiplyScalar(R + 0.18 + dist * 0.15);
  const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
  return curve.getPoints(60);
}

export function ArcConnections() {
  const lookup = useMemo(() => Object.fromEntries(MARKETS.map((m) => [m.code, latLngToVec3(m.lat, m.lng, R)])), []);
  const arcs = useMemo(
    () =>
      ARC_PAIRS.map(([a, b], i) => ({
        i,
        points: buildArc(lookup[a], lookup[b]),
      })),
    [lookup],
  );

  return (
    <group>
      {arcs.map((a) => (
        <Arc key={a.i} points={a.points} offset={a.i * 0.4} />
      ))}
    </group>
  );
}

function Arc({ points, offset }: { points: THREE.Vector3[]; offset: number }) {
  const lineRef = useRef<THREE.Line>(null);
  const dotRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  useFrame((state) => {
    if (!dotRef.current) return;
    const t = ((state.clock.elapsedTime * 0.25 + offset) % 1 + 1) % 1;
    const idx = Math.floor(t * (points.length - 1));
    const p = points[idx];
    dotRef.current.position.copy(p);
  });

  const lineObj = useMemo(() => {
    const mat = new THREE.LineBasicMaterial({ color: "#7cd1ff", transparent: true, opacity: 0.35, toneMapped: false });
    return new THREE.Line(geometry, mat);
  }, [geometry]);

  return (
    <group>
      <primitive object={lineObj} ref={lineRef} />
      <mesh ref={dotRef}>
        <sphereGeometry args={[0.012, 12, 12]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
    </group>
  );
}
