/** Extract the trailing numeric id from a PokeAPI resource URL. */
export function idFromUrl(url: string): number {
  const parts = url.split("/").filter(Boolean);
  return Number(parts.at(-1));
}

/** Zero-padded national dex number, e.g. 25 -> "#0025". */
export function formatDexNumber(id: number): string {
  return `#${String(id).padStart(4, "0")}`;
}

/** Title-case a hyphenated PokeAPI name, e.g. "mr-mime" -> "Mr Mime". */
export function titleCase(name: string): string {
  return name
    .split(/[-\s]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Official artwork URL for a Pokémon id (high-res, stable CDN path). */
export function artworkUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

/** Default front sprite URL for a Pokémon id (small, fast). */
export function spriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

/** Animated Gen-5 sprite URL (Showdown) for a Pokémon id. */
export function animatedSpriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`;
}

/** Height in decimetres -> "1.7 m". */
export function formatHeight(dm: number): string {
  return `${(dm / 10).toFixed(1)} m`;
}

/** Weight in hectograms -> "60.0 kg". */
export function formatWeight(hg: number): string {
  return `${(hg / 10).toFixed(1)} kg`;
}

const STAT_LABELS: Record<string, string> = {
  attack: "Attack",
  defense: "Defense",
  hp: "HP",
  "special-attack": "Sp. Atk",
  "special-defense": "Sp. Def",
  speed: "Speed",
};

export function statLabel(name: string): string {
  return STAT_LABELS[name] ?? titleCase(name);
}

const GEN_LABELS: Record<string, string> = {
  "generation-i": "Gen I",
  "generation-ii": "Gen II",
  "generation-iii": "Gen III",
  "generation-iv": "Gen IV",
  "generation-ix": "Gen IX",
  "generation-v": "Gen V",
  "generation-vi": "Gen VI",
  "generation-vii": "Gen VII",
  "generation-viii": "Gen VIII",
};

export function generationLabel(name: string): string {
  return GEN_LABELS[name] ?? titleCase(name);
}

/** Tailwind text/bg helper: returns the CSS var color for a type. */
export function typeColor(type: string): string {
  return `var(--color-type-${type})`;
}

export const ALL_TYPES = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
] as const;

export type PokemonType = (typeof ALL_TYPES)[number];

export const ALL_GENERATIONS = [
  { id: 1, label: "Gen I", name: "generation-i", range: "Kanto" },
  { id: 2, label: "Gen II", name: "generation-ii", range: "Johto" },
  { id: 3, label: "Gen III", name: "generation-iii", range: "Hoenn" },
  { id: 4, label: "Gen IV", name: "generation-iv", range: "Sinnoh" },
  { id: 5, label: "Gen V", name: "generation-v", range: "Unova" },
  { id: 6, label: "Gen VI", name: "generation-vi", range: "Kalos" },
  { id: 7, label: "Gen VII", name: "generation-vii", range: "Alola" },
  { id: 8, label: "Gen VIII", name: "generation-viii", range: "Galar" },
  { id: 9, label: "Gen IX", name: "generation-ix", range: "Paldea" },
] as const;

/** Pick the first English flavor text, cleaned of control characters. */
export function englishFlavorText(
  entries: { flavor_text: string; language: { name: string } }[]
): string {
  const entry = entries.find((e) => e.language.name === "en");
  return entry ? entry.flavor_text.replaceAll(/[\n\f\r]/g, " ").trim() : "";
}

/** Max value for a single base stat, used to scale stat bars. */
export const MAX_STAT = 255;
