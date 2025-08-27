// svelte.config.js
import adapter from "@sveltejs/adapter-static";

const dev = process.argv.includes("dev");
const repo = "Workout-Graphs"; // <-- your repo name

export default {
  kit: {
    adapter: adapter({
      fallback: "404.html", // or 'index.html' if you want SPA-style routing
    }),
    paths: {
      base: dev ? "" : `/${repo}`,
      // assets: '' // only set this if you have a custom domain/CDN
    },
  },
};
