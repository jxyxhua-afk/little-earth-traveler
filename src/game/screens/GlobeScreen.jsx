import React, { useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { GLOBE_MARKERS } from "../data/countries.js";
import { getCountryUiConfig } from "../data/countryConfig.js";
import { useGameAudio } from "../hooks/useGameAudio.js";
import { GameHud } from "../ui/GameHud.jsx";
import { GameCanvas } from "../three/GameCanvas.jsx";
import { HotspotLabel } from "../three/HotspotLabel.jsx";

export function GlobeScreen({ countries, totalStars, totalStarsTotal, onEnterCountry }) {
  const audio = useGameAudio();
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);
  const availableMarkers = useMemo(() => {
    return GLOBE_MARKERS.filter((marker) => countries[marker.id]);
  }, [countries]);
  const selectedMarker = useMemo(() => {
    return availableMarkers.find((marker) => marker.id === selectedMarkerId) ?? null;
  }, [availableMarkers, selectedMarkerId]);
  const selectedCountryInfo = selectedMarker
    ? getCountryUiConfig(selectedMarker.id, selectedMarker)
    : null;

  const chooseMarker = (marker) => {
    const country = countries[marker.id];
    if (!country) {
      audio.playTone("tap");
      setSelectedMarkerId(marker.id);
      return;
    }

    setSelectedMarkerId(marker.id);
    audio.playTone("tap");
  };

  const closeCountryPopover = () => {
    setSelectedMarkerId(null);
  };

  const handleEnterScene = () => {
    if (!selectedCountryInfo) return;
    console.log("[CountryPreview] enter", {
      id: selectedCountryInfo.id,
      sceneId: selectedCountryInfo.sceneId
    });

    if (selectedCountryInfo.id === "china" || selectedCountryInfo.id === "egypt") {
      onEnterCountry?.(selectedCountryInfo.id);
    }
  };

  return (
    <main className={`little-earth-game ${selectedCountryInfo ? "has-globe-popover" : ""}`}>
      <button className="globe-back-button" onClick={closeCountryPopover} aria-label="返回">
        ←
      </button>

      <GameHud
        mode="globe"
        title="地球转起来"
        subtitle="点国家"
        stars={`${totalStars}/${totalStarsTotal}`}
        soundOn={audio.soundOn}
        onSound={audio.toggleSound}
      />

      <section className="screen globe-screen">
        <GameCanvas sky="#bfe3ff" onPointerMissed={closeCountryPopover}>
          <GlobeWorld markers={availableMarkers} countries={countries} selectedId={selectedMarkerId} scale={0.92} onMarker={chooseMarker} />
        </GameCanvas>

        {selectedCountryInfo && (
          <GlobeCountryPopover country={selectedCountryInfo} onEnter={handleEnterScene} />
        )}

        <div className="touch-gesture-hint" aria-hidden="true">
          <span className="finger-dot" />
          <span className="finger-dot second" />
          <span className="gesture-line" />
        </div>

        <button className="local-trip-button" onClick={() => audio.speak("从大河坎出发，先看中国，再看世界。")}>
          从大河坎出发
        </button>
      </section>
    </main>
  );
}

function GlobeCountryPopover({ country, onEnter }) {
  return (
    <section className="globe-country-popover" aria-live="polite">
      <div className="globe-popover-emoji" aria-hidden="true">
        {country.emoji}
      </div>
      <div className="globe-popover-copy">
        <h2>{country.name}</h2>
        <p>{country.shortHint}</p>
      </div>
      <button className="globe-popover-button" onClick={onEnter}>
        进去玩
      </button>
    </section>
  );
}

function GlobeWorld({ markers, countries, selectedId, scale, onMarker }) {
  const texture = useMemo(() => makeEarthTexture(), []);
  const { size } = useThree();
  const responsiveScale = size.width < 560 ? 0.72 : size.width < 900 ? 0.82 : scale;

  return (
    <>
      <group scale={responsiveScale} rotation={[0.1, -0.45, 0]}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[2, 128, 80]} />
          <meshStandardMaterial map={texture} roughness={0.78} metalness={0.02} />
        </mesh>
        <mesh>
          <sphereGeometry args={[2.08, 64, 32]} />
          <meshStandardMaterial color="#b9f7ff" transparent opacity={0.22} side={THREE.BackSide} roughness={0.9} />
        </mesh>
        <mesh>
          <sphereGeometry args={[2.015, 48, 24]} />
          <meshStandardMaterial color="#ffffff" wireframe transparent opacity={0.1} roughness={1} />
        </mesh>
        {markers.map((marker) => (
          <CountryMarker
            key={marker.id}
            marker={marker}
            countries={countries}
            selected={selectedId === marker.id}
            onMarker={onMarker}
          />
        ))}
      </group>
      <OrbitControls enablePan={false} enableDamping dampingFactor={0.08} minDistance={3.8} maxDistance={7.6} />
    </>
  );
}

function CountryMarker({ marker, countries, selected, onMarker }) {
  const [hovered, setHovered] = useState(false);
  const pulseRef = useRef(null);
  const pointerStartRef = useRef(null);
  const lastTriggerRef = useRef(0);
  const position = latLonToVector(marker.lat, marker.lon, 2.14);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), position.clone().normalize());
  const hasScene = Boolean(countries[marker.id]);

  useFrame(({ clock }) => {
    if (!pulseRef.current) return;

    const base = selected ? 1.18 : 1;
    const pulse = base + Math.sin(clock.elapsedTime * 3.2 + marker.lat * 0.04) * 0.08;
    pulseRef.current.scale.setScalar(pulse);
  });

  function triggerMarker(event) {
    event?.stopPropagation?.();

    const now = performance.now();
    if (now - lastTriggerRef.current < 260) return;

    lastTriggerRef.current = now;
    onMarker(marker);
  }

  function handlePointerDown(event) {
    event.stopPropagation();
    pointerStartRef.current = {
      x: event.clientX,
      y: event.clientY
    };
  }

  function handlePointerUp(event) {
    event.stopPropagation();

    const start = pointerStartRef.current;
    pointerStartRef.current = null;

    if (!start) {
      triggerMarker(event);
      return;
    }

    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.hypot(dx, dy) <= 18) {
      triggerMarker(event);
    }
  }

  return (
    <group
      position={position}
      quaternion={quaternion}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={(event) => {
        event.stopPropagation();
        setHovered(false);
      }}
      onClick={(event) => {
        triggerMarker(event);
      }}
    >
      <mesh castShadow position={[0, 0.1, 0]}>
        <sphereGeometry args={[selected ? 0.15 : 0.11, 24, 16]} />
        <meshStandardMaterial color={marker.color} emissive={marker.color} emissiveIntensity={selected ? 0.65 : 0.35} />
      </mesh>
      <mesh ref={pulseRef} position={[0, 0.09, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[selected ? 0.25 : 0.19, 0.014, 8, 40]} />
        <meshStandardMaterial color={marker.color} emissive={marker.color} emissiveIntensity={0.25} transparent opacity={hasScene ? 0.92 : 0.45} />
      </mesh>
      <mesh visible={false} position={[0, 0.16, 0]}>
        <sphereGeometry args={[0.55, 16, 12]} />
        <meshStandardMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <HotspotLabel
        position={[0, 0.5, 0]}
        visible={selected || hovered}
        tone={selected ? "warm" : "light"}
        onClick={(event) => {
          event.stopPropagation();
          onMarker(marker);
        }}
      >
        {marker.name} {marker.greeting}
      </HotspotLabel>
    </group>
  );
}

function makeEarthTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1600;
  canvas.height = 800;
  const ctx = canvas.getContext("2d");
  const ocean = ctx.createLinearGradient(0, 0, 0, canvas.height);
  ocean.addColorStop(0, "#79e6f0");
  ocean.addColorStop(1, "#20b9c4");
  ctx.fillStyle = ocean;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawLand(ctx, [[103, 35], [125, 48], [135, 30], [105, 18], [78, 28]], "#7ed957");
  drawLand(ctx, [[138, 36], [146, 45], [151, 34], [142, 27]], "#a6e77d");
  drawLand(ctx, [[2, 46], [20, 56], [40, 42], [15, 34], [-8, 42]], "#8ade71");
  drawLand(ctx, [[-97, 38], [-125, 50], [-119, 25], [-75, 24], [-68, 45]], "#b8e86b");
  drawLand(ctx, [[133, -25], [112, -12], [153, -10], [148, -38], [118, -35]], "#a0df7a");
  drawLand(ctx, [[30, 26], [14, 33], [35, 37], [45, 25], [35, 15]], "#ffd166");
  drawLand(ctx, [[-51, -14], [-72, 4], [-38, 0], [-36, -25], [-55, -34]], "#67d876");
  drawLand(ctx, [[38, 0], [23, 12], [29, -14], [49, -9], [48, 10]], "#7ed957");
  ctx.strokeStyle = "rgba(255,255,255,0.28)";
  ctx.lineWidth = 2;
  for (let lon = -180; lon <= 180; lon += 30) {
    const x = ((lon + 180) / 360) * canvas.width;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let lat = -60; lat <= 60; lat += 30) {
    const y = ((90 - lat) / 180) * canvas.height;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  return new THREE.CanvasTexture(canvas);
}

function drawLand(ctx, points, color) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const toXY = ([lon, lat]) => [((lon + 180) / 360) * width, ((90 - lat) / 180) * height];
  ctx.beginPath();
  points.forEach((point, index) => {
    const [x, y] = toXY(point);
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.7)";
  ctx.lineWidth = 8;
  ctx.stroke();
}

function latLonToVector(lat, lon, radius) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon + 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}
