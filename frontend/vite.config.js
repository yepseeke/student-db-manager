import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/students_page': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/faculties': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/departments': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/student_card': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
