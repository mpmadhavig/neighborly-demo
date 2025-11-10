import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  root: ".",
  publicDir: "public",
  server: {
    host: "::",
    port: 8081,
  },
  plugins: [
    react(),
    {
      name: 'configure-server',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // Redirect all HTML requests (including OAuth callbacks) to Mr. Electric HTML
          if (req.url === '/' || req.url?.startsWith('/?') || req.url?.startsWith('/#')) {
            req.url = '/index-mr-electric.html' + (req.url.substring(1) || '');
          }
          next();
        });
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist-mr-electric",
    rollupOptions: {
      input: path.resolve(__dirname, "index-mr-electric.html"),
    },
  },
});
