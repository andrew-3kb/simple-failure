import { defineConfig } from "tsup";

export default defineConfig({
  outDir: "./dist/src",
  target: ["node18"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  minify: true,
  treeshake: true,
  entry: ["src/index.ts"],
});
