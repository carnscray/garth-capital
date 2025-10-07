// astro.config.mjs
import { defineConfig } from "astro/config";
// DEPRECATED: import vercel from "@astrojs/vercel/serverless";
import vercel from "@astrojs/vercel"; // <-- Use this instead

import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  output: "server",
  adapter: vercel({}),

  // Add this line to define your production site URL.
  // This is crucial for sitemaps and canonical URLs.
  site: 'https://www.knowbrainertrivia.com.au',

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '~': new URL('./src', import.meta.url).pathname,
      },
    },
  },

  integrations: [
    sitemap({
      // This option will automatically generate a dynamic robots.txt file.
      // It will use your `site` URL and the sitemap location.
      changefreq: 'weekly',
      lastmod: new Date(),
      
    })
  ],

  // Redirects
  redirects: {
        '/host': '/blog/what-makes-a-great-trivia-host'
  },



});