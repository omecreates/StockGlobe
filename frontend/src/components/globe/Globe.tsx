import React, { Suspense, useState, Component, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { EarthMesh } from "./EarthMesh";
import { MarketHotspots } from "./MarketHotspots";
import { ArcConnections } from "./ArcConnections";
import { Particles } from "./Particles";

/* ── Error boundary so a failed texture/WebGL issue only kills the globe, not the page ── */
class GlobeErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex h-full items-center justify-center text-center p-8">
          <div>
            <div className="text-muted-foreground text-sm mb-2">
              Globe failed to initialise
            </div>
            <div className="text-xs text-rose-400/70 font-mono max-w-md break-words">
              {this.state.error.message}
            </div>
            <button
              onClick={() => this.setState({ error: null })}
              className="mt-4 text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export function Globe() {
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <GlobeErrorBoundary>
      <Canvas
        dpr={[1, 1.6]}
        camera={{ position: [0, 0.3, 3.2], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 3, 5]} intensity={1.6} color="#7be0ff" />
        <directionalLight position={[-4, -2, -3]} intensity={0.9} color="#d98bff" />
        <pointLight position={[0, 0, 4]} intensity={1.2} color="#ff7bc5" />
        <Suspense fallback={null}>
          <EarthMesh />
          <MarketHotspots hovered={hovered} onHover={setHovered} />
          <ArcConnections />
          <Particles />
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate
          autoRotateSpeed={0.5}
          rotateSpeed={0.6}
          minPolarAngle={Math.PI / 2.6}
          maxPolarAngle={Math.PI / 1.6}
        />
      </Canvas>
    </GlobeErrorBoundary>
  );
}
