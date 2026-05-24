import React from "react";

function Mat({ color, dimmed = false }) {
  return (
    <meshStandardMaterial
      color={color}
      roughness={0.65}
      metalness={0.02}
      transparent={dimmed}
      opacity={dimmed ? 0.45 : 1}
    />
  );
}

function Tree({ x = 0, z = 0, s = 1, dimmed }) {
  return (
    <group position={[x, 0, z]} scale={s}>
      <mesh castShadow receiveShadow position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.08, 0.11, 0.65, 12]} />
        <Mat color="#b8783d" dimmed={dimmed} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.78, 0]}>
        <sphereGeometry args={[0.34, 18, 18]} />
        <Mat color="#71bf55" dimmed={dimmed} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.25, 0.7, 0.05]}>
        <sphereGeometry args={[0.28, 18, 18]} />
        <Mat color="#91d66f" dimmed={dimmed} />
      </mesh>
    </group>
  );
}

function Rainforest({ dimmed }) {
  return (
    <group>
      <Tree x={-0.35} z={0} s={1.1} dimmed={dimmed} />
      <Tree x={0.2} z={0.08} s={0.9} dimmed={dimmed} />
      <Tree x={0.55} z={-0.2} s={1.0} dimmed={dimmed} />
    </group>
  );
}

function Football({ dimmed }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.25, 0]}>
        <sphereGeometry args={[0.26, 32, 32]} />
        <Mat color="#ffffff" dimmed={dimmed} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.25, 0.255]} rotation={[0, 0, Math.PI / 5]}>
        <circleGeometry args={[0.09, 5]} />
        <Mat color="#1c3f50" dimmed={dimmed} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.27, 0.018, 8, 32]} />
        <Mat color="#1c3f50" dimmed={dimmed} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.25, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.27, 0.018, 8, 32]} />
        <Mat color="#1c3f50" dimmed={dimmed} />
      </mesh>
    </group>
  );
}

function Basketball({ dimmed }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.28, 0]}>
        <sphereGeometry args={[0.28, 32, 32]} />
        <Mat color="#f47b20" dimmed={dimmed} />
      </mesh>
      {[0, Math.PI / 2, Math.PI / 4].map((rotation) => (
        <mesh key={rotation} castShadow receiveShadow position={[0, 0.28, 0]} rotation={[Math.PI / 2, rotation, 0]}>
          <torusGeometry args={[0.29, 0.012, 8, 42]} />
          <Mat color="#3f2a1b" dimmed={dimmed} />
        </mesh>
      ))}
    </group>
  );
}

function Goal({ dimmed }) {
  return (
    <group>
      <mesh castShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[0.85, 0.08, 0.08]} />
        <Mat color="#ffffff" dimmed={dimmed} />
      </mesh>
      <mesh castShadow position={[-0.38, 0.25, 0]}>
        <boxGeometry args={[0.08, 0.55, 0.08]} />
        <Mat color="#ffffff" dimmed={dimmed} />
      </mesh>
      <mesh castShadow position={[0.38, 0.25, 0]}>
        <boxGeometry args={[0.08, 0.55, 0.08]} />
        <Mat color="#ffffff" dimmed={dimmed} />
      </mesh>
    </group>
  );
}

function SambaDrum({ dimmed }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.55, 24]} />
        <Mat color="#f1c04d" dimmed={dimmed} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.61, 0]}>
        <cylinderGeometry args={[0.33, 0.33, 0.04, 24]} />
        <Mat color="#fff5d5" dimmed={dimmed} />
      </mesh>
    </group>
  );
}

function WelcomeSign({ dimmed }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
        <boxGeometry args={[0.95, 0.42, 0.08]} />
        <Mat color="#fff1a8" dimmed={dimmed} />
      </mesh>
      <mesh castShadow position={[-0.32, 0.16, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.35, 10]} />
        <Mat color="#a66c3f" dimmed={dimmed} />
      </mesh>
      <mesh castShadow position={[0.32, 0.16, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.35, 10]} />
        <Mat color="#a66c3f" dimmed={dimmed} />
      </mesh>
    </group>
  );
}

function EiffelTower({ dimmed }) {
  return (
    <group>
      <mesh castShadow position={[-0.22, 0.45, 0]} rotation={[0, 0, -0.16]}>
        <cylinderGeometry args={[0.035, 0.06, 0.9, 8]} />
        <Mat color="#6f7f9e" dimmed={dimmed} />
      </mesh>
      <mesh castShadow position={[0.22, 0.45, 0]} rotation={[0, 0, 0.16]}>
        <cylinderGeometry args={[0.035, 0.06, 0.9, 8]} />
        <Mat color="#6f7f9e" dimmed={dimmed} />
      </mesh>
      <mesh castShadow position={[0, 0.82, 0]}>
        <boxGeometry args={[0.62, 0.08, 0.12]} />
        <Mat color="#8fa0bf" dimmed={dimmed} />
      </mesh>
      {[0.42, 0.62, 1.0].map((y, index) => (
        <mesh key={y} castShadow position={[0, y, 0.02]} rotation={[0, 0, index % 2 === 0 ? 0.22 : -0.22]}>
          <boxGeometry args={[0.5 - index * 0.1, 0.035, 0.055]} />
          <Mat color="#8fa0bf" dimmed={dimmed} />
        </mesh>
      ))}
      <mesh castShadow position={[0, 1.22, 0]}>
        <cylinderGeometry args={[0.03, 0.12, 0.65, 8]} />
        <Mat color="#6f7f9e" dimmed={dimmed} />
      </mesh>
    </group>
  );
}

function Castle({ dimmed }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.42, 0]}>
        <boxGeometry args={[0.75, 0.84, 0.55]} />
        <Mat color="#d8d5d8" dimmed={dimmed} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.22, 0.285]}>
        <boxGeometry args={[0.18, 0.32, 0.035]} />
        <Mat color="#8b6b52" dimmed={dimmed} />
      </mesh>
      {[-0.22, 0.22].map((x) => (
        <mesh key={x} castShadow receiveShadow position={[x, 0.56, 0.285]}>
          <boxGeometry args={[0.11, 0.12, 0.035]} />
          <Mat color="#a7d9ee" dimmed={dimmed} />
        </mesh>
      ))}
      <mesh castShadow position={[-0.48, 0.45, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.9, 18]} />
        <Mat color="#c7cbd2" dimmed={dimmed} />
      </mesh>
      <mesh castShadow position={[0.48, 0.45, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.9, 18]} />
        <Mat color="#c7cbd2" dimmed={dimmed} />
      </mesh>
      <mesh castShadow position={[-0.48, 1.03, 0]}>
        <coneGeometry args={[0.25, 0.36, 18]} />
        <Mat color="#ffb0a3" dimmed={dimmed} />
      </mesh>
      <mesh castShadow position={[0.48, 1.03, 0]}>
        <coneGeometry args={[0.25, 0.36, 18]} />
        <Mat color="#ffb0a3" dimmed={dimmed} />
      </mesh>
    </group>
  );
}

function Bakery({ dimmed }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.35, 0]}>
        <boxGeometry args={[0.8, 0.7, 0.55]} />
        <Mat color="#f5dfb8" dimmed={dimmed} />
      </mesh>
      <mesh castShadow position={[0, 0.78, 0]}>
        <boxGeometry args={[0.9, 0.12, 0.62]} />
        <Mat color="#e17b65" dimmed={dimmed} />
      </mesh>
    </group>
  );
}

function Baguette({ dimmed }) {
  return (
    <group rotation={[0, 0, Math.PI / 2]}>
      <mesh castShadow receiveShadow>
        <capsuleGeometry args={[0.09, 0.75, 8, 16]} />
        <Mat color="#d99b48" dimmed={dimmed} />
      </mesh>
    </group>
  );
}

function Painting({ dimmed }) {
  return (
    <group>
      <mesh castShadow position={[-0.22, 0.25, 0]} rotation={[0, 0, -0.18]}>
        <cylinderGeometry args={[0.025, 0.025, 0.65, 8]} />
        <Mat color="#7f6758" dimmed={dimmed} />
      </mesh>
      <mesh castShadow position={[0.22, 0.25, 0]} rotation={[0, 0, 0.18]}>
        <cylinderGeometry args={[0.025, 0.025, 0.65, 8]} />
        <Mat color="#7f6758" dimmed={dimmed} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.62, 0]}>
        <boxGeometry args={[0.58, 0.44, 0.055]} />
        <Mat color="#fff9ec" dimmed={dimmed} />
      </mesh>
    </group>
  );
}

function Parrot({ dimmed }) {
  return (
    <group>
      <mesh castShadow position={[0, 0.12, 0]}>
        <sphereGeometry args={[0.22, 18, 18]} />
        <Mat color="#3ac36f" dimmed={dimmed} />
      </mesh>
      <mesh castShadow position={[-0.08, 0.1, -0.12]} rotation={[0.25, 0.4, -0.4]}>
        <coneGeometry args={[0.13, 0.34, 16]} />
        <Mat color="#3b8fe2" dimmed={dimmed} />
      </mesh>
      <mesh castShadow position={[0.17, 0.23, 0]}>
        <sphereGeometry args={[0.14, 18, 18]} />
        <Mat color="#ffdf5b" dimmed={dimmed} />
      </mesh>
      <mesh castShadow position={[0.3, 0.24, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.055, 0.16, 12]} />
        <Mat color="#ff8f3d" dimmed={dimmed} />
      </mesh>
      <mesh castShadow position={[-0.18, 0.08, 0]}>
        <coneGeometry args={[0.18, 0.35, 18]} />
        <Mat color="#3b8fe2" dimmed={dimmed} />
      </mesh>
    </group>
  );
}

function River({ dimmed }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[-0.22, 0.08, 0]} rotation={[0, 0, -0.18]} scale={[1.3, 0.18, 0.56]}>
        <sphereGeometry args={[0.28, 24, 12]} />
        <Mat color="#6fd8ff" dimmed={dimmed} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.2, 0.09, 0.05]} rotation={[0, 0, 0.14]} scale={[1.35, 0.16, 0.52]}>
        <sphereGeometry args={[0.28, 24, 12]} />
        <Mat color="#45c7f2" dimmed={dimmed} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.62, 0.1, -0.02]} rotation={[0, 0, -0.12]} scale={[1.05, 0.13, 0.44]}>
        <sphereGeometry args={[0.24, 24, 12]} />
        <Mat color="#9be9ff" dimmed={dimmed} />
      </mesh>
    </group>
  );
}

function CarnivalMask({ dimmed }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[-0.18, 0.35, 0]} rotation={[0, 0, 0.2]} scale={[0.9, 0.55, 0.18]}>
        <sphereGeometry args={[0.32, 24, 16]} />
        <Mat color="#ff79b6" dimmed={dimmed} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.18, 0.35, 0]} rotation={[0, 0, -0.2]} scale={[0.9, 0.55, 0.18]}>
        <sphereGeometry args={[0.32, 24, 16]} />
        <Mat color="#7f7cff" dimmed={dimmed} />
      </mesh>
      {[-0.2, 0.2].map((x) => (
        <mesh key={x} castShadow position={[x, 0.39, 0.08]} scale={[1.25, 0.55, 0.28]}>
          <sphereGeometry args={[0.055, 16, 10]} />
          <Mat color="#25384a" dimmed={dimmed} />
        </mesh>
      ))}
      {[-0.28, 0, 0.28].map((x, index) => (
        <mesh key={x} castShadow position={[x, 0.82, -0.03]} rotation={[0, 0, (index - 1) * 0.35]}>
          <coneGeometry args={[0.08, 0.44, 12]} />
          <Mat color={["#ffd166", "#6ee7b7", "#ff8f70"][index]} dimmed={dimmed} />
        </mesh>
      ))}
      <mesh castShadow receiveShadow position={[0, 0.22, 0.05]} scale={[1, 0.18, 0.18]}>
        <sphereGeometry args={[0.16, 18, 10]} />
        <Mat color="#ffd166" dimmed={dimmed} />
      </mesh>
    </group>
  );
}

function Beret({ dimmed }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.3, 0]} scale={[1.25, 0.28, 0.9]}>
        <sphereGeometry args={[0.34, 28, 14]} />
        <Mat color="#d84e5d" dimmed={dimmed} />
      </mesh>
      <mesh castShadow receiveShadow position={[-0.12, 0.48, 0.02]} rotation={[0, 0, -0.32]} scale={[0.72, 0.2, 0.5]}>
        <sphereGeometry args={[0.24, 20, 10]} />
        <Mat color="#ef6d78" dimmed={dimmed} />
      </mesh>
      <mesh castShadow position={[0.14, 0.58, 0]}>
        <cylinderGeometry args={[0.035, 0.045, 0.12, 12]} />
        <Mat color="#7a2630" dimmed={dimmed} />
      </mesh>
    </group>
  );
}

function Liberty({ dimmed }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.18, 0.24, 0.95, 18]} />
        <Mat color="#8dd7c5" dimmed={dimmed} />
      </mesh>
      <mesh castShadow position={[0, 1.1, 0]}>
        <sphereGeometry args={[0.16, 18, 18]} />
        <Mat color="#8dd7c5" dimmed={dimmed} />
      </mesh>
      <mesh castShadow position={[0.28, 1.35, 0]} rotation={[0, 0, -0.35]}>
        <cylinderGeometry args={[0.035, 0.045, 0.55, 10]} />
        <Mat color="#8dd7c5" dimmed={dimmed} />
      </mesh>
      <mesh castShadow position={[0.41, 1.66, 0]}>
        <coneGeometry args={[0.09, 0.22, 12]} />
        <Mat color="#ffd166" dimmed={dimmed} />
      </mesh>
    </group>
  );
}

function Flag({ dimmed }) {
  return (
    <group>
      <mesh castShadow position={[-0.28, 0.42, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.85, 10]} />
        <Mat color="#d7dce6" dimmed={dimmed} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.12, 0.65, 0]}>
        <boxGeometry args={[0.72, 0.38, 0.04]} />
        <Mat color="#ef5b5b" dimmed={dimmed} />
      </mesh>
      <mesh castShadow receiveShadow position={[-0.08, 0.72, 0.03]}>
        <boxGeometry args={[0.24, 0.18, 0.035]} />
        <Mat color="#4f74c9" dimmed={dimmed} />
      </mesh>
    </group>
  );
}

function Bus({ dimmed }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.34, 0]}>
        <boxGeometry args={[1.0, 0.45, 0.44]} />
        <Mat color="#ffd84d" dimmed={dimmed} />
      </mesh>
      {[-0.25, 0, 0.25].map((x) => (
        <mesh key={x} castShadow receiveShadow position={[x, 0.43, 0.23]}>
          <boxGeometry args={[0.16, 0.12, 0.035]} />
          <Mat color="#9de7ff" dimmed={dimmed} />
        </mesh>
      ))}
      {[-0.32, 0.32].map((x) => (
        <mesh key={x} castShadow receiveShadow position={[x, 0.1, 0.24]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.08, 18]} />
          <Mat color="#263845" dimmed={dimmed} />
        </mesh>
      ))}
    </group>
  );
}

function Burger({ dimmed }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.45, 0]} scale={[1.05, 0.3, 0.82]}>
        <sphereGeometry args={[0.34, 24, 14]} />
        <Mat color="#e7a64d" dimmed={dimmed} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.3, 0]}>
        <boxGeometry args={[0.72, 0.09, 0.48]} />
        <Mat color="#7a4c2b" dimmed={dimmed} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.21, 0]}>
        <boxGeometry args={[0.82, 0.08, 0.52]} />
        <Mat color="#76c957" dimmed={dimmed} />
      </mesh>
    </group>
  );
}

function GreatWall({ dimmed }) {
  return (
    <group>
      {[-0.45, 0, 0.45].map((x, index) => (
        <mesh key={x} castShadow receiveShadow position={[x, 0.25 + index * 0.04, 0]} rotation={[0, index * 0.22, 0]}>
          <boxGeometry args={[0.52, 0.32, 0.24]} />
          <Mat color="#c8995b" dimmed={dimmed} />
        </mesh>
      ))}
      {[-0.72, 0.72].map((x) => (
        <mesh key={x} castShadow receiveShadow position={[x, 0.52, 0]}>
          <boxGeometry args={[0.26, 0.72, 0.3]} />
          <Mat color="#b98243" dimmed={dimmed} />
        </mesh>
      ))}
      {[-0.62, -0.42, -0.12, 0.12, 0.42, 0.62].map((x) => (
        <mesh key={`cap-${x}`} castShadow receiveShadow position={[x, 0.48, 0]}>
          <boxGeometry args={[0.1, 0.13, 0.28]} />
          <Mat color="#9e6d38" dimmed={dimmed} />
        </mesh>
      ))}
    </group>
  );
}

function Panda({ dimmed }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.38, 0]} scale={[0.82, 1.0, 0.72]}>
        <sphereGeometry args={[0.34, 24, 16]} />
        <Mat color="#ffffff" dimmed={dimmed} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.82, 0]}>
        <sphereGeometry args={[0.26, 24, 16]} />
        <Mat color="#ffffff" dimmed={dimmed} />
      </mesh>
      {[-0.18, 0.18].map((x) => (
        <mesh key={`ear-${x}`} castShadow position={[x, 1.02, 0]}>
          <sphereGeometry args={[0.1, 16, 10]} />
          <Mat color="#263845" dimmed={dimmed} />
        </mesh>
      ))}
      {[-0.1, 0.1].map((x) => (
        <mesh key={`eye-${x}`} castShadow position={[x, 0.85, 0.22]} scale={[1.2, 0.8, 0.45]}>
          <sphereGeometry args={[0.06, 12, 8]} />
          <Mat color="#263845" dimmed={dimmed} />
        </mesh>
      ))}
      {[-0.24, 0.24].map((x) => (
        <mesh key={`arm-${x}`} castShadow receiveShadow position={[x, 0.42, 0.08]} rotation={[0, 0, x < 0 ? -0.55 : 0.55]}>
          <capsuleGeometry args={[0.055, 0.32, 6, 10]} />
          <Mat color="#263845" dimmed={dimmed} />
        </mesh>
      ))}
      <mesh castShadow position={[0.34, 0.56, 0]} rotation={[0, 0, 0.28]}>
        <cylinderGeometry args={[0.025, 0.025, 0.82, 8]} />
        <Mat color="#71bf55" dimmed={dimmed} />
      </mesh>
    </group>
  );
}

function Lantern({ dimmed }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.5, 0]} scale={[0.86, 1.05, 0.86]}>
        <sphereGeometry args={[0.28, 24, 16]} />
        <Mat color="#e94b4b" dimmed={dimmed} />
      </mesh>
      {[0.22, 0.78].map((y) => (
        <mesh key={y} castShadow receiveShadow position={[0, y, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.06, 20]} />
          <Mat color="#ffd166" dimmed={dimmed} />
        </mesh>
      ))}
      <mesh castShadow position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.28, 8]} />
        <Mat color="#ffd166" dimmed={dimmed} />
      </mesh>
    </group>
  );
}

function Dumpling({ dimmed }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.26, 0]} scale={[1.35, 0.48, 0.78]}>
        <sphereGeometry args={[0.32, 24, 14]} />
        <Mat color="#fff4dc" dimmed={dimmed} />
      </mesh>
      {[-0.28, -0.12, 0.04, 0.2].map((x) => (
        <mesh key={x} castShadow position={[x, 0.46, 0.03]} rotation={[0, 0, 0.35]}>
          <boxGeometry args={[0.035, 0.22, 0.04]} />
          <Mat color="#e7d2ad" dimmed={dimmed} />
        </mesh>
      ))}
    </group>
  );
}

function ToriiGate({ dimmed }) {
  return (
    <group>
      {[-0.32, 0.32].map((x) => (
        <mesh key={x} castShadow position={[x, 0.45, 0]}>
          <cylinderGeometry args={[0.045, 0.055, 0.9, 12]} />
          <Mat color="#e9504f" dimmed={dimmed} />
        </mesh>
      ))}
      <mesh castShadow receiveShadow position={[0, 0.92, 0]}>
        <boxGeometry args={[0.9, 0.08, 0.12]} />
        <Mat color="#d94141" dimmed={dimmed} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 1.05, 0]}>
        <boxGeometry args={[1.05, 0.08, 0.14]} />
        <Mat color="#e9504f" dimmed={dimmed} />
      </mesh>
    </group>
  );
}

function MountFuji({ dimmed }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.42, 0]}>
        <coneGeometry args={[0.62, 0.88, 32]} />
        <Mat color="#8fb4dc" dimmed={dimmed} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.82, 0]}>
        <coneGeometry args={[0.24, 0.32, 32]} />
        <Mat color="#ffffff" dimmed={dimmed} />
      </mesh>
    </group>
  );
}

function Sushi({ dimmed }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.24, 24]} />
        <Mat color="#273b3e" dimmed={dimmed} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.25, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.26, 24]} />
        <Mat color="#fff9ee" dimmed={dimmed} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.25, 0.16]} scale={[1.2, 0.36, 0.62]}>
        <sphereGeometry args={[0.16, 18, 10]} />
        <Mat color="#ff8f70" dimmed={dimmed} />
      </mesh>
    </group>
  );
}

function BulletTrain({ dimmed }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.32, 0]} scale={[1.55, 0.42, 0.42]}>
        <sphereGeometry args={[0.32, 24, 14]} />
        <Mat color="#f5fbff" dimmed={dimmed} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.58, 0.35, 0]}>
        <coneGeometry args={[0.2, 0.46, 24]} />
        <Mat color="#eaf6ff" dimmed={dimmed} />
      </mesh>
      <mesh castShadow receiveShadow position={[-0.12, 0.44, 0.22]}>
        <boxGeometry args={[0.7, 0.08, 0.035]} />
        <Mat color="#65c7f2" dimmed={dimmed} />
      </mesh>
    </group>
  );
}

function OperaHouse({ dimmed }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.12, 0]}>
        <boxGeometry args={[0.95, 0.18, 0.62]} />
        <Mat color="#d6edf4" dimmed={dimmed} />
      </mesh>
      {[-0.26, 0.04, 0.32].map((x, index) => (
        <mesh key={x} castShadow receiveShadow position={[x, 0.52 + index * 0.03, 0]} rotation={[0, 0, -0.42 + index * 0.12]} scale={[0.72, 1.0, 0.38]}>
          <coneGeometry args={[0.28, 0.72, 24]} />
          <Mat color="#ffffff" dimmed={dimmed} />
        </mesh>
      ))}
    </group>
  );
}

function Kangaroo({ dimmed }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.42, 0]} scale={[0.72, 1.0, 0.58]}>
        <sphereGeometry args={[0.28, 22, 14]} />
        <Mat color="#c8874a" dimmed={dimmed} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.18, 0.82, 0]}>
        <sphereGeometry args={[0.16, 18, 12]} />
        <Mat color="#d39a62" dimmed={dimmed} />
      </mesh>
      {[-0.05, 0.15].map((x) => (
        <mesh key={x} castShadow position={[x, 1.02, 0]} rotation={[0, 0, x < 0 ? -0.18 : 0.18]}>
          <coneGeometry args={[0.06, 0.28, 12]} />
          <Mat color="#c8874a" dimmed={dimmed} />
        </mesh>
      ))}
      <mesh castShadow position={[-0.34, 0.28, 0]} rotation={[0, 0, 1.1]}>
        <cylinderGeometry args={[0.035, 0.055, 0.72, 10]} />
        <Mat color="#a76537" dimmed={dimmed} />
      </mesh>
    </group>
  );
}

function Koala({ dimmed }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.46, 0]}>
        <sphereGeometry args={[0.28, 22, 14]} />
        <Mat color="#9aa5aa" dimmed={dimmed} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.82, 0]}>
        <sphereGeometry args={[0.24, 22, 14]} />
        <Mat color="#aeb8bc" dimmed={dimmed} />
      </mesh>
      {[-0.22, 0.22].map((x) => (
        <mesh key={x} castShadow position={[x, 0.88, 0]}>
          <sphereGeometry args={[0.11, 16, 10]} />
          <Mat color="#7a858a" dimmed={dimmed} />
        </mesh>
      ))}
      <mesh castShadow position={[0, 0.8, 0.22]}>
        <sphereGeometry args={[0.07, 14, 8]} />
        <Mat color="#27343a" dimmed={dimmed} />
      </mesh>
    </group>
  );
}

function Pyramid({ dimmed }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.42, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.62, 0.84, 4]} />
        <Mat color="#d5aa57" dimmed={dimmed} />
      </mesh>
      <mesh receiveShadow position={[0.32, 0.18, 0.32]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.32, 0.36, 4]} />
        <Mat color="#e2bf72" dimmed={dimmed} />
      </mesh>
    </group>
  );
}

function Camel({ dimmed }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.48, 0]} scale={[1.05, 0.48, 0.45]}>
        <sphereGeometry args={[0.28, 20, 12]} />
        <Mat color="#bd884f" dimmed={dimmed} />
      </mesh>
      {[-0.18, 0.16].map((x) => (
        <mesh key={x} castShadow receiveShadow position={[x, 0.72, 0]} scale={[0.75, 0.9, 0.6]}>
          <sphereGeometry args={[0.15, 16, 10]} />
          <Mat color="#a87342" dimmed={dimmed} />
        </mesh>
      ))}
      <mesh castShadow position={[0.42, 0.68, 0]} rotation={[0, 0, -0.55]}>
        <cylinderGeometry args={[0.04, 0.055, 0.48, 10]} />
        <Mat color="#bd884f" dimmed={dimmed} />
      </mesh>
      <mesh castShadow position={[0.6, 0.86, 0]}>
        <sphereGeometry args={[0.1, 14, 8]} />
        <Mat color="#bd884f" dimmed={dimmed} />
      </mesh>
      {[-0.32, -0.08, 0.18, 0.38].map((x) => (
        <mesh key={x} castShadow position={[x, 0.22, 0]}>
          <cylinderGeometry args={[0.025, 0.035, 0.42, 8]} />
          <Mat color="#875a32" dimmed={dimmed} />
        </mesh>
      ))}
    </group>
  );
}

function Boat({ dimmed }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.22, 0]} scale={[1.3, 0.28, 0.52]}>
        <sphereGeometry args={[0.28, 22, 10]} />
        <Mat color="#b8783d" dimmed={dimmed} />
      </mesh>
      <mesh castShadow position={[0, 0.62, 0]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.04, 0.68, 0.04]} />
        <Mat color="#7f6758" dimmed={dimmed} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.2, 0.58, 0]} rotation={[0, 0, -0.2]}>
        <coneGeometry args={[0.22, 0.5, 3]} />
        <Mat color="#fff4dc" dimmed={dimmed} />
      </mesh>
    </group>
  );
}

function Savanna({ dimmed }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.05, 0.08, 0.64, 10]} />
        <Mat color="#8b623d" dimmed={dimmed} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.78, 0]} scale={[1.45, 0.42, 1.0]}>
        <sphereGeometry args={[0.3, 18, 10]} />
        <Mat color="#91bd50" dimmed={dimmed} />
      </mesh>
    </group>
  );
}

function Lion({ dimmed }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.36, 0]} scale={[1.0, 0.55, 0.5]}>
        <sphereGeometry args={[0.28, 20, 12]} />
        <Mat color="#d9a441" dimmed={dimmed} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.36, 0.46, 0]}>
        <sphereGeometry args={[0.22, 18, 12]} />
        <Mat color="#8d5a2b" dimmed={dimmed} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.42, 0.48, 0.02]}>
        <sphereGeometry args={[0.14, 18, 10]} />
        <Mat color="#d9a441" dimmed={dimmed} />
      </mesh>
      {[-0.28, -0.08, 0.12, 0.28].map((x) => (
        <mesh key={x} castShadow position={[x, 0.13, 0]}>
          <cylinderGeometry args={[0.025, 0.035, 0.28, 8]} />
          <Mat color="#b8783d" dimmed={dimmed} />
        </mesh>
      ))}
    </group>
  );
}

function Giraffe({ dimmed }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.42, 0]} scale={[0.82, 0.45, 0.42]}>
        <sphereGeometry args={[0.24, 18, 10]} />
        <Mat color="#d9ad55" dimmed={dimmed} />
      </mesh>
      <mesh castShadow position={[0.22, 0.88, 0]} rotation={[0, 0, -0.08]}>
        <cylinderGeometry args={[0.045, 0.06, 0.85, 10]} />
        <Mat color="#d9ad55" dimmed={dimmed} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.28, 1.3, 0]}>
        <sphereGeometry args={[0.12, 16, 10]} />
        <Mat color="#d9ad55" dimmed={dimmed} />
      </mesh>
      {[-0.18, 0.04, 0.2].map((x) => (
        <mesh key={x} castShadow position={[x, 0.48, 0.2]} scale={[1, 0.65, 0.35]}>
          <sphereGeometry args={[0.055, 12, 8]} />
          <Mat color="#9b6b34" dimmed={dimmed} />
        </mesh>
      ))}
      {[-0.2, -0.04, 0.12, 0.28].map((x) => (
        <mesh key={`leg-${x}`} castShadow position={[x, 0.18, 0]}>
          <cylinderGeometry args={[0.022, 0.032, 0.36, 8]} />
          <Mat color="#c88e45" dimmed={dimmed} />
        </mesh>
      ))}
    </group>
  );
}

function SafariJeep({ dimmed }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.34, 0]}>
        <boxGeometry args={[1.05, 0.42, 0.52]} />
        <Mat color="#e0b84e" dimmed={dimmed} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.12, 0.62, 0]}>
        <boxGeometry args={[0.48, 0.28, 0.46]} />
        <Mat color="#f0d16e" dimmed={dimmed} />
      </mesh>
      {[-0.34, 0.34].map((x) => (
        <mesh key={x} castShadow receiveShadow position={[x, 0.12, 0.28]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.08, 18]} />
          <Mat color="#263845" dimmed={dimmed} />
        </mesh>
      ))}
    </group>
  );
}

function SimpleDisc({ color, dimmed }) {
  return (
    <mesh castShadow receiveShadow position={[0, 0.1, 0]}>
      <sphereGeometry args={[0.22, 18, 18]} />
      <Mat color={color} dimmed={dimmed} />
    </mesh>
  );
}

export function PlaceholderModel({ type, dimmed }) {
  switch (type) {
    case "rainforest":
      return <Rainforest dimmed={dimmed} />;
    case "football":
      return <Football dimmed={dimmed} />;
    case "basketball":
      return <Basketball dimmed={dimmed} />;
    case "goal":
      return <Goal dimmed={dimmed} />;
    case "sambaDrum":
      return <SambaDrum dimmed={dimmed} />;
    case "welcomeSign":
      return <WelcomeSign dimmed={dimmed} />;
    case "eiffelTower":
      return <EiffelTower dimmed={dimmed} />;
    case "castle":
      return <Castle dimmed={dimmed} />;
    case "bakery":
      return <Bakery dimmed={dimmed} />;
    case "baguette":
      return <Baguette dimmed={dimmed} />;
    case "painting":
      return <Painting dimmed={dimmed} />;
    case "parrot":
      return <Parrot dimmed={dimmed} />;
    case "liberty":
      return <Liberty dimmed={dimmed} />;
    case "flag":
      return <Flag dimmed={dimmed} />;
    case "bus":
      return <Bus dimmed={dimmed} />;
    case "burger":
      return <Burger dimmed={dimmed} />;
    case "greatWall":
      return <GreatWall dimmed={dimmed} />;
    case "panda":
      return <Panda dimmed={dimmed} />;
    case "lantern":
      return <Lantern dimmed={dimmed} />;
    case "dumpling":
      return <Dumpling dimmed={dimmed} />;
    case "toriiGate":
      return <ToriiGate dimmed={dimmed} />;
    case "mountFuji":
      return <MountFuji dimmed={dimmed} />;
    case "sushi":
      return <Sushi dimmed={dimmed} />;
    case "bulletTrain":
      return <BulletTrain dimmed={dimmed} />;
    case "operaHouse":
      return <OperaHouse dimmed={dimmed} />;
    case "kangaroo":
      return <Kangaroo dimmed={dimmed} />;
    case "koala":
      return <Koala dimmed={dimmed} />;
    case "pyramid":
      return <Pyramid dimmed={dimmed} />;
    case "camel":
      return <Camel dimmed={dimmed} />;
    case "boat":
      return <Boat dimmed={dimmed} />;
    case "savanna":
      return <Savanna dimmed={dimmed} />;
    case "lion":
      return <Lion dimmed={dimmed} />;
    case "giraffe":
      return <Giraffe dimmed={dimmed} />;
    case "safariJeep":
      return <SafariJeep dimmed={dimmed} />;
    case "river":
      return <River dimmed={dimmed} />;
    case "carnivalMask":
      return <CarnivalMask dimmed={dimmed} />;
    case "beret":
      return <Beret dimmed={dimmed} />;
    default:
      return <SimpleDisc color="#ffd166" dimmed={dimmed} />;
  }
}
