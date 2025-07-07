import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: './duksu/renderer',
  base: './',
  build: {
    outDir: '../../dist/renderer',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    strictPort: true,
    host: 'localhost',
    cors: true,
    hmr: {
      port: 5173,
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './duksu/renderer'),
    },
  },
}) 