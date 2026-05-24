import React, { useRef, useState } from "react";
import { Float } from "@react-three/drei";
import { ItemModel } from "./ItemModel.jsx";
import { HotspotLabel } from "./HotspotLabel.jsx";

function normalizeScale(scale) {
  if (Array.isArray(scale)) return scale;
  return [scale, scale, scale];
}

function multiplyScale(scale, factor) {
  const s = normalizeScale(scale);
  return [s[0] * factor, s[1] * factor, s[2] * factor];
}

export function InteractiveItem({
  item,
  visibleEmphasis,
  visibleLabel,
  selected,
  completed,
  discovered,
  onClick,
  onSelect,
}) {
  const [hovered, setHovered] = useState(false);
  const pointerStartRef = useRef(null);
  const lastTriggerRef = useRef(0);
  const isCompleted = completed ?? discovered ?? false;
  const emphasized = visibleEmphasis ?? visibleLabel ?? false;
  const showLabel = Boolean(hovered || selected || isCompleted || visibleLabel);
  const scale = selected
    ? multiplyScale(item.scale, 1.12)
    : normalizeScale(item.scale);

  function handleClick() {
    if (onClick) {
      onClick();
      return;
    }

    onSelect?.(item);
  }

  function triggerItem(event) {
    event?.stopPropagation?.();

    const now = performance.now();
    if (now - lastTriggerRef.current < 260) return;

    lastTriggerRef.current = now;
    handleClick();
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
      triggerItem(event);
      return;
    }

    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.hypot(dx, dy) <= 18) {
      triggerItem(event);
    }
  }

  return (
    <group
      position={item.position}
      scale={scale}
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
        triggerItem(event);
      }}
    >
      <Float
        speed={emphasized ? 1.25 : 0.7}
        rotationIntensity={selected ? 0.18 : 0.08}
        floatIntensity={selected ? 0.22 : 0.08}
      >
        <ItemModel
          src={item.model}
          fallbackType={item.fallbackType}
          item={item}
          dimmed={!emphasized && !selected}
        />
      </Float>

      <mesh position={[0, 0.72, 0]} visible={false}>
        <boxGeometry args={[1.25, 1.55, 1.25]} />
        <meshStandardMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <HotspotLabel
        text={item.name}
        visible={showLabel}
        completed={isCompleted}
        offset={item.labelOffset}
        onClick={(event) => {
          event.stopPropagation();
          handleClick();
        }}
      />
    </group>
  );
}
