import React, { useCallback, useEffect, useMemo, useState } from "react";
import { PhysicsAudioEngine } from "./PhysicsAudioEngine.js";
import { PhysicsScene } from "./PhysicsScene.jsx";
import { PHYSICS_TUNING } from "./physicsTuningConfig.js";
import "./physicsLab.css";

const PARAMETER_KEYS = [
  "dragSpring",
  "maxDragSpeed",
  "carMass",
  "truckMass",
  "ballRestitution",
  "groundFriction"
];

export function PhysicsLab() {
  const [resetToken, setResetToken] = useState(0);
  const [draggingId, setDraggingId] = useState(null);
  const [muted, setMuted] = useState(false);
  const [audioEngine] = useState(() => new PhysicsAudioEngine());

  const parameterRows = useMemo(() => {
    return PARAMETER_KEYS.map((key) => [key, PHYSICS_TUNING[key]]);
  }, []);

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
    audioEngine.ensureStarted().then(() => {
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
    }).catch(() => {});
  }

  return (
    <main className="physics-lab-shell">
      <PhysicsScene
        resetToken={resetToken}
        onDragChange={setDraggingId}
        onImpact={handleImpact}
        onInteractionStart={ensureAudioStarted}
      />

      <header className="physics-lab-hud">
        <div className="physics-title-pill">
          <span>物理手感试验</span>
          <strong>{draggingId ? `正在拖动 ${draggingId}` : "拖动车、球和箱子"}</strong>
        </div>
        <div className="physics-controls">
          <button
            className="physics-icon-button"
            onClick={handleToggleMute}
            aria-label={muted ? "打开声音" : "关闭声音"}
          >
            {muted ? "🔇" : "🔊"}
          </button>
          <button
            className="physics-reset-button"
            onClick={handleReset}
          >
            重置
          </button>
        </div>
      </header>

      <aside className="physics-params" aria-label="物理参数">
        {parameterRows.map(([key, value]) => (
          <div className="physics-param-row" key={key}>
            <span>{key}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </aside>
    </main>
  );
}
