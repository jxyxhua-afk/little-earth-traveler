import {
  COUNTRY_GAMEPLAY_MATRIX,
  validateCountryGameplayMatrix
} from "../src/game/config/countryGameplayMatrix.js";
import { LOCOMOTION_ARCHETYPES } from "../src/game/config/locomotionArchetypes.js";

const REQUIRED_COUNTRY_IDS = ["china", "egypt", "japan", "usa", "australia", "arctic"];
const REQUIRED_ARCHETYPE_FIELDS = [
  "id",
  "name",
  "coreMotion",
  "dragBehavior",
  "releaseBehavior",
  "collisionBehavior",
  "soundCue",
  "visualCue"
];
const REQUIRED_ARCHETYPE_LIST_FIELDS = [
  "representativeObjects",
  "suitableCountries",
  "forbiddenPatterns"
];

const result = validateCountryGameplayMatrix();
const errors = [...result.errors];

const countryIds = new Set(COUNTRY_GAMEPLAY_MATRIX.map((country) => country.countryId));
for (const countryId of REQUIRED_COUNTRY_IDS) {
  if (!countryIds.has(countryId)) {
    errors.push(`missing country: ${countryId}`);
  }
}

if (COUNTRY_GAMEPLAY_MATRIX.length !== REQUIRED_COUNTRY_IDS.length) {
  errors.push(`expected ${REQUIRED_COUNTRY_IDS.length} countries, got ${COUNTRY_GAMEPLAY_MATRIX.length}`);
}

for (const countryId of countryIds) {
  if (!REQUIRED_COUNTRY_IDS.includes(countryId)) {
    errors.push(`unexpected country: ${countryId}`);
  }
}

for (const archetype of Object.values(LOCOMOTION_ARCHETYPES)) {
  const archetypeLabel = archetype.id || archetype.name || "unknown-archetype";

  for (const field of REQUIRED_ARCHETYPE_FIELDS) {
    if (!archetype[field]) {
      errors.push(`${archetypeLabel}: ${field} is required`);
    }
  }

  for (const field of REQUIRED_ARCHETYPE_LIST_FIELDS) {
    if (!Array.isArray(archetype[field]) || archetype[field].length === 0) {
      errors.push(`${archetypeLabel}: ${field} is required`);
    }
  }
}

const usa = COUNTRY_GAMEPLAY_MATRIX.find((country) => country.countryId === "usa");
const china = COUNTRY_GAMEPLAY_MATRIX.find((country) => country.countryId === "china");
const egypt = COUNTRY_GAMEPLAY_MATRIX.find((country) => country.countryId === "egypt");

if (!usa) {
  errors.push("usa: country gameplay config is required");
} else {
  if (!Array.isArray(usa.keyObjects) || usa.keyObjects.length === 0) {
    errors.push("usa: keyObjects is required");
  }

  if (!Array.isArray(usa.forbiddenSimilarities) || usa.forbiddenSimilarities.length === 0) {
    errors.push("usa: forbiddenSimilarities is required");
  }

  if (china && usa.coreVerb === china.coreVerb) {
    errors.push("usa: coreVerb must differ from china");
  }

  if (egypt && usa.coreVerb === egypt.coreVerb) {
    errors.push("usa: coreVerb must differ from egypt");
  }
}

if (errors.length > 0) {
  console.error("Country gameplay matrix validation failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("Country gameplay matrix validation passed.");
console.log(`Countries: ${COUNTRY_GAMEPLAY_MATRIX.map((country) => country.countryId).join(", ")}`);
console.log(`Locomotion archetypes: ${Object.keys(LOCOMOTION_ARCHETYPES).length}`);
