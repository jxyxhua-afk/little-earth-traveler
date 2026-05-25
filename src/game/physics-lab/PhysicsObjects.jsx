import React from "react";
import { BallCollider, CuboidCollider, RigidBody } from "@react-three/rapier";
import { DYNAMIC_OBJECTS, PHYSICS_TUNING } from "./physicsTuningConfig.js";
import { DraggableRigidBody } from "./DraggableRigidBody.jsx";

function ToyMaterial({ color, roughness = 0.72, metalness = 0.02, opacity = 1 }) {
  return (
    <meshStandardMaterial
      color={color}
      roughness={roughness}
      metalness={metalness}
      transparent={opacity < 1}
      opacity={opacity}
    />
  );
}

function ThinBox({ position, size, color, roughness = 0.7 }) {
  return (
    <mesh castShadow receiveShadow position={position}>
      <boxGeometry args={size} />
      <ToyMaterial color={color} roughness={roughness} />
    </mesh>
  );
}

function Ground() {
  const matTiles = [
    { position: [-3.6, 0.015, -2.35], size: [1.8, 0.025, 1.15], color: "#c9f0ff" },
    { position: [-1.75, 0.016, -2.35], size: [1.8, 0.025, 1.15], color: "#f0ffd6" },
    { position: [0.1, 0.017, -2.35], size: [1.8, 0.025, 1.15], color: "#fff2bd" },
    { position: [1.95, 0.018, -2.35], size: [1.8, 0.025, 1.15], color: "#d7f6e5" },
    { position: [-4.65, 0.019, 2.75], size: [0.12, 0.03, 1.55], color: "#b8e986" },
    { position: [-4.28, 0.02, 2.75], size: [0.12, 0.03, 1.55], color: "#ffe28c" },
    { position: [-3.91, 0.021, 2.75], size: [0.12, 0.03, 1.55], color: "#9bdcf5" }
  ];

  return (
    <RigidBody type="fixed" friction={PHYSICS_TUNING.groundFriction} restitution={0.05}>
      <mesh receiveShadow position={[0, -0.08, 0]}>
        <boxGeometry args={[11.4, 0.16, 8.4]} />
        <ToyMaterial color="#e4f7dc" />
      </mesh>
      {matTiles.map((tile) => (
        <ThinBox
          key={tile.position.join(":")}
          position={tile.position}
          size={tile.size}
          color={tile.color}
          roughness={0.82}
        />
      ))}
      <CuboidCollider args={[5.7, 0.08, 4.2]} position={[0, -0.08, 0]} />
    </RigidBody>
  );
}

function Rails() {
  const railColor = "#9ddfec";
  const rails = [
    { position: [0, 0.42, -4.15], size: [11.8, 0.55, 0.24] },
    { position: [0, 0.42, 4.15], size: [11.8, 0.55, 0.24] },
    { position: [-5.85, 0.42, 0], size: [0.24, 0.55, 8.4] },
    { position: [5.85, 0.42, 0], size: [0.24, 0.55, 8.4] }
  ];

  return rails.map((rail) => (
    <RigidBody key={rail.position.join(":")} type="fixed" friction={0.35} restitution={0.62}>
      <mesh castShadow receiveShadow position={rail.position}>
        <boxGeometry args={rail.size} />
        <ToyMaterial color={railColor} />
      </mesh>
      <ThinBox
        position={[rail.position[0], rail.position[1] + rail.size[1] / 2 + 0.025, rail.position[2]]}
        size={[Math.max(0.18, rail.size[0] - 0.05), 0.05, Math.max(0.18, rail.size[2] - 0.05)]}
        color="#dff9ff"
        roughness={0.62}
      />
      <CuboidCollider
        args={[rail.size[0] / 2, rail.size[1] / 2, rail.size[2] / 2]}
        position={rail.position}
        friction={0.35}
        restitution={0.62}
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
        <ToyMaterial color="#ffe083" />
      </mesh>
      <ThinBox position={[0, 0.125, -0.55]} size={[2.75, 0.03, 0.055]} color="#fff7c9" />
      <ThinBox position={[0, 0.127, -0.08]} size={[2.75, 0.03, 0.055]} color="#fff7c9" />
      <ThinBox position={[0, 0.129, 0.39]} size={[2.75, 0.03, 0.055]} color="#fff7c9" />
      <group position={[0, 0.15, -0.08]}>
        <ThinBox position={[0, 0, 0.05]} size={[0.18, 0.035, 0.78]} color="#f49b63" />
        <mesh castShadow receiveShadow position={[0, 0.005, 0.52]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.34, 0.045, 3]} />
          <ToyMaterial color="#f49b63" roughness={0.7} />
        </mesh>
      </group>
      <ThinBox position={[0, 0.14, -0.83]} size={[3.1, 0.04, 0.12]} color="#ffeeb2" />
      <ThinBox position={[0, 0.14, 0.83]} size={[3.1, 0.04, 0.12]} color="#f4c66d" />
      <CuboidCollider args={[1.6, 0.11, 0.88]} />
    </RigidBody>
  );
}

function Wheel({ position, radius = 0.18, width = 0.16, hubColor = "#aee7ff" }) {
  const side = position[2] >= 0 ? 1 : -1;

  return (
    <group>
      <mesh castShadow position={position} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[radius, radius, width, 28]} />
        <ToyMaterial color="#21495a" roughness={0.48} />
      </mesh>
      <mesh
        castShadow
        position={[position[0], position[1], position[2] + side * (width * 0.52)]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry args={[radius * 0.48, radius * 0.48, 0.028, 20]} />
        <ToyMaterial color={hubColor} roughness={0.38} />
      </mesh>
    </group>
  );
}

function LightDot({ position, color, radius = 0.055 }) {
  return (
    <mesh castShadow position={position}>
      <sphereGeometry args={[radius, 16, 12]} />
      <ToyMaterial color={color} roughness={0.35} />
    </mesh>
  );
}

function BlockEdge({ position, size }) {
  return <ThinBox position={position} size={size} color="#fff8dc" roughness={0.76} />;
}

function BlockSticker({ type }) {
  if (type === "arrow") {
    return (
      <group position={[0, 0.02, 0.355]}>
        <ThinBox position={[0, 0, 0]} size={[0.08, 0.22, 0.028]} color="#5db7ff" />
        <mesh castShadow position={[0, 0.18, 0]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.13, 0.04, 3]} />
          <ToyMaterial color="#5db7ff" />
        </mesh>
      </group>
    );
  }

  if (type === "stripe") {
    return (
      <group position={[0, 0, 0.355]}>
        <ThinBox position={[-0.16, 0.08, 0]} size={[0.055, 0.34, 0.028]} color="#ff8f8f" />
        <ThinBox position={[0, 0.08, 0]} size={[0.055, 0.34, 0.028]} color="#fff3a6" />
        <ThinBox position={[0.16, 0.08, 0]} size={[0.055, 0.34, 0.028]} color="#9bd972" />
      </group>
    );
  }

  return (
    <group position={[0, 0.02, 0.355]}>
      <LightDot position={[-0.14, 0.1, 0]} color="#ffffff" radius={0.048} />
      <LightDot position={[0.14, 0.1, 0]} color="#ffffff" radius={0.048} />
      <LightDot position={[0, -0.08, 0]} color="#ffffff" radius={0.048} />
    </group>
  );
}

function ToyBlock({ color, sticker }) {
  const edge = 0.36;

  return (
    <group>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.68, 0.68, 0.68]} />
        <ToyMaterial color={color} />
      </mesh>
      <BlockEdge position={[-edge, 0, -edge]} size={[0.035, 0.72, 0.035]} />
      <BlockEdge position={[edge, 0, -edge]} size={[0.035, 0.72, 0.035]} />
      <BlockEdge position={[-edge, 0, edge]} size={[0.035, 0.72, 0.035]} />
      <BlockEdge position={[edge, 0, edge]} size={[0.035, 0.72, 0.035]} />
      <BlockEdge position={[0, 0.36, -edge]} size={[0.7, 0.035, 0.035]} />
      <BlockEdge position={[0, 0.36, edge]} size={[0.7, 0.035, 0.035]} />
      <BlockEdge position={[-edge, 0.36, 0]} size={[0.035, 0.035, 0.7]} />
      <BlockEdge position={[edge, 0.36, 0]} size={[0.035, 0.035, 0.7]} />
      <mesh castShadow position={[-0.16, 0.405, -0.12]}>
        <cylinderGeometry args={[0.105, 0.105, 0.08, 18]} />
        <ToyMaterial color="#fff8dc" roughness={0.68} />
      </mesh>
      <mesh castShadow position={[0.16, 0.405, 0.12]}>
        <cylinderGeometry args={[0.105, 0.105, 0.08, 18]} />
        <ToyMaterial color="#fff8dc" roughness={0.68} />
      </mesh>
      <BlockSticker type={sticker} />
    </group>
  );
}

function SmallCar({ resetToken, onDragChange, onImpact, onInteractionStart }) {
  const object = DYNAMIC_OBJECTS.car;

  return (
    <DraggableRigidBody
      id={object.id}
      audioType="car"
      initialPosition={object.position}
      initialRotation={object.rotation}
      resetToken={resetToken}
      colliders={false}
      friction={0.52}
      restitution={0.12}
      onDragChange={onDragChange}
      onImpact={onImpact}
      onInteractionStart={onInteractionStart}
      dragLift={0.18}
    >
      <CuboidCollider args={[0.64, 0.28, 0.36]} mass={object.mass} />
      <ThinBox position={[0, 0.02, 0]} size={[1.24, 0.34, 0.68]} color="#ff7d66" />
      <ThinBox position={[0.36, 0.26, 0]} size={[0.48, 0.2, 0.62]} color="#ff9d7f" />
      <ThinBox position={[-0.14, 0.39, 0]} size={[0.52, 0.34, 0.54]} color="#ffd166" />
      <ThinBox position={[0.12, 0.44, 0]} size={[0.045, 0.18, 0.44]} color="#9fe7ff" roughness={0.38} />
      <ThinBox position={[-0.14, 0.43, -0.29]} size={[0.34, 0.16, 0.035]} color="#b9f2ff" roughness={0.36} />
      <ThinBox position={[-0.14, 0.43, 0.29]} size={[0.34, 0.16, 0.035]} color="#b9f2ff" roughness={0.36} />
      <ThinBox position={[0.67, 0.05, 0]} size={[0.065, 0.18, 0.58]} color="#ff6b57" />
      <ThinBox position={[-0.67, 0.02, 0]} size={[0.055, 0.15, 0.58]} color="#c75a63" />
      <LightDot position={[0.71, 0.12, -0.22]} color="#fff8b8" />
      <LightDot position={[0.71, 0.12, 0.22]} color="#fff8b8" />
      <LightDot position={[-0.7, 0.12, -0.22]} color="#ff5c5c" radius={0.045} />
      <LightDot position={[-0.7, 0.12, 0.22]} color="#ff5c5c" radius={0.045} />
      <Wheel position={[-0.38, -0.22, -0.42]} />
      <Wheel position={[0.38, -0.22, -0.42]} />
      <Wheel position={[-0.38, -0.22, 0.42]} />
      <Wheel position={[0.38, -0.22, 0.42]} />
    </DraggableRigidBody>
  );
}

function Truck({ resetToken, onDragChange, onImpact, onInteractionStart }) {
  const object = DYNAMIC_OBJECTS.truck;

  return (
    <DraggableRigidBody
      id={object.id}
      audioType="truck"
      initialPosition={object.position}
      initialRotation={object.rotation}
      resetToken={resetToken}
      colliders={false}
      friction={0.62}
      restitution={0.08}
      onDragChange={onDragChange}
      onImpact={onImpact}
      onInteractionStart={onInteractionStart}
      dragLift={0.18}
    >
      <CuboidCollider args={[0.95, 0.38, 0.48]} mass={object.mass} />
      <ThinBox position={[0.28, 0.02, 0]} size={[1.35, 0.64, 0.92]} color="#4f74c9" />
      <ThinBox position={[-0.78, 0.05, 0]} size={[0.68, 0.58, 0.84]} color="#2f8ccf" />
      <ThinBox position={[-0.92, 0.47, 0]} size={[0.42, 0.36, 0.76]} color="#75d6f0" />
      <ThinBox position={[0.28, 0.49, 0]} size={[1.12, 0.22, 0.82]} color="#9bd972" />
      <ThinBox position={[0.28, 0.61, -0.02]} size={[0.92, 0.055, 0.86]} color="#d5f0a4" />
      <ThinBox position={[0.28, 0.5, 0.48]} size={[0.96, 0.08, 0.035]} color="#fff3a6" />
      <ThinBox position={[0.28, 0.34, 0.48]} size={[0.96, 0.08, 0.035]} color="#fff3a6" />
      <ThinBox position={[-1.15, 0.1, 0]} size={[0.055, 0.26, 0.62]} color="#21495a" />
      <ThinBox position={[-1.18, 0.28, 0]} size={[0.045, 0.18, 0.5]} color="#b9f2ff" roughness={0.36} />
      <LightDot position={[-1.18, 0.04, -0.28]} color="#fff8b8" radius={0.06} />
      <LightDot position={[-1.18, 0.04, 0.28]} color="#fff8b8" radius={0.06} />
      <LightDot position={[-0.92, 0.71, -0.2]} color="#ffcf5a" radius={0.05} />
      <LightDot position={[-0.92, 0.71, 0.2]} color="#ffcf5a" radius={0.05} />
      <Wheel position={[-0.72, -0.32, -0.56]} radius={0.22} width={0.18} hubColor="#ffd166" />
      <Wheel position={[0.05, -0.32, -0.56]} radius={0.22} width={0.18} hubColor="#ffd166" />
      <Wheel position={[0.78, -0.32, -0.56]} radius={0.22} width={0.18} hubColor="#ffd166" />
      <Wheel position={[-0.72, -0.32, 0.56]} radius={0.22} width={0.18} hubColor="#ffd166" />
      <Wheel position={[0.05, -0.32, 0.56]} radius={0.22} width={0.18} hubColor="#ffd166" />
      <Wheel position={[0.78, -0.32, 0.56]} radius={0.22} width={0.18} hubColor="#ffd166" />
    </DraggableRigidBody>
  );
}

function Ball({ resetToken, onDragChange, onImpact, onInteractionStart }) {
  const object = DYNAMIC_OBJECTS.ball;

  return (
    <DraggableRigidBody
      id={object.id}
      audioType="ball"
      initialPosition={object.position}
      initialRotation={object.rotation}
      resetToken={resetToken}
      colliders={false}
      friction={0.38}
      restitution={PHYSICS_TUNING.ballRestitution}
      onDragChange={onDragChange}
      onImpact={onImpact}
      onInteractionStart={onInteractionStart}
    >
      <BallCollider args={[0.34]} mass={object.mass} restitution={PHYSICS_TUNING.ballRestitution} />
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.34, 32, 24]} />
        <ToyMaterial color="#ffdd57" roughness={0.42} />
      </mesh>
      <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.345, 0.022, 10, 48]} />
        <ToyMaterial color="#ff7d66" roughness={0.38} />
      </mesh>
      <mesh castShadow receiveShadow rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.35, 0.018, 10, 48]} />
        <ToyMaterial color="#5db7ff" roughness={0.38} />
      </mesh>
      <mesh castShadow position={[-0.12, 0.18, 0.2]}>
        <sphereGeometry args={[0.075, 16, 12]} />
        <ToyMaterial color="#fffdf0" roughness={0.2} opacity={0.9} />
      </mesh>
    </DraggableRigidBody>
  );
}

function BoxPile({ resetToken, onImpact, onInteractionStart }) {
  const stickers = ["dots", "arrow", "stripe", "dots", "arrow"];

  return DYNAMIC_OBJECTS.boxes.map((box, index) => (
    <DraggableRigidBody
      key={box.id}
      id={box.id}
      audioType="box"
      initialPosition={box.position}
      initialRotation={[0, 0, 0]}
      resetToken={resetToken}
      colliders={false}
      friction={PHYSICS_TUNING.boxFriction}
      restitution={0.05}
      onImpact={onImpact}
      onInteractionStart={onInteractionStart}
    >
      <CuboidCollider
        args={[0.34, 0.34, 0.34]}
        mass={1.15}
        friction={PHYSICS_TUNING.boxFriction}
      />
      <ToyBlock color={box.color} sticker={stickers[index % stickers.length]} />
    </DraggableRigidBody>
  ));
}

export function PhysicsObjects({ resetToken, onDragChange, onImpact, onInteractionStart }) {
  return (
    <>
      <Ground />
      <Rails />
      <Ramp />
      <SmallCar
        resetToken={resetToken}
        onDragChange={onDragChange}
        onImpact={onImpact}
        onInteractionStart={onInteractionStart}
      />
      <Truck
        resetToken={resetToken}
        onDragChange={onDragChange}
        onImpact={onImpact}
        onInteractionStart={onInteractionStart}
      />
      <Ball
        resetToken={resetToken}
        onDragChange={onDragChange}
        onImpact={onImpact}
        onInteractionStart={onInteractionStart}
      />
      <BoxPile
        resetToken={resetToken}
        onImpact={onImpact}
        onInteractionStart={onInteractionStart}
      />
    </>
  );
}
