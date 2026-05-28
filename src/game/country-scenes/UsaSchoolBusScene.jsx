import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { getCountryGameplay } from "../config/countryGameplayMatrix.js";
import "./usaSchoolBusScene.css";

const WORLD_LIMITS = {
  minX: -5.8,
  maxX: 5.8,
  minZ: -3.1,
  maxZ: 3.1
};

const BUS_START = {
  x: -4.55,
  z: -1.65,
  heading: 0.18
};

const BUS = {
  radius: 0.55,
  acceleration: 4.1,
  reverseAcceleration: 2.25,
  maxSpeed: 3.25,
  friction: 0.58,
  turnSpeed: 1.85,
  rebound: 0.38,
  mass: 5.2
};

const OBSTACLE_STARTS = [
  {
    id: "cone-a",
    kind: "cone",
    name: "锥桶",
    x: -2.45,
    z: -0.5,
    radius: 0.33,
    mass: 1.15,
    friction: 0.32,
    angularFriction: 0.3
  },
  {
    id: "crate-a",
    kind: "crate",
    name: "纸箱",
    x: -1.15,
    z: 1.05,
    radius: 0.46,
    mass: 2.15,
    friction: 0.3,
    angularFriction: 0.28
  },
  {
    id: "barrier-a",
    kind: "barrier",
    name: "轻路障",
    x: 0.45,
    z: -0.95,
    radius: 0.54,
    mass: 3.25,
    friction: 0.26,
    angularFriction: 0.25
  }
];

const BALL_START = {
  x: 3.2,
  y: 0.24,
  z: 1.24
};

const HOOP_CENTER = {
  x: 3.85,
  y: 1.02,
  z: 0.32
};

const BALL = {
  radius: 0.2,
  gravity: -5.7,
  bounce: 0.54,
  airFriction: 0.996,
  groundFriction: 0.78
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function createBusState() {
  return {
    position: { x: BUS_START.x, z: BUS_START.z },
    velocity: { x: 0, z: 0 },
    heading: BUS_START.heading,
    bump: 0
  };
}

function createObstacles() {
  return OBSTACLE_STARTS.map((item) => ({
    ...item,
    position: { x: item.x, z: item.z },
    velocity: { x: 0, z: 0 },
    rotation: 0,
    angularVelocity: 0,
    lastMovedAt: -999
  }));
}

function createBallState() {
  return {
    position: { ...BALL_START },
    velocity: { x: 0, y: 0, z: 0 },
    state: "idle",
    spin: 0,
    scored: false
  };
}

function resetBall(ball, ballMesh, aimLine) {
  const nextBall = createBallState();
  ball.position.x = nextBall.position.x;
  ball.position.y = nextBall.position.y;
  ball.position.z = nextBall.position.z;
  ball.velocity.x = 0;
  ball.velocity.y = 0;
  ball.velocity.z = 0;
  ball.state = "idle";
  ball.spin = 0;
  ball.scored = false;

  if (ballMesh.current) {
    ballMesh.current.position.set(ball.position.x, ball.position.y, ball.position.z);
    ballMesh.current.rotation.set(0, 0, 0);
  }

  if (aimLine.current) {
    aimLine.current.visible = false;
  }
}

function resetWorld(bus, obstacles, ball, busMesh, obstacleMeshes, ballMesh, aimLine) {
  const nextBus = createBusState();
  bus.position.x = nextBus.position.x;
  bus.position.z = nextBus.position.z;
  bus.velocity.x = 0;
  bus.velocity.z = 0;
  bus.heading = nextBus.heading;
  bus.bump = 0;

  const freshObstacles = createObstacles();
  obstacles.splice(0, obstacles.length, ...freshObstacles);

  if (busMesh.current) {
    busMesh.current.position.set(bus.position.x, 0.34, bus.position.z);
    busMesh.current.rotation.y = -bus.heading;
  }

  for (const obstacle of obstacles) {
    const mesh = obstacleMeshes.current[obstacle.id];
    if (!mesh) continue;
    mesh.position.set(obstacle.position.x, 0, obstacle.position.z);
    mesh.rotation.y = obstacle.rotation;
      mesh.rotation.z = 0;
  }

  resetBall(ball, ballMesh, aimLine);
}

function updateBus(bus, controls, dt) {
  const keyboardSteer = (controls.right ? 1 : 0) - (controls.left ? 1 : 0);
  const keyboardThrottle = (controls.forward ? 1 : 0) - (controls.back ? 1 : 0);
  const steer = clamp(keyboardSteer + (controls.steer ?? 0), -1, 1);
  const throttle = clamp(keyboardThrottle + (controls.throttle ?? 0), -1, 1);
  const speed = Math.hypot(bus.velocity.x, bus.velocity.z);
  const turnAuthority = 0.38 + Math.min(speed, BUS.maxSpeed) / BUS.maxSpeed;

  if (steer !== 0) {
    bus.heading -= steer * BUS.turnSpeed * turnAuthority * dt;
  }

  if (throttle !== 0) {
    const acceleration = throttle > 0 ? BUS.acceleration : BUS.reverseAcceleration;
    const direction = throttle > 0 ? 1 : -0.72;
    bus.velocity.x += Math.cos(bus.heading) * acceleration * direction * dt;
    bus.velocity.z += Math.sin(bus.heading) * acceleration * direction * dt;
  }

  const nextSpeed = Math.hypot(bus.velocity.x, bus.velocity.z);
  if (nextSpeed > BUS.maxSpeed) {
    const ratio = BUS.maxSpeed / nextSpeed;
    bus.velocity.x *= ratio;
    bus.velocity.z *= ratio;
  }

  bus.velocity.x *= Math.pow(BUS.friction, dt);
  bus.velocity.z *= Math.pow(BUS.friction, dt);

  bus.position.x += bus.velocity.x * dt;
  bus.position.z += bus.velocity.z * dt;

  if (bus.position.x < WORLD_LIMITS.minX + BUS.radius) {
    bus.position.x = WORLD_LIMITS.minX + BUS.radius;
    bus.velocity.x = Math.abs(bus.velocity.x) * BUS.rebound;
    bus.bump = 1;
  }

  if (bus.position.x > WORLD_LIMITS.maxX - BUS.radius) {
    bus.position.x = WORLD_LIMITS.maxX - BUS.radius;
    bus.velocity.x = -Math.abs(bus.velocity.x) * BUS.rebound;
    bus.bump = 1;
  }

  if (bus.position.z < WORLD_LIMITS.minZ + BUS.radius) {
    bus.position.z = WORLD_LIMITS.minZ + BUS.radius;
    bus.velocity.z = Math.abs(bus.velocity.z) * BUS.rebound;
    bus.bump = 1;
  }

  if (bus.position.z > WORLD_LIMITS.maxZ - BUS.radius) {
    bus.position.z = WORLD_LIMITS.maxZ - BUS.radius;
    bus.velocity.z = -Math.abs(bus.velocity.z) * BUS.rebound;
    bus.bump = 1;
  }

  bus.bump *= Math.pow(0.02, dt);
}

function updateObstacles(obstacles, dt) {
  for (const obstacle of obstacles) {
    obstacle.position.x += obstacle.velocity.x * dt;
    obstacle.position.z += obstacle.velocity.z * dt;
    obstacle.rotation += obstacle.angularVelocity * dt;

    obstacle.velocity.x *= Math.pow(obstacle.friction, dt);
    obstacle.velocity.z *= Math.pow(obstacle.friction, dt);
    obstacle.angularVelocity *= Math.pow(obstacle.angularFriction, dt);

    if (Math.abs(obstacle.velocity.x) < 0.004) obstacle.velocity.x = 0;
    if (Math.abs(obstacle.velocity.z) < 0.004) obstacle.velocity.z = 0;
    if (Math.abs(obstacle.angularVelocity) < 0.004) obstacle.angularVelocity = 0;

    if (obstacle.position.x < WORLD_LIMITS.minX + obstacle.radius) {
      obstacle.position.x = WORLD_LIMITS.minX + obstacle.radius;
      obstacle.velocity.x = Math.abs(obstacle.velocity.x) * 0.42;
    }

    if (obstacle.position.x > WORLD_LIMITS.maxX - obstacle.radius) {
      obstacle.position.x = WORLD_LIMITS.maxX - obstacle.radius;
      obstacle.velocity.x = -Math.abs(obstacle.velocity.x) * 0.42;
    }

    if (obstacle.position.z < WORLD_LIMITS.minZ + obstacle.radius) {
      obstacle.position.z = WORLD_LIMITS.minZ + obstacle.radius;
      obstacle.velocity.z = Math.abs(obstacle.velocity.z) * 0.42;
    }

    if (obstacle.position.z > WORLD_LIMITS.maxZ - obstacle.radius) {
      obstacle.position.z = WORLD_LIMITS.maxZ - obstacle.radius;
      obstacle.velocity.z = -Math.abs(obstacle.velocity.z) * 0.42;
    }
  }
}

function resolveBusObstacleCollisions(bus, obstacles, onPush) {
  for (const obstacle of obstacles) {
    const dx = obstacle.position.x - bus.position.x;
    const dz = obstacle.position.z - bus.position.z;
    const distance = Math.hypot(dx, dz) || 0.001;
    const minDistance = BUS.radius + obstacle.radius;

    if (distance >= minDistance) continue;

    const nx = dx / distance;
    const nz = dz / distance;
    const overlap = minDistance - distance;
    const busSpeedIntoObstacle = bus.velocity.x * nx + bus.velocity.z * nz;
    const obstacleSpeedAway = obstacle.velocity.x * nx + obstacle.velocity.z * nz;
    const relativeSpeed = busSpeedIntoObstacle - obstacleSpeedAway;
    const restitution = obstacle.kind === "cone" ? 0.22 : obstacle.kind === "crate" ? 0.16 : 0.1;
    const impulseMagnitude = relativeSpeed > 0.04
      ? ((1 + restitution) * relativeSpeed) / (1 / BUS.mass + 1 / obstacle.mass)
      : 0;
    const obstacleImpulse = impulseMagnitude / obstacle.mass;
    const busImpulse = impulseMagnitude / BUS.mass;

    obstacle.position.x += nx * overlap * 0.56;
    obstacle.position.z += nz * overlap * 0.56;
    obstacle.velocity.x += nx * obstacleImpulse * 0.82;
    obstacle.velocity.z += nz * obstacleImpulse * 0.82;
    obstacle.angularVelocity += (nx * bus.velocity.z - nz * bus.velocity.x) * 1.75 / obstacle.mass;
    obstacle.lastMovedAt = performance.now();

    bus.position.x -= nx * overlap * 0.44;
    bus.position.z -= nz * overlap * 0.44;
    bus.velocity.x -= nx * busImpulse * 1.18;
    bus.velocity.z -= nz * busImpulse * 1.18;
    bus.velocity.x *= 0.74;
    bus.velocity.z *= 0.74;
    bus.bump = 1;
    onPush(obstacle.name);
  }
}

function getPointerScreenPosition(event) {
  const source = event.nativeEvent ?? event;
  return {
    x: source.clientX ?? 0,
    y: source.clientY ?? 0
  };
}

function launchBasketball(ball, aim, onStatus) {
  const dx = aim.current.x - aim.start.x;
  const dy = aim.current.y - aim.start.y;
  const pullDistance = Math.hypot(dx, dy);
  const pullPower = clamp(pullDistance / 170, 0.28, 1.35);
  const hoopDx = HOOP_CENTER.x - ball.position.x;
  const hoopDz = HOOP_CENTER.z - ball.position.z;
  const hoopDistance = Math.hypot(hoopDx, hoopDz) || 1;
  const hoopDirection = {
    x: hoopDx / hoopDistance,
    z: hoopDz / hoopDistance
  };

  ball.velocity.x = hoopDirection.x * (2.4 + pullPower * 1.15) + clamp(dx / 220, -0.55, 0.55);
  ball.velocity.z = hoopDirection.z * (2.4 + pullPower * 1.15);
  ball.velocity.y = 2.55 + pullPower * 1.8 + clamp(-dy / 180, -0.35, 0.55);
  ball.state = "flying";
  ball.scored = false;
  onStatus("篮球飞起来了");
}

function updateBasketball(ball, dt, onStatus) {
  if (ball.state !== "flying") return;

  ball.velocity.y += BALL.gravity * dt;
  ball.velocity.x *= Math.pow(BALL.airFriction, dt * 60);
  ball.velocity.z *= Math.pow(BALL.airFriction, dt * 60);

  ball.position.x += ball.velocity.x * dt;
  ball.position.y += ball.velocity.y * dt;
  ball.position.z += ball.velocity.z * dt;
  ball.spin += Math.hypot(ball.velocity.x, ball.velocity.z) * dt * 7;

  const hoopDistance = Math.hypot(
    ball.position.x - HOOP_CENTER.x,
    ball.position.z - HOOP_CENTER.z
  );
  const hoopHeightDistance = Math.abs(ball.position.y - HOOP_CENTER.y);

  if (!ball.scored && hoopDistance < 0.3 && hoopHeightDistance < 0.28 && ball.velocity.y < 0.45) {
    ball.scored = true;
    ball.velocity.x *= 0.24;
    ball.velocity.z *= 0.24;
    ball.velocity.y = -0.45;
    onStatus("投进啦，篮球进框了");
  }

  if (ball.position.y <= BALL.radius) {
    ball.position.y = BALL.radius;
    if (Math.abs(ball.velocity.y) > 0.55) {
      ball.velocity.y = -ball.velocity.y * BALL.bounce;
      ball.velocity.x *= BALL.groundFriction;
      ball.velocity.z *= BALL.groundFriction;
      onStatus("篮球弹了一下");
      return;
    }

    ball.velocity.y = 0;
    ball.velocity.x *= 0.58;
    ball.velocity.z *= 0.58;

    if (Math.hypot(ball.velocity.x, ball.velocity.z) < 0.08) {
      ball.velocity.x = 0;
      ball.velocity.z = 0;
      ball.state = "idle";
      onStatus(ball.scored ? "投进啦，再开校车逛逛" : "拖动篮球，再投一次");
    }
  }
}

function StageLighting() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight
        castShadow
        position={[5, 8, 4]}
        intensity={2.15}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
      />
      <hemisphereLight args={["#ffffff", "#a9d4ff", 0.36]} />
    </>
  );
}

function GroundAndRoad() {
  return (
    <group>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]}>
        <planeGeometry args={[14, 8]} />
        <meshStandardMaterial color="#9acb86" roughness={0.86} />
      </mesh>

      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -0.65]}>
        <boxGeometry args={[11.3, 2.25, 0.05]} />
        <meshStandardMaterial color="#485966" roughness={0.78} />
      </mesh>

      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[-1.3, 0.025, 0.95]}>
        <boxGeometry args={[6.7, 1.3, 0.04]} />
        <meshStandardMaterial color="#596a75" roughness={0.78} />
      </mesh>

      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[2.75, 0.035, 1.05]}>
        <boxGeometry args={[2.5, 2.1, 0.04]} />
        <meshStandardMaterial color="#7bcdda" roughness={0.6} />
      </mesh>

      {[-1.18, -0.12].map((z) => (
        <mesh key={z} receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.055, z]}>
          <boxGeometry args={[10.25, 0.035, 0.02]} />
          <meshStandardMaterial color="#eef7fb" roughness={0.55} />
        </mesh>
      ))}

      <mesh castShadow receiveShadow position={[0, 0.18, WORLD_LIMITS.minZ - 0.12]}>
        <boxGeometry args={[12, 0.36, 0.18]} />
        <meshStandardMaterial color="#d5e6e8" roughness={0.68} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.18, WORLD_LIMITS.maxZ + 0.12]}>
        <boxGeometry args={[12, 0.36, 0.18]} />
        <meshStandardMaterial color="#d5e6e8" roughness={0.68} />
      </mesh>
      <mesh castShadow receiveShadow position={[WORLD_LIMITS.minX - 0.12, 0.18, 0]}>
        <boxGeometry args={[0.18, 0.36, 6.4]} />
        <meshStandardMaterial color="#d5e6e8" roughness={0.68} />
      </mesh>
      <mesh castShadow receiveShadow position={[WORLD_LIMITS.maxX + 0.12, 0.18, 0]}>
        <boxGeometry args={[0.18, 0.36, 6.4]} />
        <meshStandardMaterial color="#d5e6e8" roughness={0.68} />
      </mesh>

      <Route66Sign position={[-3.75, 0, 1.55]} />
    </group>
  );
}

function SchoolBus({ meshRef }) {
  return (
    <group ref={meshRef} position={[BUS_START.x, 0.34, BUS_START.z]} rotation={[0, -BUS_START.heading, 0]}>
      <mesh castShadow receiveShadow position={[0, 0.18, 0]}>
        <boxGeometry args={[1.24, 0.54, 0.58]} />
        <meshStandardMaterial color="#f4c542" roughness={0.54} />
      </mesh>
      <mesh castShadow receiveShadow position={[-0.08, 0.53, 0]}>
        <boxGeometry args={[0.84, 0.24, 0.5]} />
        <meshStandardMaterial color="#ffe27a" roughness={0.48} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.62, 0.22, 0]}>
        <boxGeometry args={[0.26, 0.4, 0.56]} />
        <meshStandardMaterial color="#e7ad2c" roughness={0.55} />
      </mesh>

      {[[-0.35, 0.66], [0.02, 0.66], [-0.35, -0.66], [0.02, -0.66]].map(([x, z]) => (
        <mesh key={`${x}-${z}`} castShadow receiveShadow position={[x, 0.55, z * 0.31]}>
          <boxGeometry args={[0.22, 0.16, 0.025]} />
          <meshStandardMaterial color="#9ee8ff" roughness={0.22} metalness={0.02} />
        </mesh>
      ))}

      {[[-0.43, 0.35], [0.43, 0.35], [-0.43, -0.35], [0.43, -0.35]].map(([x, z]) => (
        <mesh key={`${x}-${z}`} castShadow receiveShadow position={[x, -0.08, z]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.14, 24]} />
          <meshStandardMaterial color="#112634" roughness={0.62} />
        </mesh>
      ))}

      <mesh castShadow receiveShadow position={[0.77, 0.26, 0.18]}>
        <sphereGeometry args={[0.055, 16, 12]} />
        <meshStandardMaterial color="#fff6b0" emissive="#ffd166" emissiveIntensity={0.18} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.77, 0.26, -0.18]}>
        <sphereGeometry args={[0.055, 16, 12]} />
        <meshStandardMaterial color="#fff6b0" emissive="#ffd166" emissiveIntensity={0.18} />
      </mesh>
    </group>
  );
}

function ConeObstacle() {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.33, 0.39, 0.12, 28]} />
        <meshStandardMaterial color="#ffd166" roughness={0.58} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.42, 0]}>
        <coneGeometry args={[0.23, 0.68, 28]} />
        <meshStandardMaterial color="#f97316" roughness={0.52} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.54, 0]}>
        <torusGeometry args={[0.13, 0.026, 8, 28]} />
        <meshStandardMaterial color="#fff7d6" roughness={0.45} />
      </mesh>
    </group>
  );
}

function CrateObstacle() {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.28, 0]}>
        <boxGeometry args={[0.74, 0.56, 0.62]} />
        <meshStandardMaterial color="#d8a85f" roughness={0.72} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.59, 0]}>
        <boxGeometry args={[0.82, 0.08, 0.68]} />
        <meshStandardMaterial color="#f1d08f" roughness={0.68} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.31, 0.34]}>
        <boxGeometry args={[0.08, 0.42, 0.035]} />
        <meshStandardMaterial color="#b57a35" roughness={0.7} />
      </mesh>
    </group>
  );
}

function BarrierObstacle() {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.16, 0]}>
        <boxGeometry args={[0.88, 0.16, 0.18]} />
        <meshStandardMaterial color="#8b6b43" roughness={0.66} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.58, 0]}>
        <boxGeometry args={[0.98, 0.5, 0.14]} />
        <meshStandardMaterial color="#f36d2f" roughness={0.48} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.6, 0.08]}>
        <boxGeometry args={[0.64, 0.075, 0.035]} />
        <meshStandardMaterial color="#ffe8b8" roughness={0.42} />
      </mesh>
    </group>
  );
}

function ObstacleMesh({ obstacle, meshRef }) {
  return (
    <group ref={meshRef} position={[obstacle.position.x, 0, obstacle.position.z]}>
      {obstacle.kind === "cone" && <ConeObstacle />}
      {obstacle.kind === "crate" && <CrateObstacle />}
      {obstacle.kind === "barrier" && <BarrierObstacle />}
    </group>
  );
}

function LibertyPlaceholder({ position }) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow position={[0, 0.15, 0]}>
        <boxGeometry args={[0.78, 0.3, 0.78]} />
        <meshStandardMaterial color="#d7f2e8" roughness={0.7} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.2, 0.28, 1.0, 20]} />
        <meshStandardMaterial color="#75cdb7" roughness={0.62} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 1.32, 0]}>
        <sphereGeometry args={[0.19, 18, 12]} />
        <meshStandardMaterial color="#9ee8d5" roughness={0.54} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.35, 1.22, 0]} rotation={[0, 0, -0.5]}>
        <boxGeometry args={[0.1, 0.72, 0.1]} />
        <meshStandardMaterial color="#75cdb7" roughness={0.62} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.54, 1.58, 0]}>
        <coneGeometry args={[0.12, 0.28, 18]} />
        <meshStandardMaterial color="#ffd166" emissive="#f6b833" emissiveIntensity={0.25} />
      </mesh>
    </group>
  );
}

function HollywoodPlaceholder({ position }) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow rotation={[-0.18, 0, 0]} position={[0, 0.12, 0.1]}>
        <boxGeometry args={[2.2, 0.18, 0.78]} />
        <meshStandardMaterial color="#86bf74" roughness={0.82} />
      </mesh>
      {["H", "O", "L", "L", "Y"].map((letter, index) => (
        <group key={`${letter}-${index}`} position={[-0.82 + index * 0.42, 0.55, -0.08]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.24, 0.44, 0.08]} />
            <meshStandardMaterial color="#fff7de" roughness={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function BurgerStandPlaceholder({ position }) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow position={[0, 0.2, 0]}>
        <boxGeometry args={[1.05, 0.4, 0.72]} />
        <meshStandardMaterial color="#ff9f6e" roughness={0.58} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.55, 0]}>
        <boxGeometry args={[1.2, 0.14, 0.82]} />
        <meshStandardMaterial color="#fff0a8" roughness={0.5} />
      </mesh>
      <mesh castShadow receiveShadow position={[-0.22, 0.75, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.1, 28]} />
        <meshStandardMaterial color="#f6c06b" roughness={0.58} />
      </mesh>
      <mesh castShadow receiveShadow position={[-0.22, 0.84, 0]}>
        <sphereGeometry args={[0.18, 18, 10]} />
        <meshStandardMaterial color="#e3a742" roughness={0.58} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.3, 0.77, 0]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.07, 0.42, 8, 16]} />
        <meshStandardMaterial color="#d85d3f" roughness={0.5} />
      </mesh>
    </group>
  );
}

function BasketballCourtPlaceholder({ position }) {
  return (
    <group position={position}>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.045, 0]}>
        <boxGeometry args={[1.8, 1.42, 0.04]} />
        <meshStandardMaterial color="#72cdda" roughness={0.62} />
      </mesh>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.07, 0.24]}>
        <torusGeometry args={[0.56, 0.018, 8, 56]} />
        <meshStandardMaterial color="#f5efe2" roughness={0.56} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.56, -0.86]}>
        <boxGeometry args={[0.08, 1.0, 0.08]} />
        <meshStandardMaterial color="#245669" roughness={0.5} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 1.15, -0.66]}>
        <boxGeometry args={[0.84, 0.54, 0.08]} />
        <meshStandardMaterial color="#e8eef0" roughness={0.5} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 1.15, -0.61]}>
        <boxGeometry args={[0.48, 0.26, 0.025]} />
        <meshStandardMaterial color="#ffffff" roughness={0.48} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 1.02, -0.36]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.2, 0.025, 10, 36]} />
        <meshStandardMaterial color="#df6c25" roughness={0.42} />
      </mesh>
      {[-0.14, 0, 0.14].map((x) => (
        <mesh key={x} castShadow receiveShadow position={[x, 0.88, -0.36]} rotation={[0.25, 0, 0]}>
          <cylinderGeometry args={[0.009, 0.009, 0.36, 8]} />
          <meshStandardMaterial color="#f7f0d7" roughness={0.48} />
        </mesh>
      ))}
    </group>
  );
}

function Basketball({ meshRef, onPointerDown }) {
  return (
    <group ref={meshRef} position={[BALL_START.x, BALL_START.y, BALL_START.z]} onPointerDown={onPointerDown}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[BALL.radius, 32, 24]} />
        <meshStandardMaterial color="#e8871a" roughness={0.44} />
      </mesh>
      <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[BALL.radius * 1.01, 0.01, 8, 36]} />
        <meshStandardMaterial color="#4c2a13" roughness={0.55} />
      </mesh>
      <mesh castShadow receiveShadow rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[BALL.radius * 1.01, 0.01, 8, 36]} />
        <meshStandardMaterial color="#4c2a13" roughness={0.55} />
      </mesh>
      <mesh castShadow receiveShadow rotation={[0.9, 0, Math.PI / 2]}>
        <torusGeometry args={[BALL.radius * 0.68, 0.009, 8, 32]} />
        <meshStandardMaterial color="#4c2a13" roughness={0.55} />
      </mesh>
    </group>
  );
}

function AimLine({ meshRef }) {
  return (
    <mesh ref={meshRef} visible={false} castShadow={false} receiveShadow={false}>
      <boxGeometry args={[1, 0.04, 0.04]} />
      <meshStandardMaterial color="#fff3a6" emissive="#ffd166" emissiveIntensity={0.2} roughness={0.35} />
    </mesh>
  );
}

function Route66Sign({ position }) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow position={[0, 0.48, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.9, 10]} />
        <meshStandardMaterial color="#516671" roughness={0.55} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.98, 0]}>
        <boxGeometry args={[0.62, 0.42, 0.08]} />
        <meshStandardMaterial color="#fff7de" roughness={0.45} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.98, -0.052]}>
        <boxGeometry args={[0.4, 0.08, 0.02]} />
        <meshStandardMaterial color="#d85042" roughness={0.42} />
      </mesh>
    </group>
  );
}

function TownSymbols() {
  return (
    <group>
      <LibertyPlaceholder position={[-3.7, 0, 2.05]} />
      <HollywoodPlaceholder position={[2.25, 0, 2.35]} />
      <BurgerStandPlaceholder position={[-1.25, 0, 2.05]} />
      <BasketballCourtPlaceholder position={[3.85, 0, 0.68]} />
      <mesh castShadow receiveShadow position={[4.8, 0.65, -2.45]}>
        <boxGeometry args={[0.26, 1.3, 0.26]} />
        <meshStandardMaterial color="#8aa1ad" roughness={0.58} />
      </mesh>
      {[0, 1, 2].map((index) => (
        <mesh key={index} castShadow receiveShadow position={[4.42 + index * 0.38, 0.28 + index * 0.2, -2.45]}>
          <boxGeometry args={[0.3, 0.56 + index * 0.4, 0.3]} />
          <meshStandardMaterial color={index === 1 ? "#9cd3e8" : "#d6e5ec"} roughness={0.62} />
        </mesh>
      ))}
    </group>
  );
}

function UsaTownWorld({ controlsRef, resetSignal, onStatus }) {
  const busRef = useRef(createBusState());
  const obstaclesRef = useRef(createObstacles());
  const ballRef = useRef(createBallState());
  const busMeshRef = useRef(null);
  const obstacleMeshesRef = useRef({});
  const ballMeshRef = useRef(null);
  const aimLineRef = useRef(null);
  const aimRef = useRef({
    active: false,
    start: { x: 0, y: 0 },
    current: { x: 0, y: 0 }
  });
  const lastPushRef = useRef({ name: "", time: -999 });

  useEffect(() => {
    resetWorld(
      busRef.current,
      obstaclesRef.current,
      ballRef.current,
      busMeshRef,
      obstacleMeshesRef,
      ballMeshRef,
      aimLineRef
    );
  }, [resetSignal]);

  useEffect(() => {
    function handlePointerMove(event) {
      if (!aimRef.current.active) return;
      aimRef.current.current = getPointerScreenPosition(event);
    }

    function handlePointerUp(event) {
      if (!aimRef.current.active) return;
      aimRef.current.current = getPointerScreenPosition(event);
      aimRef.current.active = false;

      if (aimLineRef.current) {
        aimLineRef.current.visible = false;
      }

      launchBasketball(ballRef.current, aimRef.current, onStatus);
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [onStatus]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.033);
    const bus = busRef.current;
    const obstacles = obstaclesRef.current;
    const ball = ballRef.current;

    updateBus(bus, controlsRef.current, dt);
    updateObstacles(obstacles, dt);
    updateBasketball(ball, dt, onStatus);
    resolveBusObstacleCollisions(bus, obstacles, (name) => {
      const now = performance.now();
      if (lastPushRef.current.name === name && now - lastPushRef.current.time < 420) return;
      lastPushRef.current = { name, time: now };
      onStatus(`校车推开了${name}`);
    });

    if (busMeshRef.current) {
      busMeshRef.current.position.set(bus.position.x, 0.34 + bus.bump * 0.035, bus.position.z);
      busMeshRef.current.rotation.y = -bus.heading;
      busMeshRef.current.rotation.z = Math.sin(performance.now() / 42) * bus.bump * 0.055;
    }

    for (const obstacle of obstacles) {
      const mesh = obstacleMeshesRef.current[obstacle.id];
      if (!mesh) continue;
      mesh.position.set(obstacle.position.x, 0, obstacle.position.z);
      mesh.rotation.y = obstacle.rotation;
      mesh.rotation.z = obstacle.angularVelocity * 0.06;
    }

    if (ballMeshRef.current) {
      ballMeshRef.current.position.set(ball.position.x, ball.position.y, ball.position.z);
      ballMeshRef.current.rotation.x = ball.spin;
      ballMeshRef.current.rotation.z = ball.spin * 0.42;
    }

    if (aimLineRef.current) {
      const isAiming = aimRef.current.active && ball.state === "aiming";
      aimLineRef.current.visible = isAiming;

      if (isAiming) {
        const dx = aimRef.current.current.x - aimRef.current.start.x;
        const dy = aimRef.current.current.y - aimRef.current.start.y;
        const length = clamp(Math.hypot(dx, dy) / 92, 0.35, 1.85);
        const hoopAngle = Math.atan2(HOOP_CENTER.z - ball.position.z, HOOP_CENTER.x - ball.position.x);

        aimLineRef.current.position.set(ball.position.x + Math.cos(hoopAngle) * length * 0.38, ball.position.y + 0.46, ball.position.z + Math.sin(hoopAngle) * length * 0.38);
        aimLineRef.current.scale.set(length, 1, 1);
        aimLineRef.current.rotation.set(0, -hoopAngle, 0);
      }
    }
  });

  function handleBallPointerDown(event) {
    event.stopPropagation();
    const ball = ballRef.current;
    if (ball.state === "flying") return;

    const point = getPointerScreenPosition(event);
    ball.velocity.x = 0;
    ball.velocity.y = 0;
    ball.velocity.z = 0;
    ball.state = "aiming";
    aimRef.current.active = true;
    aimRef.current.start = point;
    aimRef.current.current = point;
    onStatus("拖动篮球，松手投篮");
  }

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 6.7, 7.4]} rotation={[-0.74, 0, 0]} fov={48} near={0.1} far={50} />
      <StageLighting />
      <GroundAndRoad />
      <TownSymbols />
      <SchoolBus meshRef={busMeshRef} />
      {obstaclesRef.current.map((obstacle) => (
        <ObstacleMesh
          key={obstacle.id}
          obstacle={obstacle}
          meshRef={(mesh) => {
            if (mesh) obstacleMeshesRef.current[obstacle.id] = mesh;
          }}
        />
      ))}
      <Basketball meshRef={ballMeshRef} onPointerDown={handleBallPointerDown} />
      <AimLine meshRef={aimLineRef} />
    </>
  );
}

function resetDrivingControls(controls) {
  controls.forward = false;
  controls.back = false;
  controls.left = false;
  controls.right = false;
  controls.steer = 0;
  controls.throttle = 0;
}

function DrivingControls({ controlsRef }) {
  const wheelRef = useRef(null);
  const [wheelTurn, setWheelTurn] = useState(0);
  const [activePedal, setActivePedal] = useState(null);

  useEffect(() => {
    return () => {
      controlsRef.current.steer = 0;
      controlsRef.current.throttle = 0;
    };
  }, [controlsRef]);

  function setWheelFromPointer(event) {
    if (!wheelRef.current) return;

    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const turn = clamp((event.clientX - centerX) / (rect.width * 0.36), -1, 1);

    controlsRef.current.steer = turn;
    setWheelTurn(turn);
  }

  function handleWheelPointerDown(event) {
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setWheelFromPointer(event);
  }

  function handleWheelPointerMove(event) {
    if (!event.currentTarget.hasPointerCapture?.(event.pointerId)) return;
    event.preventDefault();
    setWheelFromPointer(event);
  }

  function handleWheelPointerUp(event) {
    event.preventDefault();
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    controlsRef.current.steer = 0;
    setWheelTurn(0);
  }

  function pressPedal(name, throttle) {
    controlsRef.current.throttle = throttle;
    setActivePedal(name);
  }

  function releasePedal() {
    controlsRef.current.throttle = 0;
    setActivePedal(null);
  }

  return (
    <section className="usa-drive-controls" aria-label="校车驾驶控制">
      <button
        ref={wheelRef}
        className="usa-steering-wheel"
        style={{ "--wheel-turn": `${wheelTurn * 42}deg` }}
        aria-label="方向盘"
        onPointerDown={handleWheelPointerDown}
        onPointerMove={handleWheelPointerMove}
        onPointerUp={handleWheelPointerUp}
        onPointerCancel={handleWheelPointerUp}
      >
        <span className="usa-wheel-rim" />
        <span className="usa-wheel-spoke usa-wheel-spoke-top" />
        <span className="usa-wheel-spoke usa-wheel-spoke-left" />
        <span className="usa-wheel-spoke usa-wheel-spoke-right" />
        <span className="usa-wheel-center" />
      </button>

      <div className="usa-pedals" aria-label="油门和刹车">
        <button
          className={`usa-pedal usa-gas-pedal${activePedal === "gas" ? " active" : ""}`}
          aria-label="油门"
          onPointerDown={(event) => {
            event.preventDefault();
            event.currentTarget.setPointerCapture?.(event.pointerId);
            pressPedal("gas", 1);
          }}
          onPointerUp={(event) => {
            event.preventDefault();
            event.currentTarget.releasePointerCapture?.(event.pointerId);
            releasePedal();
          }}
          onPointerCancel={releasePedal}
        >
          <span />
        </button>
        <button
          className={`usa-pedal usa-brake-pedal${activePedal === "brake" ? " active" : ""}`}
          aria-label="刹车和倒车"
          onPointerDown={(event) => {
            event.preventDefault();
            event.currentTarget.setPointerCapture?.(event.pointerId);
            pressPedal("brake", -0.8);
          }}
          onPointerUp={(event) => {
            event.preventDefault();
            event.currentTarget.releasePointerCapture?.(event.pointerId);
            releasePedal();
          }}
          onPointerCancel={releasePedal}
        >
          <span />
        </button>
      </div>
    </section>
  );
}

export function UsaSchoolBusScene({ onBack }) {
  const gameplay = useMemo(() => getCountryGameplay("usa"), []);
  const controlsRef = useRef({
    forward: false,
    back: false,
    left: false,
    right: false,
    steer: 0,
    throttle: 0
  });
  const [resetSignal, setResetSignal] = useState(0);
  const [status, setStatus] = useState("开校车，探索美国小镇。");

  useEffect(() => {
    function updateKey(code, pressed) {
      if (code === "KeyW" || code === "ArrowUp") {
        controlsRef.current.forward = pressed;
        return true;
      }

      if (code === "KeyS" || code === "ArrowDown") {
        controlsRef.current.back = pressed;
        return true;
      }

      if (code === "KeyA" || code === "ArrowLeft") {
        controlsRef.current.left = pressed;
        return true;
      }

      if (code === "KeyD" || code === "ArrowRight") {
        controlsRef.current.right = pressed;
        return true;
      }

      return false;
    }

    function handleKeyDown(event) {
      if (updateKey(event.code, true)) event.preventDefault();
    }

    function handleKeyUp(event) {
      if (updateKey(event.code, false)) event.preventDefault();
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      resetDrivingControls(controlsRef.current);
    };
  }, []);

  function handleReset() {
    resetDrivingControls(controlsRef.current);
    setStatus("开校车，探索美国小镇。");
    setResetSignal((value) => value + 1);
  }

  return (
    <main className="usa-game-shell">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <color attach="background" args={["#bfe9ff"]} />
        <UsaTownWorld controlsRef={controlsRef} resetSignal={resetSignal} onStatus={setStatus} />
      </Canvas>

      <header className="usa-game-hud">
        <button className="usa-back-button" onClick={onBack}>
          ← 地球
        </button>
        <div className="usa-title-card">
          <span>{gameplay.countryName} · 校车小镇探索</span>
          <strong>{status}</strong>
        </div>
      </header>

      <aside className="usa-symbol-strip" aria-label="美国小镇标志">
        <span title="黄色校车">🚌</span>
        <span title="自由女神像">🗽</span>
        <span title="好莱坞牌">🎬</span>
        <span title="汉堡摊">🍔</span>
        <span title="篮球场">🏀</span>
      </aside>

      <DrivingControls controlsRef={controlsRef} />

      <button className="usa-reset-button" onClick={handleReset}>
        重新开始
      </button>
    </main>
  );
}
