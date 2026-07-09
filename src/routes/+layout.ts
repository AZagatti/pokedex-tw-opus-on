// SPA mode: render on the client, no server-side rendering or prerendering.
// PokeAPI is fetched at runtime in the browser; GitHub Pages serves the static shell.
export const ssr = false;
export const prerender = false;
export const trailingSlash = "always";
