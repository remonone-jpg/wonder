import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Served from https://<user>.github.io/wonder/, so every asset URL needs the
// repository name in front of it.
export default defineConfig({
  base: "/wonder/",
  plugins: [react()],
});
