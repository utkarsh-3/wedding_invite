import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  publicDir: 'public',
  base: '/wedding_invite/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
