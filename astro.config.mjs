import { defineConfig } from 'astro/config';

// Static site: `npm run build` outputs plain HTML in /dist, hostable anywhere
// (Vercel, Netlify, GitHub Pages, a plain bucket).
export default defineConfig({
  site: 'https://example.com', // TODO: replace with the final domain
  devToolbar: { enabled: false },
});
