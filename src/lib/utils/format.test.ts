import { describe, expect, it } from "vitest";

import {
  idFromUrl,
  formatDexNumber,
  titleCase,
  formatHeight,
  formatWeight,
  statLabel,
  generationLabel,
  englishFlavorText,
  artworkUrl,
} from "./format";

describe("idFromUrl", () => {
  it("extracts trailing id from a PokeAPI url", () => {
    expect(idFromUrl("https://pokeapi.co/api/v2/pokemon/25/")).toBe(25);
  });
  it("handles urls without trailing slash", () => {
    expect(idFromUrl("https://pokeapi.co/api/v2/type/4")).toBe(4);
  });
});

describe("formatDexNumber", () => {
  it("zero-pads to four digits", () => {
    expect(formatDexNumber(25)).toBe("#0025");
    expect(formatDexNumber(1)).toBe("#0001");
    expect(formatDexNumber(1025)).toBe("#1025");
  });
});

describe("titleCase", () => {
  it("title-cases hyphenated names", () => {
    expect(titleCase("mr-mime")).toBe("Mr Mime");
    expect(titleCase("bulbasaur")).toBe("Bulbasaur");
  });
});

describe("formatHeight / formatWeight", () => {
  it("converts decimetres and hectograms", () => {
    expect(formatHeight(17)).toBe("1.7 m");
    expect(formatWeight(905)).toBe("90.5 kg");
  });
});

describe("statLabel", () => {
  it("maps known stat keys", () => {
    expect(statLabel("hp")).toBe("HP");
    expect(statLabel("special-attack")).toBe("Sp. Atk");
  });
});

describe("generationLabel", () => {
  it("maps generation slugs to roman labels", () => {
    expect(generationLabel("generation-i")).toBe("Gen I");
    expect(generationLabel("generation-ix")).toBe("Gen IX");
  });
});

describe("englishFlavorText", () => {
  it("picks the english entry and strips control chars", () => {
    const entries = [
      { flavor_text: "Bonjour", language: { name: "fr" } },
      { flavor_text: "Hello\fthere\nfriend", language: { name: "en" } },
    ];
    expect(englishFlavorText(entries)).toBe("Hello there friend");
  });
  it("returns empty string when no english entry", () => {
    expect(englishFlavorText([])).toBe("");
  });
});

describe("artworkUrl", () => {
  it("builds a sprites CDN url for an id", () => {
    expect(artworkUrl(6)).toContain("official-artwork/6.png");
  });
});
