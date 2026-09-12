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

          // three is reached only through the landing page's dynamic import.
          // Naming a chunk for it here would hoist it into a static one and
          // hand the whole renderer to every visitor of every page, so it is
          // left for Rollup to place with the async chunk that asks for it.
          if (path.includes('/node_modules/three/')) {
            return undefined
          }

          return path.includes('/node_modules/gsap/') || path.includes('/node_modules/@gsap/')
            ? 'motion'
            : 'vendor'
        },
      },
    },
  },
})
