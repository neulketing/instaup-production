import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    })
  ],
  optimizeDeps: {
    exclude: ["bippy/dist/jsx-runtime", "bippy/dist/jsx-dev-runtime"]
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          supabase: ['@supabase/supabase-js'],
          socket: ['socket.io-client'],
          toast: ['react-toastify']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  esbuild: {
    drop: ['console', 'debugger']
  },
  server: {
    hmr: {
      overlay: false
    }
  }
});
