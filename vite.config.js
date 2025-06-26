import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  root: '.', // Nếu dùng index.html ngay tại root
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})