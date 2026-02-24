import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // When Friend B's code calls "/api", it redirects to your machine
      '/api': {
        target: 'http://192.168.8.157:3000', 
        changeOrigin: true,
        secure: false,
      },
      // Also proxy the uploads folder so images show up
      '/uploads': {
        target: 'http://192.168.8.157:3000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})