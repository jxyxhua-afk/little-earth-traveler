import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { RigidBodyType } from "@dimforge/rapier3d-compat";
import * as THREE from "three";
import { PHYSICS_TUNING } from "./physicsTuningConfig.js";

const dragPlaneNormal = new THREE.Vector3(0, 1, 0);
const scratchPoint = new THREE.Vector3();
const scratchSortPosition = new THREE.Vector3();
const scratchSortQuaternion = new THREE.Quaternion();

function clampMagnitude(x, z, max) {
  const length = Math.hypot(x, z);
  if (length <= max || length === 0) return { x, z };
  const scale = max / length;
  return { x: x * scale, z: z * scale };
}

export function DraggableRigidBody({
  id,
  audioType = "generic",
  initialPosition,
  initialRotation = [0, 0, 0],
  resetToken,
  children,
  onDragChange,
  onImpact,
  onInteractionStart,
  onSortComplete,
  sortToken = 0,
  sortDuration = 1.8,
  sortLift = 0.32,
  dragLift = PHYSICS_TUNING.dragLift,
  tuning = PHYSICS_TUNING,
  ...rigidBodyProps
}) {
  const bodyRef = useRef(null);
  const draggingRef = useRef(false);
  const sortingRef = useRef(false);
  const targetRef = useRef(new THREE.Vector3(...initialPosition));
  const planeRef = useRef(new THREE.Plane(dragPlaneNormal, -initialPosition[1]));
  const dragTargetYRef = useRef(initialPosition[1]);
  const lastSortTokenRef = useRef(sortToken);
  const sortStartTimeRef = useRef(0);
  const sortStartPositionRef = useRef(new THREE.Vector3(...initialPosition));
  const sortStartQuaternionRef = useRef(new THREE.Quaternion());
  const targetPosition = useMemo(() => new THREE.Vector3(...initialPosition), [initialPosition]);

  const initialQuaternion = useMemo(() => {
    return new THREE.Quaternion().setFromEuler(new THREE.Euler(...initialRotation));
  }, [initialRotation]);

  const resetBody = useCallback(() => {
    const body = bodyRef.current;
    if (!body) return;

    sortingRef.current = false;
    body.setBodyType(RigidBodyType.Dynamic, true);
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

  const startSort = useCallback(() => {
    const body = bodyRef.current;
    if (!body) return;

    draggingRef.current = false;
    onDragChange?.(null);

    const position = body.translation();
    const rotation = body.rotation();
    sortStartPositionRef.current.set(position.x, position.y, position.z);
    sortStartQuaternionRef.current.set(rotation.x, rotation.y, rotation.z, rotation.w);
    sortStartTimeRef.current = performance.now();
    sortingRef.current = true;

    body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    body.setAngvel({ x: 0, y: 0, z: 0 }, true);
    body.setLinearDamping(tuning.dragLinearDamping);
    body.setAngularDamping(tuning.dragAngularDamping);
    body.setBodyType(RigidBodyType.KinematicPositionBased, true);
    body.wakeUp();
  }, [onDragChange, tuning.dragAngularDamping, tuning.dragLinearDamping]);

  useEffect(() => {
    if (sortToken === lastSortTokenRef.current) return;

    lastSortTokenRef.current = sortToken;
    startSort();
  }, [sortToken, startSort]);

  function updateDragTarget(event) {
    if (event.ray.intersectPlane(planeRef.current, scratchPoint)) {
      targetRef.current.set(
        scratchPoint.x,
        dragTargetYRef.current,
        scratchPoint.z
      );
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
    if (sortingRef.current) return;

    const body = bodyRef.current;
    if (!body) return;

    onInteractionStart?.();
    const position = body.translation();
    const movementPlaneY = Math.min(position.y, tuning.dragPlaneY);
    const liftedY = Math.min(
      position.y + dragLift,
      tuning.dragMaxLiftY ?? tuning.boundaryLimitY - 0.4
    );

    planeRef.current.set(dragPlaneNormal, -movementPlaneY);
    dragTargetYRef.current = liftedY;
    targetRef.current.set(position.x, liftedY, position.z);
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
    if (!draggingRef.current || sortingRef.current) return;
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

  function handleCollisionEnter(payload) {
    const body = bodyRef.current;
    if (!body) return;

    const velocity = body.linvel();
    const otherVelocity = payload.other.rigidBody?.linvel?.() ?? { x: 0, y: 0, z: 0 };
    const relativeSpeed = Math.hypot(
      velocity.x - otherVelocity.x,
      velocity.y - otherVelocity.y,
      velocity.z - otherVelocity.z
    );
    const intensity = Math.min(1, relativeSpeed / 7);

    onImpact?.(audioType, intensity, id);
  }

  useFrame(() => {
    const body = bodyRef.current;
    if (!body) return;

    if (sortingRef.current) {
      const elapsedSeconds = (performance.now() - sortStartTimeRef.current) / 1000;
      const progress = Math.min(1, elapsedSeconds / sortDuration);
      const eased = progress * progress * (3 - 2 * progress);

      scratchSortPosition.lerpVectors(
        sortStartPositionRef.current,
        targetPosition,
        eased
      );
      scratchSortPosition.y += Math.sin(Math.PI * eased) * sortLift;
      scratchSortQuaternion.slerpQuaternions(
        sortStartQuaternionRef.current,
        initialQuaternion,
        eased
      );

      body.setNextKinematicTranslation({
        x: scratchSortPosition.x,
        y: scratchSortPosition.y,
        z: scratchSortPosition.z
      });
      body.setNextKinematicRotation(scratchSortQuaternion);

      if (progress >= 1) {
        sortingRef.current = false;
        body.setNextKinematicTranslation({
          x: targetPosition.x,
          y: targetPosition.y,
          z: targetPosition.z
        });
        body.setNextKinematicRotation(initialQuaternion);
        body.setTranslation(
          { x: targetPosition.x, y: targetPosition.y, z: targetPosition.z },
          true
        );
        body.setRotation(initialQuaternion, true);
        body.setLinvel({ x: 0, y: 0, z: 0 }, true);
        body.setAngvel({ x: 0, y: 0, z: 0 }, true);
        body.setLinearDamping(tuning.linearDamping);
        body.setAngularDamping(tuning.angularDamping);
        body.setBodyType(RigidBodyType.Dynamic, true);
        body.wakeUp();
        onSortComplete?.(id);
      }

      return;
    }

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

    const desired = clampMagnitude(
      (targetRef.current.x - position.x) * tuning.dragSpring,
      (targetRef.current.z - position.z) * tuning.dragSpring,
      tuning.maxDragSpeed
    );
    const desiredY = THREE.MathUtils.clamp(
      (targetRef.current.y - position.y) * tuning.dragSpring,
      -tuning.maxDragVerticalSpeed,
      tuning.maxDragVerticalSpeed
    );

    body.setLinvel(
      {
        x: desired.x,
        y: desiredY,
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
      onCollisionEnter={handleCollisionEnter}
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
