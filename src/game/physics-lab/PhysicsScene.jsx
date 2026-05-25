import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrthographicCamera } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import * as THREE from "three";
import { PhysicsObjects } from "./PhysicsObjects.jsx";

export function PhysicsScene({ resetToken, onDragChange, onImpact, onInteractionStart }) {
  return (
    <Canvas
      className="physics-canvas"
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
      }}
    >
      <color attach="background" args={["#cfeeff"]} />
      <fog attach="fog" args={["#cfeeff", 12, 24]} />
      <OrthographicCamera
        makeDefault
        position={[6.8, 6.1, 7.4]}
        zoom={72}
        near={0.1}
        far={60}
        onUpdate={(camera) => camera.lookAt(0, 0, 0)}
      />
      <ambientLight intensity={0.56} />
      <hemisphereLight args={["#ffffff", "#bde9ff", 0.55]} />
      <directionalLight
        castShadow
        position={[4, 8, 5]}
        intensity={2.15}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />
      <Suspense fallback={null}>
        <Environment preset="park" />
        <Physics gravity={[0, -9.81, 0]} colliders={false} timeStep="vary">
          <PhysicsObjects
            resetToken={resetToken}
            onDragChange={onDragChange}
            onImpact={onImpact}
            onInteractionStart={onInteractionStart}
          />
        </Physics>
      </Suspense>
    </Canvas>
  );
}
