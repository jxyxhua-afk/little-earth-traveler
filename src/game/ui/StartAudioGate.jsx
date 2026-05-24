import React, { useEffect, useRef } from "react";

export function StartAudioGate({ unlocked = false, soundOn = true, onStart }) {
  const startedRef = useRef(false);

  function handleStart(event) {
    event?.preventDefault?.();
    event?.stopPropagation?.();

    if (startedRef.current) return;
    startedRef.current = true;
    onStart?.();
  }

  useEffect(() => {
    if (unlocked || !soundOn) return undefined;

    function handleGlobalTouch(event) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (!target.closest(".audio-gate")) return;
      handleStart(event);
    }

    window.addEventListener("touchend", handleGlobalTouch, { passive: false });

    return () => {
      window.removeEventListener("touchend", handleGlobalTouch);
    };
  }, [unlocked, soundOn, onStart]);

  if (unlocked || !soundOn) return null;

  return (
    <button
      className="audio-gate"
      onClick={handleStart}
      onPointerDown={handleStart}
      onPointerUp={handleStart}
      onMouseDown={handleStart}
      onTouchEnd={handleStart}
    >
      开启声音
    </button>
  );
}
