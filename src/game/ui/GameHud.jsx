import React from "react";

export function GameHud({
  mode,
  title,
  subtitle,
  stars,
  country,
  totalStars,
  countryStars,
  countryStarsTotal,
  totalStarsTotal = 21,
  soundOn,
  onSound,
  onBack
}) {
  const displayTitle = country ? `${country.name} ${country.greeting}` : title;
  const displaySubtitle = country ? `${countryStars}/${countryStarsTotal} 个小发现` : subtitle;
  const displayStars = stars ?? `${totalStars}/${totalStarsTotal}`;
  const titlePill = (
    <div className="hud-title-pill">
      <strong>{displayTitle}</strong>
      {displaySubtitle && <span>{displaySubtitle}</span>}
    </div>
  );

  return (
    <header className={`game-hud ${mode === "country" ? "country-hud" : ""}`}>
      <div className="hud-left">
        {mode === "country" && (
          <button className="hud-round" onClick={onBack} aria-label="返回地球">
            ←
          </button>
        )}
        {mode !== "country" && titlePill}
      </div>

      <div className="hud-center">
        {mode === "country" && titlePill}
      </div>

      <div className="hud-right">
        <div className="star-chip">⭐ {displayStars}</div>
        {onSound && (
          <button className="hud-round" onClick={onSound} aria-pressed={soundOn} aria-label="声音">
            {soundOn ? "♪" : "×"}
          </button>
        )}
      </div>
    </header>
  );
}
