import React, { useMemo, useState } from "react";
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

  const parameterRows = useMemo(() => {
    return PARAMETER_KEYS.map((key) => [key, PHYSICS_TUNING[key]]);
  }, []);

  return (
    <main className="physics-lab-shell">
      <PhysicsScene resetToken={resetToken} onDragChange={setDraggingId} />

      <header className="physics-lab-hud">
        <div className="physics-title-pill">
          <span>物理手感试验</span>
          <strong>{draggingId ? `正在拖动 ${draggingId}` : "拖动车、球和箱子"}</strong>
        </div>
        <button
          className="physics-reset-button"
          onClick={() => setResetToken((value) => value + 1)}
        >
          重置
        </button>
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
