import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import { StageLighting } from "./StageLighting.jsx";

export function GameCanvas({ sky, background, children, onPointerMissed }) {
  const sceneBackground = background || sky || "#bfe3ff";

  return (
    <div className="canvas-fill">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        camera={{ position: [0, 2, 6], fov: 45 }}
        onPointerMissed={onPointerMissed}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
      >
        <color attach="background" args={[sceneBackground]} />
        <fog attach="fog" args={[sceneBackground, 9, 24]} />
        <Environment preset="sunset" />
        <StageLighting />
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </Canvas>
    </div>
  );
}
