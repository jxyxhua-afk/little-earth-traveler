import React from "react";

const ITEM_SYMBOLS = {
  greatWall: "🏯",
  lantern: "🏮",
  panda: "🐼",
  dumpling: "🥟",
  mountFuji: "🗻",
  toriiGate: "⛩️",
  sushi: "🍣",
  bulletTrain: "🚄",
  operaHouse: "🎭",
  kangaroo: "🦘",
  koala: "🐨",
  pyramid: "🔺",
  camel: "🐪",
  boat: "⛵",
  savanna: "🌳",
  lion: "🦁",
  giraffe: "🦒",
  safariJeep: "🚙",
  liberty: "🗽",
  flag: "🇺🇸",
  bus: "🚌",
  burger: "🍔",
  basketball: "🏀",
  rainforest: "🌳",
  parrot: "🦜",
  river: "🌊",
  football: "⚽",
  goal: "🥅",
  sambaDrum: "🥁",
  carnivalMask: "🎭",
  eiffelTower: "🗼",
  castle: "🏰",
  bakery: "🥐",
  baguette: "🥖",
  painting: "🎨",
  beret: "🎩",
  welcomeSign: "💬"
};

function itemSymbol(item) {
  if (!item) return "✨";
  return ITEM_SYMBOLS[item.fallbackType] || ITEM_SYMBOLS[item.id] || "✨";
}

export function ItemInfoCard({ country, zone, item, completed = false, onReplay, onClose }) {
  if (!item && !zone) return null;

  const title = item ? item.name : zone?.name;
  const body = item ? item.intro : zone?.hint || country.greetingIntro;

  return (
    <aside className={`item-info-card ${item ? "has-item" : ""}`}>
      {onClose && (
        <button className="info-close" onClick={onClose} aria-label="关闭介绍">
          ×
        </button>
      )}
      <div className="item-card-symbol" aria-hidden="true">{itemSymbol(item)}</div>
      <span className="tiny-tag">{country.name}</span>
      <h2>{title}</h2>
      <p>{body}</p>
      {item && (
        <>
          {completed && <div className="completed-chip" aria-label="已点亮">⭐</div>}
          <button className="secondary-small" onClick={onReplay} aria-label="再听一次">
            再听一次
          </button>
        </>
      )}
    </aside>
  );
}
