import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Howl, Howler } from "howler";

let globalAudioUnlocked = false;

export function useGameAudio(country = null) {
  const [soundOn, setSoundOn] = useState(() => readSoundSetting() !== "off");
  const [unlocked, setUnlocked] = useState(() => globalAudioUnlocked);
  const synthTimer = useRef(null);

  const sounds = useMemo(() => {
    const map = {};

    for (const item of country?.items ?? []) {
      const audio = item.audio || item.sound;
      if (!audio) continue;

      map[item.id] = new Howl({
        src: [audio],
        preload: true,
        volume: 0.85,
      });
    }

    return map;
  }, [country]);

  const unlockAudio = useCallback(async () => {
    globalAudioUnlocked = true;
    setUnlocked(true);

    try {
      if (Howler.ctx?.state === "suspended") {
        await Howler.ctx.resume();
      }
    } catch {
      // ignore unlock failures; user can still continue visually
    }
  }, []);

  const speak = useCallback((text, voice = {}) => {
    if (!soundOn || !text || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voice.lang || "zh-CN";
    utterance.rate = voice.rate ?? 0.86;
    utterance.pitch = voice.pitch ?? 1.05;
    window.speechSynthesis.speak(utterance);
  }, [soundOn]);

  const playTone = useCallback((kind = "tap") => {
    if (!soundOn) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const context = new AudioContext();
    const now = context.currentTime;
    const notes = {
      tap: [520],
      happy: [523, 659, 784],
      zoom: [420, 520],
      star: [660, 880],
      wrong: [220, 180]
    }[kind] || [520];

    notes.forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = kind === "wrong" ? "triangle" : "sine";
      oscillator.frequency.setValueAtTime(frequency, now + index * 0.07);
      gain.gain.setValueAtTime(0.0001, now + index * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.11, now + index * 0.07 + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.07 + 0.18);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(now + index * 0.07);
      oscillator.stop(now + index * 0.07 + 0.2);
    });

    synthTimer.current = window.setTimeout(() => context.close(), 650);
  }, [soundOn]);

  const playAudioFile = useCallback((url, fallbackKind = "tap") => {
    if (!soundOn || !url) {
      playTone(fallbackKind);
      return;
    }

    try {
      const sound = new Howl({
        src: [url],
        volume: 0.85,
      });

      sound.once("loaderror", () => {
        sound.unload();
        playTone(fallbackKind);
      });
      sound.once("playerror", () => {
        sound.unload();
        playTone(fallbackKind);
      });
      sound.once("end", () => sound.unload());
      sound.play();
    } catch {
      playTone(fallbackKind);
    }
  }, [playTone, soundOn]);

  const playItemAudio = useCallback((itemId) => {
    if (!soundOn || !unlocked) return;

    const item = country?.items?.find((entry) => entry.id === itemId);
    if (!item) {
      playTone("tap");
      return;
    }

    const sound = sounds[item.id];
    if (sound) {
      sound.stop();
      sound.play();
    } else {
      playTone(item.fallbackType);
    }

    speak(item.intro, item.id === "hello" || item.name === "Hello" ? { lang: "en-US", pitch: 1.14 } : {});
  }, [country, playTone, soundOn, sounds, speak, unlocked]);

  const toggleSound = useCallback(() => {
    const next = !soundOn;
    setSoundOn(next);
    writeSoundSetting(next ? "on" : "off");
    if (!next && "speechSynthesis" in window) window.speechSynthesis.cancel();
    if (next) {
      unlockAudio();
      window.setTimeout(() => speak("声音打开"), 0);
    }
  }, [soundOn, speak, unlockAudio]);

  useEffect(() => () => {
    if (synthTimer.current) window.clearTimeout(synthTimer.current);
  }, []);

  useEffect(() => {
    return () => {
      Object.values(sounds).forEach((sound) => sound.unload());
    };
  }, [sounds]);

  return {
    soundOn,
    unlocked,
    unlock: unlockAudio,
    unlockAudio,
    speak,
    playTone,
    playAudioFile,
    playItemAudio,
    toggleSound
  };
}

function readSoundSetting() {
  try {
    return window.localStorage?.getItem("earthTravelerSound");
  } catch {
    return null;
  }
}

function writeSoundSetting(value) {
  try {
    window.localStorage?.setItem("earthTravelerSound", value);
  } catch {
    // Some embedded browsers expose storage read-only. Sound still works for the current session.
  }
}
