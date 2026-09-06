import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['maplibre-gl'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://api.portofy.net',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
