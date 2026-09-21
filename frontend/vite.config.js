import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// During local dev, requests to /api are proxied to the Express server on :5000
// In production, the React build is served BY that same Express server, so no proxy is needed
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
});
