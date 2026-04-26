import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Set base for GitHub Pages. Override with VITE_BASE if hosting elsewhere.
const base = process.env.VITE_BASE || "/atsc-command-center-demo/";

export default defineConfig({
  plugins: [react()],
  base,
});
