import { browser } from "$app/environment";

const STORAGE_KEY = "pokedex:favorites";

export type FavoriteKind = "pokemon" | "berry";

export interface Favorite {
  kind: FavoriteKind;
  id: number;
  name: string;
}

function load(): Favorite[] {
  if (!browser) {
    return [];
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Favorite[]) : [];
  } catch {
    return [];
  }
}

class FavoritesStore {
  items = $state<Favorite[]>(load());

  private key(kind: FavoriteKind, id: number): string {
    return `${kind}:${id}`;
  }

  private persist(): void {
    if (browser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
    }
  }

  has(kind: FavoriteKind, id: number): boolean {
    return this.items.some(
      (f) => this.key(f.kind, f.id) === this.key(kind, id)
    );
  }

  toggle(fav: Favorite): void {
    if (this.has(fav.kind, fav.id)) {
      this.items = this.items.filter(
        (f) => this.key(f.kind, f.id) !== this.key(fav.kind, fav.id)
      );
    } else {
      this.items = [...this.items, fav];
    }
    this.persist();
  }

  get count(): number {
    return this.items.length;
  }

  byKind(kind: FavoriteKind): Favorite[] {
    return this.items.filter((f) => f.kind === kind);
  }
}

export const favorites = new FavoritesStore();
