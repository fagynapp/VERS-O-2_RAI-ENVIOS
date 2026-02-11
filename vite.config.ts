import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Isso impede que o Vite tente empacotar estas libs, usando as do importmap (index.html)
      external: ['jspdf', 'jspdf-autotable']
    }
  }
})