import { defineConfig } from "vite";

export default defineConfig({
  esbuild: {
    minify: true,
  },
  build: {
    lib: {
      entry: "src/stream.js",
      name: "@reactiv/streams",
      fileName: (format) => `streams.${format}.js`,
    },
  },
  test: {
    globals: true,
  },
});
