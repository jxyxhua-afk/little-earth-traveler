import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { PHYSICS_TUNING } from "./physicsTuningConfig.js";

const dragPlaneNormal = new THREE.Vector3(0, 1, 0);
const scratchPoint = new THREE.Vector3();

function clampMagnitude(x, z, max) {
  const length = Math.hypot(x, z);
  if (length <= max || length === 0) return { x, z };
  const scale = max / length;
  return { x: x * scale, z: z * scale };
}

export function DraggableRigidBody({
  id,
  initialPosition,
  initialRotation = [0, 0, 0],
  resetToken,
  children,
  onDragChange,
  tuning = PHYSICS_TUNING,
  ...rigidBodyProps
}) {
  const bodyRef = useRef(null);
  const draggingRef = useRef(false);
  const targetRef = useRef(new THREE.Vector3(...initialPosition));
  const planeRef = useRef(new THREE.Plane(dragPlaneNormal, -initialPosition[1]));

  const initialQuaternion = useMemo(() => {
    return new THREE.Quaternion().setFromEuler(new THREE.Euler(...initialRotation));
  }, [initialRotation]);

  const resetBody = useCallback(() => {
    const body = bodyRef.current;
    if (!body) return;

    body.setTranslation(
      { x: initialPosition[0], y: initialPosition[1], z: initialPosition[2] },
      true
    );
    body.setRotation(initialQuaternion, true);
    body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    body.setAngvel({ x: 0, y: 0, z: 0 }, true);
    body.setLinearDamping(tuning.linearDamping);
    body.setAngularDamping(tuning.angularDamping);
    body.wakeUp();
    targetRef.current.set(...initialPosition);
  }, [initialPosition, initialQuaternion, tuning.angularDamping, tuning.linearDamping]);

  useEffect(() => {
    resetBody();
  }, [resetBody, resetToken]);

  function updateDragTarget(event) {
    if (event.ray.intersectPlane(planeRef.current, scratchPoint)) {
      targetRef.current.copy(scratchPoint);
    }
  }

  const finishDrag = useCallback(() => {
    if (!draggingRef.current) return;
    draggingRef.current = false;

    const body = bodyRef.current;
    if (body) {
      body.setLinearDamping(tuning.linearDamping);
      body.setAngularDamping(tuning.angularDamping);
      body.wakeUp();
    }

    onDragChange?.(null);
  }, [onDragChange, tuning.angularDamping, tuning.linearDamping]);

  useEffect(() => {
    window.addEventListener("pointerup", finishDrag);
    window.addEventListener("pointercancel", finishDrag);

    return () => {
      window.removeEventListener("pointerup", finishDrag);
      window.removeEventListener("pointercancel", finishDrag);
    };
  }, [finishDrag]);

  function handlePointerDown(event) {
    event.stopPropagation();
    const body = bodyRef.current;
    if (!body) return;

    const position = body.translation();
    planeRef.current.set(dragPlaneNormal, -position.y);
    updateDragTarget(event);
    draggingRef.current = true;
    body.setLinearDamping(tuning.dragLinearDamping);
    body.setAngularDamping(tuning.dragAngularDamping);
    body.wakeUp();
    onDragChange?.(id);

    try {
      event.target.setPointerCapture(event.pointerId);
    } catch {
      // Some embedded browsers do not expose pointer capture for WebGL events.
    }
  }

  function handlePointerMove(event) {
    if (!draggingRef.current) return;
    event.stopPropagation();
    updateDragTarget(event);
  }

  function handlePointerUp(event) {
    if (!draggingRef.current) return;
    event.stopPropagation();
    finishDrag();

    try {
      event.target.releasePointerCapture(event.pointerId);
    } catch {
      // No-op; pointer capture is a convenience, not required for the lab.
    }
  }

  useFrame(() => {
    const body = bodyRef.current;
    if (!body) return;

    const position = body.translation();
    if (
      Math.abs(position.x) > tuning.boundaryLimitX ||
      Math.abs(position.z) > tuning.boundaryLimitZ ||
      position.y < -1.4 ||
      position.y > tuning.boundaryLimitY
    ) {
      draggingRef.current = false;
      resetBody();
      onDragChange?.(null);
      return;
    }

    if (!draggingRef.current) return;

    const linvel = body.linvel();
    const desired = clampMagnitude(
      (targetRef.current.x - position.x) * tuning.dragSpring,
      (targetRef.current.z - position.z) * tuning.dragSpring,
      tuning.maxDragSpeed
    );

    body.setLinvel(
      {
        x: desired.x,
        y: THREE.MathUtils.clamp(linvel.y, -6, 4),
        z: desired.z
      },
      true
    );
  });

  return (
    <RigidBody
      ref={bodyRef}
      position={initialPosition}
      rotation={initialRotation}
      linearDamping={tuning.linearDamping}
      angularDamping={tuning.angularDamping}
      canSleep={false}
      ccd
      {...rigidBodyProps}
    >
      <group
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {children}
      </group>
    </RigidBody>
  );
}
