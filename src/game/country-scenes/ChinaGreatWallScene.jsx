import React, { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrthographicCamera } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import * as THREE from "three";
import { PhysicsAudioEngine } from "../physics-lab/PhysicsAudioEngine.js";
import {
  CHINA_SORTABLE_COUNT,
  ChinaGreatWallObjects
} from "./ChinaGreatWallObjects.jsx";
import { awardStamp } from "../progress/stampStorage.js";
import "./countryScene.css";

const CHINA_GREAT_WALL_STAMP = {
  id: "china-great-wall-blocks",
  name: "长城积木章",
  countryId: "china",
  sceneId: "china"
};

export function ChinaGreatWallScene({ onBack }) {
  const [resetToken, setResetToken] = useState(0);
  const [sortToken, setSortToken] = useState(0);
  const [isSorting, setIsSorting] = useState(false);
  const [completedSortIds, setCompletedSortIds] = useState(() => new Set());
  const [stampMessage, setStampMessage] = useState(null);
  const [rampFolded, setRampFolded] = useState(false);
  const [muted, setMuted] = useState(false);
  const [audioEngine] = useState(() => new PhysicsAudioEngine());
  const sortingActiveRef = useRef(false);
  const sortFallbackTimerRef = useRef(null);

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

  const finishSorting = useCallback(() => {
    if (!sortingActiveRef.current) return;

    sortingActiveRef.current = false;
    if (sortFallbackTimerRef.current) {
      window.clearTimeout(sortFallbackTimerRef.current);
      sortFallbackTimerRef.current = null;
    }

    setIsSorting(false);

    const result = awardStamp({
      ...CHINA_GREAT_WALL_STAMP,
      earnedAt: Date.now()
    });

    audioEngine.playUi(result.awarded ? "stampAward" : "sortComplete");
    setStampMessage(result.awarded ? "🎖️ 获得：长城积木章" : "长城整理好啦！");
  }, [audioEngine]);

  useEffect(() => {
    return () => {
      if (sortFallbackTimerRef.current) {
        window.clearTimeout(sortFallbackTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isSorting || completedSortIds.size < CHINA_SORTABLE_COUNT) return;
    finishSorting();
  }, [completedSortIds, finishSorting, isSorting]);

  useEffect(() => {
    if (!stampMessage) return undefined;

    const timer = window.setTimeout(() => {
      setStampMessage(null);
    }, 2200);

    return () => window.clearTimeout(timer);
  }, [stampMessage]);

  const handleSortComplete = useCallback((id) => {
    setCompletedSortIds((prev) => {
      if (prev.has(id)) return prev;

      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  function handleReset() {
    ensureAudioStarted();
    audioEngine.playUi("reset");
    sortingActiveRef.current = false;
    if (sortFallbackTimerRef.current) {
      window.clearTimeout(sortFallbackTimerRef.current);
      sortFallbackTimerRef.current = null;
    }
    setIsSorting(false);
    setCompletedSortIds(new Set());
    setStampMessage(null);
    setRampFolded(false);
    setResetToken((value) => value + 1);
  }

  function handleSort() {
    if (isSorting) return;

    ensureAudioStarted();
    audioEngine.playUi("click");
    sortingActiveRef.current = true;
    if (sortFallbackTimerRef.current) {
      window.clearTimeout(sortFallbackTimerRef.current);
    }
    setStampMessage(null);
    setCompletedSortIds(new Set());
    setIsSorting(true);
    setSortToken((value) => value + 1);
    sortFallbackTimerRef.current = window.setTimeout(() => {
      finishSorting();
    }, 2400);
  }

  function handleToggleRampFold() {
    ensureAudioStarted();
    audioEngine.playUi("click");
    setRampFolded((folded) => !folded);
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
              sortToken={sortToken}
              rampFolded={rampFolded}
              onImpact={handleImpact}
              onInteractionStart={ensureAudioStarted}
              onToggleRampFold={handleToggleRampFold}
              onSortComplete={handleSortComplete}
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

      <div className="country-action-stack">
        <button
          className="country-sort-button"
          onClick={handleSort}
          disabled={isSorting}
        >
          {isSorting ? "整理中..." : "🧹 整理"}
        </button>
        <button className="country-reset-button" onClick={handleReset}>
          重置
        </button>
      </div>

      {stampMessage && (
        <div className="country-stamp-toast" role="status" aria-live="polite">
          {stampMessage}
        </div>
      )}
    </main>
  );
}
