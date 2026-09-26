import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// vite-plugin-pwa is installed but not wired yet: the offline caching strategy for
// /models/** is a project decision (see CLAUDE.md > Offline).
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
