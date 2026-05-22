import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { MARKETS, type Market } from "@/data/markets";
import { latLngToVec3 } from "./utils";

const RADIUS = 1.005;

export function MarketHotspots({
  hovered,
  onHover,
}: {
  hovered: string | null;
  onHover: (code: string | null) => void;
}) {
  return (
    <group>
      {MARKETS.map((m) => (
        <Hotspot key={m.code} market={m} active={hovered === m.code} onHover={onHover} />
      ))}
    </group>
  );
}

function Hotspot({ market, active, onHover }: { market: Market; active: boolean; onHover: (c: string | null) => void }) {
  const pos = useMemo(() => latLngToVec3(market.lat, market.lng, RADIUS), [market.lat, market.lng]);
  const ringRef = useRef<THREE.Mesh>(null);
  const upNormal = useMemo(() => pos.clone().normalize(), [pos]);
  const quat = useMemo(() => {
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), upNormal);
    return q;
  }, [upNormal]);
  const color = market.change >= 0 ? "#3ce7a1" : "#ff5b6e";

  useFrame((state) => {
    if (ringRef.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 2 + market.lat) * 0.25 + (active ? 0.4 : 0);
      ringRef.current.scale.setScalar(s);
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.55 - Math.sin(state.clock.elapsedTime * 2 + market.lat) * 0.25;
    }
  });

  return (
    <group position={pos} quaternion={quat}>
      {/* Core dot */}
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(market.code);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          onHover(null);
          document.body.style.cursor = "";
        }}
      >
        <sphereGeometry args={[0.018, 16, 16]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      {/* Pulsing ring */}
      <mesh ref={ringRef}>
        <ringGeometry args={[0.025, 0.045, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      {/* Vertical beacon */}
      <mesh position={[0, 0, 0.04]}>
        <cylinderGeometry args={[0.004, 0.004, 0.08, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.7} toneMapped={false} />
      </mesh>
      {active && (
        <Html
          position={[0, 0, 0.16]}
          center
          distanceFactor={4}
          style={{ pointerEvents: "none" }}
        >
          <div className="glass-strong w-[200px] rounded-xl p-3 text-left shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="font-display text-xs font-semibold">{market.city}</div>
              <div className="text-[9px] uppercase tracking-widest text-muted-foreground">{market.code}</div>
            </div>
            <div className="mt-1 text-[10px] text-muted-foreground">{market.index}</div>
            <div className="mt-2 flex items-baseline justify-between">
              <div className="font-display text-base tabular-nums">{market.value.toLocaleString()}</div>
              <div className={`text-xs tabular-nums ${market.change >= 0 ? "text-[color:var(--signal-buy)]" : "text-[color:var(--signal-sell)]"}`}>
                {market.change >= 0 ? "+" : ""}{market.change.toFixed(2)}%
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between text-[10px]">
              <span className="text-muted-foreground">AI conf</span>
              <span className="font-medium">{market.confidence}%</span>
            </div>
            <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full" style={{ width: `${market.confidence}%`, background: "var(--gradient-aurora)" }} />
            </div>
            <div className="mt-2 text-[10px] text-muted-foreground">
              Sentiment · <span className="text-foreground">{market.sentiment}</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
