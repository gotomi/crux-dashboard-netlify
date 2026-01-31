import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import node from "@astrojs/node";

export default defineConfig({
  integrations: [svelte(), node({ mode: "standalone" })],
  output: "server",
});
