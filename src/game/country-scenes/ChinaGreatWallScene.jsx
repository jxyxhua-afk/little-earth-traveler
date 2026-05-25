import React, { Suspense, useCallback, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrthographicCamera } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import * as THREE from "three";
import { PhysicsAudioEngine } from "../physics-lab/PhysicsAudioEngine.js";
import { ChinaGreatWallObjects } from "./ChinaGreatWallObjects.jsx";
import "./countryScene.css";

export function ChinaGreatWallScene({ onBack }) {
  const [resetToken, setResetToken] = useState(0);
  const [muted, setMuted] = useState(false);
  const [audioEngine] = useState(() => new PhysicsAudioEngine());

  useEffect(() => {
    audioEngine.setMuted(muted);
  }, [audioEngine, muted]);

  const ensureAudioStarted = useCallback(() => {
    audioEngine.ensureStarted().catch(() => {});
  }, [audioEngine]);

  const handleImpact = useCallback(
    (type, intensity, sourceId) => {
      audioEngine.playImpact(type, intensity, sourceId);
    },
    [audioEngine]
  );

  function handleReset() {
    ensureAudioStarted();
    audioEngine.playUi("reset");
    setResetToken((value) => value + 1);
  }

  function handleToggleMute() {
    audioEngine
      .ensureStarted()
      .then(() => {
        setMuted((currentMuted) => {
          const nextMuted = !currentMuted;

          if (currentMuted) {
            audioEngine.setMuted(false);
            audioEngine.playUi("toggleMute");
          } else {
            audioEngine.playUi("toggleMute");
            audioEngine.setMuted(true);
          }

          return nextMuted;
        });
      })
      .catch(() => {});
  }

  return (
    <main className="country-play-shell china-great-wall-shell">
      <Canvas
        className="country-play-canvas"
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
        <ambientLight intensity={0.58} />
        <hemisphereLight args={["#ffffff", "#bde9ff", 0.58]} />
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
            <ChinaGreatWallObjects
              resetToken={resetToken}
              onImpact={handleImpact}
              onInteractionStart={ensureAudioStarted}
            />
          </Physics>
        </Suspense>
      </Canvas>

      <header className="country-play-hud">
        <button className="country-back-button" onClick={onBack}>
          ← 地球
        </button>

        <div className="china-title-pill">
          <span>中国 · 长城积木场</span>
          <strong>开小车，撞一撞长城积木。</strong>
        </div>

        <button
          className="country-sound-button"
          onClick={handleToggleMute}
          aria-label={muted ? "打开声音" : "关闭声音"}
        >
          {muted ? "🔇" : "🔊"}
        </button>
      </header>

      <button className="country-reset-button" onClick={handleReset}>
        重置
      </button>
    </main>
  );
}
