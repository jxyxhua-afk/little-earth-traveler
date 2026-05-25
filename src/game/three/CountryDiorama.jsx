import React from "react";
import { CountryEnvironment } from "./CountryEnvironment.jsx";
import { InteractiveItem } from "./InteractiveItem.jsx";

export function CountryDiorama({
  country,
  displayItems,
  activeZone,
  activeZoneId,
  selectedItemId,
  rotationY = 0,
  discoveredIds = [],
  onItem,
  onItemClick,
  onClearSelection
}) {
  const resolvedZone = activeZone || country.zones.find((zone) => zone.id === activeZoneId) || null;
  const activeIds = new Set(resolvedZone?.items || []);
  const isOverview = !resolvedZone;
  const clickItem = onItemClick || onItem;
  const visibleItems = displayItems || (resolvedZone
    ? country.items.filter((item) => activeIds.has(item.id) || item.id === selectedItemId)
    : country.items);

  return (
    <group rotation={[0, rotationY, 0]} onClick={() => onClearSelection?.()}>
      <CountryEnvironment country={country} activeZoneId={resolvedZone?.id ?? null} />
      {visibleItems.map((item) => (
        <InteractiveItem
          key={item.id}
          item={item}
          visibleEmphasis={isOverview || activeIds.has(item.id)}
          completed={discoveredIds.includes(item.id)}
          selected={selectedItemId === item.id}
          onClick={() => clickItem?.(item)}
        />
      ))}
    </group>
  );
}
