import React from "react";

export function StageLighting() {
  return (
    <>
      <ambientLight intensity={0.45} />

      <directionalLight
        position={[5, 8, 5]}
        intensity={2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={30}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />

      <hemisphereLight args={["#ffffff", "#b6d7ff", 0.45]} />
    </>
  );
}
