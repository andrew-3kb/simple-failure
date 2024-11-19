import { $ } from "zx";
import { readFile, writeFile, copyFile, rm } from "node:fs/promises";

try {
  await rm("dist", { recursive: true });
} catch (e) {}
await $`tsup`;
const packageString = await readFile("./package.json", "utf8");
const packageJson = JSON.parse(packageString) as Record<string, string>;
// biome-ignore lint/performance/noDelete: who cares it's just a script
delete packageJson.devDependencies;
// biome-ignore lint/performance/noDelete: who cares it's just a script
delete packageJson.scripts;
// biome-ignore lint/performance/noDelete: who cares it's just a script
delete packageJson.packageManager;
await writeFile("./dist/package.json", JSON.stringify(packageJson, null, 2), {
  encoding: "utf8",
});
await copyFile("./README.md", "./dist/README.md");
