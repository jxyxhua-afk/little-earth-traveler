import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

if (!globalThis.FileReader) {
  globalThis.FileReader = class FileReader {
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then((buffer) => {
        this.result = buffer;
        this.onloadend?.();
      }).catch((error) => {
        this.error = error;
        this.onerror?.(error);
      });
    }
  };
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const modelDir = path.join(rootDir, "public", "models");
const audioDir = path.join(rootDir, "public", "audio");

await fs.mkdir(modelDir, { recursive: true });
await fs.mkdir(audioDir, { recursive: true });

const exporter = new GLTFExporter();

function mat(color, extra = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: extra.roughness ?? 0.52,
    metalness: extra.metalness ?? 0.05,
    emissive: extra.emissive ?? color,
    emissiveIntensity: extra.emissiveIntensity ?? 0.02
  });
}

function mesh(geometry, color, position = [0, 0, 0], scale = [1, 1, 1], rotation = [0, 0, 0], extra = {}) {
  const object = new THREE.Mesh(geometry, mat(color, extra));
  object.position.set(...position);
  object.scale.set(...scale);
  object.rotation.set(...rotation);
  object.castShadow = true;
  object.receiveShadow = true;
  return object;
}

function box(x, y, z, w, h, d, color, extra) {
  return mesh(new THREE.BoxGeometry(w, h, d), color, [x, y, z], [1, 1, 1], [0, 0, 0], extra);
}

async function writeGlb(name, scene) {
  scene.traverse((object) => {
    if (object.isMesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });
  const arrayBuffer = await exporter.parseAsync(scene, { binary: true });
  await fs.writeFile(path.join(modelDir, `${name}.glb`), Buffer.from(arrayBuffer));
}

function makeBus() {
  const group = new THREE.Group();
  group.name = "YellowSchoolBus";
  group.add(box(0, 0.42, 0, 1.42, 0.58, 0.58, "#ffd166"));
  group.add(box(0.12, 0.78, 0, 1.02, 0.24, 0.54, "#ffe7a8"));
  group.add(box(-0.58, 0.48, 0.33, 0.12, 0.18, 0.04, "#ff7d66"));
  group.add(box(0.6, 0.48, 0.33, 0.12, 0.12, 0.04, "#fff8db"));
  group.add(box(0.58, 0.62, 0, 0.04, 0.52, 0.62, "#f0aa24"));
  [-0.34, -0.08, 0.18, 0.44].forEach((x) => {
    group.add(box(x, 0.8, 0.32, 0.17, 0.14, 0.035, "#aef3ff", { emissive: "#7be6ff", emissiveIntensity: 0.08 }));
    group.add(box(x, 0.8, -0.32, 0.17, 0.14, 0.035, "#aef3ff", { emissive: "#7be6ff", emissiveIntensity: 0.08 }));
  });
  [-0.45, 0.48].forEach((x) => {
    [-0.33, 0.33].forEach((z) => {
      const wheel = mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.1, 28), "#223846", [x, 0.17, z], [1, 1, 1], [Math.PI / 2, 0, 0]);
      const hub = mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.108, 18), "#eaf9ff", [x, 0.17, z], [1, 1, 1], [Math.PI / 2, 0, 0]);
      group.add(wheel, hub);
    });
  });
  const sign = mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.035, 8), "#ef4b4b", [-0.74, 0.64, 0.34], [1, 1, 1], [Math.PI / 2, 0, 0]);
  group.add(sign);
  return group;
}

function makeLiberty() {
  const group = new THREE.Group();
  group.name = "LibertyStatue";
  group.add(box(0, 0.09, 0, 0.72, 0.18, 0.72, "#83cdbc"));
  group.add(box(0, 0.29, 0, 0.56, 0.2, 0.56, "#6fc1ae"));
  group.add(box(0, 0.5, 0, 0.4, 0.24, 0.4, "#58b09d"));
  const body = mesh(new THREE.CylinderGeometry(0.2, 0.34, 0.78, 28), "#75d1bd", [0, 0.96, 0]);
  group.add(body);
  for (let i = 0; i < 8; i += 1) {
    const fold = mesh(new THREE.CylinderGeometry(0.012, 0.02, 0.72, 8), "#5cb7a5", [Math.cos(i) * 0.16, 0.95, Math.sin(i) * 0.16]);
    fold.rotation.z = Math.cos(i) * 0.18;
    group.add(fold);
  }
  group.add(mesh(new THREE.SphereGeometry(0.16, 28, 18), "#8fd5c5", [0, 1.43, 0]));
  for (let i = 0; i < 7; i += 1) {
    const angle = -Math.PI * 0.75 + i * (Math.PI * 1.5 / 6);
    const spike = mesh(new THREE.ConeGeometry(0.026, 0.22, 8), "#8fd5c5", [Math.cos(angle) * 0.15, 1.6 + Math.sin(angle) * 0.08, 0.02]);
    spike.rotation.z = -angle;
    group.add(spike);
  }
  const arm = mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.66, 14), "#75d1bd", [0.27, 1.34, 0]);
  arm.rotation.z = -0.62;
  const torch = mesh(new THREE.ConeGeometry(0.09, 0.22, 18), "#ffd166", [0.5, 1.68, 0], [1, 1, 1], [0, 0, 0], { emissive: "#ffb703", emissiveIntensity: 0.65 });
  const tablet = box(-0.28, 1.08, 0.06, 0.25, 0.36, 0.04, "#5fb8a7");
  tablet.rotation.z = 0.16;
  group.add(arm, torch, tablet);
  return group;
}

function makeBurger() {
  const group = new THREE.Group();
  [
    [0.43, 0.18, "#f7c56a", 0.72],
    [0.42, 0.08, "#7ed957", 0.58],
    [0.38, 0.14, "#7a4d2a", 0.45],
    [0.42, 0.1, "#ffd166", 0.32],
    [0.43, 0.18, "#f7c56a", 0.18]
  ].forEach(([radius, height, color, y]) => group.add(mesh(new THREE.CylinderGeometry(radius, radius, height, 42), color, [0, y, 0])));
  for (let i = 0; i < 14; i += 1) {
    group.add(mesh(new THREE.SphereGeometry(0.018, 8, 6), "#fff1bd", [(Math.random() - 0.5) * 0.56, 0.84, (Math.random() - 0.5) * 0.3]));
  }
  return group;
}

function makeBasketball() {
  const group = new THREE.Group();
  group.name = "Basketball";
  group.add(mesh(new THREE.SphereGeometry(0.48, 48, 32), "#f47b20", [0, 0.54, 0], [1, 1, 1], [0, 0, 0], { roughness: 0.44 }));
  [0, Math.PI / 2, Math.PI / 4, -Math.PI / 4].forEach((rotation, index) => {
    const ring = mesh(new THREE.TorusGeometry(0.49, 0.013, 10, 72), "#3f2a1b", [0, 0.54, 0]);
    ring.rotation.set(index === 0 ? Math.PI / 2 : rotation, index === 1 ? Math.PI / 2 : 0, rotation);
    group.add(ring);
  });
  return group;
}

function makeHello() {
  const group = new THREE.Group();
  group.name = "HelloBubble";
  group.add(box(0, 0.72, 0, 1.22, 0.62, 0.08, "#ffffff", { emissive: "#ffffff", emissiveIntensity: 0.06 }));
  const tail = mesh(new THREE.ConeGeometry(0.13, 0.28, 3), "#ffffff", [-0.34, 0.35, 0.02]);
  tail.rotation.z = 0.55;
  group.add(tail);
  const textColor = "#169fb6";
  group.add(box(-0.36, 0.73, 0.08, 0.06, 0.3, 0.04, textColor));
  group.add(box(-0.2, 0.73, 0.08, 0.06, 0.3, 0.04, textColor));
  group.add(box(-0.28, 0.73, 0.08, 0.22, 0.05, 0.04, textColor));
  [-0.02, 0.16, 0.34].forEach((x) => group.add(box(x, 0.72, 0.08, 0.08, 0.3, 0.04, textColor)));
  return group;
}

function makeFlag() {
  const group = new THREE.Group();
  group.name = "UsFlag";
  group.add(mesh(new THREE.CylinderGeometry(0.035, 0.045, 1.42, 18), "#8a9caf", [-0.5, 0.72, 0]));
  for (let i = 0; i < 7; i += 1) {
    const stripe = box(-0.1 + i * 0.095, 1.04 - i * 0.058, 0, 0.14, 0.052, 0.04, i % 2 === 0 ? "#ef4b4b" : "#ffffff");
    stripe.rotation.y = Math.sin(i * 0.65) * 0.12;
    group.add(stripe);
  }
  group.add(box(-0.3, 1.05, 0.03, 0.24, 0.18, 0.045, "#3a5ba8"));
  for (let i = 0; i < 8; i += 1) {
    group.add(mesh(new THREE.SphereGeometry(0.012, 8, 6), "#ffffff", [-0.39 + (i % 4) * 0.055, 1.09 - Math.floor(i / 4) * 0.065, 0.07]));
  }
  return group;
}

function sampleTone(t, notes) {
  let value = 0;
  for (const note of notes) {
    if (t < note.start || t > note.start + note.duration) continue;
    const local = t - note.start;
    const fade = Math.min(1, local / 0.02, (note.duration - local) / 0.04);
    const wave = note.type === "square"
      ? Math.sign(Math.sin(Math.PI * 2 * note.frequency * local))
      : Math.sin(Math.PI * 2 * note.frequency * local);
    value += wave * fade * note.volume;
  }
  return Math.max(-1, Math.min(1, value));
}

async function writeWav(name, duration, sampler) {
  const sampleRate = 44100;
  const sampleCount = Math.floor(duration * sampleRate);
  const buffer = Buffer.alloc(44 + sampleCount * 2);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + sampleCount * 2, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(sampleCount * 2, 40);
  for (let i = 0; i < sampleCount; i += 1) {
    const t = i / sampleRate;
    const value = Math.max(-1, Math.min(1, sampler(t, i)));
    buffer.writeInt16LE(Math.round(value * 32767), 44 + i * 2);
  }
  await fs.writeFile(path.join(audioDir, name), buffer);
}

await Promise.all([
  writeGlb("bus", makeBus()),
  writeGlb("liberty", makeLiberty()),
  writeGlb("burger", makeBurger()),
  writeGlb("basketball", makeBasketball()),
  writeGlb("hello", makeHello()),
  writeGlb("flag", makeFlag())
]);

await Promise.all([
  writeWav("bus.wav", 0.62, (t) => sampleTone(t, [
    { frequency: 330, start: 0.02, duration: 0.16, volume: 0.38, type: "square" },
    { frequency: 392, start: 0.24, duration: 0.16, volume: 0.3, type: "square" }
  ])),
  writeWav("liberty.wav", 0.74, (t) => sampleTone(t, [
    { frequency: 660, start: 0.02, duration: 0.2, volume: 0.3 },
    { frequency: 880, start: 0.18, duration: 0.28, volume: 0.24 },
    { frequency: 1046, start: 0.36, duration: 0.24, volume: 0.16 }
  ])),
  writeWav("burger.wav", 0.6, (t, i) => ((Math.sin(i * 18.13) * 43758.5453) % 1) * 2 * (1 - t / 0.6) * 0.18),
  writeWav("basketball.wav", 0.52, (t) => sampleTone(t, [
    { frequency: 115, start: 0.02, duration: 0.13, volume: 0.45 },
    { frequency: 88, start: 0.23, duration: 0.12, volume: 0.32 }
  ])),
  writeWav("hello.wav", 0.74, (t) => sampleTone(t, [
    { frequency: 523, start: 0.02, duration: 0.13, volume: 0.24 },
    { frequency: 659, start: 0.16, duration: 0.13, volume: 0.24 },
    { frequency: 784, start: 0.3, duration: 0.26, volume: 0.22 }
  ])),
  writeWav("flag.wav", 0.64, (t, i) => {
    const noise = ((Math.sin(i * 9.71) * 23454.123) % 1) * 2 - 1;
    return noise * Math.sin(t * Math.PI * 18) * (1 - t / 0.64) * 0.12;
  })
]);

console.log(`Generated scene assets in ${path.relative(rootDir, modelDir)} and ${path.relative(rootDir, audioDir)}`);
