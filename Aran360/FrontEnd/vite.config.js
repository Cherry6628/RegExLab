import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { frontendbasename } from './src/utils/params'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: frontendbasename,
  build: {
    outDir: 'dist', 
    emptyOutDir: true,
  },
})
