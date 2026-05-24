import React, { useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import * as THREE from "three";
import { MODEL_PATHS } from "../data/countries.js";
import { PlaceholderModel } from "./PlaceholderModel.jsx";

MODEL_PATHS.forEach((path) => useGLTF.preload(path));

function toStandardMaterial(material) {
  if (!material) return material;

  if (Array.isArray(material)) {
    return material.map(toStandardMaterial);
  }

  if (!material.isMeshBasicMaterial) {
    return material.clone ? material.clone() : material;
  }

  return new THREE.MeshStandardMaterial({
    color: material.color ?? new THREE.Color("#ffffff"),
    map: material.map ?? null,
    roughness: 0.6,
    metalness: 0.05,
  });
}

export function ItemModel({ src, fallbackType, dimmed = false, item }) {
  const resolvedItem = item || { model: src, fallbackType };
  const modelSrc = src ?? resolvedItem.model;
  const modelType = fallbackType ?? resolvedItem.fallbackType;

  if (!modelSrc) {
    return <PlaceholderModel type={modelType} item={resolvedItem} dimmed={dimmed} />;
  }

  return <GLBModel src={modelSrc} dimmed={dimmed} />;
}

function GLBModel({ src, dimmed }) {
  const gltf = useGLTF(src);

  const scene = useMemo(() => {
    const model = clone(gltf.scene);
    const wrapper = new THREE.Group();
    wrapper.add(model);

    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);

    const largest = Math.max(size.x, size.y, size.z) || 1;
    model.scale.setScalar(1.55 / largest);

    const grounded = new THREE.Box3().setFromObject(model);
    model.position.y -= grounded.min.y;

    return wrapper;
  }, [gltf.scene]);

  useEffect(() => {
    scene.traverse((object) => {
      if (!object.isMesh) return;

      object.castShadow = true;
      object.receiveShadow = true;
      object.material = toStandardMaterial(object.material);

      if (!object.material) return;

      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];

      for (const material of materials) {
        material.transparent = dimmed;
        material.opacity = dimmed ? 0.45 : 1;
        material.depthWrite = !dimmed;
        material.needsUpdate = true;
      }
    });
  }, [scene, dimmed]);

  return <primitive object={scene} />;
}
