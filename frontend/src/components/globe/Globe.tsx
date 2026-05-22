import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { EarthMesh } from "./EarthMesh";
import { MarketHotspots } from "./MarketHotspots";
import { ArcConnections } from "./ArcConnections";
import { Particles } from "./Particles";

export function Globe() {
  const [hovered, setHovered] = useState<string | null>(null);
  return (
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
  );
}
