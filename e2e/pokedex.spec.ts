import { expect, test } from "@playwright/test";

test.describe("Pokédex", () => {
  test("list page loads Pokémon cards", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Pokédex", level: 1 })
    ).toBeVisible();
    await expect(page.getByText("Bulbasaur")).toBeVisible({ timeout: 20000 });
    const cards = page.getByTestId("pokemon-card");
    expect(await cards.count()).toBeGreaterThan(10);
  });

  test("search filters the grid", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Bulbasaur")).toBeVisible({ timeout: 20000 });
    await page
      .getByRole("searchbox", { name: "Search Pokémon" })
      .fill("pikachu");
    await expect(page.getByText("Pikachu")).toBeVisible();
    await expect(page.getByTestId("pokemon-card")).toHaveCount(1);
  });

  test("navigates to a detail page", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Bulbasaur")).toBeVisible({ timeout: 20000 });
    await page
      .getByRole("link", { name: /Bulbasaur/ })
      .first()
      .click();
    await expect(page).toHaveURL(/\/pokemon\/bulbasaur/);
    await expect(
      page.getByRole("heading", { name: "Bulbasaur", level: 1 })
    ).toBeVisible();
    await expect(page.getByText("Base stats")).toBeVisible();
  });

  test("toggles dark theme and persists", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Toggle dark mode" }).click();
    await expect(page.locator("html")).toHaveClass(/dark/);
    await page.reload();
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("favorites a Pokémon and shows it on the favorites page", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByText("Bulbasaur")).toBeVisible({ timeout: 20000 });
    await page
      .getByRole("button", { name: /Add bulbasaur to favorites/i })
      .click();
    await page.goto("/favorites/");
    await expect(
      page.getByRole("heading", { name: "Favorites", level: 1 })
    ).toBeVisible();
    await expect(page.getByText("Bulbasaur")).toBeVisible();
  });

  test("shows 404 for an unknown Pokémon", async ({ page }) => {
    await page.goto("/pokemon/not-a-real-pokemon/");
    await expect(
      page.getByRole("heading", { name: "Page not found" })
    ).toBeVisible({
      timeout: 20000,
    });
  });
});
