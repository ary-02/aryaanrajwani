import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
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
