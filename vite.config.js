import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // ✅ Prevents Vite from trying to bundle Babel standalone
      external: ['@babel/standalone'],
    },
  },
})
