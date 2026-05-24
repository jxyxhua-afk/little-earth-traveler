import React from "react";
import * as THREE from "three";

const GROUND_ROTATION = [-THREE.MathUtils.degToRad(90), 0, 0];

function SurfaceMaterial({ color, roughness = 0.65, metalness = 0.02, dimmed = false }) {
  return (
    <meshStandardMaterial
      color={color}
      roughness={roughness}
      metalness={metalness}
      transparent={dimmed}
      opacity={dimmed ? 0.42 : 1}
    />
  );
}

function BaseIsland({ country }) {
  return (
    <group>
      <mesh receiveShadow rotation={GROUND_ROTATION} position={[0, -0.04, 0]}>
        <circleGeometry args={[3.5, 96]} />
        <SurfaceMaterial color={country.theme.ground} roughness={0.85} metalness={0} />
      </mesh>

      <mesh receiveShadow rotation={GROUND_ROTATION} position={[0, 0.005, 0]}>
        <torusGeometry args={[3.52, 0.055, 12, 128]} />
        <SurfaceMaterial color={country.theme.accent} roughness={0.5} />
      </mesh>
    </group>
  );
}

function TreePrimitive({ primitive, dimmed }) {
  const color = primitive.color || "#7ed957";

  return (
    <group position={primitive.position}>
      <mesh castShadow receiveShadow position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.56, 12]} />
        <SurfaceMaterial color="#a46a3a" dimmed={dimmed} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.74, 0]}>
        <sphereGeometry args={[0.22, 18, 12]} />
        <SurfaceMaterial color={color} roughness={0.52} dimmed={dimmed} />
      </mesh>
    </group>
  );
}

function EnvironmentPrimitive({ primitive, activeZoneId }) {
  const belongsToActiveZone = primitive.zone && primitive.zone === activeZoneId;
  const dimmed = Boolean(activeZoneId && primitive.zone && !belongsToActiveZone);
  const rotation = primitive.rotation || [0, 0, 0];
  const roughness = primitive.roughness ?? 0.65;
  const metalness = primitive.metalness ?? 0.02;

  if (primitive.type === "tree") {
    return <TreePrimitive primitive={primitive} dimmed={dimmed} />;
  }

  if (primitive.type === "box") {
    return (
      <mesh castShadow receiveShadow position={primitive.position} rotation={rotation}>
        <boxGeometry args={primitive.size || [1, 1, 1]} />
        <SurfaceMaterial color={primitive.color} roughness={roughness} metalness={metalness} dimmed={dimmed} />
      </mesh>
    );
  }

  if (primitive.type === "plane") {
    return (
      <mesh receiveShadow position={primitive.position} rotation={rotation}>
        <planeGeometry args={primitive.size || [1, 1]} />
        <SurfaceMaterial color={primitive.color} roughness={roughness} metalness={metalness} dimmed={dimmed} />
      </mesh>
    );
  }

  if (primitive.type === "circle") {
    return (
      <mesh receiveShadow position={primitive.position} rotation={rotation}>
        <circleGeometry args={[primitive.radius || 1, primitive.segments || 64]} />
        <SurfaceMaterial color={primitive.color} roughness={roughness} metalness={metalness} dimmed={dimmed} />
      </mesh>
    );
  }

  if (primitive.type === "cylinder") {
    return (
      <mesh castShadow receiveShadow position={primitive.position} rotation={rotation}>
        <cylinderGeometry args={primitive.args || [0.1, 0.1, 1, 16]} />
        <SurfaceMaterial color={primitive.color} roughness={roughness} metalness={metalness} dimmed={dimmed} />
      </mesh>
    );
  }

  return null;
}

export function CountryEnvironment({ country, activeZoneId }) {
  const primitives = activeZoneId
    ? (country.environment || []).filter((primitive) => !primitive.zone || primitive.zone === activeZoneId)
    : (country.environment || []);

  return (
    <group>
      <BaseIsland country={country} />

      {primitives.map((primitive, index) => (
        <EnvironmentPrimitive
          key={`${primitive.type}-${primitive.zone || "shared"}-${index}`}
          primitive={primitive}
          activeZoneId={activeZoneId}
        />
      ))}
    </group>
  );
}
