import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  //rewrite asset paths
  base: '/static/',
  build: {
    outDir: '../django_backend/static',
    // vite empties outDir on build if it is inside project root.
    // outDir will be outside of frontend root, it's ok suppress warning.
    emptyOutDir: true
  },
  plugins: [react()]
})

