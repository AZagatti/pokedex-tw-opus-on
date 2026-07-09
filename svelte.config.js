import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      pages: "build",
      assets: "build",
      fallback: "404.html",
      precompress: false,
      strict: true,
    }),
    alias: {
      $api: "src/lib/api",
      $components: "src/lib/components",
      $stores: "src/lib/stores",
      $utils: "src/lib/utils",
    },
    paths: {
      base: process.env.BASE_PATH ?? "",
    },
  },
  preprocess: vitePreprocess(),
};

export default config;
