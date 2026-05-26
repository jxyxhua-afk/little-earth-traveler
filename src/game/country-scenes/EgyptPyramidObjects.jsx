import React from "react";
import { BallCollider, CuboidCollider, RigidBody } from "@react-three/rapier";
import { DraggableRigidBody } from "../physics-lab/DraggableRigidBody.jsx";
import { PHYSICS_TUNING } from "../physics-lab/physicsTuningConfig.js";

const EGYPT_TOYS = {
  car: {
    id: "egypt-car",
    position: [-3.3, 0.48, 1.0],
    rotation: [0, 0.04, 0],
    mass: PHYSICS_TUNING.carMass
  },
  truck: {
    id: "egypt-truck",
    position: [-3.42, 0.62, -0.78],
    rotation: [0, Math.PI - 0.08, 0],
    mass: PHYSICS_TUNING.truckMass
  },
  ball: {
    id: "egypt-ball",
    position: [2.65, 1.55, -2.7],
    rotation: [0, 0, 0],
    mass: 1
  }
};

const PYRAMID_BLOCKS = [
  { id: "pyramid-block-1", position: [-1.16, 0.28, 0.18], color: "#f3bf67", sticker: "sun" },
  { id: "pyramid-block-2", position: [-0.58, 0.28, 0.18], color: "#ffd36e", sticker: "stripe" },
  { id: "pyramid-block-3", position: [0, 0.28, 0.18], color: "#f7c97a", sticker: "door" },
  { id: "pyramid-block-4", position: [0.58, 0.28, 0.18], color: "#ffe08a", sticker: "stripe" },
  { id: "pyramid-block-5", position: [1.16, 0.28, 0.18], color: "#f2b96a", sticker: "sun" },
  { id: "pyramid-block-6", position: [-0.58, 0.78, 0.16], color: "#ffe08a", sticker: "stripe" },
  { id: "pyramid-block-7", position: [0, 0.78, 0.16], color: "#f4bf6f", sticker: "door" },
  { id: "pyramid-block-8", position: [0.58, 0.78, 0.16], color: "#ffd36e", sticker: "stripe" },
  { id: "pyramid-block-9", position: [0, 1.28, 0.14], color: "#fff0a7", sticker: "sun" }
];

const RAMP_POSES = {
  open: {
    position: [2.45, 0.72, -2.2],
    rotation: [-0.36, 0, 0]
  },
  folded: {
    position: [2.45, 0.2, -2.2],
    rotation: [0, 0, 0]
  }
};

const RAMP_DRAG_BOUNDS = {
  minX: -3.85,
  maxX: 3.85,
  minZ: -2.75,
  maxZ: 2.55
};

const EGYPT_BALL_TUNING = {
  ...PHYSICS_TUNING,
  linearDamping: 0.24,
  angularDamping: 0.22
};

export const EGYPT_SORTABLE_COUNT = PYRAMID_BLOCKS.length + 4;

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

function ThinBox({ position, size, color, roughness = 0.7, opacity = 1 }) {
  return (
    <mesh castShadow receiveShadow position={position}>
      <boxGeometry args={size} />
      <ToyMaterial color={color} roughness={roughness} opacity={opacity} />
    </mesh>
  );
}

function Ground() {
  const sandTiles = [
    { position: [-3.6, 0.015, -2.35], size: [1.8, 0.025, 0.92], color: "#ffe0a3" },
    { position: [-1.65, 0.016, -2.35], size: [1.8, 0.025, 0.92], color: "#fff0bd" },
    { position: [0.3, 0.017, -2.35], size: [1.8, 0.025, 0.92], color: "#ffd894" },
    { position: [2.25, 0.018, -2.35], size: [1.8, 0.025, 0.92], color: "#ffe7b6" },
    { position: [0, 0.02, 2.85], size: [4.9, 0.026, 0.16], color: "#f4c26f" },
    { position: [0.3, 0.021, 3.2], size: [4.2, 0.026, 0.16], color: "#ffe08a" }
  ];

  return (
    <RigidBody type="fixed" friction={PHYSICS_TUNING.groundFriction} restitution={0.05}>
      <mesh receiveShadow position={[0, -0.08, 0]}>
        <boxGeometry args={[11.4, 0.16, 8.4]} />
        <ToyMaterial color="#f8dfaa" />
      </mesh>
      {sandTiles.map((tile) => (
        <ThinBox
          key={tile.position.join(":")}
          position={tile.position}
          size={tile.size}
          color={tile.color}
          roughness={0.84}
        />
      ))}
      <group position={[-2.1, 0.03, 2.1]} scale={[1.7, 0.18, 0.55]}>
        <mesh receiveShadow>
          <sphereGeometry args={[0.8, 28, 12]} />
          <ToyMaterial color="#f0c77a" roughness={0.9} />
        </mesh>
      </group>
      <group position={[2.9, 0.035, 1.85]} scale={[1.25, 0.16, 0.46]}>
        <mesh receiveShadow>
          <sphereGeometry args={[0.78, 28, 12]} />
          <ToyMaterial color="#ffe0a3" roughness={0.9} />
        </mesh>
      </group>
      <CuboidCollider args={[5.7, 0.08, 4.2]} position={[0, -0.08, 0]} />
    </RigidBody>
  );
}

function Rails() {
  const rails = [
    { position: [0, 0.42, -4.15], size: [11.8, 0.55, 0.24] },
    { position: [0, 0.42, 4.15], size: [11.8, 0.55, 0.24] },
    { position: [-5.85, 0.42, 0], size: [0.24, 0.55, 8.4] },
    { position: [5.85, 0.42, 0], size: [0.24, 0.55, 8.4] }
  ];

  return rails.map((rail) => (
    <RigidBody
      key={rail.position.join(":")}
      type="fixed"
      friction={PHYSICS_TUNING.railFriction}
      restitution={PHYSICS_TUNING.railRestitution}
    >
      <mesh castShadow receiveShadow position={rail.position}>
        <boxGeometry args={rail.size} />
        <ToyMaterial color="#f3d183" />
      </mesh>
      <ThinBox
        position={[rail.position[0], rail.position[1] + rail.size[1] / 2 + 0.025, rail.position[2]]}
        size={[Math.max(0.18, rail.size[0] - 0.05), 0.05, Math.max(0.18, rail.size[2] - 0.05)]}
        color="#fff3c6"
        roughness={0.62}
      />
      <CuboidCollider
        args={[rail.size[0] / 2, rail.size[1] / 2, rail.size[2] / 2]}
        position={rail.position}
        friction={PHYSICS_TUNING.railFriction}
        restitution={PHYSICS_TUNING.railRestitution}
      />
    </RigidBody>
  ));
}

function SunAndDunes() {
  return (
    <group>
      <mesh castShadow receiveShadow position={[-3.9, 1.15, -2.85]}>
        <sphereGeometry args={[0.34, 32, 18]} />
        <ToyMaterial color="#ffd05a" roughness={0.38} />
      </mesh>
      <mesh castShadow receiveShadow position={[-3.9, 1.15, -2.85]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.46, 0.022, 10, 42]} />
        <ToyMaterial color="#fff0a7" roughness={0.42} />
      </mesh>
      <ThinBox position={[-3.9, 0.68, -2.85]} size={[0.06, 0.82, 0.06]} color="#dfa957" />
      <ThinBox position={[3.0, 0.11, 1.35]} size={[1.35, 0.11, 0.16]} color="#f2bd68" />
      <ThinBox position={[3.45, 0.18, 1.72]} size={[1.0, 0.1, 0.15]} color="#ffe09a" />
    </group>
  );
}

function Ramp({ resetToken, sortToken, folded, onImpact, onInteractionStart, onToggleFold, onSortComplete }) {
  const pose = folded ? RAMP_POSES.folded : RAMP_POSES.open;

  return (
    <DraggableRigidBody
      id="egypt-sand-ramp"
      audioType="box"
      initialPosition={pose.position}
      initialRotation={pose.rotation}
      resetToken={resetToken}
      sortToken={sortToken}
      colliders={false}
      friction={0.58}
      restitution={0.05}
      dragLift={0.22}
      dragBounds={RAMP_DRAG_BOUNDS}
      tapMoveThreshold={16}
      tapMaxDuration={360}
      lockRotations
      onTap={onToggleFold}
      onImpact={onImpact}
      onInteractionStart={onInteractionStart}
      onSortComplete={onSortComplete}
    >
      <CuboidCollider args={[1.53, 0.11, 0.88]} mass={4.5} friction={0.58} restitution={0.05} />
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3.05, 0.22, 1.75]} />
        <ToyMaterial color="#f2c56d" />
      </mesh>
      <ThinBox position={[0, 0.125, -0.55]} size={[2.6, 0.03, 0.055]} color="#fff0bd" />
      <ThinBox position={[0, 0.127, -0.08]} size={[2.6, 0.03, 0.055]} color="#fff0bd" />
      <ThinBox position={[0, 0.129, 0.39]} size={[2.6, 0.03, 0.055]} color="#fff0bd" />
      <group position={[0, 0.15, -0.08]}>
        <ThinBox position={[0, 0, 0.05]} size={[0.18, 0.035, 0.78]} color="#d98945" />
        <mesh castShadow receiveShadow position={[0, 0.005, 0.52]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.34, 0.045, 3]} />
          <ToyMaterial color="#d98945" roughness={0.7} />
        </mesh>
      </group>
      <group position={[1.2, 0.2, 0.56]}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.12, 20, 14]} />
          <ToyMaterial color="#fff3a6" roughness={0.38} />
        </mesh>
        <mesh castShadow receiveShadow position={[0.16, 0.01, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.1, 0.18, 18]} />
          <ToyMaterial color="#d98945" roughness={0.5} />
        </mesh>
      </group>
      <ThinBox position={[0, 0.14, -0.83]} size={[3.0, 0.04, 0.12]} color="#ffe7b6" />
      <ThinBox position={[0, 0.14, 0.83]} size={[3.0, 0.04, 0.12]} color="#dfa957" />
    </DraggableRigidBody>
  );
}

function Wheel({ position, radius = 0.18, width = 0.16, hubColor = "#ffe08a" }) {
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

function SmallCar({ resetToken, sortToken, onImpact, onInteractionStart, onSortComplete }) {
  const object = EGYPT_TOYS.car;

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
      sortToken={sortToken}
      dragLift={0.18}
      onImpact={onImpact}
      onInteractionStart={onInteractionStart}
      onSortComplete={onSortComplete}
    >
      <CuboidCollider args={[0.64, 0.28, 0.36]} mass={object.mass} />
      <ThinBox position={[0, 0.02, 0]} size={[1.24, 0.34, 0.68]} color="#f08f5f" />
      <ThinBox position={[0.36, 0.26, 0]} size={[0.48, 0.2, 0.62]} color="#ffb16d" />
      <ThinBox position={[-0.14, 0.39, 0]} size={[0.52, 0.34, 0.54]} color="#ffd166" />
      <ThinBox position={[0.12, 0.44, 0]} size={[0.045, 0.18, 0.44]} color="#9fe7ff" roughness={0.38} />
      <ThinBox position={[-0.14, 0.43, -0.29]} size={[0.34, 0.16, 0.035]} color="#b9f2ff" roughness={0.36} />
      <ThinBox position={[-0.14, 0.43, 0.29]} size={[0.34, 0.16, 0.035]} color="#b9f2ff" roughness={0.36} />
      <ThinBox position={[0.67, 0.05, 0]} size={[0.065, 0.18, 0.58]} color="#d96a42" />
      <ThinBox position={[-0.67, 0.02, 0]} size={[0.055, 0.15, 0.58]} color="#b95045" />
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

function Truck({ resetToken, sortToken, onImpact, onInteractionStart, onSortComplete }) {
  const object = EGYPT_TOYS.truck;

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
      sortToken={sortToken}
      dragLift={0.18}
      onImpact={onImpact}
      onInteractionStart={onInteractionStart}
      onSortComplete={onSortComplete}
    >
      <CuboidCollider args={[0.95, 0.38, 0.48]} mass={object.mass} />
      <ThinBox position={[0.28, 0.02, 0]} size={[1.35, 0.64, 0.92]} color="#4f74c9" />
      <ThinBox position={[-0.78, 0.05, 0]} size={[0.68, 0.58, 0.84]} color="#2f8ccf" />
      <ThinBox position={[-0.92, 0.47, 0]} size={[0.42, 0.36, 0.76]} color="#75d6f0" />
      <ThinBox position={[0.28, 0.49, 0]} size={[1.12, 0.22, 0.82]} color="#f0c76e" />
      <ThinBox position={[0.28, 0.61, -0.02]} size={[0.92, 0.055, 0.86]} color="#ffe7b6" />
      <ThinBox position={[0.28, 0.5, 0.48]} size={[0.96, 0.08, 0.035]} color="#fff3a6" />
      <ThinBox position={[0.28, 0.34, 0.48]} size={[0.96, 0.08, 0.035]} color="#fff3a6" />
      <ThinBox position={[-1.15, 0.1, 0]} size={[0.055, 0.26, 0.62]} color="#21495a" />
      <ThinBox position={[-1.18, 0.28, 0]} size={[0.045, 0.18, 0.5]} color="#b9f2ff" roughness={0.36} />
      <LightDot position={[-1.18, 0.04, -0.28]} color="#fff8b8" radius={0.06} />
      <LightDot position={[-1.18, 0.04, 0.28]} color="#fff8b8" radius={0.06} />
      <LightDot position={[-0.92, 0.71, -0.2]} color="#ffcf5a" radius={0.05} />
      <LightDot position={[-0.92, 0.71, 0.2]} color="#ffcf5a" radius={0.05} />
      <Wheel position={[-0.72, -0.32, -0.56]} radius={0.22} width={0.18} />
      <Wheel position={[0.05, -0.32, -0.56]} radius={0.22} width={0.18} />
      <Wheel position={[0.78, -0.32, -0.56]} radius={0.22} width={0.18} />
      <Wheel position={[-0.72, -0.32, 0.56]} radius={0.22} width={0.18} />
      <Wheel position={[0.05, -0.32, 0.56]} radius={0.22} width={0.18} />
      <Wheel position={[0.78, -0.32, 0.56]} radius={0.22} width={0.18} />
    </DraggableRigidBody>
  );
}

function Ball({ resetToken, sortToken, onImpact, onInteractionStart, onSortComplete }) {
  const object = EGYPT_TOYS.ball;

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
      sortToken={sortToken}
      dragLift={1.08}
      tuning={EGYPT_BALL_TUNING}
      onImpact={onImpact}
      onInteractionStart={onInteractionStart}
      onSortComplete={onSortComplete}
    >
      <BallCollider args={[0.34]} mass={object.mass} restitution={PHYSICS_TUNING.ballRestitution} />
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.34, 32, 24]} />
        <ToyMaterial color="#ffdd57" roughness={0.42} />
      </mesh>
      <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.345, 0.022, 10, 48]} />
        <ToyMaterial color="#f08f5f" roughness={0.38} />
      </mesh>
      <mesh castShadow receiveShadow rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.35, 0.018, 10, 48]} />
        <ToyMaterial color="#4f74c9" roughness={0.38} />
      </mesh>
      <mesh castShadow position={[-0.12, 0.18, 0.2]}>
        <sphereGeometry args={[0.075, 16, 12]} />
        <ToyMaterial color="#fffdf0" roughness={0.2} opacity={0.9} />
      </mesh>
    </DraggableRigidBody>
  );
}

function PyramidSticker({ type }) {
  if (type === "door") {
    return (
      <group position={[0, -0.04, 0.225]}>
        <ThinBox position={[0, -0.04, 0]} size={[0.22, 0.16, 0.026]} color="#d98945" />
        <mesh castShadow position={[0, 0.05, 0]}>
          <sphereGeometry args={[0.12, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <ToyMaterial color="#d98945" />
        </mesh>
      </group>
    );
  }

  if (type === "stripe") {
    return (
      <group position={[0, 0, 0.225]}>
        <ThinBox position={[-0.14, 0.05, 0]} size={[0.055, 0.28, 0.026]} color="#fff0bd" />
        <ThinBox position={[0.04, 0.01, 0]} size={[0.055, 0.28, 0.026]} color="#e29d4e" />
        <ThinBox position={[0.2, -0.03, 0]} size={[0.055, 0.28, 0.026]} color="#fff0bd" />
      </group>
    );
  }

  return (
    <group position={[0, 0.02, 0.225]}>
      <mesh castShadow position={[0, 0.06, 0]}>
        <sphereGeometry args={[0.065, 16, 10]} />
        <ToyMaterial color="#fff8dc" />
      </mesh>
      <mesh castShadow position={[0, 0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.1, 0.012, 8, 24]} />
        <ToyMaterial color="#fff8dc" />
      </mesh>
    </group>
  );
}

function PyramidToyBlock({ color, sticker }) {
  return (
    <group>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.56, 0.48, 0.36]} />
        <ToyMaterial color={color} />
      </mesh>
      <ThinBox position={[0, 0.245, -0.19]} size={[0.58, 0.035, 0.035]} color="#fff3c6" />
      <ThinBox position={[0, 0.245, 0.19]} size={[0.58, 0.035, 0.035]} color="#fff3c6" />
      <ThinBox position={[-0.29, 0, 0.19]} size={[0.035, 0.5, 0.035]} color="#fff3c6" />
      <ThinBox position={[0.29, 0, 0.19]} size={[0.035, 0.5, 0.035]} color="#fff3c6" />
      <PyramidSticker type={sticker} />
    </group>
  );
}

function PyramidBlock({ block, resetToken, sortToken, onImpact, onInteractionStart, onSortComplete }) {
  return (
    <DraggableRigidBody
      id={block.id}
      audioType="box"
      initialPosition={block.position}
      initialRotation={[0, 0, 0]}
      resetToken={resetToken}
      colliders={false}
      friction={PHYSICS_TUNING.boxFriction}
      restitution={0.05}
      sortToken={sortToken}
      onImpact={onImpact}
      onInteractionStart={onInteractionStart}
      onSortComplete={onSortComplete}
    >
      <CuboidCollider
        args={[0.28, 0.24, 0.18]}
        mass={1.08}
        friction={PHYSICS_TUNING.boxFriction}
        restitution={PHYSICS_TUNING.boxRestitution}
      />
      <PyramidToyBlock color={block.color} sticker={block.sticker} />
    </DraggableRigidBody>
  );
}

function PyramidBackdrop() {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.64, 0.72]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[1.58, 1.28, 4]} />
        <ToyMaterial color="#e8b862" roughness={0.88} opacity={0.38} />
      </mesh>
      <ThinBox position={[-1.85, 0.34, 0.62]} size={[0.38, 0.62, 0.35]} color="#e0a957" opacity={0.78} />
      <ThinBox position={[1.85, 0.34, 0.62]} size={[0.38, 0.62, 0.35]} color="#e0a957" opacity={0.78} />
    </group>
  );
}

function PyramidBlocks({ resetToken, sortToken, onImpact, onInteractionStart, onSortComplete }) {
  return (
    <>
      <PyramidBackdrop />
      {PYRAMID_BLOCKS.map((block) => (
        <PyramidBlock
          key={block.id}
          block={block}
          resetToken={resetToken}
          sortToken={sortToken}
          onImpact={onImpact}
          onInteractionStart={onInteractionStart}
          onSortComplete={onSortComplete}
        />
      ))}
    </>
  );
}

export function EgyptPyramidObjects({
  resetToken,
  sortToken,
  rampFolded,
  onImpact,
  onInteractionStart,
  onToggleRampFold,
  onSortComplete
}) {
  return (
    <>
      <Ground />
      <Rails />
      <SunAndDunes />
      <Ramp
        resetToken={resetToken}
        sortToken={sortToken}
        folded={rampFolded}
        onImpact={onImpact}
        onInteractionStart={onInteractionStart}
        onToggleFold={onToggleRampFold}
        onSortComplete={onSortComplete}
      />
      <PyramidBlocks
        resetToken={resetToken}
        sortToken={sortToken}
        onImpact={onImpact}
        onInteractionStart={onInteractionStart}
        onSortComplete={onSortComplete}
      />
      <SmallCar
        resetToken={resetToken}
        sortToken={sortToken}
        onImpact={onImpact}
        onInteractionStart={onInteractionStart}
        onSortComplete={onSortComplete}
      />
      <Truck
        resetToken={resetToken}
        sortToken={sortToken}
        onImpact={onImpact}
        onInteractionStart={onInteractionStart}
        onSortComplete={onSortComplete}
      />
      <Ball
        resetToken={resetToken}
        sortToken={sortToken}
        onImpact={onImpact}
        onInteractionStart={onInteractionStart}
        onSortComplete={onSortComplete}
      />
    </>
  );
}
