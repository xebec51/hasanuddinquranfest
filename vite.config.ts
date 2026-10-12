import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// A relative base works on GitHub Pages project URLs and on the custom domain.
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
});
