const MIN_IMPACT_INTENSITY = 0.08;
const OBJECT_COOLDOWN_MS = 150;
const GLOBAL_WINDOW_MS = 100;
const MAX_GLOBAL_IMPACTS = 4;
const MASTER_VOLUME = 0.34;

function clamp01(value) {
  return Math.min(1, Math.max(0, value));
}

function shapeImpactIntensity(value) {
  const safeValue = clamp01(value);
  if (safeValue < MIN_IMPACT_INTENSITY) return 0;

  const normalized = (safeValue - MIN_IMPACT_INTENSITY) / (1 - MIN_IMPACT_INTENSITY);
  return Math.pow(normalized, 0.85);
}

function getAudioContextClass() {
  return window.AudioContext || window.webkitAudioContext;
}

export class PhysicsAudioEngine {
  constructor() {
    this.context = null;
    this.masterGain = null;
    this.muted = false;
    this.objectImpactTimes = new Map();
    this.globalImpactTimes = [];
  }

  async ensureStarted() {
    if (typeof window === "undefined") return false;

    if (!this.context) {
      const AudioContextClass = getAudioContextClass();
      if (!AudioContextClass) return false;

      this.context = new AudioContextClass();
      this.masterGain = this.context.createGain();
      this.masterGain.gain.value = MASTER_VOLUME;
      this.masterGain.connect(this.context.destination);
    }

    if (this.context.state === "suspended") {
      await this.context.resume();
    }

    return this.context.state === "running";
  }

  setMuted(muted) {
    this.muted = muted;
  }

  playImpact(type, intensity, sourceId = type) {
    const safeIntensity = clamp01(intensity);
    if (this.muted || safeIntensity < MIN_IMPACT_INTENSITY || !this.context || !this.masterGain) {
      return;
    }

    const nowMs = performance.now();
    const lastObjectTime = this.objectImpactTimes.get(sourceId) ?? -Infinity;
    if (nowMs - lastObjectTime < OBJECT_COOLDOWN_MS) return;

    this.globalImpactTimes = this.globalImpactTimes.filter(
      (time) => nowMs - time < GLOBAL_WINDOW_MS
    );
    if (this.globalImpactTimes.length >= MAX_GLOBAL_IMPACTS) return;

    this.objectImpactTimes.set(sourceId, nowMs);
    this.globalImpactTimes.push(nowMs);

    if (this.context.state === "suspended") {
      this.context.resume().catch(() => {});
    }

    const soundType = ["car", "truck", "ball", "box", "generic"].includes(type)
      ? type
      : "generic";
    this.playImpactTone(soundType, shapeImpactIntensity(safeIntensity));
  }

  playUi(type = "click") {
    if (this.muted || !this.context || !this.masterGain) return;

    if (this.context.state === "suspended") {
      this.context.resume().catch(() => {});
    }

    const now = this.context.currentTime;
    const gain = this.context.createGain();
    const oscillator = this.context.createOscillator();
    const filter = this.context.createBiquadFilter();

    const baseFrequency = type === "reset" ? 520 : 640;
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(baseFrequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(baseFrequency * 1.28, now + 0.08);

    filter.type = "lowpass";
    filter.frequency.value = 1800;

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.08, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    oscillator.start(now);
    oscillator.stop(now + 0.16);
  }

  playImpactTone(type, intensity) {
    const now = this.context.currentTime;

    if (type === "car") {
      this.playTone({
        type: "triangle",
        frequency: 620 + intensity * 360,
        endFrequency: 360 + intensity * 120,
        gain: 0.055 + intensity * 0.13,
        duration: 0.085,
        filterType: "bandpass",
        filterFrequency: 1350 + intensity * 260
      });
      this.playNoiseBurst(now, 0.035, 0.018 + intensity * 0.052, "highpass", 1100);
      return;
    }

    if (type === "truck") {
      this.playTone({
        type: "sawtooth",
        frequency: 118 + intensity * 62,
        endFrequency: 68 + intensity * 24,
        gain: 0.075 + intensity * 0.16,
        duration: 0.2,
        filterType: "lowpass",
        filterFrequency: 360 + intensity * 120
      });
      this.playNoiseBurst(now, 0.105, 0.026 + intensity * 0.058, "lowpass", 300);
      return;
    }

    if (type === "ball") {
      this.playTone({
        type: "sine",
        frequency: 900 + intensity * 360,
        endFrequency: 430 + intensity * 140,
        gain: 0.052 + intensity * 0.135,
        duration: 0.2,
        filterType: "lowpass",
        filterFrequency: 2600
      });
      return;
    }

    if (type === "box") {
      this.playTone({
        type: "triangle",
        frequency: 235 + intensity * 54,
        endFrequency: 112 + intensity * 24,
        gain: 0.06 + intensity * 0.105,
        duration: 0.095,
        filterType: "lowpass",
        filterFrequency: 520 + intensity * 100
      });
      this.playNoiseBurst(now, 0.06, 0.022 + intensity * 0.045, "bandpass", 360);
      return;
    }

    this.playTone({
      type: "triangle",
      frequency: 360 + intensity * 140,
      endFrequency: 190 + intensity * 70,
      gain: 0.05 + intensity * 0.1,
      duration: 0.1,
      filterType: "lowpass",
      filterFrequency: 900
    });
  }

  playTone({
    type,
    frequency,
    endFrequency,
    gain,
    duration,
    filterType,
    filterFrequency
  }) {
    const now = this.context.currentTime;
    const oscillator = this.context.createOscillator();
    const filter = this.context.createBiquadFilter();
    const envelope = this.context.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, endFrequency), now + duration);

    filter.type = filterType;
    filter.frequency.value = filterFrequency;
    filter.Q.value = filterType === "bandpass" ? 0.85 : 0.35;

    envelope.gain.setValueAtTime(0.0001, now);
    envelope.gain.exponentialRampToValueAtTime(gain, now + 0.008);
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    oscillator.connect(filter);
    filter.connect(envelope);
    envelope.connect(this.masterGain);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.02);
  }

  playNoiseBurst(now, duration, gainValue, filterType, filterFrequency) {
    const sampleRate = this.context.sampleRate;
    const buffer = this.context.createBuffer(1, Math.floor(sampleRate * duration), sampleRate);
    const channel = buffer.getChannelData(0);

    for (let index = 0; index < channel.length; index += 1) {
      channel[index] = (Math.random() * 2 - 1) * (1 - index / channel.length);
    }

    const source = this.context.createBufferSource();
    const filter = this.context.createBiquadFilter();
    const gain = this.context.createGain();

    source.buffer = buffer;
    filter.type = filterType;
    filter.frequency.value = filterFrequency;
    filter.Q.value = filterType === "bandpass" ? 0.8 : 0.4;

    gain.gain.setValueAtTime(gainValue, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    source.start(now);
    source.stop(now + duration + 0.01);
  }
}
