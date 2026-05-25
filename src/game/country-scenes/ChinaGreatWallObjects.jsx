import React from "react";
import { BallCollider, CuboidCollider, RigidBody } from "@react-three/rapier";
import { DraggableRigidBody } from "../physics-lab/DraggableRigidBody.jsx";
import { PHYSICS_TUNING } from "../physics-lab/physicsTuningConfig.js";

const CHINA_TOYS = {
  car: {
    id: "china-car",
    position: [-3.35, 0.48, 1.05],
    rotation: [0, 0.05, 0],
    mass: PHYSICS_TUNING.carMass
  },
  truck: {
    id: "china-truck",
    position: [-3.45, 0.62, -0.72],
    rotation: [0, Math.PI - 0.06, 0],
    mass: PHYSICS_TUNING.truckMass
  },
  ball: {
    id: "china-ball",
    position: [2.65, 1.55, -2.7],
    rotation: [0, 0, 0],
    mass: 1
  }
};

const WALL_BLOCKS = [
  { id: "great-wall-block-1", position: [-1.55, 0.27, 0.15], color: "#f5c56c", sticker: "dots" },
  { id: "great-wall-block-2", position: [-0.93, 0.27, 0.15], color: "#ffd76d", sticker: "stripe" },
  { id: "great-wall-block-3", position: [-0.31, 0.27, 0.15], color: "#f4b765", sticker: "arch" },
  { id: "great-wall-block-4", position: [0.31, 0.27, 0.15], color: "#ffe08a", sticker: "dots" },
  { id: "great-wall-block-5", position: [0.93, 0.27, 0.15], color: "#f3bd72", sticker: "stripe" },
  { id: "great-wall-block-6", position: [1.55, 0.27, 0.15], color: "#ffd166", sticker: "arch" }
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

export const CHINA_SORTABLE_COUNT = WALL_BLOCKS.length + 3;

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
    { position: [-3.75, 0.015, -2.45], size: [1.6, 0.025, 1.0], color: "#c9f0ff" },
    { position: [-2.05, 0.016, -2.45], size: [1.6, 0.025, 1.0], color: "#f0ffd6" },
    { position: [-0.35, 0.017, -2.45], size: [1.6, 0.025, 1.0], color: "#fff2bd" },
    { position: [1.35, 0.018, -2.45], size: [1.6, 0.025, 1.0], color: "#d7f6e5" },
    { position: [3.05, 0.019, -2.45], size: [1.6, 0.025, 1.0], color: "#ffe7d7" },
    { position: [0, 0.02, 2.9], size: [4.8, 0.026, 0.18], color: "#f0c06b" },
    { position: [0, 0.021, 3.25], size: [4.8, 0.026, 0.18], color: "#ffe08a" }
  ];

  return (
    <RigidBody type="fixed" friction={PHYSICS_TUNING.groundFriction} restitution={0.05}>
      <mesh receiveShadow position={[0, -0.08, 0]}>
        <boxGeometry args={[11.4, 0.16, 8.4]} />
        <ToyMaterial color="#e9f8d9" />
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
  const railColor = "#8bdce8";
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

function Ramp({ resetToken, folded, onImpact, onInteractionStart }) {
  const pose = folded ? RAMP_POSES.folded : RAMP_POSES.open;

  return (
    <DraggableRigidBody
      id="china-ramp-board"
      audioType="box"
      initialPosition={pose.position}
      initialRotation={pose.rotation}
      resetToken={resetToken}
      colliders={false}
      friction={0.58}
      restitution={0.05}
      dragLift={0.22}
      lockRotations
      onImpact={onImpact}
      onInteractionStart={onInteractionStart}
    >
      <CuboidCollider args={[1.53, 0.11, 0.88]} mass={4.5} friction={0.58} restitution={0.05} />
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3.05, 0.22, 1.75]} />
        <ToyMaterial color="#ffe083" />
      </mesh>
      <ThinBox position={[0, 0.125, -0.55]} size={[2.6, 0.03, 0.055]} color="#fff7c9" />
      <ThinBox position={[0, 0.127, -0.08]} size={[2.6, 0.03, 0.055]} color="#fff7c9" />
      <ThinBox position={[0, 0.129, 0.39]} size={[2.6, 0.03, 0.055]} color="#fff7c9" />
      <group position={[0, 0.15, -0.08]}>
        <ThinBox position={[0, 0, 0.05]} size={[0.18, 0.035, 0.78]} color="#f49b63" />
        <mesh castShadow receiveShadow position={[0, 0.005, 0.52]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.34, 0.045, 3]} />
          <ToyMaterial color="#f49b63" roughness={0.7} />
        </mesh>
      </group>
      <ThinBox position={[0, 0.14, -0.83]} size={[3.0, 0.04, 0.12]} color="#ffeeb2" />
      <ThinBox position={[0, 0.14, 0.83]} size={[3.0, 0.04, 0.12]} color="#f4c66d" />
    </DraggableRigidBody>
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

function SmallCar({ resetToken, sortToken, onImpact, onInteractionStart, onSortComplete }) {
  const object = CHINA_TOYS.car;

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

function Truck({ resetToken, sortToken, onImpact, onInteractionStart, onSortComplete }) {
  const object = CHINA_TOYS.truck;

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

function Ball({ resetToken, sortToken, onImpact, onInteractionStart, onSortComplete }) {
  const object = CHINA_TOYS.ball;

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

function WallSticker({ type }) {
  if (type === "stripe") {
    return (
      <group position={[0, 0, 0.205]}>
        <ThinBox position={[-0.15, 0.02, 0]} size={[0.05, 0.28, 0.028]} color="#f49b63" />
        <ThinBox position={[0, 0.02, 0]} size={[0.05, 0.28, 0.028]} color="#fff3a6" />
        <ThinBox position={[0.15, 0.02, 0]} size={[0.05, 0.28, 0.028]} color="#f49b63" />
      </group>
    );
  }

  if (type === "arch") {
    return (
      <group position={[0, -0.03, 0.205]}>
        <ThinBox position={[0, -0.04, 0]} size={[0.25, 0.14, 0.028]} color="#d98945" />
        <mesh castShadow position={[0, 0.05, 0]}>
          <sphereGeometry args={[0.13, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <ToyMaterial color="#d98945" />
        </mesh>
      </group>
    );
  }

  return (
    <group position={[0, 0.01, 0.205]}>
      <mesh castShadow position={[-0.14, 0.09, 0]}>
        <cylinderGeometry args={[0.055, 0.055, 0.028, 16]} />
        <ToyMaterial color="#fff8dc" />
      </mesh>
      <mesh castShadow position={[0.14, 0.09, 0]}>
        <cylinderGeometry args={[0.055, 0.055, 0.028, 16]} />
        <ToyMaterial color="#fff8dc" />
      </mesh>
      <mesh castShadow position={[0, -0.11, 0]}>
        <cylinderGeometry args={[0.055, 0.055, 0.028, 16]} />
        <ToyMaterial color="#fff8dc" />
      </mesh>
    </group>
  );
}

function Crenel({ x }) {
  return <ThinBox position={[x, 0.33, 0]} size={[0.16, 0.18, 0.3]} color="#fff1b5" />;
}

function GreatWallToyBlock({ color, sticker }) {
  return (
    <group>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.56, 0.48, 0.34]} />
        <ToyMaterial color={color} />
      </mesh>
      <ThinBox position={[0, 0.245, -0.18]} size={[0.58, 0.035, 0.035]} color="#fff8dc" />
      <ThinBox position={[0, 0.245, 0.18]} size={[0.58, 0.035, 0.035]} color="#fff8dc" />
      <ThinBox position={[-0.29, 0, 0.18]} size={[0.035, 0.5, 0.035]} color="#fff8dc" />
      <ThinBox position={[0.29, 0, 0.18]} size={[0.035, 0.5, 0.035]} color="#fff8dc" />
      <Crenel x={-0.18} />
      <Crenel x={0.18} />
      <WallSticker type={sticker} />
    </group>
  );
}

function WallBlock({ block, resetToken, sortToken, onImpact, onInteractionStart, onSortComplete }) {
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
        args={[0.28, 0.24, 0.17]}
        mass={1.05}
        friction={PHYSICS_TUNING.boxFriction}
      />
      <GreatWallToyBlock color={block.color} sticker={block.sticker} />
    </DraggableRigidBody>
  );
}

function WatchTower({ x }) {
  return (
    <RigidBody type="fixed" friction={0.82} restitution={0.05}>
      <group position={[x, 0.05, 0.12]}>
        <ThinBox position={[0, 0.32, 0]} size={[0.62, 0.62, 0.5]} color="#f0b768" />
        <ThinBox position={[0, 0.78, 0]} size={[0.82, 0.28, 0.58]} color="#ffd76d" />
        <ThinBox position={[-0.23, 1.01, -0.02]} size={[0.16, 0.22, 0.5]} color="#fff1b5" />
        <ThinBox position={[0.23, 1.01, -0.02]} size={[0.16, 0.22, 0.5]} color="#fff1b5" />
        <ThinBox position={[0, 1.05, -0.02]} size={[0.16, 0.18, 0.5]} color="#fff1b5" />
        <ThinBox position={[0, 0.34, 0.27]} size={[0.24, 0.28, 0.035]} color="#d98945" />
      </group>
      <CuboidCollider args={[0.41, 0.55, 0.29]} position={[x, 0.55, 0.12]} />
    </RigidBody>
  );
}

function GreatWallBlocks({ resetToken, sortToken, onImpact, onInteractionStart, onSortComplete }) {
  return (
    <>
      <WatchTower x={-2.35} />
      <WatchTower x={2.35} />
      {WALL_BLOCKS.map((block) => (
        <WallBlock
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

export function ChinaGreatWallObjects({
  resetToken,
  sortToken,
  rampFolded,
  onImpact,
  onInteractionStart,
  onSortComplete
}) {
  return (
    <>
      <Ground />
      <Rails />
      <Ramp
        resetToken={resetToken}
        folded={rampFolded}
        onImpact={onImpact}
        onInteractionStart={onInteractionStart}
      />
      <GreatWallBlocks
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
