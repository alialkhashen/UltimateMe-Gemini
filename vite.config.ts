import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "./", // ✅ important: makes build work anywhere (local or Netlify)

  server: {
    host: "::",
    port: 8080,
  },

  plugins: [
    react(),
    // ❌ removed lovable-tagger because it's only for Lovable editor
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

