import React from "react";
import { BallCollider, CuboidCollider, RigidBody } from "@react-three/rapier";
import { DYNAMIC_OBJECTS, PHYSICS_TUNING } from "./physicsTuningConfig.js";
import { DraggableRigidBody } from "./DraggableRigidBody.jsx";

function ToyMaterial({ color, roughness = 0.72 }) {
  return <meshStandardMaterial color={color} roughness={roughness} metalness={0.02} />;
}

function Ground() {
  return (
    <RigidBody type="fixed" friction={PHYSICS_TUNING.groundFriction} restitution={0.05}>
      <mesh receiveShadow position={[0, -0.08, 0]}>
        <boxGeometry args={[11.4, 0.16, 8.4]} />
        <ToyMaterial color="#dff8d5" />
      </mesh>
      <CuboidCollider args={[5.7, 0.08, 4.2]} position={[0, -0.08, 0]} />
    </RigidBody>
  );
}

function Rails() {
  const railColor = "#8ed9f3";
  const rails = [
    { position: [0, 0.42, -4.15], size: [11.8, 0.55, 0.24] },
    { position: [0, 0.42, 4.15], size: [11.8, 0.55, 0.24] },
    { position: [-5.85, 0.42, 0], size: [0.24, 0.55, 8.4] },
    { position: [5.85, 0.42, 0], size: [0.24, 0.55, 8.4] }
  ];

  return rails.map((rail) => (
    <RigidBody key={rail.position.join(":")} type="fixed" friction={0.8} restitution={0.2}>
      <mesh castShadow receiveShadow position={rail.position}>
        <boxGeometry args={rail.size} />
        <ToyMaterial color={railColor} />
      </mesh>
      <CuboidCollider
        args={[rail.size[0] / 2, rail.size[1] / 2, rail.size[2] / 2]}
        position={rail.position}
      />
    </RigidBody>
  ));
}

function Ramp() {
  return (
    <RigidBody
      type="fixed"
      friction={0.58}
      restitution={0.05}
      position={[2.15, 0.72, -2.2]}
      rotation={[-0.36, 0, 0]}
    >
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.22, 1.75]} />
        <ToyMaterial color="#ffe28c" />
      </mesh>
      <CuboidCollider args={[1.6, 0.11, 0.88]} />
    </RigidBody>
  );
}

function Wheel({ position }) {
  return (
    <mesh castShadow position={position} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.17, 0.17, 0.14, 24]} />
      <ToyMaterial color="#24495a" roughness={0.5} />
    </mesh>
  );
}

function SmallCar({ resetToken, onDragChange }) {
  const object = DYNAMIC_OBJECTS.car;

  return (
    <DraggableRigidBody
      id={object.id}
      initialPosition={object.position}
      initialRotation={object.rotation}
      resetToken={resetToken}
      colliders={false}
      friction={0.52}
      restitution={0.12}
      onDragChange={onDragChange}
    >
      <CuboidCollider args={[0.64, 0.28, 0.36]} mass={object.mass} />
      <mesh castShadow receiveShadow position={[0, 0.02, 0]}>
        <boxGeometry args={[1.25, 0.38, 0.68]} />
        <ToyMaterial color="#ff7d66" />
      </mesh>
      <mesh castShadow receiveShadow position={[0.08, 0.34, 0]}>
        <boxGeometry args={[0.62, 0.32, 0.52]} />
        <ToyMaterial color="#ffd166" />
      </mesh>
      <Wheel position={[-0.38, -0.24, -0.42]} />
      <Wheel position={[0.38, -0.24, -0.42]} />
      <Wheel position={[-0.38, -0.24, 0.42]} />
      <Wheel position={[0.38, -0.24, 0.42]} />
    </DraggableRigidBody>
  );
}

function Truck({ resetToken, onDragChange }) {
  const object = DYNAMIC_OBJECTS.truck;

  return (
    <DraggableRigidBody
      id={object.id}
      initialPosition={object.position}
      initialRotation={object.rotation}
      resetToken={resetToken}
      colliders={false}
      friction={0.62}
      restitution={0.08}
      onDragChange={onDragChange}
    >
      <CuboidCollider args={[0.95, 0.38, 0.48]} mass={object.mass} />
      <mesh castShadow receiveShadow position={[0.18, 0, 0]}>
        <boxGeometry args={[1.85, 0.58, 0.9]} />
        <ToyMaterial color="#4f74c9" />
      </mesh>
      <mesh castShadow receiveShadow position={[-0.56, 0.44, 0]}>
        <boxGeometry args={[0.7, 0.46, 0.82]} />
        <ToyMaterial color="#75d6f0" />
      </mesh>
      <mesh castShadow receiveShadow position={[0.45, 0.42, 0]}>
        <boxGeometry args={[0.9, 0.22, 0.82]} />
        <ToyMaterial color="#9bd972" />
      </mesh>
      <Wheel position={[-0.62, -0.34, -0.56]} />
      <Wheel position={[0.05, -0.34, -0.56]} />
      <Wheel position={[0.72, -0.34, -0.56]} />
      <Wheel position={[-0.62, -0.34, 0.56]} />
      <Wheel position={[0.05, -0.34, 0.56]} />
      <Wheel position={[0.72, -0.34, 0.56]} />
    </DraggableRigidBody>
  );
}

function Ball({ resetToken, onDragChange }) {
  const object = DYNAMIC_OBJECTS.ball;

  return (
    <DraggableRigidBody
      id={object.id}
      initialPosition={object.position}
      initialRotation={object.rotation}
      resetToken={resetToken}
      colliders={false}
      friction={0.38}
      restitution={PHYSICS_TUNING.ballRestitution}
      onDragChange={onDragChange}
    >
      <BallCollider args={[0.34]} mass={object.mass} restitution={PHYSICS_TUNING.ballRestitution} />
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.34, 32, 24]} />
        <ToyMaterial color="#ffdd57" roughness={0.42} />
      </mesh>
    </DraggableRigidBody>
  );
}

function BoxPile({ resetToken }) {
  return DYNAMIC_OBJECTS.boxes.map((box) => (
    <DraggableRigidBody
      key={box.id}
      id={box.id}
      initialPosition={box.position}
      initialRotation={[0, 0, 0]}
      resetToken={resetToken}
      colliders={false}
      friction={PHYSICS_TUNING.boxFriction}
      restitution={0.05}
    >
      <CuboidCollider
        args={[0.34, 0.34, 0.34]}
        mass={1.15}
        friction={PHYSICS_TUNING.boxFriction}
      />
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.68, 0.68, 0.68]} />
        <ToyMaterial color={box.color} />
      </mesh>
    </DraggableRigidBody>
  ));
}

export function PhysicsObjects({ resetToken, onDragChange }) {
  return (
    <>
      <Ground />
      <Rails />
      <Ramp />
      <SmallCar resetToken={resetToken} onDragChange={onDragChange} />
      <Truck resetToken={resetToken} onDragChange={onDragChange} />
      <Ball resetToken={resetToken} onDragChange={onDragChange} />
      <BoxPile resetToken={resetToken} />
    </>
  );
}
