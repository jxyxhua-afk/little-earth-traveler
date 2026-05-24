import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export function CameraRig({ view }) {
  const { camera } = useThree();

  const currentTarget = useRef(new THREE.Vector3(
    view.target[0],
    view.target[1],
    view.target[2]
  ));

  useFrame((_, delta) => {
    const speed = 1 - Math.exp(-delta * 4.5);

    const desiredPosition = new THREE.Vector3(
      view.position[0],
      view.position[1],
      view.position[2]
    );

    const desiredTarget = new THREE.Vector3(
      view.target[0],
      view.target[1],
      view.target[2]
    );

    camera.position.lerp(desiredPosition, speed);
    currentTarget.current.lerp(desiredTarget, speed);
    camera.lookAt(currentTarget.current);
  });

  return null;
}
