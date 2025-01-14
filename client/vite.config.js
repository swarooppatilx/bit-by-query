import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "https://bit-by-query-server.vercel.app/api/", // Forward requests from /api to backend server
    },
  },
});
