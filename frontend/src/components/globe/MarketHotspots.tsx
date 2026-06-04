import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { MARKETS, type Market } from "@/data/markets";
import { latLngToVec3 } from "./utils";
import { useGlobeStore } from "@/store/globeStore";

const RADIUS = 1.005;

function getSentimentColor(sentiment: string) {
  switch (sentiment) {
    case "Very Bearish": return "#8b0000"; // Dark Red
    case "Bearish": return "#ff0000"; // Red
    case "Neutral": return "#ffcc00"; // Yellow
    case "Bullish": return "#00ff00"; // Green
    case "Very Bullish": return "#00ffaa"; // Bright Green
    default: return "#ffffff";
  }
}

export function MarketHotspots({
  hovered,
  onHover,
}: {
  hovered: string | null;
  onHover: (code: string | null) => void;
}) {
  const toggleMarketSelection = useGlobeStore(state => state.toggleMarketSelection);
  const selectedMarkets = useGlobeStore(state => state.selectedMarkets);
  const heatmapMode = useGlobeStore(state => state.heatmapMode);

  return (
    <group>
      {MARKETS.map((m) => (
        <Hotspot 
          key={m.code} 
          market={m} 
          active={hovered === m.code} 
          selected={selectedMarkets.includes(m.code)}
          heatmapMode={heatmapMode}
          onHover={onHover} 
          onClick={() => toggleMarketSelection(m.code)}
        />
      ))}
    </group>
  );
}

function Hotspot({ 
  market, 
  active, 
  selected,
  heatmapMode,
  onHover,
  onClick
}: { 
  market: Market; 
  active: boolean; 
  selected: boolean;
  heatmapMode: boolean;
  onHover: (c: string | null) => void;
  onClick: () => void;
}) {
  const pos = useMemo(() => latLngToVec3(market.lat, market.lng, RADIUS), [market.lat, market.lng]);
  const ringRef = useRef<THREE.Mesh>(null);
  const upNormal = useMemo(() => pos.clone().normalize(), [pos]);
  const quat = useMemo(() => {
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), upNormal);
    return q;
  }, [upNormal]);
  
  const color = getSentimentColor(market.sentiment);

  useFrame((state) => {
    if (ringRef.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 2 + market.lat) * 0.25 + (active || selected ? 0.4 : 0);
      ringRef.current.scale.setScalar(heatmapMode ? s * 2 : s); // Larger glow in heatmap mode
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.6 - Math.sin(state.clock.elapsedTime * 2 + market.lat) * 0.25;
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
        onClick={(e) => {
          e.stopPropagation();
          onClick();
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

      {/* Tooltip */}
      {(active || selected) && (
        <Html
          position={[0, 0, 0.16]}
          center
          distanceFactor={heatmapMode ? 3 : 4} // Slightly larger in heatmap mode
          style={{ pointerEvents: "none", zIndex: selected ? 10 : 5 }}
        >
          <div className="glass-strong w-[220px] rounded-xl p-4 text-left shadow-2xl border border-white/20 bg-background/80 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="font-display text-sm font-bold text-white">{market.city}</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{market.code}</div>
            </div>
            
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Market:</span>
                <span className="font-medium">{market.name}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Index:</span>
                <span className="font-medium truncate max-w-[100px] text-right" title={market.index}>{market.index}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Change:</span>
                <span className={`font-semibold ${market.change >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {market.change >= 0 ? "+" : ""}{market.change.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">AI Signal:</span>
                <span className="font-medium text-primary">{market.confidence > 80 ? "STRONG" : "NEUTRAL"}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Confidence:</span>
                <span className="font-medium">{market.confidence}%</span>
              </div>
              <div className="flex justify-between text-xs items-center pt-1 border-t border-white/10 mt-1">
                <span className="text-muted-foreground">Sentiment:</span>
                <span className="font-bold text-[10px] uppercase tracking-wider" style={{ color }}>{market.sentiment}</span>
              </div>
            </div>
            
            {selected && (
              <div className="mt-3 text-center text-[10px] text-primary/70 animate-pulse">
                View panel for details
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}
