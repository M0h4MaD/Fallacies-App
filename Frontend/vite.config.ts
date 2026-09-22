/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // Enables listening on all local network IPs
    port: 5173, // Optional: defaults to 5173, change if needed
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
})