import React, { useMemo, useState } from "react";
import { MVP_COUNTRIES } from "./data/countries.js";
import { CountryScreen } from "./screens/CountryScreen.jsx";
import { GlobeScreen } from "./screens/GlobeScreen.jsx";
import "./styles/game.css";

export function GameRoot() {
  const [screen, setScreen] = useState("globe");
  const [selectedCountryId, setSelectedCountryId] = useState(null);
  const [discoveredByCountry, setDiscoveredByCountry] = useState({});

  const selectedCountry = selectedCountryId ? MVP_COUNTRIES[selectedCountryId] : null;
  const totalStarsTotal = useMemo(() => {
    return Object.values(MVP_COUNTRIES).reduce((sum, country) => sum + country.starsTotal, 0);
  }, []);

  const totalStars = useMemo(() => {
    return Object.values(discoveredByCountry).reduce((sum, ids) => sum + ids.length, 0);
  }, [discoveredByCountry]);

  function enterCountry(countryId) {
    setSelectedCountryId(countryId);
    setScreen("country");
  }

  function backToGlobe() {
    setScreen("globe");
    setSelectedCountryId(null);
  }

  function markDiscovered(countryId, itemId) {
    setDiscoveredByCountry((prev) => {
      const current = prev[countryId] ?? [];
      if (current.includes(itemId)) return prev;

      return {
        ...prev,
        [countryId]: [...current, itemId]
      };
    });
  }

  if (screen === "country" && selectedCountry) {
    return (
      <CountryScreen
        country={selectedCountry}
        discoveredIds={discoveredByCountry[selectedCountry.id] ?? []}
        totalStars={totalStars}
        totalStarsTotal={totalStarsTotal}
        onBack={backToGlobe}
        onDiscover={markDiscovered}
      />
    );
  }

  return (
    <GlobeScreen
      countries={MVP_COUNTRIES}
      totalStars={totalStars}
      totalStarsTotal={totalStarsTotal}
      onEnterCountry={enterCountry}
    />
  );
}
