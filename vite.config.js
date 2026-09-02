import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // The catalog is edited far more often than its dependencies change, so
        // React and the router get a chunk of their own. Adding a template then
        // ships a few kilobytes to returning visitors instead of re-downloading
        // the framework behind it.
        manualChunks: (id) => (id.includes('node_modules') ? 'vendor' : undefined),
      },
    },
  },
})
