import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  // @lucide/svelte v1 ships raw .svelte icon files; excluding it from the
  // dep optimizer lets the Svelte plugin compile them instead of esbuild.
  optimizeDeps: {
    exclude: ["@lucide/svelte"],
  },
  test: {
    projects: [
      {
        extends: "./vite.config.ts",
        test: {
          environment: "node",
          exclude: ["src/**/*.svelte.{test,spec}.{js,ts}"],
          include: ["src/**/*.{test,spec}.{js,ts}"],
          name: "unit",
        },
      },
      {
        extends: "./vite.config.ts",
        test: {
          environment: "jsdom",
          include: ["src/**/*.svelte.{test,spec}.{js,ts}"],
          name: "component",
          setupFiles: ["./vitest-setup-client.ts"],
        },
      },
    ],
  },
});
