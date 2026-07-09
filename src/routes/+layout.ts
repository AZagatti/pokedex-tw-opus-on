// SPA-first static build. Static routes (/, /berries, /favorites) are
// prerendered to real HTML for SEO + fast first paint; PokeAPI data still
// loads client-side. Dynamic routes opt out of prerender and fall back to
// 404.html, which resolves them client-side on GitHub Pages.
export const ssr = false;
export const prerender = true;
export const trailingSlash = "always";
