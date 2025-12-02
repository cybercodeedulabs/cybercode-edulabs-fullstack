import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // ✅ Force Classic JSX Runtime — disables Emotion / require() injections
      jsxRuntime: 'classic'
    })
  ],

  build: {
    rollupOptions: {
      // ❗ Keep your existing config
      external: ['@babel/standalone'],
    },
    sourcemap: true  // Optional but recommended for debugging on Netlify
  }
})
