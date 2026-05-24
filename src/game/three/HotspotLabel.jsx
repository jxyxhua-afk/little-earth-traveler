import React from "react";
import { Html } from "@react-three/drei";

export function HotspotLabel({
  children,
  text,
  position,
  offset = [0, 1, 0],
  visible = true,
  tone = "light",
  completed = false,
  onClick
}) {
  if (!visible) return null;

  const labelPosition = position || offset;
  const labelText = text ?? children;
  const labelTone = completed ? "completed" : tone;

  return (
    <Html
      position={labelPosition}
      center
      occlude={!onClick}
      distanceFactor={8}
      zIndexRange={[120, 0]}
    >
      <div
        className={`hotspot-label ${labelTone} ${onClick ? "clickable" : ""}`}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onClick={onClick}
        onKeyDown={(event) => {
          if (!onClick) return;
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          onClick(event);
        }}
      >
        {completed ? "⭐ " : ""}
        {labelText}
      </div>
    </Html>
  );
}
