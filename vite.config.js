import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  // GitHub Pages hosts this project under /<repository-name>/; Surge uses the domain root.
  base: process.env.VITE_BASE || '/',
  plugins: [vue()],
})
