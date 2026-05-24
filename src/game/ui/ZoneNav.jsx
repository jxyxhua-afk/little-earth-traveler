import React from "react";

const ZONE_ICONS = {
  overview: "🌍",
  landmark: "🏛️",
  city: "🏙️",
  school: "🚌",
  street: "🍔",
  playground: "🏀",
  rainforest: "🌳",
  football: "⚽",
  music: "🥁",
  bakery: "🥖",
  art: "🎨",
  language: "💬",
  animal: "🐼",
  food: "🍽️",
  train: "🚄",
  coast: "🌊",
  desert: "🏜️",
  river: "💧",
  savanna: "🦁",
  safari: "🚙"
};

function zoneIcon(zoneId) {
  return ZONE_ICONS[zoneId] || "✨";
}

export function ZoneNav({ zones, activeZoneId, onSelectZone, onOverview, onZone }) {
  const selectZone = onSelectZone || onZone;

  return (
    <nav className="zone-nav" aria-label="国家区域">
      {onOverview && (
        <button
          className={activeZoneId === null ? "active" : ""}
          onClick={onOverview}
          aria-label="总览"
        >
          <span className="zone-icon" aria-hidden="true">{zoneIcon("overview")}</span>
          <span className="zone-text">总览</span>
        </button>
      )}
      {zones.map((zone) => (
        <button
          key={zone.id}
          className={zone.id === activeZoneId ? "active" : ""}
          onClick={() => selectZone(zone.id)}
          aria-label={zone.name}
        >
          <span className="zone-icon" aria-hidden="true">{zoneIcon(zone.id)}</span>
          <span className="zone-text">{zone.name}</span>
        </button>
      ))}
    </nav>
  );
}
