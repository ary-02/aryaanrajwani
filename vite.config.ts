import { fileURLToPath, URL } from "node:url";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * Substitutes %SITE_URL% in index.html at build time.
 *
 * Open Graph tags must carry ABSOLUTE urls — LinkedIn, WhatsApp and the rest do
 * not resolve relative paths — which normally means hardcoding the domain into
 * the markup and silently breaking every link preview the day the domain
 * changes. Vercel exposes the production hostname to the build, so the tags can
 * derive it instead and simply follow the deployment.
 *
 * Precedence: an explicit SITE_URL wins (useful for a custom domain, where
 * Vercel's own *.vercel.app host is not the canonical one), then Vercel's
 * production hostname, then localhost so dev and `vite preview` stay valid.
 */
function siteUrl(): Plugin {
  const resolved =
    process.env.SITE_URL?.replace(/\/$/, "") ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:5173");

  return {
    name: "site-url",
    transformIndexHtml(html) {
      return html.replaceAll("%SITE_URL%", resolved);
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), siteUrl()],
  server: {
    watch: {
      /**
       * Poll instead of using native fs.watch.
       *
       * Dropping images into public/ — via an editor's scratch file, or a
       * browser download still holding the handle — makes the native watcher
       * throw EBUSY on Windows, and Node treats an FSWatcher error as fatal,
       * killing the dev server mid-session. Polling stats files rather than
       * holding watch handles, so a locked file is simply retried.
       *
       * Do NOT "fix" this by adding public/ to `ignored` instead: Vite relies
       * on the watcher to notice new files there, and ignoring the directory
       * makes any logo added mid-session 404 (served as the SPA index.html)
       * until the server restarts.
       *
       * `ignored` is merged with Vite's defaults, so node_modules and .git stay
       * excluded and the polling cost stays modest.
       */
      usePolling: true,
      interval: 300,
      binaryInterval: 1000,
      ignored: ["**/*.~tmp", "**/*.tmp", "**/*.crdownload", "**/~$*"],
    },
  },
  resolve: {
    alias: {
      // Must stay in sync with `paths` in tsconfig.json — components import via "@/…".
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
