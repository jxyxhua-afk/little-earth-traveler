import React, { useEffect, useMemo, useRef, useState } from "react";
import { GameHud } from "../ui/GameHud.jsx";
import { ItemInfoCard } from "../ui/ItemInfoCard.jsx";
import { ZoneNav } from "../ui/ZoneNav.jsx";
import { StartAudioGate } from "../ui/StartAudioGate.jsx";
import { GameCanvas } from "../three/GameCanvas.jsx";
import { CameraRig } from "../three/CameraRig.jsx";
import { CountryDiorama } from "../three/CountryDiorama.jsx";
import { useGameAudio } from "../hooks/useGameAudio.js";

export function CountryScreen({
  country,
  discoveredIds,
  totalStars,
  totalStarsTotal,
  onBack,
  onDiscover
}) {
  const [activeZoneId, setActiveZoneId] = useState(country.zones[0]?.id ?? null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [sceneRotation, setSceneRotation] = useState(0);
  const touchDistanceRef = useRef(null);
  const dragTouchRef = useRef(null);

  const selectedItem = useMemo(() => {
    return country.items.find((item) => item.id === selectedItemId) ?? null;
  }, [country.items, selectedItemId]);

  const activeZone = useMemo(() => {
    return country.zones.find((zone) => zone.id === activeZoneId) ?? null;
  }, [country.zones, activeZoneId]);

  const {
    unlocked,
    soundOn,
    unlockAudio,
    toggleSound,
    playItemAudio,
    playTone,
    speak
  } = useGameAudio(country);

  useEffect(() => {
    setActiveZoneId(country.zones[0]?.id ?? null);
    setSelectedItemId(null);
    setZoomLevel(1);
    setSceneRotation(0);
  }, [country]);

  const cameraView = useMemo(() => {
    if (selectedItem) {
      const [x, y, z] = selectedItem.position;

      return {
        position: [x + 1.5 / zoomLevel, y + 1.25 / zoomLevel, z + 2.3 / zoomLevel],
        target: [x, y + 0.5, z]
      };
    }

    if (activeZone?.camera) {
      const p = activeZone.camera.position;
      const t = activeZone.camera.target;

      return {
        position: [p[0] / zoomLevel, p[1] / zoomLevel, p[2] / zoomLevel],
        target: t
      };
    }

    const overview = country.views.overview;

    return {
      position: [
        overview.position[0] / zoomLevel,
        overview.position[1] / zoomLevel,
        overview.position[2] / zoomLevel
      ],
      target: overview.target
    };
  }, [selectedItem, activeZone, country.views.overview, zoomLevel]);

  function handleItemClick(item) {
    const isNewDiscovery = !discoveredIds.includes(item.id);
    setSelectedItemId(item.id);
    onDiscover(country.id, item.id);
    if (isNewDiscovery) playTone("star");
    playItemAudio(item.id);
  }

  function getTouchDistance(touches) {
    if (touches.length < 2) return null;

    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.hypot(dx, dy);
  }

  function handleTouchStart(event) {
    if (event.touches.length === 1) {
      dragTouchRef.current = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      };
      touchDistanceRef.current = null;
      return;
    }

    dragTouchRef.current = null;
    touchDistanceRef.current = getTouchDistance(event.touches);
  }

  function handleTouchMove(event) {
    if (event.touches.length === 1 && dragTouchRef.current) {
      const touch = event.touches[0];
      const dx = touch.clientX - dragTouchRef.current.x;
      const dy = touch.clientY - dragTouchRef.current.y;

      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        event.preventDefault();
        dragTouchRef.current = { x: touch.clientX, y: touch.clientY };
        setSceneRotation((rotation) => rotation + dx * 0.008);
      }

      return;
    }

    const nextDistance = getTouchDistance(event.touches);
    if (!nextDistance || !touchDistanceRef.current) return;

    event.preventDefault();
    const factor = nextDistance / touchDistanceRef.current;
    touchDistanceRef.current = nextDistance;
    setZoomLevel((currentZoom) => Math.max(0.72, Math.min(1.65, currentZoom * factor)));
  }

  function handleTouchEnd(event) {
    if (event.touches.length < 2) {
      touchDistanceRef.current = null;
    }

    if (event.touches.length === 0) {
      dragTouchRef.current = null;
    }
  }

  function handleWheel(event) {
    if (Math.abs(event.deltaY) < 2) return;

    const direction = event.deltaY < 0 ? 1 : -1;
    setZoomLevel((currentZoom) => Math.max(0.72, Math.min(1.65, currentZoom + direction * 0.08)));
  }

  const hintTitle = activeZone
    ? `${country.name} · ${activeZone.name}`
    : `${country.name} · ${country.greeting}`;
  const hintBody = activeZone?.hint ?? country.greetingIntro;
  const hintSub = activeZone
    ? `点这里的发光物体，找到 ${activeZone.items.length} 个小发现。`
    : `全景里有 ${country.zones.length} 个区域，可以先选一个靠近看看。`;

  return (
    <main
      className={`game-shell ${selectedItem ? "has-selected-item" : ""}`}
      style={{ "--sky": country.theme.sky }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      <GameHud
        mode="country"
        country={country}
        totalStars={totalStars}
        countryStars={discoveredIds.length}
        countryStarsTotal={country.starsTotal}
        totalStarsTotal={totalStarsTotal}
        soundOn={soundOn}
        onSound={toggleSound}
        onBack={onBack}
      />

      {!unlocked && (
        <StartAudioGate
          onStart={() => {
            unlockAudio();
            window.setTimeout(() => {
              speak(`开始探索${country.name}。${activeZone?.hint ?? country.greetingIntro}`);
            }, 0);
          }}
        />
      )}

      <GameCanvas background={country.theme.sky}>
        <CameraRig view={cameraView} />

        <CountryDiorama
          country={country}
          activeZoneId={activeZoneId}
          selectedItemId={selectedItemId}
          rotationY={sceneRotation}
          discoveredIds={discoveredIds}
          onItemClick={handleItemClick}
          onClearSelection={() => setSelectedItemId(null)}
        />
      </GameCanvas>

      <aside className="country-mini-hint">
        <div className="mini-badge">{country.name}</div>
        <h1>{hintTitle}</h1>
        <p>{hintBody}</p>
        <p className="mini-sub">{hintSub}</p>
      </aside>

      <ZoneNav
        zones={country.zones}
        activeZoneId={activeZoneId}
        onSelectZone={(zoneId) => {
          const zone = country.zones.find((entry) => entry.id === zoneId);
          setSelectedItemId(null);
          setActiveZoneId(zoneId);
          playTone("tap");
          speak(zone ? `${zone.name}。${zone.hint}` : "");
        }}
        onOverview={() => {
          setSelectedItemId(null);
          setActiveZoneId(null);
          playTone("tap");
          speak(`这是${country.name}的全景。你可以选择一个区域靠近看看。`);
        }}
      />

      <div className="touch-gesture-hint country-touch-hint" aria-hidden="true">
        <span className="finger-dot" />
        <span className="finger-dot second" />
        <span className="gesture-line" />
      </div>

      {selectedItem && (
        <ItemInfoCard
          item={selectedItem}
          country={country}
          completed={discoveredIds.includes(selectedItem.id)}
          onReplay={() => playItemAudio(selectedItem.id)}
          onClose={() => setSelectedItemId(null)}
        />
      )}
    </main>
  );
}
