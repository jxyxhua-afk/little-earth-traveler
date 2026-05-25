export const STAMP_STORAGE_KEY = "little-earth-traveler:stamps";

function getStorage() {
  if (typeof window === "undefined") return null;
  return window.localStorage ?? null;
}

export function getStamps() {
  try {
    const storage = getStorage();
    if (!storage) return {};

    const raw = storage.getItem(STAMP_STORAGE_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    return parsed;
  } catch (error) {
    console.warn("[stampStorage] read failed", error);
    return {};
  }
}

export function hasStamp(id) {
  return Boolean(getStamps()[id]);
}

export function awardStamp(stamp) {
  const stamps = getStamps();
  const existingStamp = stamps[stamp.id];

  if (existingStamp) {
    return {
      awarded: false,
      stamp: existingStamp,
      stamps
    };
  }

  const awardedStamp = {
    ...stamp,
    earnedAt: stamp.earnedAt ?? Date.now()
  };
  const nextStamps = {
    ...stamps,
    [stamp.id]: awardedStamp
  };

  try {
    const storage = getStorage();
    if (!storage) {
      return {
        awarded: false,
        stamp: awardedStamp,
        stamps
      };
    }

    storage.setItem(STAMP_STORAGE_KEY, JSON.stringify(nextStamps));

    return {
      awarded: true,
      stamp: awardedStamp,
      stamps: nextStamps
    };
  } catch (error) {
    console.warn("[stampStorage] write failed", error);

    return {
      awarded: false,
      stamp: awardedStamp,
      stamps
    };
  }
}

export function getStampCount() {
  return Object.keys(getStamps()).length;
}
