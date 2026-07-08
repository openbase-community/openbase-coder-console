import react from "@vitejs/plugin-react-swc";
import { existsSync } from "fs";
import path from "path";
import { defineConfig } from "vite";

const s3Name = "openbase-coder-console";
const useCdnBase = process.env.VITE_USE_CDN === "true";

const sharedSrc = path.resolve(
  __dirname,
  "./node_modules/@openbase/coder-react/src"
);
const multiReactSrc = path.resolve(__dirname, "../multi-react/src");
const multiReactEntry = path.resolve(multiReactSrc, "index.ts");
const boilersyncReactSrc = path.resolve(__dirname, "../boilersync-react/src");
const boilersyncReactEntry = path.resolve(boilersyncReactSrc, "index.ts");
const consoleNodeModules = path.resolve(__dirname, "./node_modules");
const workspaceNodeModules = path.resolve(__dirname, "../node_modules");
const resolveNodeModule = (packageName: string) => {
  const consolePath = path.resolve(consoleNodeModules, packageName);
  return existsSync(consolePath)
    ? consolePath
    : path.resolve(workspaceNodeModules, packageName);
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: [
        __dirname,
        sharedSrc,
        multiReactSrc,
        boilersyncReactSrc,
        consoleNodeModules,
        workspaceNodeModules,
      ],
    },
  },
  // Relative base so the built console works both at the server root and when
  // served behind a reverse-proxy subpath (Openbase Cloud headless workspaces
  // inject a <base href> that these relative asset URLs resolve against).
  base: useCdnBase ? `https://cdn.openbase.app/${s3Name}/` : "./",
  plugins: [react()],
  resolve: {
    alias: {
      "@": sharedSrc,
      "@openbase/coder-react": sharedSrc,
      "multi-react": multiReactEntry,
      "boilersync-react": boilersyncReactEntry,
      "@radix-ui/react-slot": resolveNodeModule("@radix-ui/react-slot"),
      "use-sync-external-store": resolveNodeModule("use-sync-external-store"),
    },
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "@radix-ui/react-slot",
      "use-sync-external-store",
    ],
  },
  optimizeDeps: {
    exclude: ["@openbase/coder-react"],
    include: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "use-sync-external-store/shim",
      "use-sync-external-store/shim/with-selector",
      "style-to-js",
      "style-to-object",
      "inline-style-parser",
      "multi-react",
      "diff2html",
      "@profoundlogic/hogan",
    ],
  },
}));
