import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // The catalog is edited far more often than its dependencies change, so
        // the libraries get chunks of their own. Adding a template then ships a
        // few kilobytes to returning visitors instead of re-downloading the
        // framework behind it. GSAP is split out separately from React because
        // the two move on completely different release cycles.
        manualChunks: (id) => {
          if (!id.includes('node_modules')) {
            return undefined
          }

          const path = id.split('\\').join('/')
          return path.includes('/node_modules/gsap/') || path.includes('/node_modules/@gsap/')
            ? 'motion'
            : 'vendor'
        },
      },
    },
  },
})
