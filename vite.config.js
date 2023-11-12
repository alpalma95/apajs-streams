import { defineConfig } from "vite";

export default defineConfig({
  esbuild: {
    minify: true,
  },
  build: {
    lib: {
      entry: "src/index.js",
      name: "@apajs/streams",
      fileName: (format) => `apa-streams.${format}.js`,
    },
  },
});
