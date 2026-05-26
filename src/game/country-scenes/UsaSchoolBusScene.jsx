import React, { useEffect, useMemo, useRef, useState } from "react";
import { getCountryGameplay } from "../config/countryGameplayMatrix.js";
import { getLocomotionArchetype } from "../config/locomotionArchetypes.js";
import "./usaSchoolBusScene.css";

const LANE_TOPS = [30, 50, 70];
const OBSTACLES = [
  { id: "cone-a", lane: 0, x: 38, icon: "▲" },
  { id: "cone-b", lane: 2, x: 52, icon: "▲" },
  { id: "burger-sign", lane: 1, x: 67, icon: "🍔" },
  { id: "cone-c", lane: 0, x: 80, icon: "▲" }
];
const SHOT_ZONE = { min: 44, max: 64 };
const BASKETS_TO_WIN = 3;
const BUMPS_TO_RETRY = 3;

function clampLane(value) {
  return Math.max(0, Math.min(LANE_TOPS.length - 1, value));
}

function laneFromPointer(event) {
  const rect = event.currentTarget.getBoundingClientRect();
  const ratio = ((event.clientY - rect.top) / rect.height) * 100;
  if (ratio < 40) return 0;
  if (ratio > 60) return 2;
  return 1;
}

export function UsaSchoolBusScene({ onBack }) {
  const gameplay = useMemo(() => getCountryGameplay("usa"), []);
  const archetype = useMemo(
    () => getLocomotionArchetype(gameplay.locomotionArchetypeId),
    [gameplay]
  );
  const [busLane, setBusLane] = useState(1);
  const [busX, setBusX] = useState(12);
  const [baskets, setBaskets] = useState(0);
  const [bumps, setBumps] = useState(0);
  const [gameState, setGameState] = useState("running");
  const [status, setStatus] = useState("拖动公路换车道，跑起来再投篮。");
  const [shot, setShot] = useState(null);
  const [isPointerDown, setIsPointerDown] = useState(false);

  const busLaneRef = useRef(busLane);
  const basketsRef = useRef(baskets);
  const bumpsRef = useRef(bumps);
  const gameStateRef = useRef(gameState);
  const hitObstacleKeysRef = useRef(new Set());
  const shotTimeoutRef = useRef(null);

  useEffect(() => {
    busLaneRef.current = busLane;
  }, [busLane]);

  useEffect(() => {
    basketsRef.current = baskets;
  }, [baskets]);

  useEffect(() => {
    bumpsRef.current = bumps;
  }, [bumps]);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (gameStateRef.current !== "running") return;

      setBusX((currentX) => {
        let nextX = currentX + 0.8;

        if (nextX > 88) {
          nextX = 12;
          hitObstacleKeysRef.current = new Set();
          setStatus("校车继续跑，找准篮筐再投。");
        }

        for (const obstacle of OBSTACLES) {
          const obstacleKey = `${obstacle.id}:${Math.floor(nextX / 12)}`;
          const isNearObstacle = Math.abs(nextX - obstacle.x) < 1.6;
          const isSameLane = busLaneRef.current === obstacle.lane;

          if (isNearObstacle && isSameLane && !hitObstacleKeysRef.current.has(obstacleKey)) {
            hitObstacleKeysRef.current.add(obstacleKey);
            setBumps((currentBumps) => {
              const nextBumps = currentBumps + 1;

              if (nextBumps >= BUMPS_TO_RETRY) {
                setGameState("retry");
                setStatus("还没完成：校车碰到太多路障，换车道再跑一次。");
              } else {
                setStatus("碰到路障啦，换一条车道继续跑。");
              }

              return nextBumps;
            });
          }
        }

        return nextX;
      });
    }, 70);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    return () => {
      if (shotTimeoutRef.current) {
        window.clearTimeout(shotTimeoutRef.current);
      }
    };
  }, []);

  function chooseLane(nextLane) {
    if (gameState !== "running") return;
    setBusLane(clampLane(nextLane));
  }

  function handleRoadPointerDown(event) {
    setIsPointerDown(true);
    chooseLane(laneFromPointer(event));
  }

  function handleRoadPointerMove(event) {
    if (!isPointerDown) return;
    chooseLane(laneFromPointer(event));
  }

  function handleRoadPointerUp() {
    setIsPointerDown(false);
  }

  function handleShoot() {
    if (gameState !== "running" || shot) return;

    const startX = busX;
    const startY = LANE_TOPS[busLane];
    const isInShotZone = startX >= SHOT_ZONE.min && startX <= SHOT_ZONE.max;
    const isMade = busLane === 1 && isInShotZone;
    const endX = isMade ? 82 : 78;
    const endY = isMade ? 42 : startY + (busLane === 0 ? -14 : 12);

    setShot({
      id: Date.now(),
      made: isMade,
      startX,
      startY,
      dx: endX - startX,
      dy: endY - startY
    });

    shotTimeoutRef.current = window.setTimeout(() => {
      shotTimeoutRef.current = null;
      setShot(null);

      if (isMade) {
        setBaskets((currentBaskets) => {
          const nextBaskets = currentBaskets + 1;

          if (nextBaskets >= BASKETS_TO_WIN) {
            setGameState("success");
            setStatus(gameplay.successCondition);
          } else {
            setStatus("进球！车还在跑，继续投。");
          }

          return nextBaskets;
        });
        return;
      }

      setStatus(`还没完成：${gameplay.failureCondition}`);
    }, 760);
  }

  function handleReset() {
    if (shotTimeoutRef.current) {
      window.clearTimeout(shotTimeoutRef.current);
      shotTimeoutRef.current = null;
    }

    hitObstacleKeysRef.current = new Set();
    setBusLane(1);
    setBusX(12);
    setBaskets(0);
    setBumps(0);
    setGameState("running");
    setShot(null);
    setStatus("拖动公路换车道，跑起来再投篮。");
  }

  const busStyle = {
    "--bus-x": `${busX}%`,
    "--bus-y": `${LANE_TOPS[busLane]}%`
  };

  return (
    <main className="usa-game-shell">
      <header className="usa-game-hud">
        <button className="usa-back-button" onClick={onBack}>
          ← 地球
        </button>

        <div className="usa-title-card">
          <span>{gameplay.countryName} · {gameplay.mainScene}</span>
          <strong>{gameplay.coreVerb}：{gameplay.playerGoal}</strong>
        </div>
      </header>

      <section className="usa-scoreboard" aria-live="polite">
        <div>
          <span>🏀</span>
          <strong>{baskets}/{BASKETS_TO_WIN}</strong>
        </div>
        <div>
          <span>🚧</span>
          <strong>{bumps}/{BUMPS_TO_RETRY}</strong>
        </div>
      </section>

      <section
        className="usa-road-stage"
        aria-label="美国校车公路"
      >
        <div className="usa-skyline" aria-hidden="true">
          <div className="usa-liberty" title={gameplay.keyObjects.includes("自由女神像") ? "自由女神像" : undefined} />
          <div className="usa-burger-shop">
            <span>🍔</span>
          </div>
        </div>

        <div
          className="usa-road"
          onPointerDown={handleRoadPointerDown}
          onPointerMove={handleRoadPointerMove}
          onPointerUp={handleRoadPointerUp}
          onPointerCancel={handleRoadPointerUp}
        >
          {LANE_TOPS.map((laneTop, index) => (
            <button
              key={laneTop}
              className={`usa-lane-tap ${busLane === index ? "active" : ""}`}
              style={{ "--lane-y": `${laneTop}%` }}
              onClick={(event) => {
                event.stopPropagation();
                chooseLane(index);
              }}
              aria-label={`切换到第 ${index + 1} 条车道`}
            />
          ))}

          <div className="usa-shot-zone" aria-hidden="true">
            <span>投篮区</span>
          </div>

          {OBSTACLES.map((obstacle) => (
            <div
              key={obstacle.id}
              className={`usa-obstacle lane-${obstacle.lane}`}
              style={{
                "--obstacle-x": `${obstacle.x}%`,
                "--obstacle-y": `${LANE_TOPS[obstacle.lane]}%`
              }}
              aria-hidden="true"
            >
              {obstacle.icon}
            </div>
          ))}

          <div className="usa-hoop" aria-hidden="true">
            <div className="usa-hoop-ring" />
            <div className="usa-hoop-net" />
          </div>

          <div className="usa-school-bus" style={busStyle} aria-label={archetype.representativeObjects[2]}>
            <div className="usa-bus-top" />
            <div className="usa-bus-body">
              <span className="usa-bus-window" />
              <span className="usa-bus-window" />
              <span className="usa-bus-window" />
              <span className="usa-bus-light" />
            </div>
            <div className="usa-bus-wheel front" />
            <div className="usa-bus-wheel back" />
          </div>

          {shot && (
            <div
              className={`usa-basketball-shot ${shot.made ? "made" : "miss"}`}
              style={{
                "--shot-start-x": `${shot.startX}%`,
                "--shot-start-y": `${shot.startY}%`,
                "--shot-dx": `${shot.dx}vw`,
                "--shot-dy": `${shot.dy}vh`
              }}
              aria-hidden="true"
            >
              🏀
            </div>
          )}
        </div>
      </section>

      <section className={`usa-feedback-card ${gameState}`} aria-live="polite">
        <div className="usa-feedback-status">{status}</div>
        <div className="usa-feedback-physics">
          {gameplay.physicsFocus.join(" · ")}
        </div>
      </section>

      <div className="usa-action-bar">
        <button className="usa-shoot-button" onClick={handleShoot} disabled={gameState !== "running" || Boolean(shot)}>
          🏀 投篮
        </button>
        <button className="usa-reset-button" onClick={handleReset}>
          再跑一次
        </button>
      </div>
    </main>
  );
}
