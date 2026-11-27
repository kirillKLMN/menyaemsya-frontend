import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // On GitHub Pages this repository is published below /menyaemsya-frontend/.
  // Keep the usual root URL for local development.
  base: command === 'build' ? '/menyaemsya-frontend/' : '/',
}))
