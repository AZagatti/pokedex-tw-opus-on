import { beforeEach, describe, expect, it } from "vitest";

import { favorites } from "./favorites.svelte";

describe("favorites store", () => {
  beforeEach(() => {
    localStorage.clear();
    for (const f of [...favorites.items]) {
      favorites.toggle(f);
    }
  });

  it("adds and removes a favorite by toggle", () => {
    expect(favorites.has("pokemon", 25)).toBe(false);
    favorites.toggle({ kind: "pokemon", id: 25, name: "pikachu" });
    expect(favorites.has("pokemon", 25)).toBe(true);
    expect(favorites.count).toBe(1);
    favorites.toggle({ kind: "pokemon", id: 25, name: "pikachu" });
    expect(favorites.has("pokemon", 25)).toBe(false);
    expect(favorites.count).toBe(0);
  });

  it("stores the favorite name and id", () => {
    favorites.toggle({ kind: "pokemon", id: 1, name: "bulbasaur" });
    const entry = favorites.items.find((f) => f.id === 1);
    expect(entry?.name).toBe("bulbasaur");
  });

  it("separates pokemon and berry kinds", () => {
    favorites.toggle({ kind: "pokemon", id: 4, name: "charmander" });
    favorites.toggle({ kind: "berry", id: 4, name: "rawst" });
    expect(favorites.byKind("pokemon")).toHaveLength(1);
    expect(favorites.byKind("berry")).toHaveLength(1);
    expect(favorites.has("berry", 4)).toBe(true);
  });
});
