import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/students_page': {
        target: 'http://backend:8080',
        changeOrigin: true,
        secure: false,
      },
      '/faculties': {
        target: 'http://backend:8080',
        changeOrigin: true,
        secure: false,
      },
      '/departments': {
        target: 'http://backend:8080',
        changeOrigin: true,
        secure: false,
      },
      '/student_card': {
        target: 'http://backend:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
